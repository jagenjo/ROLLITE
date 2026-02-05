import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { GameManager } from './game/GameManager.js';
import { FileStorage } from './game/file_storage.js';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '../shared/types.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Global logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.static('public'));
app.use('/data/images', express.static('data/images'));

const isDev = process.env.NODE_ENV !== 'production';
let viteServer: import('vite').ViteDevServer | undefined;

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use a more robust approach for destination
        const sessionId = req.body.sessionId || 'unknown';
        // Sanitize sessionId to prevent directory traversal
        const safeSessionId = sessionId.replace(/[^a-zA-Z0-9-]/g, '_');
        const uploadPath = path.join('public', 'uploads', safeSessionId);

        try {
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        } catch (err) {
            console.error('Error creating upload directory:', err);
            cb(err as Error, '');
        }
    },
    filename: (req, file, cb) => {
        // Simple sanitization: keep extension, generate unique name or keep original if safe
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${Date.now()}_${safeName}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Define API routes BEFORE Vite middleware to ensure they are not intercepted
app.post('/upload', (req, res, next) => {
    console.log('Upload request received');
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(500).send(err.message);
        }
        next();
    });
}, (req, res) => {
    console.log('File uploaded successfully');
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }
    const sessionId = req.body.sessionId;
    const fileUrl = `/uploads/${sessionId}/${req.file.filename}`;
    res.json({ url: fileUrl });
});

app.get('/api/images', (req, res) => {
    const imagesDir = path.join(process.cwd(), 'data', 'images');
    if (!fs.existsSync(imagesDir)) {
        return res.json([]);
    }

    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error('Error reading images directory:', err);
            return res.status(500).json({ error: 'Failed to list images' });
        }

        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
        });

        res.json(imageFiles);
    });
});

if (isDev) {
    console.log('Starting in Development Mode with Vite Middleware...');
    const vite = await import('vite');
    viteServer = await vite.createServer({
        server: {
            middlewareMode: true,
            watch: {
                ignored: ['**/public/uploads/**', '**/data/**']
            }
        },
        appType: 'custom',
        root: '.'
    });

    app.use(viteServer.middlewares);
} else {
    // Production: serve built assets
    app.use(express.static('dist/client', {
        setHeaders: (res, filePath) => {
            if (filePath.endsWith('index.html')) {
                res.setHeader('Cache-Control', 'no-store');
            }
        }
    }));
}

// Serve index.html for unknown routes (SPA support)
app.get(/^(?!\/socket.io\/|(?:\/api\/)|(?:\/upload)).*$/, async (req, res) => {
    if (isDev && viteServer) {
        try {
            const url = req.originalUrl;
            let template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
            template = await viteServer.transformIndexHtml(url, template);
            res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
            viteServer.ssrFixStacktrace(e as Error);
            console.error(e);
            res.status(500).end((e as Error).message);
        }
    } else {
        res.setHeader('Cache-Control', 'no-store');
        res.sendFile(path.resolve('dist/client/index.html'));
    }
});

const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const fileStorage = new FileStorage();
const gameManager = new GameManager(fileStorage);

// Load existing state
const index = fileStorage.loadGameIndex();
if (index && index.sessions) {
    console.log(`Loading ${index.sessions.length} sessions from persistence...`);
    for (const sessionId of index.sessions) {
        const sessionState = fileStorage.loadGame(sessionId);
        if (sessionState) {
            gameManager.restoreSession(sessionState);
            console.log(`Restored session: ${sessionId}`);
        }
    }
}

const PORT = process.env.PORT || 4001;

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('createSession', (token, name, gameName, avatarIndex, templateId) => {
        // Use token as playerId
        const sessionId = gameManager.createSession(token, name, gameName, avatarIndex, templateId);
        socket.join(sessionId);
        const session = gameManager.getSession(sessionId);
        if (session) {
            socket.emit('gameStateUpdate', session);
        }
    });

    socket.on('getTemplates', () => {
        const templates = gameManager.getTemplates();
        socket.emit('templatesList', templates);
    });

    socket.on('saveAsTemplate', (sessionId, templateName) => {
        const success = gameManager.saveAsTemplate(sessionId, templateName);
        if (success) {
            socket.emit('templateSaved', true);
            // Refresh list for everyone? Or just let them fetch it when needed.
        } else {
            socket.emit('templateSaved', false);
        }
    });

    socket.on('loadTemplateIntoSession', (sessionId, templateId) => {
        const success = gameManager.loadTemplateIntoSession(sessionId, templateId);
        if (success) {
            const session = gameManager.getSession(sessionId);
            if (session) {
                // Determine if we need to emit 'newScene' or just 'gameStateUpdate'
                // gameStateUpdate should enable full refresh
                io.to(sessionId).emit('gameStateUpdate', session);

                // Emitting newScene might be redundant if the client re-renders on gameStateUpdate,
                // but if we want to ensure the scene display updates immediately:
                if (session.currentScene) {
                    io.to(sessionId).emit('newScene', session.currentScene);
                }
            }
        }
    });

    socket.on('createPlayer', (sessionId, name, avatarIndex, badges) => {
        const player = gameManager.createPlayer(sessionId, name, avatarIndex, badges);
        if (player) {
            const session = gameManager.getSession(sessionId);
            if (session) {
                io.to(sessionId).emit('gameStateUpdate', session);
            }
        }
    });

    socket.on('joinSession', (sessionId, playerId) => {
        const session = gameManager.getSession(sessionId);
        if (!session) {
            socket.emit('error', 'Session not found');
            return;
        }

        const joinedSession = gameManager.joinSession(sessionId, playerId);
        if (joinedSession) {
            socket.join(sessionId);
            io.to(sessionId).emit('gameStateUpdate', joinedSession);
        } else {
            // Handle error: player not found
            console.log(`Failed to join session ${sessionId} with player ${playerId}`);
            socket.emit('error', 'Player not found in session');
        }
    });

    socket.on('updateScene', (scene) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                const session = gameManager.updateScene(room, scene);
                if (session) {
                    io.to(room).emit('gameStateUpdate', session);
                }
            }
        }
    });

    socket.on('startRound', (sessionId) => {
        for (const room of socket.rooms) {
            if (room === sessionId) {
                const session = gameManager.startRound(room);
                if (session) {
                    io.to(room).emit('gameStateUpdate', session);
                    if (session.currentScene) {
                        io.to(room).emit('newScene', session.currentScene);
                    }
                }
            }
        }
    });

    socket.on('spectateSession', (sessionId) => {
        const session = gameManager.getSession(sessionId);
        if (session) {
            socket.join(sessionId);
            socket.emit('gameStateUpdate', session);
            console.log(`Socket ${socket.id} started spectating session ${sessionId}`);
        } else {
            socket.emit('error', 'Session not found');
        }
    });

    socket.on('deleteSession', (sessionId) => {
        const success = gameManager.deleteSession(sessionId);
        if (success) {
            console.log(`Session ${sessionId} deleted by admin`);
            const sessions = gameManager.getAllSessions();
            io.emit('systemStatsUpdate', sessions as any);
        }
    });

    socket.on('saveSession', (sessionId) => {
        const success = gameManager.saveSession(sessionId);
        if (success) {
            console.log(`Session ${sessionId} saved manually`);
        }
    });

    socket.on('endSession', (sessionId) => {
        const session = gameManager.endSession(sessionId);
        if (session) {
            console.log(`Session ${sessionId} ended`);
            io.to(sessionId).emit('gameStateUpdate', session);
            const sessions = gameManager.getAllSessions();
            io.emit('systemStatsUpdate', sessions as any);
        }
    });

    socket.on('submitAction', (action, token) => {
        console.log('Received submitAction:', action, 'from', token || socket.id);
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                const playerId = token || socket.id;
                const session = gameManager.submitAction(room, playerId, action);
                if (session) {
                    console.log('Action submitted, emitting update to room:', room);
                    io.to(room).emit('gameStateUpdate', session);
                }
            }
        }
    });

    socket.on('nextRound', () => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                const session = gameManager.nextRound(room);
                if (session) {
                    io.to(room).emit('gameStateUpdate', session);
                }
            }
        }
    });

    socket.on('addBadge', (playerId, badge, hidden) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                const session = gameManager.addBadge(room, playerId, badge, hidden);
                if (session) {
                    io.to(room).emit('gameStateUpdate', session);
                }
            }
        }
    });

    socket.on('removeBadge', (playerId, badgeIndex) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                const session = gameManager.removeBadge(room, playerId, badgeIndex);
                if (session) {
                    io.to(room).emit('gameStateUpdate', session);
                }
            }
        }
    });

    socket.on('setPendingPrivateMessage', (playerId, message) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                const session = gameManager.setPendingPrivateMessage(room, playerId, message);
                if (session) {
                    io.to(room).emit('gameStateUpdate', session);
                }
            }
        }
    });

    socket.on('updatePlayerStatus', (playerId, status) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                const session = gameManager.updatePlayerStatus(room, playerId, status);
                if (session) {
                    io.to(room).emit('gameStateUpdate', session);
                }
            }
        }
    });

    socket.on('updatePlayerAvatar', (playerId, avatarIndex) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                const session = gameManager.updatePlayerAvatar(room, playerId, avatarIndex);
                if (session) {
                    io.to(room).emit('gameStateUpdate', session);
                }
            }
        }
    });

    socket.on('updatePlayerBackground', (playerId, background) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                const session = gameManager.updatePlayerBackground(room, playerId, background);
                if (session) {
                    io.to(room).emit('gameStateUpdate', session);
                }
            }
        }
    });

    socket.on('updatePlayerName', (playerId, name) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                const session = gameManager.updatePlayerName(room, playerId, name);
                if (session) {
                    io.to(room).emit('gameStateUpdate', session);
                }
            }
        }
    });

    socket.on('postMessage', (content, token) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                const session = gameManager.getSession(room);
                const playerId = token || socket.id;
                const player = session?.players.find(p => p.id === playerId);
                const senderName = player ? player.name : "Unknown";

                const message = {
                    id: Math.random().toString(36).substring(7),
                    senderId: playerId,
                    senderName: senderName,
                    content,
                    timestamp: Date.now(),
                    isAction: false,
                    round: session?.round || 0
                };
                gameManager.addMessage(room, message);
                io.to(room).emit('newMessage', message);
            }
        }
    });

    socket.on('disconnecting', () => {
        const affectedSessions = gameManager.handleDisconnect(socket.id);
        for (const session of affectedSessions) {
            io.to(session.sessionId).emit('gameStateUpdate', session);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    socket.on('getSystemStats', () => {
        const stats = gameManager.getAllSessions();
        socket.emit('systemStatsUpdate', stats);
    });
});

app.get('/', (req, res) => {
    res.send('RPG Session Manager API is running');
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `);
});

// Persistence on shutdown
const saveState = () => {
    console.log('Saving game state...');
    const sessions = gameManager.getAllSessions();
    const sessionIds = sessions.map(s => s.sessionId);

    // Save index
    fileStorage.saveGameIndex({ sessions: sessionIds });

    // Save each session
    for (const session of sessions) {
        fileStorage.saveGame(session.sessionId, session);
    }
    console.log('Game state saved.');
};

process.on('SIGINT', () => {
    saveState();
    process.exit(0);
});

process.on('SIGTERM', () => {
    saveState();
    process.exit(0);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const GameManager_1 = require("./game/GameManager");
const file_storage_1 = require("./game/file_storage");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const gameManager = new GameManager_1.GameManager();
const fileStorage = new file_storage_1.FileStorage();
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
    socket.on('createSession', (token, name, avatarIndex) => {
        // Use token as playerId
        const sessionId = gameManager.createSession(token, name, avatarIndex);
        socket.join(sessionId);
        const session = gameManager.getSession(sessionId);
        if (session) {
            socket.emit('gameStateUpdate', session);
        }
    });
    socket.on('joinSession', (sessionId, token, name, avatarIndex) => {
        const session = gameManager.joinSession(sessionId, token, name, avatarIndex);
        if (session) {
            socket.join(sessionId);
            io.to(sessionId).emit('gameStateUpdate', session);
        }
        else {
            // Handle error: session not found
        }
    });
    // resumeSession is largely redundant now if the client handles auto-join with token
    // But we can keep it or remove it. The plan implied removing/updating it.
    // If we rely on joinSession for everything (reconnects included), we can remove resumeSession.
    // Let's remove it to simplify.
    socket.on('updateScene', (scene) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                const session = gameManager.updateScene(room, scene);
                if (session) {
                    io.to(room).emit('gameStateUpdate', session);
                    io.to(room).emit('newScene', scene);
                }
            }
        }
    });
    socket.on('submitAction', (action, token) => {
        console.log('Received submitAction:', action, 'from', token || socket.id);
        console.log('Rooms:', socket.rooms);
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                console.log('Processing for room:', room);
                // Use token as playerId if provided, else fall back to socket.id (though token should always be there now)
                const playerId = token || socket.id;
                const session = gameManager.submitAction(room, playerId, action);
                if (session) {
                    console.log('Action submitted, emitting update to room:', room);
                    io.to(room).emit('gameStateUpdate', session);
                }
                else {
                    console.log('submitAction returned null or no change');
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
    socket.on('addBadge', (playerId, badge) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                const session = gameManager.addBadge(room, playerId, badge);
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
            // Emit to the specific room (session ID) corresponding to this session
            // Since the socket is still in the room (disconnecting), we can still broadcast,
            // OR we can emit to the room ID explicitly which Socket.IO handles.
            io.to(session.sessionId).emit('gameStateUpdate', session);
        }
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
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

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameManager } from './game/GameManager';
import { FileStorage } from './game/file_storage';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from './types';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const gameManager = new GameManager();
const fileStorage = new FileStorage();

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

    socket.on('createSession', (token, name, gameName, avatarIndex) => {
        // Use token as playerId
        const sessionId = gameManager.createSession(token, name, gameName, avatarIndex);
        socket.join(sessionId);
        const session = gameManager.getSession(sessionId);
        if (session) {
            socket.emit('gameStateUpdate', session);
        }
    });

    socket.on('createPlayer', (sessionId, name, avatarIndex, badges) => {
        const player = gameManager.createPlayer(sessionId, name, avatarIndex, badges);
        if (player) {
            const session = gameManager.getSession(sessionId);
            if (session) {
                io.to(sessionId).emit('gameStateUpdate', session);
                // Also explicitly tell the creator (director) that the player was created if needed, 
                // but gameStateUpdate should cover the list update.
            }
        }
    });

    socket.on('joinSession', (sessionId, playerId) => {
        const session = gameManager.joinSession(sessionId, playerId);
        if (session) {
            socket.join(sessionId);
            io.to(sessionId).emit('gameStateUpdate', session);
        } else {
            // Handle error: session not found or player not found
            console.log(`Failed to join session ${sessionId} with player ${playerId}`);
            socket.emit('error', 'Failed to join session');
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
                }
            }
        }
    });

    socket.on('startRound', (sessionId) => {
        // We can use room iteration or just use the passed ID (if trusted). 
        // Using rooms is safer to ensure they are in the session (director).
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
                } else {
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

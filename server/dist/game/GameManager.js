"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
class GameManager {
    constructor() {
        this.sessions = new Map();
        this.players = new Map();
    }
    createSession(playerId, directorName, avatarIndex) {
        const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const director = { id: playerId, name: directorName, avatarIndex, badges: [] };
        const initialState = {
            sessionId,
            director,
            players: [director],
            players_online: [director],
            currentScene: null,
            round: 1,
            isRoundActive: false,
            submittedActions: [],
            messages: [],
            history: []
        };
        this.sessions.set(sessionId, initialState);
        return sessionId;
    }
    joinSession(sessionId, playerId, playerName, avatarIndex) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        const existingPlayer = session.players.find(p => p.name === playerName);
        if (existingPlayer) {
            // Reconnection: Update player ID
            existingPlayer.id = playerId;
            if (avatarIndex !== undefined)
                existingPlayer.avatarIndex = avatarIndex;
            // Also update director ID if this player is the director
            if (session.director.name === playerName) {
                session.director.id = playerId;
                if (avatarIndex !== undefined)
                    session.director.avatarIndex = avatarIndex;
            }
        }
        else {
            // New player
            const player = { id: playerId, name: playerName, avatarIndex, badges: [] };
            session.players.push(player);
        }
        // Add to online players if not already there (or update id)
        const onlinePlayer = session.players_online.find(p => p.name === playerName);
        if (onlinePlayer) {
            onlinePlayer.id = playerId;
            if (avatarIndex !== undefined)
                onlinePlayer.avatarIndex = avatarIndex;
        }
        else {
            session.players_online.push({
                id: playerId,
                name: playerName,
                avatarIndex,
                badges: session.players.find(p => p.name === playerName)?.badges || []
            });
        }
        return session;
    }
    resumeSession(playerName) {
        for (let [key, session] of this.sessions.entries()) {
            if (session.director.name === playerName) {
                session.players_online.push({
                    id: key,
                    name: playerName,
                    badges: session.players.find(p => p.name === playerName)?.badges || []
                });
                return session;
            }
        }
        return null;
    }
    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
    updateScene(sessionId, scene) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        session.currentScene = scene;
        session.isRoundActive = true; // Start round when scene is updated?
        return session;
    }
    addMessage(sessionId, message) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        session.messages.push(message);
        return session;
    }
    removePlayer(sessionId, playerId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        session.players_online = session.players.filter(p => p.id !== playerId);
        return session;
    }
    submitAction(sessionId, playerId, action) {
        console.log(`GameManager.submitAction: sessionId=${sessionId}, playerId=${playerId}, action=${action}`);
        const session = this.sessions.get(sessionId);
        if (!session) {
            console.log('Session not found');
            return null;
        }
        // Check if player has already submitted
        if (session.submittedActions.includes(playerId)) {
            console.log('Player already submitted');
            return session;
        }
        const player = session.players.find(p => p.id === playerId);
        if (!player) {
            console.log('Player not found in session');
            return null;
        }
        const message = {
            id: Math.random().toString(36).substring(7),
            senderId: playerId,
            senderName: player.name,
            content: action,
            timestamp: Date.now(),
            isAction: true,
            round: session.round
        };
        session.messages.push(message);
        session.submittedActions.push(playerId);
        console.log('Action added. New submittedActions:', session.submittedActions);
        return session;
    }
    handleDisconnect(socketId) {
        const affectedSessions = [];
        for (const session of this.sessions.values()) {
            const wasOnline = session.players_online.some(p => p.id === socketId);
            if (wasOnline) {
                session.players_online = session.players_online.filter(p => p.id !== socketId);
                affectedSessions.push(session);
            }
        }
        return affectedSessions;
    }
    nextRound(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        if (session.currentScene) {
            session.history.push({
                round: session.round,
                scene: session.currentScene
            });
        }
        session.round++;
        session.submittedActions = [];
        session.currentScene = null; // Clear scene description
        session.isRoundActive = false; // Wait for director to update scene
        // Optionally clear action messages or keep them? 
        // For now, we keep them as history.
        return session;
    }
    getAllSessions() {
        return Array.from(this.sessions.values());
    }
    restoreSession(session) {
        this.sessions.set(session.sessionId, session);
        // Ensure legacy sessions have badges array if missing
        session.players.forEach(p => {
            if (!p.badges)
                p.badges = [];
        });
        if (session.director && !session.director.badges) {
            session.director.badges = [];
        }
    }
    addBadge(sessionId, playerId, badge) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        const player = session.players.find(p => p.id === playerId);
        if (player) {
            if (!player.badges)
                player.badges = [];
            player.badges.push(badge);
            // Sync with online players list only if it's a different array reference
            const onlinePlayer = session.players_online.find(p => p.id === playerId);
            if (onlinePlayer && onlinePlayer.badges !== player.badges) {
                if (!onlinePlayer.badges)
                    onlinePlayer.badges = [];
                onlinePlayer.badges.push(badge);
            }
            return session;
        }
        return null;
    }
    removeBadge(sessionId, playerId, badgeIndex) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        const player = session.players.find(p => p.id === playerId);
        if (player && player.badges) {
            if (badgeIndex >= 0 && badgeIndex < player.badges.length) {
                player.badges.splice(badgeIndex, 1);
                // Sync with online players list
                const onlinePlayer = session.players_online.find(p => p.id === playerId);
                if (onlinePlayer && onlinePlayer.badges && onlinePlayer.badges !== player.badges) {
                    // Since indexes are synced (assumed), we can remove the same index
                    if (onlinePlayer.badges.length > badgeIndex) {
                        onlinePlayer.badges.splice(badgeIndex, 1);
                    }
                }
                return session;
            }
        }
        return null;
    }
}
exports.GameManager = GameManager;

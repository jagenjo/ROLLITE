export class GameManager {
    constructor(fileStorage) {
        this.sessions = new Map();
        this.players = new Map();
        this.fileStorage = fileStorage;
    }
    createSession(playerId, directorName, gameName, avatarIndex) {
        const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const director = { id: playerId, name: directorName, avatarIndex };
        const initialState = {
            sessionId,
            gameName,
            director,
            players: [director],
            players_online: [director],
            currentScene: null,
            pendingScene: null, // For director only (draft)
            round: 1,
            isRoundActive: false,
            submittedActions: [],
            messages: [],
            history: []
        };
        this.sessions.set(sessionId, initialState);
        return sessionId;
    }
    createPlayer(sessionId, name, avatarIndex, badges) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        const newPlayerId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const player = {
            id: newPlayerId,
            name,
            avatarIndex
        };
        session.players.push(player);
        // Add initial badges to current or pending scene if provided
        if (badges.length > 0) {
            let targetScene = session.isRoundActive ? session.currentScene : session.pendingScene;
            if (!targetScene && !session.isRoundActive) {
                // Initialize pending scene if needed
                if (!session.pendingScene)
                    session.pendingScene = { description: '' };
                targetScene = session.pendingScene;
            }
            if (targetScene) {
                if (!targetScene.playerBadges)
                    targetScene.playerBadges = {};
                targetScene.playerBadges[newPlayerId] = badges;
            }
        }
        return player;
    }
    joinSession(sessionId, playerId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        const player = session.players?.find(p => p.id === playerId);
        if (!player) {
            console.log(`Player ${playerId} not found in session ${sessionId}`);
            return null;
        }
        // Add to online players if not already there
        const onlinePlayer = session.players_online.find(p => p.id === playerId);
        if (!onlinePlayer) {
            session.players_online.push(player);
        }
        return session;
    }
    resumeSession(playerName) {
        for (let [key, session] of this.sessions.entries()) {
            if (session.director.name === playerName) {
                session.players_online.push({
                    id: key,
                    name: playerName
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
        // Save as pending scene only. Director must "Start Round" to publish.
        // Enhance: Preserve existing pending data if updating just description?
        // For now, assuming standard flow.
        if (!session.pendingScene) {
            session.pendingScene = scene;
        }
        else {
            // Update description but keep existing pending data
            session.pendingScene.description = scene.description;
        }
        return session;
    }
    startRound(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        const sceneSource = session.pendingScene;
        // Process private messages from pending scene
        if (sceneSource?.privateMessages) {
            Object.entries(sceneSource.privateMessages).forEach(([playerId, content]) => {
                if (!content)
                    return;
                const message = {
                    id: Math.random().toString(36).substring(7),
                    senderId: session.director.id,
                    senderName: session.director.name,
                    content: content,
                    timestamp: Date.now(),
                    isAction: false,
                    round: session.round,
                    recipientId: playerId
                };
                session.messages.push(message);
            });
        }
        // Apply pending player statuses from pending scene
        if (sceneSource?.playerStatuses) {
            Object.entries(sceneSource.playerStatuses).forEach(([playerId, status]) => {
                const player = session.players?.find(p => p.id === playerId);
                if (player)
                    player.statusText = status;
                const onlinePlayer = session.players_online.find(p => p.id === playerId);
                if (onlinePlayer)
                    onlinePlayer.statusText = status;
            });
        }
        if (sceneSource) {
            session.currentScene = sceneSource;
            session.isRoundActive = true;
            session.pendingScene = null;
        }
        else if (!session.isRoundActive && session.currentScene) {
            // If no pending scene but we want to start (maybe re-start?), just set active
            session.isRoundActive = true;
        }
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
        const player = session.players?.find(p => p.id === playerId);
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
            // Snapshot player statuses
            const statuses = {};
            session.players.forEach(p => {
                if (p.statusText)
                    statuses[p.id] = p.statusText;
            });
            session.currentScene.playerStatuses = statuses;
            // Preserve badges for the next round
            const currentBadges = JSON.parse(JSON.stringify(session.currentScene.playerBadges));
            session.history.push({
                round: session.round,
                scene: session.currentScene
            });
            // Initialize pending scene with preserved badges
            session.pendingScene = {
                description: '',
                playerBadges: currentBadges // Carry over badges (deep copied)
            };
        }
        else {
            session.pendingScene = null; // Clear any pending drafts if no previous scene to inherit from
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
        return Array.from(this.sessions.values()).map(s => ({
            sessionId: s.sessionId,
            gameName: s.gameName,
            round: s.round,
            playerCount: s?.players?.length || 0,
            onlineCount: s?.players_online?.length || 0,
            directorId: s?.director?.id,
            isEnded: !!s.isEnded
        }));
    }
    restoreSession(session) {
        this.sessions.set(session.sessionId, session);
        // Legacy checks removed
    }
    saveSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session && this.fileStorage) {
            this.fileStorage.saveGame(sessionId, session);
            return true;
        }
        return false;
    }
    deleteSession(sessionId) {
        if (this.sessions.has(sessionId) && this.fileStorage) {
            this.sessions.delete(sessionId);
            this.fileStorage.deleteGame(sessionId);
            // Remove from index
            const index = this.fileStorage.loadGameIndex();
            index.sessions = index.sessions.filter((id) => id !== sessionId);
            this.fileStorage.saveGameIndex(index);
            return true;
        }
        return false;
    }
    endSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.isEnded = true;
            if (this.fileStorage) {
                this.fileStorage.saveGame(sessionId, session);
            }
            return session;
        }
        return null;
    }
    addBadge(sessionId, playerId, badgeName, hidden) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        let targetScene = session.isRoundActive ? session.currentScene : session.pendingScene;
        if (!targetScene) {
            if (!session.isRoundActive) {
                if (!session.pendingScene)
                    session.pendingScene = { description: '' };
                targetScene = session.pendingScene;
            }
            else {
                // Should not happen if isRoundActive is true but currentScene is null?
                // But just in case
                return null;
            }
        }
        if (targetScene) {
            if (!targetScene.playerBadges)
                targetScene.playerBadges = {};
            if (!targetScene.playerBadges[playerId])
                targetScene.playerBadges[playerId] = [];
            targetScene.playerBadges[playerId].push({ name: badgeName, hidden });
        }
        return session;
    }
    setPendingPrivateMessage(sessionId, playerId, content) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        if (!session.pendingScene) {
            // Initialize pending scene if it doesn't exist so we can store messages
            session.pendingScene = { description: '' };
        }
        if (!session.pendingScene.privateMessages)
            session.pendingScene.privateMessages = {};
        session.pendingScene.privateMessages[playerId] = content;
        return session;
    }
    removeBadge(sessionId, playerId, badgeIndex) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        let targetScene = session.isRoundActive ? session.currentScene : session.pendingScene;
        // If inactive, we must look at pendingScene. 
        if (!session.isRoundActive && !targetScene) {
            // If no pending scene, nothing to remove from
            return null;
        }
        if (targetScene && targetScene.playerBadges && targetScene.playerBadges[playerId]) {
            if (badgeIndex >= 0 && badgeIndex < targetScene.playerBadges[playerId].length) {
                targetScene.playerBadges[playerId].splice(badgeIndex, 1);
                return session;
            }
        }
        return null;
    }
    updatePlayerStatus(sessionId, playerId, statusText) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        const player = session.players?.find(p => p.id === playerId);
        const playerOnline = session.players_online.find(p => p.id === playerId);
        if (session.isRoundActive) {
            if (player)
                player.statusText = statusText;
            if (playerOnline && playerOnline !== player)
                playerOnline.statusText = statusText;
        }
        else {
            if (!session.pendingScene) {
                session.pendingScene = { description: '' };
            }
            if (!session.pendingScene.playerStatuses)
                session.pendingScene.playerStatuses = {};
            session.pendingScene.playerStatuses[playerId] = statusText;
        }
        return session;
    }
    updatePlayerAvatar(sessionId, playerId, avatarIndex) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        const player = session.players?.find(p => p.id === playerId);
        const playerOnline = session.players_online.find(p => p.id === playerId);
        if (player) {
            player.avatarIndex = avatarIndex;
        }
        // If objects are different references
        if (playerOnline && playerOnline !== player) {
            playerOnline.avatarIndex = avatarIndex;
        }
        return session;
    }
    updatePlayerBackground(sessionId, playerId, background) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        const player = session.players?.find(p => p.id === playerId);
        const playerOnline = session.players_online.find(p => p.id === playerId);
        if (player) {
            player.background = background;
        }
        if (playerOnline && playerOnline !== player) {
            playerOnline.background = background;
        }
        return session;
    }
    updatePlayerName(sessionId, playerId, name) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        const player = session.players?.find(p => p.id === playerId);
        const playerOnline = session.players_online.find(p => p.id === playerId);
        if (player) {
            player.name = name;
        }
        if (playerOnline && playerOnline !== player) {
            playerOnline.name = name;
        }
        return session;
    }
}

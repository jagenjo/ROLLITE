import { GameState, Player, Scene, Message } from '../../shared/types.js';

export class GameManager {
    private sessions: Map<string, GameState> = new Map();
    private players: Map<string, Player> = new Map();
    private fileStorage?: any;

    constructor(fileStorage?: any) {
        this.fileStorage = fileStorage;
    }

    createSession(playerId: string, directorName: string, gameName: string, avatarIndex?: number, templateId?: string): string {
        let initialState: GameState;

        if (templateId && this.fileStorage) {
            const template = this.fileStorage.loadTemplate(templateId);
            if (template) {
                // Clone the template
                initialState = JSON.parse(JSON.stringify(template));

                // Override specific fields for the new session
                initialState.sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
                initialState.gameName = gameName; // Use new name

                // Reset Director
                const director: Player = { id: playerId, name: directorName, avatarIndex };
                initialState.director = director;
                initialState.players = [director];
                initialState.players_online = [director];

                // Reset dynamic state
                initialState.submittedActions = [];
                initialState.messages = [];
                initialState.history = []; // Optionally keep history or clear it? Clearing for fresh start.
                initialState.isRoundActive = false; // Ensure starts inactive?
                initialState.isEnded = false;

                // If template had pending scene, keep it. 
                // If it had current scene, maybe move it to pending if we want to start fresh? 
                // For now, exact clone of scene state seems best, just resetting players/history.
            } else {
                // Fallback if template fails
                const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
                const director: Player = { id: playerId, name: directorName, avatarIndex };
                initialState = {
                    sessionId,
                    gameName,
                    director,
                    players: [director],
                    players_online: [director],
                    currentScene: null,
                    pendingScene: null,
                    round: 1,
                    isRoundActive: false,
                    submittedActions: [],
                    messages: [],
                    history: []
                };
            }
        } else {
            const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
            const director: Player = { id: playerId, name: directorName, avatarIndex };

            initialState = {
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
        }

        this.sessions.set(initialState.sessionId, initialState);
        return initialState.sessionId;
    }

    createPlayer(sessionId: string, name: string, avatarIndex: number, badges: { name: string, hidden: boolean }[]): Player | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const newPlayerId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const player: Player = {
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
                if (!session.pendingScene) session.pendingScene = { description: '' };
                targetScene = session.pendingScene;
            }

            if (targetScene) {
                if (!targetScene.playerBadges) targetScene.playerBadges = {};
                targetScene.playerBadges[newPlayerId] = badges;
            }
        }
        return player;
    }

    joinSession(sessionId: string, playerId: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const player = session.players?.find(p => p.id === playerId);
        if (!player) {
            console.log(`Player ${playerId} not found in session ${sessionId}`);
            return null;
        }

        // Add to online players if not already there
        const onlinePlayer = session.players_online?.find(p => p.id === playerId);
        if (!onlinePlayer) {
            session.players_online?.push(player);
        }

        return session;
    }

    resumeSession(playerName: string): GameState | null {
        for (let [key, session] of this.sessions.entries()) {
            if (session.director.name === playerName) {
                session.players_online?.push({
                    id: key,
                    name: playerName
                });
                return session;
            }
        }
        return null
    }

    getSession(sessionId: string): GameState | undefined {
        return this.sessions.get(sessionId);
    }

    updateScene(sessionId: string, scene: Scene): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        // Save as pending scene only. Director must "Start Round" to publish.
        // Enhance: Preserve existing pending data if updating just description?
        // For now, assuming standard flow.
        if (!session.pendingScene) {
            session.pendingScene = scene;
        } else {
            // Update description but keep existing pending data
            session.pendingScene.description = scene.description;
        }
        return session;
    }

    startRound(sessionId: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const sceneSource = session.pendingScene;

        // Process private messages from pending scene
        if (sceneSource?.privateMessages) {
            Object.entries(sceneSource.privateMessages).forEach(([playerId, content]) => {
                if (!content) return;
                const message: Message = {
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
                if (player) player.statusText = status;

                const onlinePlayer = session.players_online?.find(p => p.id === playerId);
                if (onlinePlayer) onlinePlayer.statusText = status;
            });
        }

        if (sceneSource) {
            session.currentScene = sceneSource;
            session.isRoundActive = true;
            session.pendingScene = null;
        } else if (!session.isRoundActive && session.currentScene) {
            // If no pending scene but we want to start (maybe re-start?), just set active
            session.isRoundActive = true;
        }

        return session;
    }

    addMessage(sessionId: string, message: Message): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        session.messages.push(message);
        return session;
    }

    removePlayer(sessionId: string, playerId: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        session.players_online = session.players.filter(p => p.id !== playerId);
        return session;
    }

    submitAction(sessionId: string, playerId: string, action: string): GameState | null {
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

        const message: Message = {
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

    handleDisconnect(socketId: string): GameState[] {
        const affectedSessions: GameState[] = [];
        for (const session of this.sessions.values()) {
            const wasOnline = session.players_online?.some(p => p.id === socketId);
            if (wasOnline) {
                session.players_online = session.players_online?.filter(p => p.id !== socketId);
                affectedSessions.push(session);
            }
        }
        return affectedSessions;
    }


    nextRound(sessionId: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        if (session.currentScene) {
            // Snapshot player statuses
            const statuses: Record<string, string> = {};
            session.players.forEach(p => {
                if (p.statusText) statuses[p.id] = p.statusText;
            });
            session.currentScene.playerStatuses = statuses;

            // Preserve badges for the next round
            const currentBadges = session.currentScene.playerBadges ? JSON.parse(JSON.stringify(session.currentScene.playerBadges)) : {};

            session.history.push({
                round: session.round,
                scene: session.currentScene
            });

            // Initialize pending scene with preserved badges
            session.pendingScene = {
                description: '',
                playerBadges: currentBadges // Carry over badges (deep copied)
            };
        } else {
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

    getAllSessions(): any[] {
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

    restoreSession(session: GameState) {
        this.sessions.set(session.sessionId, session);
        // Legacy checks removed
    }

    saveSession(sessionId: string) {
        const session = this.sessions.get(sessionId);
        if (session && this.fileStorage) {
            this.fileStorage.saveGame(sessionId, session);
            return true;
        }
        return false;
    }

    deleteSession(sessionId: string) {
        if (this.sessions.has(sessionId) && this.fileStorage) {
            this.sessions.delete(sessionId);
            this.fileStorage.deleteGame(sessionId);

            // Remove from index
            const index = this.fileStorage.loadGameIndex();
            index.sessions = index.sessions.filter((id: string) => id !== sessionId);
            this.fileStorage.saveGameIndex(index);
            return true;
        }
        return false;
    }

    endSession(sessionId: string) {
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

    addBadge(sessionId: string, playerId: string, badgeName: string, hidden: boolean): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        let targetScene = session.isRoundActive ? session.currentScene : session.pendingScene;
        if (!targetScene) {
            if (!session.isRoundActive) {
                if (!session.pendingScene) session.pendingScene = { description: '' };
                targetScene = session.pendingScene;
            } else {
                // Should not happen if isRoundActive is true but currentScene is null?
                // But just in case
                return null;
            }
        }

        if (targetScene) {
            if (!targetScene.playerBadges) targetScene.playerBadges = {};
            if (!targetScene.playerBadges[playerId]) targetScene.playerBadges[playerId] = [];
            targetScene.playerBadges[playerId].push({ name: badgeName, hidden });
        }

        return session;
    }

    setPendingPrivateMessage(sessionId: string, playerId: string, content: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;
        if (!session.pendingScene) {
            // Initialize pending scene if it doesn't exist so we can store messages
            session.pendingScene = { description: '' };
        }
        if (!session.pendingScene.privateMessages) session.pendingScene.privateMessages = {};
        session.pendingScene.privateMessages[playerId] = content;
        return session;
    }

    removeBadge(sessionId: string, playerId: string, badgeIndex: number): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

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
    updatePlayerStatus(sessionId: string, playerId: string, statusText: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const player = session.players?.find(p => p.id === playerId);
        const playerOnline = session.players_on
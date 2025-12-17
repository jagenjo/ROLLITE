import { GameState, Player, Scene, Message } from '../types';

export class GameManager {
    private sessions: Map<string, GameState> = new Map();
    private players: Map<string, Player> = new Map();

    createSession(playerId: string, directorName: string, gameName: string, avatarIndex?: number): string {
        const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const director: Player = { id: playerId, name: directorName, avatarIndex, badges: [] };

        const initialState: GameState = {
            sessionId,
            gameName,
            director,
            players: [director],
            players_online: [director],
            currentScene: null,
            pendingScene: null, // For director only (draft)
            pendingPrivateMessages: {},
            round: 1,
            isRoundActive: false,
            submittedActions: [],
            messages: [],
            history: []
        };

        this.sessions.set(sessionId, initialState);
        return sessionId;
    }

    createPlayer(sessionId: string, name: string, avatarIndex: number, badges: { name: string, hidden: boolean }[]): Player | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const newPlayerId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const player: Player = {
            id: newPlayerId,
            name,
            avatarIndex,
            badges
        };
        session.players.push(player);
        return player;
    }




    joinSession(sessionId: string, playerId: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const player = session.players.find(p => p.id === playerId);
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

    resumeSession(playerName: string): GameState | null {
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
        return null
    }

    getSession(sessionId: string): GameState | undefined {
        return this.sessions.get(sessionId);
    }

    updateScene(sessionId: string, scene: Scene): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        // Save as pending scene only. Director must "Start Round" to publish.
        session.pendingScene = scene;
        // Do NOT set currentScene or isRoundActive yet.
        return session;
    }

    startRound(sessionId: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        if (session.pendingScene) {
            session.currentScene = session.pendingScene;
            session.isRoundActive = true;
            session.pendingScene = null;
        } else if (!session.isRoundActive && session.currentScene) {
            // If no pending scene but we want to start (maybe re-start?), just set active
            session.isRoundActive = true;
        }

        // Apply pending player statuses
        session.players.forEach(p => {
            if (p.pendingStatusText !== undefined) {
                p.statusText = p.pendingStatusText;
                p.pendingStatusText = undefined;
            }
        });
        session.players_online.forEach(p => {
            if (p.pendingStatusText !== undefined) {
                p.statusText = p.pendingStatusText;
                p.pendingStatusText = undefined;
            }
        });

        // Process pending private messages
        if (session.pendingPrivateMessages) {
            Object.entries(session.pendingPrivateMessages).forEach(([playerId, content]) => {
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
            session.pendingPrivateMessages = {};
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

        const player = session.players.find(p => p.id === playerId);
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
            const wasOnline = session.players_online.some(p => p.id === socketId);
            if (wasOnline) {
                session.players_online = session.players_online.filter(p => p.id !== socketId);
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

            session.history.push({
                round: session.round,
                scene: session.currentScene
            });
        }

        session.round++;
        session.submittedActions = [];
        session.currentScene = null; // Clear scene description
        session.pendingScene = null; // Clear any pending drafts
        session.isRoundActive = false; // Wait for director to update scene
        // Optionally clear action messages or keep them? 
        // For now, we keep them as history.
        return session;
    }

    getAllSessions(): GameState[] {
        return Array.from(this.sessions.values());
    }

    restoreSession(session: GameState) {
        this.sessions.set(session.sessionId, session);
        // Ensure legacy sessions have badges array if missing
        session.players.forEach(p => {
            if (!p.badges) p.badges = [];
        });
        if (session.director && !session.director.badges) {
            session.director.badges = [];
        }
    }

    addBadge(sessionId: string, playerId: string, badgeName: string, hidden: boolean): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const player = session.players.find(p => p.id === playerId);
        const playerOnline = session.players_online.find(p => p.id === playerId);

        // Sanitize legacy strings if any persist (optional safety)

        if (player) {
            if (!player.badges) player.badges = [];
            player.badges.push({ name: badgeName, hidden });
        }

        // Sync online player too if needed
        if (playerOnline) {
            if (!playerOnline.badges) playerOnline.badges = [];
            // Avoid duplication if they point to different refs
            if (playerOnline !== player) {
                playerOnline.badges.push({ name: badgeName, hidden });
            }
        }

        return session;
    }

    setPendingPrivateMessage(sessionId: string, playerId: string, content: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;
        if (!session.pendingPrivateMessages) session.pendingPrivateMessages = {};
        session.pendingPrivateMessages[playerId] = content;
        return session;
    }

    removeBadge(sessionId: string, playerId: string, badgeIndex: number): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

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
    updatePlayerStatus(sessionId: string, playerId: string, statusText: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const player = session.players.find(p => p.id === playerId);
        const playerOnline = session.players_online.find(p => p.id === playerId);

        if (session.isRoundActive) {
            if (player) {
                player.statusText = statusText;
                player.pendingStatusText = undefined; // Clear pending if any
            }
            if (playerOnline && playerOnline !== player) {
                playerOnline.statusText = statusText;
                playerOnline.pendingStatusText = undefined;
            }
        } else {
            if (player) {
                player.pendingStatusText = statusText;
            }
            if (playerOnline && playerOnline !== player) {
                playerOnline.pendingStatusText = statusText;
            }
        }

        return session;
    }
}

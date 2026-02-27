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

                // Preserve existing players (characters) from template, excluding the old director
                const oldDirectorId = template.director.id;
                const accumulatedPlayers = template.players.filter((p: Player) => p.id !== oldDirectorId);

                initialState.players = [director, ...accumulatedPlayers];
                initialState.players_online = [director];

                // Reset dynamic state
                initialState.submittedActions = [];
                initialState.messages = [];
                initialState.history = []; // Optionally keep history or clear it? Clearing for fresh start.
                initialState.isRoundActive = false; // Ensure starts inactive?
                initialState.isEnded = false;
                initialState.status = 'INACTIVE';
                initialState.createdAt = Date.now();

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
                    history: [],
                    status: 'INACTIVE',
                    createdAt: Date.now()
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
                history: [],
                status: 'INACTIVE',
                createdAt: Date.now()
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

        let targetScene = session.isRoundActive ? session.currentScene : session.pendingScene;

        if (targetScene) {
            targetScene.description = scene.description;
        } else if (!session.isRoundActive) {
            // If inactive and no pending scene, create one
            session.pendingScene = scene;
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
            session.status = 'ROUND_ACTIVE';
            session.pendingScene = null;
        } else if (!session.isRoundActive && session.currentScene) {
            // If no pending scene but we want to start (maybe re-start?), just set active
            session.isRoundActive = true;
            session.status = 'ROUND_ACTIVE';
        }

        session.lastRoundAt = Date.now();

        return session;
    }

    addMessage(sessionId: string, message: Message): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        session.messages.push(message);
        return session;
    }

    applyNextRoundUpdates(sessionId: string, description: string, characterUpdates: { id: string, statusText?: string, badge?: { name: string, hidden: boolean }, privateMessage?: string }[], summary?: string, goals?: { description: string, isCompleted: boolean }[]): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        // Ensure pending scene exists
        if (!session.pendingScene) {
            session.pendingScene = { description: '' };
        }

        // 1. Update Description
        if (description) {
            session.pendingScene.description = description;
        }

        // 2. Update Summary
        if (summary) {
            session.gameSummary = summary;
        }

        // 2.5 Update Goals
        if (goals) {
            session.goals = goals;
        }

        // 3. Process Character Updates
        for (const update of characterUpdates) {
            // Status Text
            if (update.statusText !== undefined) {
                if (!session.pendingScene.playerStatuses) session.pendingScene.playerStatuses = {};
                session.pendingScene.playerStatuses[update.id] = update.statusText;
            }

            // Private Message
            if (update.privateMessage) {
                if (!session.pendingScene.privateMessages) session.pendingScene.privateMessages = {};
                session.pendingScene.privateMessages[update.id] = update.privateMessage;
            }

            // Badges
            // Only adding badges (not removing for now, as LLM usually grants things)
            if (update.badge) {
                if (!session.pendingScene.playerBadges) session.pendingScene.playerBadges = {};
                if (!session.pendingScene.playerBadges[update.id]) session.pendingScene.playerBadges[update.id] = [];
                session.pendingScene.playerBadges[update.id].push(update.badge);
            }
        }

        session.status = 'INACTIVE';
        session.lastRoundAt = Date.now();
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
            return null;
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

    updatePlayerAction(sessionId: string, playerId: string, actionContent: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const player = session.players.find(p => p.id === playerId);
        if (!player) return null;

        // Find existing action for this player in this round
        let actionMessage = session.messages.find(m => m.senderId === playerId && m.round === session.round && m.isAction);

        if (actionMessage) {
            actionMessage.content = actionContent;
            actionMessage.timestamp = Date.now();
        } else {
            // Create new action if doesn't exist
            actionMessage = {
                id: Math.random().toString(36).substring(7),
                senderId: playerId,
                senderName: player.name,
                content: actionContent,
                timestamp: Date.now(),
                isAction: true,
                round: session.round
            };
            session.messages.push(actionMessage);
        }

        // Ensure player is in submittedActions
        if (!session.submittedActions.includes(playerId)) {
            session.submittedActions.push(playerId);
        }

        return session;
    }

    leaveSession(sessionId: string, playerId: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        session.players_online = session.players_online?.filter(p => p.id !== playerId);
        return session;
    }

    updateDirectives(sessionId: string, directives: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        session.directives = directives;
        return session;
    }

    updateGameSummary(sessionId: string, summary: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;
        session.gameSummary = summary;
        return session;
    }

    toggleGoalCompletion(sessionId: string, goalIndex: number): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session || !session.goals || !session.goals[goalIndex]) return null;

        session.goals[goalIndex].isCompleted = !session.goals[goalIndex].isCompleted;
        return session;
    }

    deleteGoal(sessionId: string, goalIndex: number): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session || !session.goals || !session.goals[goalIndex]) return null;

        session.goals.splice(goalIndex, 1);
        return session;
    }

    addGoal(sessionId: string, description: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        if (!session.goals) session.goals = [];
        session.goals.push({ description, isCompleted: false });
        return session;
    }

    handleDisconnect(socketId: string): GameState[] {
        // This is now handled by the server tracking socket counts
        return [];
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
        session.status = 'INACTIVE';
        // Optionally clear action messages or keep them? 
        // For now, we keep them as history.
        return session;
    }

    getSessionSummaries(): any[] {
        return Array.from(this.sessions.values()).map(s => ({
            sessionId: s.sessionId,
            gameName: s.gameName,
            round: s.round,
            playerCount: s?.players?.length || 0,
            onlineCount: s?.players_online?.length || 0,
            directorId: s?.director?.id,
            isEnded: !!s.isEnded,
            status: s.status || 'INACTIVE',
            createdAt: s.createdAt,
            lastRoundAt: s.lastRoundAt
        }));
    }

    getSessions(): GameState[] {
        return Array.from(this.sessions.values());
    }

    restoreSession(session: GameState) {
        if (!session.createdAt) {
            session.createdAt = Date.now();
        }
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
            session.status = 'ENDED'; // New: Set status to ended
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
        const playerOnline = session.players_online?.find(p => p.id === playerId);

        if (session.isRoundActive) {
            if (player) player.statusText = statusText;
            if (playerOnline && playerOnline !== player) playerOnline.statusText = statusText;
        } else {
            if (!session.pendingScene) {
                session.pendingScene = { description: '' };
            }
            if (!session.pendingScene.playerStatuses) session.pendingScene.playerStatuses = {};
            session.pendingScene.playerStatuses[playerId] = statusText;
        }

        return session;
    }

    updatePlayerAvatar(sessionId: string, playerId: string, avatarIndex: number): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const player = session.players?.find(p => p.id === playerId);
        const playerOnline = session.players_online?.find(p => p.id === playerId);

        if (player) {
            player.avatarIndex = avatarIndex;
        }
        // If objects are different references
        if (playerOnline && playerOnline !== player) {
            playerOnline.avatarIndex = avatarIndex;
        }

        return session;
    }

    updatePlayerBackground(sessionId: string, playerId: string, background: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const player = session.players?.find(p => p.id === playerId);
        const playerOnline = session.players_online?.find(p => p.id === playerId);

        if (player) {
            player.background = background;
        }
        if (playerOnline && playerOnline !== player) {
            playerOnline.background = background;
        }

        return session;
    }

    updatePlayerName(sessionId: string, playerId: string, name: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const player = session.players?.find(p => p.id === playerId);
        const playerOnline = session.players_online?.find(p => p.id === playerId);

        if (player) {
            player.name = name;
        }
        if (playerOnline && playerOnline !== player) {
            playerOnline.name = name;
        }

        return session;
    }

    saveAsTemplate(sessionId: string, templateName: string): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;

        // Restriction: Can only save as template in early rounds (Round 1) to avoid carrying over too much baggage?
        // Or maybe strictly Round 1.
        if (session.round > 1) {
            console.warn(`Cannot save as template: Round is ${session.round}`);
            return false;
        }

        if (!this.fileStorage) return false;

        // Clone session
        const templateState: GameState = JSON.parse(JSON.stringify(session));

        // Clean up for template
        templateState.gameName = templateName; // Store the template name here
        templateState.sessionId = 'TEMPLATE'; // Placeholder
        templateState.players_online = [];
        templateState.submittedActions = [];
        templateState.messages = [];
        // Keep pendingScene and currentScene as the "content"

        // Generate a simple ID for the template file
        const templateId = Math.random().toString(36).substring(2, 10);

        return this.fileStorage.saveTemplate(templateId, templateState);
    }

    getTemplates(): { id: string, name: string }[] {
        if (this.fileStorage) {
            return this.fileStorage.listTemplates();
        }
        return [];
    }

    loadTemplateIntoSession(sessionId: string, templateId: string): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;

        if (session.round > 1) {
            console.warn(`Cannot load template into session ${sessionId}: Round is ${session.round}`);
            return false;
        }

        if (!this.fileStorage) return false;

        const template = this.fileStorage.loadTemplate(templateId);
        if (!template) {
            console.warn(`Template ${templateId} not found`);
            return false;
        }

        // Merge Logic
        // Keep: sessionId, director, players_online, gameName, messages (cleared?), history (cleared)
        // Overwrite: currentScene, pendingScene, round, submittedActions

        session.currentScene = template.currentScene;
        session.pendingScene = template.pendingScene;
        session.round = 1; // Reset round to 1
        session.isRoundActive = false;
        session.status = 'INACTIVE'; // New: Set status to inactive
        session.submittedActions = [];
        session.history = []; // Reset history
        session.messages = []; // Reset messages to start fresh
        session.gameSummary = template.gameSummary || "";
        session.goals = template.goals || [];
        session.directives = template.directives || "";

        // Reset Players:
        // Keep director, replace characters.
        const director = session.director;

        // Filter out the OLD director from the template players
        const templatePlayers = template.players.filter((p: Player) => p.id !== template.director.id);

        // Reconstruct player list: Director + Template Characters
        session.players = [director, ...templatePlayers];

        // Ensure online players are still in the list (or at least valid)?
        // If we reset players, online players might refer to objects no longer in `session.players` if we use strict reference equality.
        // But `players_online` is a separate array.
        // We should probably just ensure the director object in `players_online` is the same ref if possible, or just leave it.
        // The front-end reconciles by ID usually.

        return true;
    }
}

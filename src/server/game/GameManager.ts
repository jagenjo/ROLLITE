import { GameState, Player, Round, Character, Message, Badge } from '../../shared/types.js';

export class GameManager {
    private sessions: Map<string, GameState> = new Map();
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
                initialState.gameName = gameName;

                // Reset Director
                const director: Player = { id: playerId, name: directorName, isOnline: true };
                initialState.director = director;

                // Preserve existing players from template, excluding the old director
                const oldDirectorId = template.director.id;
                const templatePlayers = template.players.filter((p: Player) => p.id !== oldDirectorId);

                initialState.players = [director, ...templatePlayers];

                // Reset dynamic state
                initialState.messages = [];
                initialState.rounds = [];
                initialState.status = 'INACTIVE';
                initialState.createdAt = Date.now();
                initialState.draftRound = null;
                initialState.gameSummary = '';
                initialState.goals = initialState.goals || [];
                initialState.directives = initialState.directives || '';
                initialState.autoGame = initialState.autoGame || false;

            } else {
                // Fallback if template fails
                const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
                const director: Player = { id: playerId, name: directorName, isOnline: true };
                initialState = {
                    sessionId,
                    gameName,
                    director,
                    players: [director],
                    draftRound: null,
                    messages: [],
                    rounds: [],
                    gameSummary: '',
                    status: 'INACTIVE',
                    createdAt: Date.now(),
                    goals: [],
                    directives: '',
                    autoGame: false
                };
            }
        } else {
            const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
            const director: Player = { id: playerId, name: directorName, isOnline: true };

            initialState = {
                sessionId,
                gameName,
                director,
                players: [director],
                draftRound: null,
                messages: [],
                rounds: [],
                gameSummary: '',
                status: 'INACTIVE',
                createdAt: Date.now(),
                goals: [],
                directives: '',
                autoGame: false
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
            isOnline: true
        };
        session.players.push(player);

        // Add player to the current target round
        let targetRound = session.status === 'ROUND_ACTIVE' ? session.rounds[session.rounds.length - 1] : session.draftRound;
        if (!targetRound && session.status !== 'ROUND_ACTIVE') {
            // Initialize draft round if needed
            if (!session.draftRound) session.draftRound = { index: session.rounds.length, description: '', summary: '', characters: [], hasFinished: false };
            targetRound = session.draftRound;
        }

        if (targetRound) {
            const char = this.getOrCreateRoundCharacter(targetRound, newPlayerId);
            char.badges = badges || [];
            char.avatarIndex = avatarIndex;
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

        player.isOnline = true;
        return session;
    }

    resumeSession(playerName: string): GameState | null {
        for (let session of this.sessions.values()) {
            if (session.director.name === playerName) {
                session.director.isOnline = true;
                return session;
            }
            const player = session.players.find(p => p.name === playerName);
            if (player) {
                player.isOnline = true;
                return session;
            }
        }
        return null;
    }

    getSession(sessionId: string): GameState | undefined {
        return this.sessions.get(sessionId);
    }

    updateRound(sessionId: string, round: Round): GameState | null {
        console.log('>> updateRound', sessionId);
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        let targetRound = session.status === 'ROUND_ACTIVE' ? session.rounds[session.rounds.length - 1] : session.draftRound;

        if (targetRound) {
            if (round.description !== undefined) {
                targetRound.description = round.description;
            }
            if (round.characters !== undefined) {
                targetRound.characters = round.characters;
            }
        } else if (session.status !== 'ROUND_ACTIVE') {
            // If inactive and no draft round, create one
            session.draftRound = {
                index: session.rounds.length,
                description: round.description || '',
                summary: round.summary || '',
                characters: round.characters || [],
                hasFinished: false
            };
        }

        return session;
    }

    startRound(sessionId: string): GameState | null {
        console.log('>> startRound', sessionId);
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const roundSource = session.draftRound;

        // Process private messages from draft round characters
        if (roundSource?.characters) {
            roundSource.characters.forEach(char => {
                const content = char.privateMessage;
                if (!content) return;
                const message: Message = {
                    id: Math.random().toString(36).substring(7),
                    senderId: session.director.id,
                    senderName: session.director.name,
                    content: content,
                    timestamp: Date.now(),
                    isAction: false,
                    round: session.rounds.length,
                    recipientId: char.playerId
                };
                session.messages.push(message);
            });
        }

        if (roundSource) {
            roundSource.index = session.rounds.length;
            session.rounds.push(roundSource);
            session.status = 'ROUND_ACTIVE';
            session.draftRound = null;
        } else if (session.status !== 'ROUND_ACTIVE' && session.rounds.length > 0) {
            session.status = 'ROUND_ACTIVE';
        }

        return session;
    }

    private getOrCreateRoundCharacter(round: Round, playerId: string): Character {
        console.log('>> getOrCreateRoundCharacter', playerId);
        if (!round.characters) {
            round.characters = [];
        }
        let char = round.characters.find(c => c.playerId === playerId);
        if (!char) {
            char = { playerId, status: '', badges: [], action: '' };
            round.characters.push(char);
        }
        return char;
    }

    addMessage(sessionId: string, message: Message): GameState | null {
        console.log('>> addMessage', message);
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        session.messages.push(message);
        return session;
    }

    applyNextRoundUpdates(sessionId: string, description: string, characterUpdates: { id: string, statusText?: string, badge?: { name: string, hidden: boolean }, privateMessage?: string, avatarIndex?: number, background?: string }[], summary?: string, goals?: { description: string, isCompleted: boolean }[]): GameState | null {
        console.log('>> applyNextRoundUpdates', sessionId);
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        // Ensure draft round exists
        if (!session.draftRound) {
            session.draftRound = { index: session.rounds.length, description: '', summary: '', characters: [], hasFinished: false };
        }

        // 1. Update Description
        if (description) {
            session.draftRound.description = description;
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
            const char = this.getOrCreateRoundCharacter(session.draftRound, update.id);

            // Status Text
            if (update.statusText !== undefined) {
                char.status = update.statusText;
            }

            // Private Message
            if (update.privateMessage) {
                char.privateMessage = update.privateMessage;
            }

            if (update.avatarIndex !== undefined) {
                char.avatarIndex = update.avatarIndex;
            }

            if (update.background) {
                char.background = update.background;
            }

            // Badges
            if (update.badge) {
                char.badges.push(update.badge);
            }
        }

        session.status = 'INACTIVE';
        return session;
    }

    removePlayer(sessionId: string, playerId: string): GameState | null {
        console.log('>> removePlayer', playerId);
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const player = session.players.find(p => p.id === playerId);
        if (player) {
            player.isOnline = false;
        } else if (session.director.id === playerId) {
            session.director.isOnline = false;
        }
        return session;
    }

    deletePlayer(sessionId: string, playerId: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        // Permanent removal from session
        session.players = session.players.filter(p => p.id !== playerId);

        // Cleanup draft round data
        if (session.draftRound) {
            session.draftRound.characters = session.draftRound.characters.filter(c => c.playerId !== playerId);
        }

        // Cleanup current active round data
        if (session.status === 'ROUND_ACTIVE' && session.rounds.length > 0) {
            const currentRound = session.rounds[session.rounds.length - 1];
            currentRound.characters = currentRound.characters.filter(c => c.playerId !== playerId);
        }

        return session;
    }

    submitAction(sessionId: string, playerId: string, action: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session || session.status !== 'ROUND_ACTIVE' || session.rounds.length === 0) {
            return null;
        }

        const currentRound = session.rounds[session.rounds.length - 1];
        const char = this.getOrCreateRoundCharacter(currentRound, playerId);
        char.action = action;
        return session;
    }

    updatePlayerAction(sessionId: string, playerId: string, actionContent: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session || session.status !== 'ROUND_ACTIVE' || session.rounds.length === 0) return null;

        const currentRound = session.rounds[session.rounds.length - 1];
        const char = this.getOrCreateRoundCharacter(currentRound, playerId);
        char.action = actionContent;

        return session;
    }

    leaveSession(sessionId: string, playerId: string): GameState | null {
        return this.removePlayer(sessionId, playerId);
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

    toggleAutoGame(sessionId: string, autoGame: boolean): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;
        session.autoGame = autoGame;
        return session;
    }

    handleDisconnect(socketId: string): GameState[] {
        // This is now handled by the server tracking socket counts
        return [];
    }

    nextRound(sessionId: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        if (session.status === 'ROUND_ACTIVE' && session.rounds.length > 0) {
            const currentRound = session.rounds[session.rounds.length - 1];
            currentRound.hasFinished = true;

            // Initialize draft round carry over characters
            const nextCharacters: Character[] = currentRound.characters.map(c => ({
                ...c,
                action: '', // Reset action for next round
                privateMessage: '' // Reset private message
            }));

            session.draftRound = {
                index: session.rounds.length,
                description: '',
                summary: '',
                characters: nextCharacters,
                hasFinished: false
            };
        }

        session.status = 'INACTIVE';
        return session;
    }

    getSessionSummaries() {
        return Array.from(this.sessions.values()).map(s => ({
            sessionId: s.sessionId,
            gameName: s.gameName,
            round_number: s.rounds.length,
            playerCount: s?.players?.length || 0,
            onlineCount: s?.players.filter(p => p.isOnline).length || 0,
            directorId: s?.director?.id,
            status: s.status || 'INACTIVE',
            createdAt: s.createdAt
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
            session.status = 'ENDED';
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

        let targetRound = session.status === 'ROUND_ACTIVE' ? session.rounds[session.rounds.length - 1] : session.draftRound;
        if (!targetRound && session.status !== 'ROUND_ACTIVE') {
            if (!session.draftRound) session.draftRound = { index: session.rounds.length, description: '', summary: '', characters: [], hasFinished: false };
            targetRound = session.draftRound;
        }

        if (targetRound) {
            const char = this.getOrCreateRoundCharacter(targetRound, playerId);
            char.badges.push({ name: badgeName, hidden });
        }

        return session;
    }

    setPendingPrivateMessage(sessionId: string, playerId: string, content: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;
        if (!session.draftRound) {
            session.draftRound = { index: session.rounds.length, description: '', summary: '', characters: [], hasFinished: false };
        }
        const char = this.getOrCreateRoundCharacter(session.draftRound, playerId);
        char.privateMessage = content;
        return session;
    }

    removeBadge(sessionId: string, playerId: string, badgeIndex: number): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        let targetRound = session.status === 'ROUND_ACTIVE' ? session.rounds[session.rounds.length - 1] : session.draftRound;

        if (targetRound) {
            const char = targetRound.characters.find(c => c.playerId === playerId);
            if (char && char.badges && badgeIndex >= 0 && badgeIndex < char.badges.length) {
                char.badges.splice(badgeIndex, 1);
                return session;
            }
        }

        return null;
    }

    updatePlayerStatus(sessionId: string, playerId: string, statusText: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        let targetRound = session.status === 'ROUND_ACTIVE' ? session.rounds[session.rounds.length - 1] : session.draftRound;

        if (!targetRound && session.status !== 'ROUND_ACTIVE') {
            session.draftRound = { index: session.rounds.length, description: '', summary: '', characters: [], hasFinished: false };
            targetRound = session.draftRound;
        }

        if (targetRound) {
            const char = this.getOrCreateRoundCharacter(targetRound, playerId);
            char.status = statusText;
        }

        return session;
    }

    updatePlayerAvatar(sessionId: string, playerId: string, avatarIndex: number): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        let targetRound = session.status === 'ROUND_ACTIVE' ? session.rounds[session.rounds.length - 1] : session.draftRound;

        if (!targetRound && session.status !== 'ROUND_ACTIVE') {
            session.draftRound = { index: session.rounds.length, description: '', summary: '', characters: [], hasFinished: false };
            targetRound = session.draftRound;
        }

        if (targetRound) {
            const char = this.getOrCreateRoundCharacter(targetRound, playerId);
            char.avatarIndex = avatarIndex;
        }

        return session;
    }

    updatePlayerBackground(sessionId: string, playerId: string, background: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        let targetRound = session.status === 'ROUND_ACTIVE' ? session.rounds[session.rounds.length - 1] : session.draftRound;

        if (!targetRound && session.status !== 'ROUND_ACTIVE') {
            session.draftRound = { index: session.rounds.length, description: '', summary: '', characters: [], hasFinished: false };
            targetRound = session.draftRound;
        }

        if (targetRound) {
            const char = this.getOrCreateRoundCharacter(targetRound, playerId);
            char.background = background;
        }

        return session;
    }

    updatePlayerName(sessionId: string, playerId: string, name: string): GameState | null {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const player = session.players?.find(p => p.id === playerId);

        if (player) {
            player.name = name;
        } else if (session.director.id === playerId) {
            session.director.name = name;
        }

        return session;
    }

    saveAsTemplate(sessionId: string, templateName: string): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;

        if (session.rounds.length > 1) {
            console.warn(`Cannot save as template: Round is ${session.rounds.length}`);
            return false;
        }

        if (!this.fileStorage) return false;

        // Clone session
        const templateState: GameState = JSON.parse(JSON.stringify(session));

        // Clean up for template
        templateState.gameName = templateName; // Store the template name here
        templateState.sessionId = 'TEMPLATE'; // Placeholder
        templateState.messages = [];
        // Keep draftRound and rounds as the "content"

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

        if (session.rounds.length > 1) {
            console.warn(`Cannot load template into session ${sessionId}: Round is ${session.rounds.length}`);
            return false;
        }

        if (!this.fileStorage) return false;

        const template = this.fileStorage.loadTemplate(templateId);
        if (!template) {
            console.warn(`Template ${templateId} not found`);
            return false;
        }

        // Overwrite template-based fields
        session.draftRound = template.draftRound;
        session.status = 'INACTIVE';
        session.rounds = [];
        session.messages = [];
        session.gameSummary = template.gameSummary || "";
        session.goals = template.goals || [];
        session.directives = template.directives || "";

        // Reset Players: Keep director, replace characters.
        const director = session.director;
        const templatePlayers = template.players.filter((p: Player) => p.id !== template.director.id);
        session.players = [director, ...templatePlayers];

        return true;
    }
}

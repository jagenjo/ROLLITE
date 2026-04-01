
// player fixed state
export interface Player {
    id: string;
    name: string;
    isOnline: boolean;
}

export interface Badge {
    name: string;
    hidden: boolean;
}

//character state in one round
export interface Character {
    playerId: string;
    avatarIndex?: number;
    background?: string;
    status: string;
    badges: Badge[];
    action: string;
    privateMessage?: string;
}

//messages sent in the chat
export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: number;
    round: number; // 0-indexed
    recipientId?: string;
    isAction?: boolean;
}

//holds the info for a single round, with the state of characters
export interface Round {
    index: number; // 0-indexed
    description: string;
    summary: string;
    characters: Character[];
    hasFinished: boolean
}

// goals for the game
export interface Goal {
    description: string;
    isCompleted: boolean;
}

//holds the whole game info
export interface GameState {
    sessionId: string;
    gameName: string;
    director: Player;
    players: Player[];
    draftRound?: Round | null;
    rounds: Round[];
    messages: Message[];
    gameSummary?: string;
    status: 'INACTIVE' | 'ROUND_ACTIVE' | 'WAITING_AI' | 'ENDED';
    createdAt: number;
    goals?: Goal[];
    directives?: string;
    autoGame?: boolean;
    aiEnabled?: boolean;
}

// Used to pass game info to admin panel
export interface SessionSummary {
    sessionId: string;
    gameName: string;
    round_number: number;
    playerCount: number;
    onlineCount: number;
    directorId?: string;
    status: string;
    createdAt: number;
}

// Server to Client Events
export interface ServerToClientEvents {
    gameStateUpdate: (state: GameState) => void;
    playerJoined: (player: Player) => void;
    playerLeft: (playerId: string) => void;
    newRound: (round: Round) => void;
    newMessage: (message: Message) => void;
    error: (message: string) => void;
    llmError: (message: string) => void;
    systemStatsUpdate: (stats: SessionSummary[]) => void;
    templatesList: (templates: { id: string, name: string }[]) => void;
    templateSaved: (success: boolean) => void;
    sessionSaved: () => void;
}

export interface ClientToServerEvents {
    joinSession: (sessionId: string, playerId: string) => void;
    createSession: (token: string, name: string, gameName: string, avatarIndex?: number, templateId?: string) => void;
    createPlayer: (sessionId: string, name: string, avatarIndex: number, badges: { name: string, hidden: boolean }[]) => void;
    getSystemStats: () => void;
    spectateSession: (sessionId: string) => void;
    deleteSession: (sessionId: string) => void;
    saveSession: (sessionId: string) => void;
    getTemplates: () => void;
    saveAsTemplate: (sessionId: string, templateName: string) => void;
    loadTemplateIntoSession: (sessionId: string, templateId: string) => void;
    endSession: (sessionId: string) => void;
    submitAction: (action: string, token: string) => void;
    postMessage: (content: string, token: string) => void;
    updateRound: (round: Round) => void;
    startRound: (sessionId: string) => void;
    nextRound: () => void;
    addBadge: (playerId: string, badge: string, hidden: boolean) => void;
    removeBadge: (playerId: string, badgeIndex: number) => void;
    updatePlayerStatus: (playerId: string, status: string) => void;
    updatePlayerAvatar: (playerId: string, avatarIndex: number) => void;
    updatePlayerName: (playerId: string, name: string) => void;
    updatePlayerBackground: (playerId: string, background: string) => void;
    setPendingPrivateMessage: (playerId: string, message: string) => void;
    generateNextRound: (sessionId: string) => void;
    updateDirectives: (sessionId: string, directives: string) => void;
    toggleGoalCompletion: (sessionId: string, goalIndex: number) => void;
    deleteGoal: (sessionId: string, goalIndex: number) => void;
    addGoal: (sessionId: string, description: string) => void;
    updatePlayerAction: (sessionId: string, playerId: string, action: string) => void;
    updateGameSummary: (sessionId: string, summary: string) => void;
    toggleAutoGame: (sessionId: string, autoGame: boolean) => void;
    deletePlayer: (sessionId: string, playerId: string) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    sessionId: string;
    playerId: string;
}

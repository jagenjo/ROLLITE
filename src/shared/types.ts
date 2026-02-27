export interface Badge {
    name: string;
    hidden: boolean;
}

export interface Goal {
    description: string;
    isCompleted: boolean;
}

export interface Player {
    id: string;
    name: string;
    avatarIndex?: number;
    statusText?: string;
    background?: string;
}

export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: number;
    isAction: boolean;
    round: number;
    recipientId?: string;
}

export interface Scene {
    description: string;
    playerStatuses?: Record<string, string>;
    privateMessages?: Record<string, string>;
    playerBadges?: Record<string, Badge[]>;
}

export interface GameState {
    sessionId: string;
    gameName: string;
    director: Player;
    players: Player[];
    players_online: Player[];
    currentScene: Scene | null;
    pendingScene?: Scene | null;
    round: number;
    gameSummary?: string;
    isRoundActive: boolean;
    submittedActions: string[];
    messages: Message[];
    history: { round: number; scene: Scene }[];
    isEnded?: boolean;
    status: 'INACTIVE' | 'ROUND_ACTIVE' | 'WAITING_AI' | 'ENDED';
    createdAt: number;
    lastRoundAt?: number;
    goals?: Goal[];
    directives?: string;
}

export interface SessionSummary {
    sessionId: string;
    gameName: string;
    round: number;
    playerCount: number;
    onlineCount: number;
    directorId?: string;
    isEnded?: boolean;
    status: string;
    createdAt: number;
    lastRoundAt?: number;
}

export interface ServerToClientEvents {
    gameStateUpdate: (state: GameState) => void;
    playerJoined: (player: Player) => void;
    playerLeft: (playerId: string) => void;
    newScene: (scene: Scene) => void;
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
    updateScene: (scene: Scene) => void;
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
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    sessionId: string;
    playerId: string;
}

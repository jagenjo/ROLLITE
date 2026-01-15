export interface Badge {
    name: string;
    hidden: boolean;
}

export interface Player {
    id: string;
    name: string;
    avatarIndex?: number;
    statusText?: string;
    background?: string; // NEW
}

export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: number;
    isAction: boolean;
    round: number;
    recipientId?: string; // NEW
}

export interface Scene {
    description: string;
    playerStatuses?: Record<string, string>; // NEW: Snapshot of player statuses
    privateMessages?: Record<string, string>; // NEW: Pending private messages for this scene
    playerBadges?: Record<string, Badge[]>; // NEW: Badges per player for this scene
}

export interface GameState {
    sessionId: string;
    gameName: string;
    director: Player;
    players: Player[];
    players_online: Player[];
    currentScene: Scene | null;
    pendingScene?: Scene | null; // For director only (draft)
    round: number;
    isRoundActive: boolean; // True if waiting for player actions
    submittedActions: string[]; // List of player IDs who have submitted actions
    messages: Message[];
    history: { round: number; scene: Scene }[];
    isEnded?: boolean; // NEW
}

// NEW: Admin stats
export interface SessionSummary {
    sessionId: string;
    gameName: string;
    round: number;
    playerCount: number;
    onlineCount: number;
}

export interface ServerToClientEvents {
    gameStateUpdate: (state: GameState) => void;
    playerJoined: (player: Player) => void;
    playerLeft: (playerId: string) => void;
    newScene: (scene: Scene) => void;
    newMessage: (message: Message) => void;
    error: (message: string) => void;
    systemStatsUpdate: (stats: SessionSummary[]) => void; // NEW
}

export interface ClientToServerEvents {
    joinSession: (sessionId: string, playerId: string) => void;
    createSession: (token: string, name: string, gameName: string, avatarIndex?: number) => void; // Returns sessionId
    createPlayer: (sessionId: string, name: string, avatarIndex: number, badges: { name: string, hidden: boolean }[]) => void;
    getSystemStats: () => void; // NEW
    spectateSession: (sessionId: string) => void; // NEW
    deleteSession: (sessionId: string) => void; // NEW
    saveSession: (sessionId: string) => void; // NEW
    endSession: (sessionId: string) => void; // NEW
    submitAction: (action: string, token: string) => void;
    postMessage: (content: string, token: string) => void;
    updateScene: (scene: Scene) => void;
    startRound: (sessionId: string) => void;
    nextRound: () => void;
    addBadge: (playerId: string, badge: string, hidden: boolean) => void;
    removeBadge: (playerId: string, badgeIndex: number) => void;
    updatePlayerStatus: (playerId: string, status: string) => void; // NEW
    updatePlayerAvatar: (playerId: string, avatarIndex: number) => void; // NEW
    updatePlayerName: (playerId: string, name: string) => void; // NEW
    updatePlayerBackground: (playerId: string, background: string) => void; // NEW
    setPendingPrivateMessage: (playerId: string, message: string) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    sessionId: string;
}

import * as net from 'net';
import { GameManager } from '../game/GameManager.js';
import { GameState, Player, Round, Character, Message } from '../../shared/types.js';

const ANSI = {
    RESET: '\x1b[0m',
    BOLD: '\x1b[1m',
    CLEAR: '\x1b[2J\x1b[H',
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    CYAN: '\x1b[36m',
    WHITE: '\x1b[37m',
    GRAY: '\x1b[90m',
    BG_BLUE: '\x1b[44m',
    HIDE_CURSOR: '\x1b[?25l',
    SHOW_CURSOR: '\x1b[?25h',
};

interface TelnetSession {
    socket: net.Socket;
    sessionId?: string;
    playerId?: string;
    inputBuffer: string;
    lastState?: GameState;
}

export class TelnetService {
    private server: net.Server;
    private gameManager: GameManager;
    private sessions: Set<TelnetSession> = new Set();
    private port: number;
    public onGenerate?: (sessionId: string) => Promise<void>;

    constructor(gameManager: GameManager, port: number = 4002) {
        this.gameManager = gameManager;
        this.port = port;
        this.server = net.createServer(this.handleConnection.bind(this));
    }

    public start() {
        this.server.listen(this.port, () => {
            console.log(`Telnet Service running on port ${this.port}`);
        });
    }

    private handleConnection(socket: net.Socket) {
        const session: TelnetSession = {
            socket,
            inputBuffer: '',
        };
        this.sessions.add(session);

        socket.write(`${ANSI.CLEAR}${ANSI.BOLD}${ANSI.CYAN}Welcome to ROLLITE Telnet Edition!${ANSI.RESET}\r\n\r\n`);
        this.askForSession(session);

        socket.on('data', (data) => {
            const str = data.toString();
            for (let i = 0; i < str.length; i++) {
                const char = str[i];
                if (char === '\r' || char === '\n') {
                    if (session.inputBuffer.length > 0 || char === '\n') {
                        this.handleInput(session, session.inputBuffer.trim());
                        session.inputBuffer = '';
                    }
                } else if (char === '\x7f' || char === '\x08') { // Backspace
                    if (session.inputBuffer.length > 0) {
                        session.inputBuffer = session.inputBuffer.slice(0, -1);
                        socket.write('\b \b');
                    }
                } else if (char.charCodeAt(0) >= 32) {
                    session.inputBuffer += char;
                    socket.write(char);
                }
            }
        });

        socket.on('close', () => {
            this.sessions.delete(session);
        });

        socket.on('error', (err) => {
            console.error('Telnet socket error:', err);
            this.sessions.delete(session);
        });
    }

    private askForSession(session: TelnetSession) {
        session.socket.write(`${ANSI.YELLOW}Enter Session ID: ${ANSI.RESET}`);
    }

    private askForPlayer(session: TelnetSession) {
        session.socket.write(`${ANSI.YELLOW}Enter Player ID (or leave empty if Director): ${ANSI.RESET}`);
    }

    private handleInput(session: TelnetSession, input: string) {
        // Check for URL
        const urlMatch = input.match(/[?&]session=([a-z0-9]+)(?:&player=([^&\s]+))?/i);
        if (urlMatch) {
            session.sessionId = urlMatch[1].toUpperCase();
            if (urlMatch[2]) {
                session.playerId = urlMatch[2];
            }

            const gameState = this.gameManager.getSession(session.sessionId);
            if (!gameState) {
                session.socket.write(`\r\n${ANSI.RED}Session not found in link.${ANSI.RESET}\r\n`);
                session.sessionId = undefined;
                session.playerId = undefined;
                this.askForSession(session);
                return;
            }

            if (session.playerId) {
                // Verify player exists
                const player = gameState.players.find(p => p.id === session.playerId || p.name === session.playerId) || (gameState.director.id === session.playerId ? gameState.director : null);
                if (!player) {
                    session.socket.write(`\r\n${ANSI.RED}Player from link not found in session.${ANSI.RESET}\r\n`);
                    session.playerId = undefined;
                    this.askForPlayer(session);
                    return;
                }
                session.socket.write(`\r\n${ANSI.GREEN}Logged in as ${this.getPlayerName(gameState, session.playerId)}${ANSI.RESET}\r\n`);
                this.refreshView(session);
            } else {
                session.socket.write(`\r\n${ANSI.GREEN}Session ID detected from link.${ANSI.RESET}\r\n`);
                this.askForPlayer(session);
            }
            return;
        }

        if (!session.sessionId) {
            session.sessionId = input.toUpperCase();
            const gameState = this.gameManager.getSession(session.sessionId);
            if (!gameState) {
                session.socket.write(`\r\n${ANSI.RED}Session not found.${ANSI.RESET}\r\n`);
                session.sessionId = undefined;
                this.askForSession(session);
            } else {
                session.socket.write(`\r\n`);
                this.askForPlayer(session);
            }
            return;
        }

        if (!session.playerId) {
            const gameState = this.gameManager.getSession(session.sessionId);
            if (!gameState) return;

            if (input === '' || input === gameState.director.id) {
                session.playerId = gameState.director.id;
            } else {
                const player = gameState.players.find(p => p.id === input || p.name === input);
                if (player) {
                    session.playerId = player.id;
                } else {
                    session.socket.write(`\r\n${ANSI.RED}Player not found.${ANSI.RESET}\r\n`);
                    this.askForPlayer(session);
                    return;
                }
            }
            session.socket.write(`\r\n${ANSI.GREEN}Logged in as ${this.getPlayerName(gameState, session.playerId)}${ANSI.RESET}\r\n`);
            this.refreshView(session);
            return;
        }

        if (input.startsWith('/')) {
            this.handleCommand(session, input);
        } else {
            // Default to chat?
            if (input.length > 0) {
                this.handleCommand(session, `/msg ${input}`);
            }
        }
    }

    private getPlayerName(state: GameState, playerId: string): string {
        if (state.director.id === playerId) return `Director (${state.director.name})`;
        const player = state.players.find(p => p.id === playerId);
        return player ? player.name : 'Unknown';
    }

    private handleCommand(session: TelnetSession, input: string) {
        const parts = input.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        const state = this.gameManager.getSession(session.sessionId!);
        if (!state) return;

        const isDirector = state.director.id === session.playerId;

        switch (cmd) {
            case '/q':
            case '/quit':
                session.socket.end(`${ANSI.GREEN}Goodbye!${ANSI.RESET}\r\n`);
                break;
            case '/r':
            case '/refresh':
                this.refreshView(session);
                break;
            case '/h':
            case '/help':
                this.showHelp(session, isDirector);
                break;
            case '/a':
            case '/action':
                if (isDirector) {
                    session.socket.write(`\r\n${ANSI.RED}Director cannot submit actions.${ANSI.RESET}\r\n`);
                } else {
                    this.gameManager.submitAction(session.sessionId!, session.playerId!, args);
                    session.socket.write(`\r\n${ANSI.GREEN}Action submitted!${ANSI.RESET}\r\n`);
                    this.broadcastUpdate(session.sessionId!);
                }
                break;
            case '/m':
            case '/msg':
                const message: Message = {
                    id: Math.random().toString(36).substring(7),
                    senderId: session.playerId!,
                    senderName: this.getPlayerName(state, session.playerId!),
                    content: args,
                    timestamp: Date.now(),
                    round: state.rounds.length,
                    isAction: false
                };
                this.gameManager.addMessage(session.sessionId!, message);
                this.broadcastUpdate(session.sessionId!);
                break;
            case '/n':
            case '/next':
                if (isDirector) {
                    this.gameManager.nextRound(session.sessionId!);
                    this.broadcastUpdate(session.sessionId!);
                } else {
                    session.socket.write(`\r\n${ANSI.RED}Only Director can use this command.${ANSI.RESET}\r\n`);
                }
                break;
            case '/s':
            case '/start':
                if (isDirector) {
                    this.gameManager.startRound(session.sessionId!);
                    this.broadcastUpdate(session.sessionId!);
                } else {
                    session.socket.write(`\r\n${ANSI.RED}Only Director can use this command.${ANSI.RESET}\r\n`);
                }
                break;
            case '/g':
            case '/generate':
                if (isDirector) {
                    if (this.onGenerate) {
                        session.socket.write(`\r\n${ANSI.YELLOW}Generating next round... (Please wait)${ANSI.RESET}\r\n`);
                        this.onGenerate(session.sessionId!).catch(err => {
                            session.socket.write(`\r\n${ANSI.RED}Generation failed: ${err.message}${ANSI.RESET}\r\n`);
                        });
                    } else {
                        session.socket.write(`\r\n${ANSI.RED}Generation not available.${ANSI.RESET}\r\n`);
                    }
                } else {
                    session.socket.write(`\r\n${ANSI.RED}Only Director can use this command.${ANSI.RESET}\r\n`);
                }
                break;
            case '/d':
            case '/description':
                if (isDirector) {
                    this.gameManager.updateRound(session.sessionId!, { description: args } as Round);
                    session.socket.write(`\r\n${ANSI.GREEN}Description updated!${ANSI.RESET}\r\n`);
                    this.broadcastUpdate(session.sessionId!);
                } else {
                    session.socket.write(`\r\n${ANSI.RED}Only Director can use this command.${ANSI.RESET}\r\n`);
                }
                break;
            default:
                session.socket.write(`\r\n${ANSI.RED}Unknown command. Type /help for options.${ANSI.RESET}\r\n`);
        }
    }

    private showHelp(session: TelnetSession, isDirector: boolean) {
        let help = `\r\n${ANSI.BOLD}Available Commands:${ANSI.RESET}\r\n`;
        help += `/r, /refresh - Redraw the screen\r\n`;
        help += `/m, /msg <text> - Send a chat message\r\n`;
        if (!isDirector) {
            help += `/a, /action <text> - Submit your action for the round\r\n`;
        }
        if (isDirector) {
            help += `/n, /next - End current round and prepare next\r\n`;
            help += `/s, /start - Start the prepared round\r\n`;
            help += `/g, /generate - Generate next round using AI\r\n`;
            help += `/d, /description <text> - Edit current round description\r\n`;
        }
        help += `/h, /help - Show this help\r\n`;
        help += `/q, /quit - Disconnect\r\n`;
        session.socket.write(help);
    }

    public broadcastUpdate(sessionId: string) {
        for (const session of this.sessions) {
            if (session.sessionId === sessionId) {
                this.refreshView(session);
            }
        }
    }

    private refreshView(session: TelnetSession) {
        const state = this.gameManager.getSession(session.sessionId!);
        if (!state) return;

        session.lastState = state;
        const isDirector = state.director.id === session.playerId;

        let output = ANSI.CLEAR;
        output += `${ANSI.BG_BLUE}${ANSI.WHITE}${ANSI.BOLD} ROLLITE - ${state.gameName} (Session: ${state.sessionId}) ${ANSI.RESET}\r\n`;
        output += `Round: ${state.rounds.length} | Status: ${state.status}\r\n`;
        output += `--------------------------------------------------\r\n`;

        // Current Round Description
        const currentRound = state.rounds.length > 0 ? state.rounds[state.rounds.length - 1] : null;
        if (currentRound) {
            output += `${ANSI.BOLD}CURRENT ROUND:${ANSI.RESET}\r\n`;
            output += `${currentRound.description}\r\n`;
            output += `--------------------------------------------------\r\n`;
        } else if (state.draftRound) {
            output += `${ANSI.YELLOW}Next round is being prepared...${ANSI.RESET}\r\n`;
            if (isDirector) {
                output += `${ANSI.BOLD}Draft Round Description:${ANSI.RESET}\r\n`;
                output += `${state.draftRound.description}\r\n`;
            }
            output += `--------------------------------------------------\r\n`;
        }

        // Characters / Players
        output += `${ANSI.BOLD}CHARACTERS:${ANSI.RESET}\r\n`;
        const targetRound = state.status === 'ROUND_ACTIVE' ? currentRound : state.draftRound;

        state.players.forEach(p => {
            if (p.id === state.director.id) return;
            const char = targetRound?.characters.find(c => c.playerId === p.id);
            const status = char ? char.status : 'No status';
            const action = char?.action ? `${ANSI.GREEN}[Has Action]${ANSI.RESET}` : `${ANSI.RED}[Waiting]${ANSI.RESET}`;

            output += `${ANSI.CYAN}${p.name}${ANSI.RESET}: ${status} ${action}\r\n`;
            if (isDirector && char?.action) {
                output += `  Action: ${char.action}\r\n`;
            }
        });
        output += `--------------------------------------------------\r\n`;

        // Messages
        output += `${ANSI.BOLD}RECENT MESSAGES:${ANSI.RESET}\r\n`;
        const recentMessages = state.messages.slice(-5);
        recentMessages.forEach(m => {
            const isPrivate = m.recipientId !== undefined;
            if (isPrivate && m.recipientId !== session.playerId && !isDirector) return;

            const color = isPrivate ? ANSI.MAGENTA : ANSI.WHITE;
            output += `${color}[${m.senderName}]: ${m.content}${ANSI.RESET}\r\n`;
        });
        output += `--------------------------------------------------\r\n`;
        output += `${ANSI.GRAY}Type /help for commands, or just type to chat.${ANSI.RESET}\r\n`;
        output += `> ${session.inputBuffer}`;

        session.socket.write(output);
    }
}

import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { io, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents, GameState, Player, Scene, Message } from './types';
import './components/director-dashboard';
import './components/player-dashboard';
import './components/scene-display';
import './components/players-list';
import './components/admin-dashboard';

import './components/header-profile';
import './components/exit-button';

const SOCKET_URL = 'http://localhost:4001';

@customElement('my-app')
export class MyApp extends LitElement {
  @state() private _socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  @state() private _gameState: GameState | null = null;
  @state() private _currentPlayer: Player | null = null;
  @state() private _playerName = '';
  @state() private _gameName = '';
  @state() private _sessionId = '';
  @state() private _selectedAvatarIndex = 0;
  @state() private _errorMessage = '';

  @state() private _isInLobby = true;
  @state() private _viewingRound = 1;
  @state() private _userToken = '';

  // Admin State
  @state() private _isAdmin = false;
  @state() private _systemStats: any[] = [];

  // Spectator State
  @state() private _isSpectator = false;

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #111827; /* gray-900 */
      color: white;
      font-family: 'Inter', sans-serif;
    }
    
    .app-header {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        padding: 0.5rem 2rem;
        background-color: #1f2937;
        border-bottom: 1px solid #374151;
        position: sticky;
        top: 0;
        z-index: 50;
        width: 100%;
        box-sizing: border-box;
        height: 60px;
    }

    .app-title {
        font-weight: bold;
        font-size: 1.25rem;
        color: #3b82f6;
    }

    .game-title {
        font-weight: bold;
        font-size: 1.25rem;
        color: #e5e7eb;
        text-align: center;
    }

    .header-right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 1.5rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 1rem;
      height: calc(100vh - 60px);
      box-sizing: border-box;
    }
    
    .main-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow-y: auto;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
      overflow-y: hidden;
    }

    .lobby {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      gap: 1rem;
    }

    .lobby-card {
      background-color: #1f2937;
      padding: 2rem;
      border-radius: 0.5rem;
      width: 100%;
      max-width: 400px;
    }

    h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: #3b82f6;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1rem;
      border-radius: 0.25rem;
      border: 1px solid #374151;
      background-color: #111827;
      color: white;
      box-sizing: border-box;
    }

    .button-group {
      display: flex;
      gap: 1rem;
    }

    button {
      flex: 1;
      padding: 0.75rem;
      border-radius: 0.25rem;
      border: none;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background-color: #2563eb;
    }

    .btn-secondary {
      background-color: #10b981;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #059669;
    }

    .btn-danger {
        background-color: #ef4444;
        color: white;
    }

    .btn-danger:hover {
        background-color: #dc2626;
    }

    /* Avatar Grid Styles */
    .avatar-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 5px;
      margin-bottom: 1rem;
      max-height: 300px;
      overflow-y: auto;
    }

    .avatar-option {
      width: 40px;
      height: 40px;
      border: 2px solid transparent;
      border-radius: 50%;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      background-color: #111827;
    }

    .avatar-option.selected {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    }

    .avatar-option img {
      width: 320px; /* 8 * 40px */
      position: absolute;
      image-rendering: pixelated;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      this._isAdmin = true;
    }
    if (urlParams.get('spectator') === 'true') {
      this._isSpectator = true;
    }

    this._initToken();
    this._initSocket();

    // Load saved avatar index
    const savedAvatar = localStorage.getItem('player_avatar');
    if (savedAvatar) {
      this._selectedAvatarIndex = parseInt(savedAvatar, 10);
    }
  }

  private _initToken() {
    let token = localStorage.getItem('user_token');
    if (!token) {
      token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('user_token', token);
    }
    this._userToken = token;
  }

  private _initSocket() {
    this._socket = io(SOCKET_URL);

    this._socket.on('connect', () => {
      console.log('Connected to server');
      if (this._isAdmin) {
        this._socket?.emit('getSystemStats');
      } else {
        this._checkAutoJoin();
      }
    });

    this._socket.on('gameStateUpdate', (state: GameState) => {
      console.log('Received gameStateUpdate:', state);
      this._gameState = state;

      // Update URL if we are the director and just created the session
      if (state.director.id === this._userToken) {
        this._updateUrl(state.sessionId);
      }

      if (this._isInLobby) {
        // If we just joined/created, find our player object
        const myPlayer = state.players.find(p => p.id === this._userToken);
        if (myPlayer) {
          this._currentPlayer = myPlayer;
          this._isInLobby = false;
        }
        // If spectator, we exit lobby once we get state
        if (this._isSpectator) {
          this._isInLobby = false;
        }
      }

      // Update viewing round if we are on the current round
      if (this._viewingRound < state.round && this._viewingRound === state.round - 1) {
        this._viewingRound = state.round;
      }

      if (!this._gameState) {
        this._viewingRound = state.round;
      }

      // Force viewing round sync for spectators on first load
      if (this._isSpectator && this._viewingRound === 1 && state.round > 1) {
        this._viewingRound = state.round;
      }
    });

    this._socket.on('newScene', (scene: Scene) => {
      if (this._gameState) {
        this._gameState = { ...this._gameState, currentScene: scene };
      }
    });

    this._socket.on('newMessage', (message: Message) => {
      if (this._gameState) {
        this._gameState = { ...this._gameState, messages: [...this._gameState.messages, message] };
      }
    });

    this._socket.on('systemStatsUpdate', (stats: any[]) => {
      this._systemStats = stats;
    });

    this._socket.on('error', (message: string) => {
      console.error('Socket Error:', message);
      this._errorMessage = message;
      // If we failed to join, ensure we stay in lobby and stop showing "Joining..."
      this._isInLobby = true;
      this._sessionId = '';
    });
  }

  private _checkAutoJoin() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    const playerId = urlParams.get('player');

    if (this._isSpectator && sessionId) {
      this._sessionId = sessionId;
      this._socket?.emit('spectateSession', sessionId);
      return;
    }

    if (sessionId) {
      this._sessionId = sessionId;
      if (playerId) {
        // Auto join as specific player. 
        // IMPORTANT: We must adopt this playerId as our token because the server generated it.
        this._userToken = playerId;
        localStorage.setItem('user_token', playerId); // Persist identity

        this._socket?.emit('joinSession', sessionId, playerId);
      } else {
        // If we have a session ID but no player ID, we might be the director reconnecting
        if (this._userToken) {
          this._socket?.emit('joinSession', sessionId, this._userToken);
        }
      }
    }
  }

  private _updateUrl(sessionId: string, playerId?: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('session', sessionId);
    if (playerId) {
      url.searchParams.set('player', playerId);
    }
    window.history.pushState({}, '', url);
  }

  private _savePlayerPrefs() {
    if (this._playerName) {
      localStorage.setItem('player_name', this._playerName);
    }
    localStorage.setItem('player_avatar', this._selectedAvatarIndex.toString());
  }

  private _handleInputKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this._createSession();
    }
  }

  private _createSession() {
    if (this._playerName && this._gameName) {
      this._savePlayerPrefs();
      this._socket?.emit('createSession', this._userToken, this._playerName, this._gameName, this._selectedAvatarIndex);
    }
  }

  private _handleExit() {
    this._gameState = null;
    this._currentPlayer = null;
    this._sessionId = '';
    this._isInLobby = true;
    this._isSpectator = false; // Reset spectator
    this._isAdmin = false; // Reset admin (unless url param persists, handled by page reload primarily)

    const url = new URL(window.location.href);
    url.searchParams.delete('session');
    url.searchParams.delete('player');
    url.searchParams.delete('spectator');
    window.history.pushState({}, '', url);

    // Potentially reload to clean state if needed, but managing state is better
    window.location.href = '/';
  }

  private _handleUpdateScene(e: CustomEvent) {
    this._socket?.emit('updateScene', e.detail);
  }

  private _handleSubmitAction(e: CustomEvent) {
    this._socket?.emit('submitAction', e.detail.action, this._userToken);
  }

  private _handleNextRound() {
    this._socket?.emit('nextRound');
    // Optimistically update viewing round to the next round
    if (this._gameState) {
      this._viewingRound = this._gameState.round + 1;
    }
  }

  private _handleViewRoundChange(e: CustomEvent) {
    this._viewingRound = e.detail.round;
  }

  private _handleMessageSent(e: CustomEvent) {
    this._socket?.emit('postMessage', e.detail.message, this._userToken);
  }

  private _handleAddBadge(e: CustomEvent) {
    this._socket?.emit('addBadge', e.detail.playerId, e.detail.badge, e.detail.hidden);
  }

  private _handleRemoveBadge(e: CustomEvent) {
    this._socket?.emit('removeBadge', e.detail.playerId, e.detail.index);
  }

  private _handleCreatePlayer(e: CustomEvent) {
    if (!this._gameState?.sessionId) return;
    const { name, avatarIndex, badges } = e.detail;
    this._socket?.emit('createPlayer', this._gameState.sessionId, name, avatarIndex, badges);
  }

  private _handleSetPendingPrivateMessage(e: CustomEvent) {
    if (this._gameState?.sessionId && this._socket) {
      this._socket.emit('setPendingPrivateMessage', e.detail.playerId, e.detail.message);
    }
  }

  private _handleStartRound(e: CustomEvent) {
    if (!this._gameState?.sessionId) return;
    this._socket?.emit('startRound', this._gameState.sessionId);
  }

  private _handleUpdatePlayerStatus(e: CustomEvent) {
    if (this._gameState?.sessionId && this._socket) {
      this._socket.emit('updatePlayerStatus', e.detail.playerId, e.detail.status);
    }
  }

  private _refreshStats() {
    this._socket?.emit('getSystemStats');
  }

  updated(changedProperties: Map<string, any>) {
    // Dynamic Title Update
    if (changedProperties.has('_isAdmin') || changedProperties.has('_isSpectator') || changedProperties.has('_gameState') || changedProperties.has('_currentPlayer')) {
      let title = 'ROLLITE';
      if (this._isAdmin) {
        title += ' - Admin';
      } else if (this._isSpectator) {
        title += ' - Spectator';
      } else if (this._gameState?.director.id === this._currentPlayer?.id) {
        title += ' - Director';
      } else if (this._currentPlayer) {
        title += ' - Player';
      }
      document.title = title;
    }
  }


  render() {
    if (this._isAdmin) {
      return html`
          <div style="padding: 2rem; background-color: #111827; min-height: 100vh;">
              <admin-dashboard 
                  .stats="${this._systemStats}"
                  @refresh-stats="${this._refreshStats}"
                  @save-session="${(e: CustomEvent) => this._socket?.emit('saveSession', e.detail.sessionId)}"
                  @end-session="${(e: CustomEvent) => this._socket?.emit('endSession', e.detail.sessionId)}"
                  @delete-session="${(e: CustomEvent) => this._socket?.emit('deleteSession', e.detail.sessionId)}"
              ></admin-dashboard>
          </div>
        `;
    }

    if (this._isSpectator) {
      return html`
            <div style="padding: 1rem; background-color: #1f2937; color: #fbbf24; text-align: center; font-weight: bold; border-bottom: 1px solid #374151;">
                SPECTATOR MODE - Viewing Session: ${this._sessionId}
            </div>
            <div class="container" style="height: calc(100vh - 50px);">
                <div class="main-content">
                  <scene-display 
                    .scene="${this._viewingRound === this._gameState?.round ? this._gameState?.currentScene : undefined}" 
                    .history="${this._gameState?.history || []}"
                    .currentRound="${this._gameState?.round || 1}"
                    .viewingRound="${this._viewingRound}"
                    ?isDirector="${false}"
                    .messages="${this._gameState?.messages || []}"
                    .players="${this._gameState?.players || []}"
                    .currentUserId="${'SPECTATOR'}"
                    ?canChat="${false}"
                    .isEnded="${!!this._gameState?.isEnded}"
                    @view-round-change="${this._handleViewRoundChange}"
                  ></scene-display>
                </div>
                <div class="sidebar">
                  <players-list
                    .players="${this._gameState?.players || []}"
                    .playersOnline="${this._gameState?.players_online || []}"
                    .director="${this._gameState?.director || null}"
                    .currentUserId="${'SPECTATOR'}"
                  ></players-list>
                </div>
            </div>
        `;
    }

    if (this._isInLobby) {
      return html`
        <div class="lobby">
          <div class="lobby-card">
            <h1>RPG Inn</h1>
            
            ${this._sessionId ? html`
                <div style="text-align: center;">
                    <p>Joining session...</p>
                    <p style="color: #9ca3af; font-size: 0.875rem;">${this._sessionId}</p>
                </div>
            ` : html`
                ${this._errorMessage ? html`
                    <div style="background-color: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 0.75rem; border-radius: 0.25rem; margin-bottom: 1rem; text-align: center;">
                        ${this._errorMessage}
                    </div>
                ` : ''}
                <div style="margin-bottom: 2rem; text-align: center;">
                    <h2 style="font-size: 1.25rem; color: #9ca3af;">Director Setup</h2>
                </div>

                <input
                    type="text"
                    placeholder="Enter Game Name"
                    .value="${this._gameName}"
                    @input="${(e: Event) => this._gameName = (e.target as HTMLInputElement).value}"
                    @keydown="${this._handleInputKeydown}"
                />

                <input
                type="text"
                placeholder="Enter your name (Director)"
                .value="${this._playerName}"
                @input="${(e: Event) => this._playerName = (e.target as HTMLInputElement).value}"
                @keydown="${this._handleInputKeydown}"
                />
                <div class="button-group">
                    <button class="btn-secondary" @click="${this._createSession}" ?disabled="${!this._gameName || !this._playerName}">Create New Session</button>
                </div>
            `}
          </div>
        </div>
      `;
    }

    // Director sees pending scene if available, otherwise current scene (for editing purposes)
    const isDirector = this._gameState?.director.id === this._currentPlayer?.id;
    const sceneToDisplay = isDirector && this._gameState?.pendingScene ? this._gameState.pendingScene : this._gameState?.currentScene;

    return html`
      <header class="app-header">
          <div class="app-title">RPG Inn</div>
          <div class="game-title">${this._gameState?.gameName || 'Untitled Game'}</div>
          <div class="header-right">
              <header-profile .player="${this._currentPlayer}"></header-profile>
              <exit-button @exit-game="${this._handleExit}"></exit-button>
          </div>
      </header>

      <div class="container">
        <div class="main-content">
          <scene-display 
            .scene="${sceneToDisplay}"
            .history="${this._gameState?.history || []}"
            .currentRound="${this._gameState?.round || 1}"
            .viewingRound="${this._viewingRound}"
            ?isDirector="${this._gameState?.director.id === this._currentPlayer?.id}"
            .messages="${this._gameState?.messages || []}"
            .players="${this._gameState?.players || []}"
            .currentUserId="${this._currentPlayer?.id || ''}"
            ?canChat="${this._gameState?.director.id === this._currentPlayer?.id || (this._gameState?.isRoundActive && !this._gameState?.submittedActions.includes(this._currentPlayer?.id || ''))}"
            .isEnded="${!!this._gameState?.isEnded}"
            @view-round-change="${this._handleViewRoundChange}"
            @update-scene="${this._handleUpdateScene}"
            @message-sent="${this._handleMessageSent}"
          ></scene-display>
          ${this._gameState?.director.id === this._currentPlayer?.id ? html`
            <director-dashboard
              .currentScene="${this._gameState?.currentScene}"
              .pendingScene="${this._gameState?.pendingScene}"
              .pendingPrivateMessages="${this._gameState?.pendingPrivateMessages || {}}"
              .messages="${this._gameState?.messages || []}"
              .history="${this._gameState?.history || []}"
              .players="${this._gameState?.players || []}"
              .round="${this._gameState?.round || 1}"
              .viewingRound="${this._viewingRound}"
              .sessionId="${this._gameState?.sessionId || ''}"
              .directorId="${this._gameState?.director.id || ''}"
              ?isRoundActive="${this._gameState?.isRoundActive}"
              .isEnded="${!!this._gameState?.isEnded}"
              @next-round="${this._handleNextRound}"
              @start-round="${this._handleStartRound}"
              @create-player="${this._handleCreatePlayer}"
              @set-pending-private-message="${this._handleSetPendingPrivateMessage}"
              @end-session="${(e: CustomEvent) => this._socket?.emit('endSession', e.detail.sessionId)}"
              @save-session="${(e: CustomEvent) => this._socket?.emit('saveSession', e.detail.sessionId)}"
            ></director-dashboard>
          ` : html`
            <player-dashboard
              .currentScene="${this._gameState?.currentScene}"
              .isRoundActive="${this._gameState?.isRoundActive}"
              .round="${this._gameState?.round || 1}"
              .messages="${this._gameState?.messages || []}"
              .currentUserId="${this._currentPlayer?.id || ''}"
              .isEnded="${!!this._gameState?.isEnded}"
              @submit-action="${this._handleSubmitAction}"
            ></player-dashboard>
          `}
        </div>
        
        <div class="sidebar">
          <players-list
            .players="${this._gameState?.players || []}"
            .playersOnline="${this._gameState?.players_online || []}"
            .director="${this._gameState?.director || null}"
            .currentUserId="${this._currentPlayer?.id || ''}"
            @add-badge="${this._handleAddBadge}"
            @remove-badge="${this._handleRemoveBadge}"
            @update-player-status="${this._handleUpdatePlayerStatus}"
          ></players-list>
        </div>
      </div>
    `;
  }
}

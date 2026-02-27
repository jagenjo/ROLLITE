import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import type { Scene, Message, Player, Goal } from '../../shared/types.js';
import './player-card';
import './avatar-selector';
import './character-sheet';

@customElement('director-dashboard')
export class DirectorDashboard extends LitElement {
  @property({ type: Array }) messages: Message[] = [];
  @property({ type: Array }) history: { round: number; scene: Scene }[] = [];
  @property({ type: Array }) players: Player[] = [];
  @property({ type: Number }) round = 1;
  @property({ type: Number }) viewingRound = 1;
  @property({ type: Boolean }) isRoundActive = false;
  @property({ type: String }) sessionId = '';
  @property({ type: String }) directorId = '';
  @property({ type: Boolean }) isEnded = false;
  @property({ type: Object }) currentScene: Scene | null = null;
  @property({ type: Object }) pendingScene: Scene | null = null;
  @property({ type: Array }) playersOnline: Player[] = [];
  @property({ type: Array }) submittedActions: string[] = [];
  @property({ type: String }) status: string = 'INACTIVE';
  @property({ type: Array }) goals: Goal[] = [];
  @property({ type: String }) directives: string = '';
  @property({ type: Boolean }) isGenerating = false;
  @property({ type: Boolean }) autoGame = false;

  @state() private _newPlayerName = '';
  @state() private _newPlayerAvatar = 0;
  @state() private _newPlayerBadges = '';
  @state() private _showPlayerManagement = false;
  @state() private _showAvatarModal = false; // For new player creation only
  @state() private _isEditingDirectives = false;
  @state() private _localDirectives = '';

  @state() private _showGoalInput = false;
  @state() private _newGoalDescription = '';

  @state() private _selectedPlayerId: string | null = null; // For character sheet

  @state() private _editingPrivateMsgId: string | null = null;
  @state() private _tempPrivateMsg = '';

  @state() private _editingPlayerActionId: string | null = null;
  @state() private _tempPlayerAction = '';

  private get _isAvatarModalOpen() {
    return this._showAvatarModal;
  }

  private _openCharacterSheet(playerId: string) {
    this._selectedPlayerId = playerId;
  }

  private _closeCharacterSheet() {
    this._selectedPlayerId = null;
  }

  private _handleDeletePlayer(e: CustomEvent) {
    this._selectedPlayerId = null;
    // The event already bubbles, but let's re-dispatch to be sure it reaches MyApp
    this.dispatchEvent(new CustomEvent('delete-player', {
      detail: e.detail,
      bubbles: true,
      composed: true
    }));
  }

  private _onAvatarSelected(e: CustomEvent) {
    const newIndex = e.detail.index;
    this._newPlayerAvatar = newIndex;
    this._showAvatarModal = false;
  }

  private _startEditingMsg(playerId: string) {
    this._editingPrivateMsgId = playerId;
    this._tempPrivateMsg = this.pendingScene?.privateMessages?.[playerId] || '';
  }

  private _cancelPrivateMsg() {
    this._editingPrivateMsgId = null;
    this._tempPrivateMsg = '';
  }

  private _savePrivateMsg() {
    if (this._editingPrivateMsgId) {
      this.dispatchEvent(new CustomEvent('set-pending-private-message', {
        detail: { playerId: this._editingPrivateMsgId, message: this._tempPrivateMsg },
        bubbles: true,
        composed: true
      }));
      this._editingPrivateMsgId = null;
      this._tempPrivateMsg = '';
    }
  }

  private _startEditingAction(playerId: string) {
    this._editingPlayerActionId = playerId;
    // Find current round action if it exists
    const actionMsg = this.messages.find(m => m.isAction && m.senderId === playerId && m.round === this.round);
    this._tempPlayerAction = actionMsg?.content || '';
  }

  private _cancelPlayerAction() {
    this._editingPlayerActionId = null;
    this._tempPlayerAction = '';
  }

  private _savePlayerAction() {
    if (this._editingPlayerActionId) {
      this.dispatchEvent(new CustomEvent('update-player-action', {
        detail: { playerId: this._editingPlayerActionId, action: this._tempPlayerAction },
        bubbles: true,
        composed: true
      }));
      this._editingPlayerActionId = null;
      this._tempPlayerAction = '';
    }
  }

  private _renderPrivateMsgForm() {
    return html`
      <div style="margin-top: 0.5rem; background: #111827; padding: 0.5rem; border-radius: 0.25rem;">
        <textarea
            style="width: 100%; min-height: 60px; margin-bottom: 0.5rem; resize: vertical;"
            .value="${this._tempPrivateMsg}"
            @input="${(e: Event) => this._tempPrivateMsg = (e.target as HTMLTextAreaElement).value}"
            placeholder="Write a private message..."
        ></textarea>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button @click="${this._cancelPrivateMsg}" style="background-color: #4b5563; font-size: 0.75rem;">Cancel</button>
            <button @click="${this._savePrivateMsg}" style="background-color: #8b5cf6; font-size: 0.75rem;">Save</button>
        </div>
      </div>
    `;
  }

  private _renderDirectives() {
    return html`
      <div class="panel" style="">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <h3 style="margin: 0; display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; color: #8b5cf6;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            AI Directives
          </h3>
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(0,0,0,0.2); padding: 0.25rem 0.6rem; border-radius: 1rem; border: 1px solid ${this.autoGame ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.05)'}; transition: all 0.3s;">
                <span style="font-size: 0.65rem; font-weight: bold; letter-spacing: 0.05em; color: ${this.autoGame ? '#10b981' : '#6b7280'}; transition: all 0.3s;">AUTOGAME</span>
                <label class="switch">
                    <input 
                        type="checkbox" 
                        .checked="${this.autoGame}"
                        @change="${(e: Event) => {
        const checked = (e.target as HTMLInputElement).checked;
        this.dispatchEvent(new CustomEvent('auto-game-toggle', {
          detail: { autoGame: checked },
          bubbles: true,
          composed: true
        }));
      }}"
                    >
                    <span class="slider"></span>
                </label>
            </div>
            <button 
              @click="${() => {
        this._isEditingDirectives = !this._isEditingDirectives;
        if (this._isEditingDirectives) this._localDirectives = this.directives;
      }}" 
              style="background: transparent; border: 1px solid #4b5563; border-radius: 0.25rem; color: #8b5cf6; font-size: 0.7rem; padding: 0.2rem 0.5rem; cursor: pointer;"
            >
              ${this._isEditingDirectives ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>
        
        ${this._isEditingDirectives ? html`
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <textarea
              style="width: 100%; min-height: 120px; background: #111827; color: white; border: 1px solid #4b5563; border-radius: 0.25rem; padding: 0.75rem; font-family: inherit; font-size: 0.9rem; resize: vertical;"
              .value="${this._localDirectives}"
              @input="${(e: Event) => this._localDirectives = (e.target as HTMLTextAreaElement).value}"
              placeholder="e.g. Always mention the spooky atmosphere, handle combat lethally, etc."
            ></textarea>
            <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
              <button @click="${this._saveDirectives}" style="background-color: #8b5cf6; font-size: 0.8rem; padding: 0.4rem 1rem;">Update Directives</button>
            </div>
          </div>
        ` : html`
          <div style="font-size: 0.9rem; color: #9ca3af; line-height: 1.5; font-style: italic; background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 0.25rem;">
            ${this.directives || html`<span style="color: #47454dff;">No special directives set. The AI will follow standard DM practices.</span>`
        }
          </div>
  `}
        <p style="font-size: 0.7rem; color: #6b7280; margin-top: 0.25rem;">
          Directives are passed to the AI to guide the narrative and tone of the game.
        </p>

        <div style="margin-top: 1.5rem; border-top: 1px solid #374151; padding-top: 1rem; display: flex; justify-content: center;">
             <button 
                @click="${this._generateNextRound}" 
                ?disabled="${this.isGenerating || this.status === 'WAITING_AI' || this.isEnded}"
                class="${(this.isGenerating || this.status === 'WAITING_AI') ? 'generating' : ''}"
                style="width: 100%; padding: 0.75rem; font-size: 1rem; background-color: #8b5cf6; display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                ${(this.isGenerating || this.status === 'WAITING_AI') ? 'AI is Thinking...' : 'Generate AI Round'}
            </button>
        </div>
      </div>
    `;
  }

  private _generateNextRound() {
    this.dispatchEvent(new CustomEvent('generate-next-round', {
      bubbles: true,
      composed: true
    }));
  }

  private _saveDirectives() {
    this.dispatchEvent(new CustomEvent('update-directives', {
      detail: { directives: this._localDirectives },
      bubbles: true,
      composed: true
    }));
    this._isEditingDirectives = false;
  }
  private _renderGoals() {
    if (!this.goals) return null;

    return html`
      <div class="panel" style="">
        <h3 style="margin: 0 0 1rem 0; color: #3b82f6; display: flex; align-items: center; gap: 0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Goals
        </h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${this.goals.map((goal, index) => html`
            <div style="display: flex; align-items: flex-start; gap: 0.75rem; background: #111827; padding: 0.75rem; border-radius: 0.25rem; border: 1px solid ${goal.isCompleted ? '#059669' : '#374151'};">
              <div 
                style="margin-top: 0.125rem; color: ${goal.isCompleted ? '#10b981' : '#9ca3af'}; cursor: pointer;"
                @click="${() => this._toggleGoal(index)}"
                title="${goal.isCompleted ? 'Mark as incomplete' : 'Mark as completed'}"
              >
                ${goal.isCompleted ? html`
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                ` : html`
                  <div style="width: 16px; height: 16px; border: 2px solid currentColor; border-radius: 50%;"></div>
                `}
              </div>
              <div style="flex: 1; font-size: 0.9rem; line-height: 1.4; color: ${goal.isCompleted ? '#9ca3af' : '#e5e7eb'}; text-decoration: ${goal.isCompleted ? 'line-through' : 'none'};">
                ${goal.description}
              </div>
              <button 
                @click="${() => this._deleteGoal(index)}"
                style="background: transparent; color: #ef4444; padding: 0.2rem; display: flex; align-items: center; justify-content: center; opacity: 0.6;"
                title="Delete goal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          `)}
        </div>
        
        ${this._showGoalInput ? html`
          <div style="margin-top: 0.5rem; background: #111827; padding: 0.75rem; border-radius: 0.25rem; border: 1px dashed #3b82f6;">
            <input 
              type="text" 
              class="card-input" 
              placeholder="New goal description..." 
              .value="${this._newGoalDescription}"
              @input="${(e: Event) => this._newGoalDescription = (e.target as HTMLInputElement).value}"
              @keydown="${(e: KeyboardEvent) => e.key === 'Enter' && this._addGoal()}"
            />
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.5rem;">
              <button @click="${() => { this._showGoalInput = false; this._newGoalDescription = ''; }}" style="background-color: #4b5563; font-size: 0.75rem; padding: 0.25rem 0.75rem;">Cancel</button>
              <button @click="${this._addGoal}" style="background-color: #3b82f6; font-size: 0.75rem; padding: 0.25rem 0.75rem;">Add Goal</button>
            </div>
          </div>
        ` : html`
          <button class="new_player" @click="${() => this._showGoalInput = true}" style="border-color: #3b82f6; color: #3b82f6;">+ Add Goal</button>
        `}
        <p style="font-size: 0.7rem; color: #6b7280; margin-top: 0.25rem;">
          Goals guide the AI though the progress of the story
        </p>

      </div>
    `;
  }

  private _addGoal() {
    if (!this._newGoalDescription.trim()) return;
    this.dispatchEvent(new CustomEvent('add-goal', {
      detail: { description: this._newGoalDescription },
      bubbles: true,
      composed: true
    }));
    this._newGoalDescription = '';
    this._showGoalInput = false;
  }

  private _toggleGoal(index: number) {
    this.dispatchEvent(new CustomEvent('toggle-goal', {
      detail: { index },
      bubbles: true,
      composed: true
    }));
  }

  private _deleteGoal(index: number) {
    if (confirm('Are you sure you want to delete this goal?')) {
      this.dispatchEvent(new CustomEvent('delete-goal', {
        detail: { index },
        bubbles: true,
        composed: true
      }));
    }
  }

  private _startRound() {
    this.dispatchEvent(new CustomEvent('start-round', {
      bubbles: true,
      composed: true
    }));
  }

  private _triggerNextRound() {
    this.dispatchEvent(new CustomEvent('next-round', {
      bubbles: true,
      composed: true
    }));
  }

  private _showPlotSummary() {
    this.dispatchEvent(new CustomEvent('show-plot-summary', {
      bubbles: true,
      composed: true
    }));
  }

  static styles = css`
    :host {
      display: block;
      padding-left: 1rem;
      color: white;
    }

    .panel {
      background-color: #1f2937;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    h2 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #3b82f6; /* blue-500 */
      font-size: 1.25rem;
    }

    .player-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    button {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        border: none;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
        color: white;
    }

    .btn-primary {
      background-color: #3b82f6;
    }
    .btn-primary:hover {
      background-color: #2563eb;
    }

    .new_player {
      color: #10b981;
      border: 1px dashed #10b981;
      background: transparent;
      width: 100%;
      margin-top: 0.5rem;
    }
    .new_player:hover {
        background-color: #059669;
    }
    
    .card-input {
        background: #111827; 
        border: 1px solid #4b5563; 
        color: white; 
        padding: 0.25rem; 
        border-radius: 0.25rem; 
        width: 100%; 
        box-sizing: border-box;
    }
    .name-input {
      font-weight: bold;
    }
    .badges-input {
      font-size: 0.8rem;
    }

    .badge {
        background-color: #4b5563;
        color: #e5e7eb;
        font-size: 0.6rem;
        padding: 0.1rem 0.3rem;
        border-radius: 0.2rem;
        display: flex;
        align-items: center;
        gap: 0.2rem;
    }

    .badge.hidden {
      border: 1px dashed #fbbf24; 
      background-color: #374151;
      color: #fbbf24;
    }

    .status-text {
      font-weight: bold;
    }

    .btn-cancel {
      background-color: #4b5563;
      color: white;
    }

    .btn-confirm {
      background-color: #3b82f6;
      color: white;
    }

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #1f2937;
    }
    ::-webkit-scrollbar-thumb {
      background: #4b5563;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #6b7280;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    
    .generating {
      animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      cursor: wait;
    }

    /* Toggle Switch */
    .switch {
      position: relative;
      display: inline-block;
      width: 32px;
      height: 18px;
    }

    .switch input { 
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #374151;
      transition: .4s;
      border-radius: 18px;
      border: 1px solid #4b5563;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 12px;
      width: 12px;
      left: 2px;
      bottom: 2px;
      background-color: #9ca3af;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: rgba(16, 185, 129, 0.2);
      border-color: #10b981;
    }

    input:checked + .slider:before {
      transform: translateX(14px);
      background-color: #10b981;
    }
  `;

  private _createPlayer() {
    if (!this._newPlayerName) return;
    this._showPlayerManagement = false;
    const badges = this._newPlayerBadges.split(',').map(b => b.trim()).filter(b => b).map(b => ({ name: b, hidden: false }));

    this.dispatchEvent(new CustomEvent('create-player', {
      detail: {
        name: this._newPlayerName,
        avatarIndex: this._newPlayerAvatar,
        badges
      },
      bubbles: true,
      composed: true
    }));

    // Reset form
    this._newPlayerName = '';
    this._newPlayerBadges = '';
    this._newPlayerAvatar = 0;
  }

  private async _copyInviteLink(playerId: string) {
    if (!this.sessionId) return;
    const url = `${window.location.origin}/?session=${this.sessionId}&player=${playerId}`;
    try {
      await navigator.clipboard.writeText(url);
      alert('Invite link copied!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      prompt('Copy this link:', url);
    }
  }

  render() {
    const displayRound = this.viewingRound;
    const isCurrentRound = displayRound === this.round;

    // Determine which actions to display
    let actionsRound = displayRound;

    if (isCurrentRound && !this.isRoundActive && this.round > 1) {
      // If current round is inactive (waiting for scene update), show previous round's actions
      actionsRound = this.round - 1;
    }

    const selectedPlayer = this._selectedPlayerId
      ? this.players.find(p => p.id === this._selectedPlayerId) || null
      : null;

    // Aggregate badges for selected player
    const selectedPlayerBadges = selectedPlayer
      ? (this.pendingScene?.playerBadges?.[selectedPlayer.id] || this.currentScene?.playerBadges?.[selectedPlayer.id] || [])
      : [];
    const formattedBadges = selectedPlayerBadges.map((b: any) => typeof b === 'string' ? { name: b, hidden: false } : b);

    // Get selected player status
    const selectedPlayerStatus = selectedPlayer
      ? (this.pendingScene?.playerStatuses?.[selectedPlayer.id] || selectedPlayer.statusText || '')
      : '';

    return html`
      <div class="panel">
        <h3 style="margin: 0; color: #3b82f6;">Director Dashboard</h3>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-top: 1px solid #374151; padding-top: 0.5rem;">
            <div style="background: #374151; padding: 0.25rem 0.75rem; margin-right: 0.7em; border-radius: 0.5rem; font-size: 0.75rem; font-weight: bold; color: ${this.status === 'WAITING_AI' ? '#fbbf24' : this.status === 'ROUND_ACTIVE' ? '#10b981' : '#9ca3af'}; border: 1px solid currentColor;">
                STATUS: ${this.status}
            </div>
            
            <div style="display: flex; gap: 0.5rem;">
                ${!this.isEnded ? html`
                    ${!this.isRoundActive ? html`
                        <button @click="${this._startRound}" style="background-color: #3b82f6; border: none; padding: 0.4rem 1rem; font-size: 0.875rem;">Start Round</button>
                    ` : html`
                         <button @click="${this._triggerNextRound}" style="background-color: #fbbf24; color: #1f2937; border: none; padding: 0.4rem 1rem; font-size: 0.875rem;">Next Round</button>
                    `}
                    <button 
                        @click="${this._showPlotSummary}" 
                        style="background-color: #8b5cf6; border: none; padding: 0.4rem 1rem; font-size: 0.875rem; color: white;"
                    >
                        Plot Summary
                    </button>
                ` : ''}
            </div>
        </div>
      </div>
      <div class="panel">
            <div class="player-list">
                ${this.players.filter(p => p.id !== this.directorId).map(p => {
      const avatarIdx = p.avatarIndex || 0;
      const isOnline = this.playersOnline.some(po => po.id === p.id);
      const actionMsg = this.messages.find(m => m.isAction && m.senderId === p.id && m.round === actionsRound);

      return html`
                      <div style="display: flex; flex-direction: column; gap: 0rem">
                        <player-card 
                          .name="${p.name}" 
                          .avatarIndex="${avatarIdx}" 
                          .online="${isOnline}"
                          style="cursor: pointer;"
                          @click="${() => this._openCharacterSheet(p.id)}"
                        >
                              <div slot="name-extras">
                                  ${this.submittedActions.includes(p.id) ? html`<span style="color: #10b981; font-weight: bold;" title="Action Submitted">✓</span>` : ''}
                              </div>
                              <div 
                                  slot="avatar"
                                  class="avatar-container"
                                  style="position: relative;"
                              >
                                  <img 
                                      src="/characters.jpg" 
                                      class="avatar-image" 
                                      style="transform: translate(-${(avatarIdx % 8) * 48}px, -${Math.floor(avatarIdx / 8) * 48}px); width: 384px;"
                                  >
                              </div>
  
                              <div slot="status">
                                  <div 
                                      class="status-text" 
                                      style="font-size: 0.8rem; margin-bottom: 0.25rem;"
                                  >
                                      ${this.pendingScene?.playerStatuses?.[p.id] ? html`<span style="color: #fbbf24; font-style: italic;">${this.pendingScene.playerStatuses[p.id]}</span>` : (p.statusText || '')}
                                  </div>
                              </div>
  
                                    <div slot="badges" style="font-size: 0.75rem; color: #9ca3af; display: flex; flex-direction: column; gap: 0.25rem;">
                                        <div style="display: flex; flex-wrap: wrap; gap: 0.25rem; align-items: center;">
                                            ${(this.pendingScene?.playerBadges?.[p.id] || this.currentScene?.playerBadges?.[p.id] || []).map((b: any) => {
        const badgeName = typeof b === 'string' ? b : b.name;
        const isHidden = typeof b === 'string' ? false : b.hidden;
        return html`
                                                    <span class="badge ${isHidden ? 'hidden' : ''}" title="${isHidden ? 'Hidden Badge' : ''}">
                                                        ${badgeName}
                                                    </span>
                                                `;
      })}
                                        </div>
  
                                    ${actionMsg ? html`
                                        <div style="color: #e5e7eb; font-size: 0.9rem; background: #374151; padding: 0.25rem 0.5rem; border-radius: 0.25rem; border-left: 2px solid #3b82f6; margin-top: 0.25rem;">
                                          ${actionMsg.content}
                                        </div>
                                    ` : ''}
                                </div>
                                <div slot="actions" @click="${(e: Event) => e.stopPropagation()}">
                                    <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: center;">
                                        <button 
                                            @click="${() => this._startEditingMsg(p.id)}" 
                                            style="background-color: ${this.pendingScene?.privateMessages?.[p.id] ? '#8b5cf6' : '#4b5563'}; padding: 0.25rem; display: flex; align-items: center; justify-content: center;"
                                            title="${this.pendingScene?.privateMessages?.[p.id] ? 'Edit Private Message' : 'Send Private Message'}"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </button>
                                        <button 
                                            @click="${() => this._startEditingAction(p.id)}" 
                                            style="background-color: ${actionMsg ? '#10b981' : '#4b5563'}; padding: 0.25rem; display: flex; align-items: center; justify-content: center;"
                                            title="Edit Player Action"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </player-card>
                            ${this._editingPrivateMsgId === p.id ? html`
                                <div style="margin-top: -0.5rem; background: #111827; padding: 0.75rem; border-radius: 0 0 0.5rem 0.5rem; border: 1px solid #8b5cf6; border-top: none; position: relative; z-index: 2; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                    <textarea
                                        style="width: 100%; min-height: 80px; margin-bottom: 0.5rem; resize: vertical; background: #1f2937; color: white; border: 1px solid #4b5563; border-radius: 0.25rem; padding: 0.5rem; font-family: inherit; font-size: 0.875rem;"
                                        .value="${this._tempPrivateMsg}"
                                        @input="${(e: Event) => this._tempPrivateMsg = (e.target as HTMLTextAreaElement).value}"
                                        placeholder="Write a private message for ${p.name}..."
                                        @click="${(e: Event) => e.stopPropagation()}"
                                    ></textarea>
                                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                                        <button @click="${(e: Event) => { e.stopPropagation(); this._cancelPrivateMsg(); }}" style="background-color: #4b5563; font-size: 0.75rem; padding: 0.4rem 0.8rem;">Cancel</button>
                                        <button @click="${(e: Event) => { e.stopPropagation(); this._savePrivateMsg(); }}" style="background-color: #8b5cf6; font-size: 0.75rem; padding: 0.4rem 0.8rem;">Save Secret</button>
                                    </div>
                                </div>
                            ` : (this.pendingScene?.privateMessages?.[p.id] ? html`
                                <div style="font-size: 0.75rem; color: #a78bfa; font-style: italic; background: rgba(139, 92, 246, 0.1); padding: 0.4rem 0.75rem; border-radius: 0 0 0.5rem 0.5rem; margin-top: -0.5rem; border: 1px solid rgba(139, 92, 246, 0.2); border-top: none; position: relative; z-index: 1;">
                                    <span style="font-weight: bold; opacity: 0.7;">Pending Secret:</span> "${this.pendingScene.privateMessages[p.id]}"
                                </div>
                            ` : '')}

                            ${this._editingPlayerActionId === p.id ? html`
                                <div style="margin-top: -0.5rem; background: #111827; padding: 0.75rem; border-radius: 0 0 0.5rem 0.5rem; border: 1px solid #10b981; border-top: none; position: relative; z-index: 2; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                    <div style="font-size: 0.75rem; color: #10b981; margin-bottom: 0.25rem; font-weight: bold;">ACTION OVERRIDE:</div>
                                    <textarea
                                        style="width: 90%; min-height: 80px; margin-bottom: 0.5rem; resize: vertical; background: #1f2937; color: white; border: 1px solid #4b5563; border-radius: 0.25rem; padding: 0.5rem; font-family: inherit; font-size: 0.875rem;"
                                        .value="${this._tempPlayerAction}"
                                        @input="${(e: Event) => this._tempPlayerAction = (e.target as HTMLTextAreaElement).value}"
                                        placeholder="Write an action for ${p.name}..."
                                        @click="${(e: Event) => e.stopPropagation()}"
                                    ></textarea>
                                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                                        <button @click="${(e: Event) => { e.stopPropagation(); this._cancelPlayerAction(); }}" style="background-color: #4b5563; font-size: 0.75rem; padding: 0.4rem 0.8rem;">Cancel</button>
                                        <button @click="${(e: Event) => { e.stopPropagation(); this._savePlayerAction(); }}" style="background-color: #10b981; font-size: 0.75rem; padding: 0.4rem 0.8rem;">Update Action</button>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                  `})}
       
        ${this._showPlayerManagement ? html`
                <player-card .name="${this._newPlayerName}" .avatarIndex="${this._newPlayerAvatar}">
                    <!-- Avatar Selection -->
                    <div 
                        slot="avatar"
                        class="avatar-container"
                        style="cursor: pointer; border: 2px solid #3b82f6; width: 48px; height: 48px; border-radius: 50%; overflow: hidden; position: relative;"
                        @click="${() => this._showAvatarModal = true}"
                        title="Click to change avatar"
                    >
                         <img 
                            src="/characters.jpg" 
                            class="avatar-image"
                            style="width: 384px; transform: translate(-${(this._newPlayerAvatar % 8) * 48}px, -${Math.floor(this._newPlayerAvatar / 8) * 48}px);" 
                            alt="Selected Avatar" 
                        >
                    </div>

                    <!-- Player Info Inputs -->
                    <div slot="name" style="width: 100%;">
                        <input 
                            type="text" 
                            class="card-input name-input"
                            placeholder="Character Name" 
                            .value="${this._newPlayerName}"
                            @input="${(e: Event) => this._newPlayerName = (e.target as HTMLInputElement).value}"
                        />
                    </div>
                    <!-- Actions -->
                    <div slot="actions">
                        <button class="btn-primary" @click="${this._createPlayer}" ?disabled="${!this._newPlayerName}" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">Create</button>
                        <button class="btn-primary" @click="${() => this._showPlayerManagement = false}" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">Cancel</button>
                    </div>
                </player-card>
            </div>
        ` : ''} <!--show player management-->
        
        ${!this._showPlayerManagement ? html`<button class="new_player" @click="${() => this._showPlayerManagement = !this._showPlayerManagement}">+ Add Character</button>` : ''}
        </div>        
      </div>

      ${this._renderGoals()}

      ${this._renderDirectives()}
      
      <!-- Character Sheet Modal -->
      <character-sheet
        .player="${selectedPlayer}"
        .isOpen="${!!selectedPlayer}"
        .isDirector="${true}"
        .badges="${formattedBadges}"
        .statusText="${selectedPlayerStatus}"
        .sessionId="${this.sessionId}"
        @close="${this._closeCharacterSheet}"
        @delete-player="${this._handleDeletePlayer}"
      ></character-sheet>
      
      <!-- Avatar Selection Modal (Global) -->
      ${this._isAvatarModalOpen ? html`
        <avatar-selector .isOpen="${this._isAvatarModalOpen}" @selected="${this._onAvatarSelected}" @close="${() => this._showAvatarModal = false}"></avatar-selector>
      ` : ''}
     
    `;
  }
}

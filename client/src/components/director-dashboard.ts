import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Scene, Message, Player } from '../types';
import './player-card';
import './avatar-selector';

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
  @property({ type: Object }) currentScene: Scene | null = null;
  @property({ type: Object }) pendingScene: Scene | null = null;
  @property({ type: Object }) pendingPrivateMessages: Record<string, string> = {};

  @state() private _newPlayerName = '';
  @state() private _newPlayerAvatar = 0;
  @state() private _newPlayerBadges = '';
  @state() private _showPlayerManagement = false;
  @state() private _showAvatarModal = false;

  @state() private _editingPrivateMsgId: string | null = null;
  @state() private _tempPrivateMsg = '';

  // Use a getter for cleaner template usage if prefered, or just use the private var directly.
  private get _isAvatarModalOpen() {
    return this._showAvatarModal;
  }
  // ...
  // ...
  private _startEditingMsg(playerId: string) {
    this._editingPrivateMsgId = playerId;
    this._tempPrivateMsg = this.pendingPrivateMessages[playerId] || '';
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

  // Helper render method for the inline form to reuse in both lists
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


  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      color: white;
    }
    
    .panel {
      background-color: #1f2937;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    h2 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      font-weight: bold;
    }

    h3 {
        margin-top: 0;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        font-weight: bold;
        color: #9ca3af;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: #10b981; /* green-500 */
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-weight: bold;
    }

    button:hover {
      background-color: #059669;
    }

    .btn-primary {
        background-color: #3b82f6;
    }
    .btn-primary:hover {
        background-color: #2563eb;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid #374151;
        background-color: #111827;
        color: white;
        box-sizing: border-box;
    }

    .player-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

      image-rendering: pixelated;
      position: absolute;
    }

    /* Reused styles for specific inputs within slots */
    .card-input {
        background: transparent;
        border: none;
        color: white;
        padding: 0;
        margin: 0;
        width: 100%;
        font-family: inherit;
    }

    .card-input:focus {
        outline: none;
        border-bottom: 1px solid #3b82f6;
    }

    .card-input::placeholder {
        color: #6b7280;
        font-style: italic;
    }

    .card-input.name-input,  .card-input.badges-input{
      background-color: transparent;
    }

    .name-input {
        font-weight: bold;
        font-size: 0.9rem;
    }

    .badges-input {
        font-size: 0.75rem;
    }

    .new_player {
        margin-top: 0.5rem;
        font-size: 1.5em;
        background-color: transparent;
        border: 2px solid #404d69ff;
        color: #566ea1ff;
    }

    .new_player:hover {
        background-color: #404d69ff;
        color: #566ea1ff;
    }
  `;

  private _nextRound() {
    this.dispatchEvent(new CustomEvent('next-round', {
      bubbles: true,
      composed: true
    }));
  }

  private _startRound() {
    this.dispatchEvent(new CustomEvent('start-round', {
      bubbles: true,
      composed: true
    }));
  }

  private _createPlayer() {
    if (!this._newPlayerName) return;
    this._showPlayerManagement = false
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


    return html`
      <div class="panel">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2>Characters (Round ${displayRound})</h2>
            <div style="display: flex; align-items: center; gap: 1rem;">
                
                ${isCurrentRound ? html`
                    ${this.pendingScene ? html`
                         <button @click="${this._startRound}" style="background-color: #3b82f6;">Start Round</button>
                    ` : html`
                         ${this.isRoundActive ? html`
                            <button @click="${this._nextRound}">Next Round</button>
                         ` : html`
                            <span style="color: #fbbf24; font-size: 0.875rem;">Set a scene to start round</span>
                         `}
                    `}
                ` : ''}
            </div>
        </div>

            <div class="player-list">
                ${this.players.filter(p => p.id !== this.directorId).map(p => {
      const avatarIdx = p.avatarIndex || 0;

      // Find action for this player
      const actionMsg = this.messages.find(m => m.isAction && m.senderId === p.id && m.round === actionsRound);

      return html`
                      <player-card .name="${p.name}" .avatarIndex="${avatarIdx}">
                              <div slot="badges" style="font-size: 0.75rem; color: #9ca3af; display: flex; flex-direction: column; gap: 0.25rem;">
                                  <div>${p.badges.map(b => b.name).join(', ')}</div>
                                  ${actionMsg ? html`
                                      <div style="color: #e5e7eb; font-size: 0.9rem; background: #374151; padding: 0.25rem 0.5rem; border-radius: 0.25rem; border-left: 2px solid #3b82f6;">
                                        ${actionMsg.content}
                                      </div>
                                  ` : ''}
                              </div>
                              <div slot="actions">
                                  ${this._editingPrivateMsgId === p.id ? this._renderPrivateMsgForm() : html`
                                      <div style="display: flex; gap: 0.5rem; align-items: center;">
                                          ${this.pendingPrivateMessages[p.id] ? html`
                                              <div style="font-size: 0.75rem; color: #a78bfa; font-style: italic; margin-right: 0.5rem; max-width: 200px; text-align: right;">
                                                  Pending: "${this.pendingPrivateMessages[p.id]}"
                                              </div>
                                          ` : ''}
                                          <button @click="${() => this._startEditingMsg(p.id)}" style="background-color: ${this.pendingPrivateMessages[p.id] ? '#8b5cf6' : '#4b5563'};">
                                              ${this.pendingPrivateMessages[p.id] ? 'Edit Private Msg' : 'Private Msg'}
                                          </button>
                                          <button @click="${() => this._copyInviteLink(p.id)}">Copy Invite Link</button>
                                      </div>
                                  `}
                              </div>
                          </player-card>
                          `})}
                ${this.players.filter(p => p.id !== this.directorId).length === 0 ? html`<div>No players created yet.</div>` : ''}

       
        ${this._showPlayerManagement ? html`
                <player-card .name="${this._newPlayerName}" .avatarIndex="${this._newPlayerAvatar}">
                    <!-- Avatar Selection -->
                    <div 
                        slot="avatar"
                        class="avatar-container"
                        style="cursor: pointer; border: 2px solid #3b82f6; width: 40px; height: 40px; border-radius: 50%; overflow: hidden; position: relative;"
                        @click="${() => this._showAvatarModal = true}"
                        title="Click to change avatar"
                    >
                         <img 
                            src="/characters.jpg" 
                            class="avatar-image"
                            style="width: 320px; transform: translate(-${(this._newPlayerAvatar % 8) * 40}px, -${Math.floor(this._newPlayerAvatar / 8) * 40}px);" 
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
                    <div slot="badges" style="width: 100%;">
                        <input 
                            type="text" 
                            class="card-input badges-input"
                            placeholder="Badges (comma separated)..." 
                            .value="${this._newPlayerBadges}"
                            @input="${(e: Event) => this._newPlayerBadges = (e.target as HTMLInputElement).value}"
                        />
                    </div>

                    <!-- Actions -->
                    <div slot="actions">
                        <button class="btn-primary" @click="${this._createPlayer}" ?disabled="${!this._newPlayerName}" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">Create</button>
                        <button class="btn-primary" @click="${() => this._showPlayerManagement = false}" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">Cancel</button>
                    </div>
                </player-card>
            </div>

            <!-- Avatar Selection Modal -->
            <!-- Avatar Selection Modal -->
            ${this._isAvatarModalOpen ? html`
                <avatar-selector
                    .selectedAvatarIndex="${this._newPlayerAvatar}"
                    @close="${() => this._showAvatarModal = false}"
                    @avatar-selected="${(e: CustomEvent) => { this._newPlayerAvatar = e.detail.index; this._showAvatarModal = false; }}"
                ></avatar-selector>
            ` : ''}

        ` : ''} <!--show player management-->
        ${!this._showPlayerManagement ? html`<button class="new_player" @click="${() => this._showPlayerManagement = !this._showPlayerManagement}">+</button>` : ''}
        </div>        

      </div>
    `;
  }
}

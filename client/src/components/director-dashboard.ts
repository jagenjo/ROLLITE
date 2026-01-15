import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Scene, Message, Player } from '../types';
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

  @state() private _newPlayerName = '';
  @state() private _newPlayerAvatar = 0;
  @state() private _newPlayerBadges = '';
  @state() private _showPlayerManagement = false;
  @state() private _showAvatarModal = false; // For new player creation only

  @state() private _selectedPlayerId: string | null = null; // For character sheet

  @state() private _editingPrivateMsgId: string | null = null;
  @state() private _tempPrivateMsg = '';

  private get _isAvatarModalOpen() {
    return this._showAvatarModal;
  }

  private _openCharacterSheet(playerId: string) {
    this._selectedPlayerId = playerId;
  }

  private _closeCharacterSheet() {
    this._selectedPlayerId = null;
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
        background-color: #10b981;
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
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2>Characters</h2>
            <div style="display: flex; align-items: center; gap: 1rem;">
            </div>
        </div>

            <div class="player-list">
                ${this.players.filter(p => p.id !== this.directorId).map(p => {
      const avatarIdx = p.avatarIndex || 0;
      const isOnline = this.playersOnline.some(po => po.id === p.id);
      const actionMsg = this.messages.find(m => m.isAction && m.senderId === p.id && m.round === actionsRound);

      return html`
                      <player-card 
                        .name="${p.name}" 
                        .avatarIndex="${avatarIdx}" 
                        .online="${isOnline}"
                        style="cursor: pointer;"
                        @click="${() => this._openCharacterSheet(p.id)}"
                      >
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
                                    ${this.pendingScene?.playerStatuses?.[p.id] ? html`<span style="color: #fbbf24; font-style: italic;">${this.pendingScene.playerStatuses[p.id]}</span>` : (p.statusText || 'No status')}
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
                                  ${this._editingPrivateMsgId === p.id ? this._renderPrivateMsgForm() : html`
                                      <div style="display: flex; gap: 0.5rem; align-items: center;">
                                          ${this.pendingScene?.privateMessages?.[p.id] ? html`
                                              <div style="font-size: 0.75rem; color: #a78bfa; font-style: italic; margin-right: 0.5rem; max-width: 200px; text-align: right;">
                                                  Pending: "${this.pendingScene?.privateMessages?.[p.id]}"
                                              </div>
                                          ` : ''}
                                          <button 
                                              @click="${() => this._startEditingMsg(p.id)}" 
                                              style="background-color: ${this.pendingScene?.privateMessages?.[p.id] ? '#8b5cf6' : '#4b5563'}; padding: 0.25rem; display: flex; align-items: center; justify-content: center;"
                                              title="${this.pendingScene?.privateMessages?.[p.id] ? 'Edit Private Message' : 'Send Private Message'}"
                                          >
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                              </svg>
                                          </button>
                                      </div>
                                  `}
                              </div>
                          </player-card>
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
        
        ${!this._showPlayerManagement ? html`<button class="new_player" @click="${() => this._showPlayerManagement = !this._showPlayerManagement}">+</button>` : ''}
        </div>        

      </div>
      
      <!-- Character Sheet Modal -->
      <character-sheet
        .player="${selectedPlayer}"
        .isOpen="${!!selectedPlayer}"
        .isDirector="${true}"
        .badges="${formattedBadges}"
        .statusText="${selectedPlayerStatus}"
        .sessionId="${this.sessionId}"
        @close="${this._closeCharacterSheet}"
      ></character-sheet>
      
      <!-- Avatar Selection Modal (Global) -->
      ${this._isAvatarModalOpen ? html`
        <avatar-selector
            .selectedAvatarIndex="${this._newPlayerAvatar}"
            @close="${() => this._showAvatarModal = false}"
            @avatar-selected="${this._onAvatarSelected}"
        ></avatar-selector>
      ` : ''}
      
    `;
  }
}

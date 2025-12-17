import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Player } from '../types';
import './player-card';

@customElement('players-list')
export class PlayersList extends LitElement {
  @property({ type: Array }) players: Player[] = [];
  @property({ type: Array }) playersOnline: Player[] = [];
  @property({ type: Object }) director: Player | null = null;
  @property({ type: String }) currentUserId = '';

  @state() private _showBadgeModal = false;
  @state() private _badgeModalPlayerId: string | null = null;
  @state() private _badgeInputValue = '';
  @state() private _badgeHiddenValue = false;

  @state() private _editingStatusId: string | null = null;
  @state() private _statusValue = '';

  static styles = css`
    :host {
      display: block;
      background: #1f2937;
      padding: 2px;
      border-radius: 0.5rem;
      overflow-y: auto;
      min-height: 90px;
    }

    .players-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
      gap: 0.5rem;
    }

    .director-badge {
      color: #fbbf24;
      font-size: 0.65rem;
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
        border: 1px solid transparent;
    }

    .badge.hidden {
      border-color: #fbbf24; 
      background-color: #374151;
      color: #fbbf24; 
      border-style: dashed;
    }

    .badge-remove {
        cursor: pointer;
        color: #f87171;
        font-weight: bold;
    }

    .badge-remove:hover {
        color: #ef4444;
    }

    .add-badge-btn {
        background: none;
        border: 1px dashed #6b7280;
        color: #9ca3af;
        cursor: pointer;
        padding: 0.1rem 0.3rem;
        border-radius: 0.2rem;
        font-size: 0.6rem;
    }

    .add-badge-btn:hover {
        border-color: #9ca3af;
        color: #d1d5db;
    }

    .status-text {
      opacity: 0.7;
    }

    .status-input {
        background: transparent;
        border: none;
        color: white;
        padding: 0;
        margin: 0;
        width: 100%;
        font-family: inherit;
        border-bottom: 1px solid #3b82f6;
    }

    .status-input:focus {
        outline: none;
    }

    .status-text.editable {
        cursor: pointer;
    }
    .status-text.editable:hover {
        text-decoration: underline;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: #1f2937;
      padding: 1.5rem;
      border-radius: 0.5rem;
      width: 300px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .modal-header {
      font-size: 1.1rem;
      font-weight: bold;
      color: white;
    }

    .modal-input {
      width: 100%;
      padding: 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid #374151;
      background-color: #111827;
      color: white;
      box-sizing: border-box;
    }
    
    .modal-checkbox-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #e5e7eb;
        font-size: 0.9rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      border: none;
      cursor: pointer;
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
  `;

  private _handleAddBadge(playerId: string) {
    if (this.director?.id !== this.currentUserId) return;
    this._badgeModalPlayerId = playerId;
    this._badgeInputValue = '';
    this._badgeHiddenValue = false;
    this._showBadgeModal = true;
    setTimeout(() => this.shadowRoot?.querySelector<HTMLInputElement>('.modal-input')?.focus(), 0);
  }

  private _closeModal() {
    this._showBadgeModal = false;
    this._badgeModalPlayerId = null;
    this._badgeInputValue = '';
    this._badgeHiddenValue = false;
  }

  private _submitBadge() {
    if (this._badgeModalPlayerId && this._badgeInputValue.trim()) {
      this.dispatchEvent(new CustomEvent('add-badge', {
        detail: { playerId: this._badgeModalPlayerId, badge: this._badgeInputValue.trim(), hidden: this._badgeHiddenValue },
        bubbles: true,
        composed: true
      }));
      this._closeModal();
    }
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this._submitBadge();
    } else if (e.key === 'Escape') {
      this._closeModal();
    }
  }

  private _handleRemoveBadge(playerId: string, index: number) {
    if (this.director?.id !== this.currentUserId) return;
    if (confirm("Remove this badge?")) {
      this.dispatchEvent(new CustomEvent('remove-badge', {
        detail: { playerId, index },
        bubbles: true,
        composed: true
      }));
    }
  }

  private _startEditingStatus(playerId: string, currentStatus: string) {
    if (this.director?.id !== this.currentUserId) return;
    this._editingStatusId = playerId;
    this._statusValue = currentStatus || '';
    setTimeout(() => this.shadowRoot?.querySelector<HTMLInputElement>('.status-input')?.focus(), 0);
  }

  private _cancelStatus() {
    this._editingStatusId = null;
    this._statusValue = '';
  }

  private _saveStatus(playerId: string) {
    if (this._editingStatusId !== playerId) return;

    this.dispatchEvent(new CustomEvent('update-player-status', {
      detail: { playerId, status: this._statusValue },
      bubbles: true,
      composed: true
    }));
    this._editingStatusId = null;
    this._statusValue = '';
  }

  private _handleStatusKeyDown(e: KeyboardEvent, playerId: string) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this._saveStatus(playerId);
    } else if (e.key === 'Escape') {
      this._cancelStatus();
    }
  }


  render() {
    const isOnline = (playerId: string) => {
      return this.playersOnline.some(p => p.id === playerId);
    };

    return html`
      <div class="players-list-container">
        ${this.players.map(p => {
      const avatarIdx = p.avatarIndex !== undefined ? p.avatarIndex : 0;

      const isDirector = this.currentUserId === this.director?.id;
      const isPlayerDirector = p.id === this.director?.id;
      const online = isOnline(p.id);

      return html`
            <player-card 
                .name="${p.name}" 
                .avatarIndex="${avatarIdx}" 
                .online="${online}"
                .isDirector="${isPlayerDirector}"
                class="${p.id === this.currentUserId ? 'is-me' : ''}"
            >
                <!-- Allow overriding avatar for Director case -->
                ${isPlayerDirector ? html`
                    <div slot="avatar" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #374151; color: #fbbf24; font-weight: bold; font-size: 0.8rem;">
                        DIR
                    </div>
                ` : ''}

                ${isPlayerDirector ? html`<span slot="name-extras" class="director-badge" title="Director">★</span>` : ''}

                ${!isPlayerDirector ? html`
                    <div slot="status">
                        ${this._editingStatusId === p.id ? html`
                            <input 
                                class="status-input" 
                                type="text" 
                                .value="${this._statusValue}"
                                @input="${(e: Event) => this._statusValue = (e.target as HTMLInputElement).value}"
                                @keydown="${(e: KeyboardEvent) => this._handleStatusKeyDown(e, p.id)}"
                                @blur="${() => this._saveStatus(p.id)}"
                                placeholder="Status..."
                                style="text-align: right;"
                            />
                        ` : html`
                            <div 
                                class="status-text ${isDirector ? 'editable' : ''}" 
                                @click="${() => isDirector ? this._startEditingStatus(p.id, p.statusText || '') : null}"
                                title="${isDirector ? 'Click to edit status' : ''}"
                                style="text-align: right;"
                            >
                                ${p.pendingStatusText && isDirector ? html`<span style="color: #fbbf24; font-style: italic;">${p.pendingStatusText}</span>` : (p.statusText || (isDirector ? 'Status...' : ''))}
                            </div>
                        `}
                    </div>
                ` : ''}

                <div slot="badges">
                    ${p.badges?.map((badge, idx) => {
        const badgeName = typeof badge === 'string' ? badge : badge.name;
        const isHidden = typeof badge === 'string' ? false : badge.hidden;
        if (isHidden && !isDirector) return null;

        return html`
                        <span class="badge ${isHidden ? 'hidden' : ''}" title="${isHidden ? 'Hidden Badge' : ''}">
                            ${badgeName}
                            ${isDirector ? html`
                                <span class="badge-remove" @click="${(e: Event) => {
              e.stopPropagation();
              this._handleRemoveBadge(p.id, idx);
            }}">&times;</span>
                            ` : ''}
                        </span>
                    `})}
                    ${isDirector && !isPlayerDirector ? html`
                        <button class="add-badge-btn" @click="${(e: Event) => {
            e.stopPropagation();
            this._handleAddBadge(p.id);
          }}">+</button>
                    ` : ''}
                </div>
            </player-card>
          `;
    })}
        ${!this.players.length ? html`<div style="color: #9ca3af; padding: 0.5rem; font-size: 0.8rem;">No players</div>` : ''}
      </div>

      ${this._showBadgeModal ? html`
        <div class="modal-overlay" @click="${this._closeModal}">
            <div class="modal-content" @click="${(e: Event) => e.stopPropagation()}">
                <div class="modal-header">Add Badge</div>
                <input 
                    class="modal-input" 
                    type="text" 
                    placeholder="Badge Name" 
                    .value="${this._badgeInputValue}" 
                    @input="${(e: Event) => this._badgeInputValue = (e.target as HTMLInputElement).value}"
                    @keydown="${this._handleKeyDown}"
                >
                <label class="modal-checkbox-container">
                    <input 
                        type="checkbox" 
                        .checked="${this._badgeHiddenValue}"
                        @change="${(e: Event) => this._badgeHiddenValue = (e.target as HTMLInputElement).checked}"
                    >
                    Hidden (Director Only)
                </label>
                <div class="modal-actions">
                    <button class="btn btn-cancel" @click="${this._closeModal}">Cancel</button>
                    <button class="btn btn-confirm" @click="${this._submitBadge}">Add</button>
                </div>
            </div>
        </div>
      ` : ''}
    `;
  }
}

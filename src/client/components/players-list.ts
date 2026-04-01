import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Player, Round } from '../../shared/types.js';
import './player-card';
import './character-sheet';

@customElement('players-list')
export class PlayersList extends LitElement {
  @property({ type: Array }) players: Player[] = [];
  @property({ type: Array }) playersOnline: Player[] = [];
  @property({ type: Object }) director: Player | null = null;
  @property({ type: String }) currentUserId = '';
  @property({ type: Object }) currentRound: Round | null = null;
  @property({ type: Object }) draftRound: Round | null = null;
  @property({ type: String }) sessionId = '';
  @property({ type: Array }) submittedActions: string[] = [];

  @state() private _selectedPlayerId: string | null = null;

  static styles = css`
    :host {
      display: block;
      background: #1f2937;
      padding: 2px;
      border-radius: 0.5rem;
      /*overflow-y: auto;*/
      min-height: 90px;
    }

    .players-grid {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .is-me {
        border: 2px solid #f6b53bff; /* blue-500 */
        border-radius: 0.5rem;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
    }

    .director-badge {
      color: #fbbf24;
      font-size: 0.8rem;
    }

    .badge {
        background-color: #4b5563;
        color: #e5e7eb;
        font-size: 0.8rem;
        padding: 0.1rem 0.3rem;
        border-radius: 0.2rem;
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

    .status-text {
      opacity: 0.7;
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

  private _openCharacterSheet(playerId: string) {
    this._selectedPlayerId = playerId;
  }

  private _closeCharacterSheet() {
    this._selectedPlayerId = null;
  }

  render() {
    const isOnline = (playerId: string) => {
      return this.playersOnline.some(p => p.id === playerId);
    };

    const selectedPlayer = this._selectedPlayerId
      ? this.players.find(p => p.id === this._selectedPlayerId) || null
      : null;

    const selectedPlayerChar = selectedPlayer ? this.currentRound?.characters?.find(c => c.playerId === selectedPlayer.id) : null;
    const draftChar = selectedPlayer ? this.draftRound?.characters?.find(c => c.playerId === selectedPlayer.id) : null;

    // Aggregate badges for selected player
    const selectedPlayerBadges = selectedPlayer
      ? (draftChar?.badges || selectedPlayerChar?.badges || [])
      : [];
    const formattedBadges = selectedPlayerBadges.map((b: any) => typeof b === 'string' ? { name: b, hidden: false } : b);

    // Get selected player status
    const selectedPlayerStatus = selectedPlayer
      ? (draftChar?.status || selectedPlayerChar?.status || '')
      : '';

    // Check if current user is director
    const isDirector = this.currentUserId === this.director?.id;

    return html`
      <div class="players-list-container">
        <div class="players-grid">
        ${this.players.map(p => {
      const avatarIdx = (() => {
        const charData = this.currentRound?.characters?.find(c => c.playerId === p.id);
        const draftCharData = this.draftRound?.characters?.find(c => c.playerId === p.id);
        return draftCharData?.avatarIndex ?? charData?.avatarIndex ?? 0;
      })();
      const isPlayerDirector = p.id === this.director?.id;
      if (isPlayerDirector) return;
      const online = isOnline(p.id);

      return html`
                <player-card 
                    .name="${p.name}" 
                    .avatarIndex="${avatarIdx}" 
                    .online="${online}"
                    .isDirector="${isPlayerDirector}"
                    class="${p.id === this.currentUserId ? 'is-me' : ''}"
                    style="cursor: pointer;"
                     @click="${() => this._openCharacterSheet(p.id)}"
                >
                    <!-- Allow overriding avatar for Director case -->
                    ${isPlayerDirector ? html`
                        <div slot="avatar" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #374151; color: #fbbf24; font-weight: bold; font-size: 0.8rem;">
                            DIR
                        </div>
                    ` : ''}

                    ${isPlayerDirector ? html`<span slot="name-extras" class="director-badge" title="Director">★</span>` : ''}
                    ${this.submittedActions.includes(p.id) ? html`<span slot="name-extras" style="color: #10b981; font-weight: bold;" title="Action Submitted">✓</span>` : ''}

                    ${!isPlayerDirector ? html`
                        <div slot="status">
                            <div 
                                class="status-text"
                            >
                                ${(() => {
            const charData = this.currentRound?.characters?.find(c => c.playerId === p.id);
            const draftCharData = this.draftRound?.characters?.find(c => c.playerId === p.id);
            return draftCharData?.status ? html`<span style="color: #fbbf24; font-style: italic;">${draftCharData.status}</span>` : (charData?.status || '');
          })()}
                            </div>
                        </div>
                    ` : ''}

                    <div slot="badges">
                        ${(() => {
          const charData = this.currentRound?.characters?.find(c => c.playerId === p.id);
          return charData?.badges.map((badge: any) => {
            const badgeName = typeof badge === 'string' ? badge : badge.name;
            const isHidden = typeof badge === 'string' ? false : (badge as any).hidden;
            if (isHidden && !isDirector) return null;

            return html`
                                <span class="badge ${isHidden ? 'hidden' : ''}" title="${isHidden ? 'Hidden Badge' : ''}">
                                    ${badgeName}
                                </span>
                            `;
          });
        })() || ''}
                    </div>
                </player-card>
            `;
    })}
        </div>
        ${!this.players.length ? html`<div style="color: #9ca3af; padding: 0.5rem; font-size: 0.8rem;">No players</div>` : ''}
      </div>

      <character-sheet
        .player="${selectedPlayer}"
        .isOpen="${!!selectedPlayer}"
        .isDirector="${isDirector}" 
        .badges="${formattedBadges}"
        .statusText="${selectedPlayerStatus}"
        .avatarIndex="${(() => {
        const charData = this.currentRound?.characters?.find(c => c.playerId === selectedPlayer?.id);
        const draftCharData = this.draftRound?.characters?.find(c => c.playerId === selectedPlayer?.id);
        return draftCharData?.avatarIndex ?? charData?.avatarIndex ?? 0;
      })()}"
        .sessionId="${this.sessionId}"
        .draftRound="${this.draftRound}"
        @close="${this._closeCharacterSheet}"
      ></character-sheet>
    `;
  }
}

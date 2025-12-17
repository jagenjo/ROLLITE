import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('player-card')
export class PlayerCard extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: Number }) avatarIndex = 0;
  @property({ type: Boolean }) online = false;
  @property({ type: Boolean }) isDirector = false; // To show DIR label instead of image if needed, or visual distinction

  static styles = css`
    :host {
      display: block;
    }

    .player-card {
      background: #374151;
      padding: 0.5rem;
      border-radius: 0.5rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      position: relative;
      margin-bottom: 0.5rem;
    }

    .player-card.is-me {
      border: 1px solid #3b82f6;
    }

    /* Online Status Dot */
    .status-dot {
        position: absolute;
        top: 4px;
        left: 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #9ca3af; /* Gray/Offline */
        border: 1px solid #1f2937;
        z-index: 1;
    }
    
    .status-dot.online {
        background-color: #10b981; /* Green/Online */
        box-shadow: 0 0 4px #10b981;
    }

    .avatar-container {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #111827;
      position: relative;
      flex-shrink: 0;
    }

    .avatar-image {
      width: 384px; /* 8 cols * 48px */
      height: auto; 
      image-rendering: pixelated;
      position: absolute;
    }

    .player-info {
      flex: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      overflow: hidden;
      min-width: 0; /* For flex truncation */
    }

    .header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .name-area {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        overflow: hidden;
        margin-right: 0.5rem;
    }

    .player-name {
      font-weight: bold;
      font-size: 0.9rem; /* Standardized size */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: white;
    }

    ::slotted([slot="status"]) {
        flex-shrink: 0; 
        max-width: 50%;
    }

    .badges-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.1rem;
        /* justify-content center removed, let it flow naturally */
        max-width: 100%;
    }
    
    /* Allow slots to style themselves, but provide container */
    .actions-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
  `;

  render() {
    const col = this.avatarIndex % 8;
    const row = Math.floor(this.avatarIndex / 8);
    const xOffset = -(col * 48);
    const yOffset = -(row * 48);

    return html`
      <div class="player-card">
        <div class="status-dot ${this.online ? 'online' : ''}"></div>
        
        <!-- Avatar Slot allows overriding behavior (like click-to-edit) -->
        <div class="avatar-container">
            <slot name="avatar">
                <img 
                    src="/characters.jpg" 
                    class="avatar-image" 
                    style="transform: translate(${xOffset}px, ${yOffset}px);"
                    alt="Avatar"
                >
            </slot>
        </div>

        <div class="player-info">
            <div class="header-row">
                <div class="name-area">
                    <slot name="name">
                        <span class="player-name" style="${!this.online ? 'opacity: 0.5;' : ''}">${this.name}</span>
                    </slot>
                    <slot name="name-extras"></slot>
                </div>
                <slot name="status"></slot>
            </div>

            <div class="badges-container">
                <slot name="badges"></slot>
            </div>
        </div>

        <div class="actions-container">
            <slot name="actions"></slot>
        </div>
      </div>
    `;
  }
}

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
      width: calc( 100% - 4px );
    }

    .player-card {
      background: #374151;
      padding: 0.75rem;
      border-radius: 0.5rem;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 0.75rem;
      position: relative;
      margin-bottom: 0.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }

    .player-card:hover {
      background: #465163ff;
    }

    .player-card.is-me {
      border: 1px solid #f6ca3bff;
      box-shadow: 0 0 0 1px #f6ca3bff;
    }

    /* Online Status Dot */
    .status-dot {
        position: absolute;
        top: -2px;
        left: -2px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #9ca3af; /* Gray/Offline */
        border: 2px solid #1f2937;
        z-index: 10;
    }
    
    .status-dot.online {
        background-color: #10b981; /* Green/Online */
        box-shadow: 0 0 4px #10b981;
    }

    .avatar-wrapper {
      position: relative;
      width: 48px;
      height: 48px;
    }

    .avatar-container {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      background-color: #111827;
      position: relative;
    }

    .avatar-image {
      width: 384px; /* 8 cols * 48px */
      height: auto; 
      image-rendering: pixelated;
      position: absolute;
    }

    .player-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 0; /* Crucial for text truncation in grid/flex */
      width: 100%;
    }

    .header-row {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
    }

    .name-area {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        min-width: 0;
    }

    .player-name {
      font-weight: bold;
      font-size: 1.1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: white;
    }

    ::slotted([slot="status"]) {
        font-size: 0.8rem;
        color: #9ca3af;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }

    .badges-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
    }
    
    .actions-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        gap: 0.25rem;
    }
  `;

  render() {
    const col = this.avatarIndex % 8;
    const row = Math.floor(this.avatarIndex / 8);
    const xOffset = -(col * 48);
    const yOffset = -(row * 48);

    return html`
      <div class="player-card">
        <div class="avatar-wrapper">
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
        </div>

        <div class="player-info">
            <div class="header-row">
                <div class="name-area">
                    <slot name="name">
                        <span class="player-name" style="${!this.online ? 'opacity: 0.5;' : ''}">${this.name}</span>
                    </slot>
                    <slot name="name-extras"></slot>
                </div>
            </div>
            <slot name="status"></slot>
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

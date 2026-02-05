import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Player } from '../../shared/types.js';

@customElement('header-profile')
export class HeaderProfile extends LitElement {
  @property({ type: Object }) player: Player | null = null;

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: white;
    }

    .avatar-container {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #374151;
      position: relative;
      border: 1px solid #4b5563;
    }

    .avatar-image {
      width: 256px; /* 8 cols * 32px */
      height: auto; 
      image-rendering: pixelated;
      position: absolute;
    }

    .info {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .role-label {
        font-size: 0.7rem;
        color: #9ca3af;
        text-transform: uppercase;
        font-weight: bold;
    }

    .player-name {
        font-weight: bold;
        font-size: 0.9rem;
    }
  `;

  render() {
    if (!this.player) return html``;

    // Sprite logic
    // Original sprite is based on 40px or 48px, but here we want 32px.
    // The sprite sheet is constant, createPlayer in director-dashboard uses 320px width for 40px cells (8 cols).
    // In players-list, it uses 384px width for 48px cells.
    // So the original sprite sheet resolution: each cell is likely designed for a certain size.
    // If I want 32px cells, the full width should be 32px * 8 = 256px.

    const avatarIdx = this.player.avatarIndex !== undefined ? this.player.avatarIndex : 0;
    const col = avatarIdx % 8;
    const row = Math.floor(avatarIdx / 8);
    const xOffset = -(col * 32);
    const yOffset = -(row * 32);

    return html`
      <div class="info">
        <span class="role-label" style="text-align: right;">Playing as</span>
        <span class="player-name">${this.player.name}</span>
      </div>
      <div class="avatar-container">
        <img 
            src="/characters.jpg" 
            class="avatar-image" 
            style="transform: translate(${xOffset}px, ${yOffset}px);"
            alt="Avatar"
        >
      </div>
    `;
  }
}

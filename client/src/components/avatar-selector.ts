import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('avatar-selector')
export class AvatarSelector extends LitElement {
  @property({ type: Number }) selectedAvatarIndex = 0;

  static styles = css`
    :host {
      display: block;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3000;
    }

    .modal-content {
      background: #1f2937;
      padding: 1.5rem;
      border-radius: 0.5rem;
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    h3 {
        margin: 0;
        color: white;
    }

    .avatar-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 5px;
      margin-bottom: 1rem;
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #374151;
      padding: 5px;
    }

    .avatar-option {
      width: 48px;
      height: 48px;
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

    .avatar-image {
      width: 384px; /* 8 cols * 48px */
      height: auto; 
      image-rendering: pixelated;
      position: absolute;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: #4b5563; 
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-weight: bold;
      align-self: flex-end;
    }

    button:hover {
        background-color: #374151;
    }
  `;

  private _handleSelect(index: number) {
    this.dispatchEvent(new CustomEvent('avatar-selected', {
      detail: { index },
      bubbles: true,
      composed: true
    }));
  }

  private _close() {
    this.dispatchEvent(new CustomEvent('close', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="modal-overlay" @click="${this._close}">
        <div class="modal-content" @click="${(e: Event) => e.stopPropagation()}">
            <h3>Choose an Avatar</h3>
            <div class="avatar-grid">
                ${Array.from({ length: 64 }).map((_, i) => {
      const col = i % 8;
      const row = Math.floor(i / 8);
      const xOffset = -(col * 48);
      const yOffset = -(row * 48);
      return html`
                    <div 
                        class="avatar-option ${this.selectedAvatarIndex === i ? 'selected' : ''}"
                        @click="${() => this._handleSelect(i)}"
                    >
                        <img 
                            src="/characters.jpg" 
                            class="avatar-image"
                            style="transform: translate(${xOffset}px, ${yOffset}px);" 
                            alt="Avatar ${i}" 
                        />
                    </div>
                  `;
    })}
            </div>
            <button @click="${this._close}">Close</button>
        </div>
      </div>
    `;
  }
}

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Scene, Message } from '../types';

@customElement('scene-display')
export class SceneDisplay extends LitElement {
  @property({ type: Object }) scene: Scene | null = null;
  @property({ type: Array }) history: { round: number; scene: Scene }[] = [];
  @property({ type: Array }) players: Array<{ id: string, name: string, avatarIndex?: number }> = [];
  @property({ type: Number }) currentRound = 1;
  @property({ type: Number }) viewingRound = 1;
  @property({ type: Boolean }) isDirector = false;
  @property({ type: Array }) messages: Message[] = [];
  @property({ type: String }) currentUserId = '';
  @property({ type: Boolean }) canChat = false;

  @state() private _isEditing = false;
  private _editDescription = '';
  @state() private _editImageUrl = '';
  @state() private _chatInputValue = ''; // NEW

  static styles = css`
    /* ... existing styles ... */
    :host {
      display: block;
      padding: 1rem;
      color: white;
    }

    .scene-container {
      background-color: #1f2937;
      border-radius: 0.5rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .header {
        padding: 1rem 1.5rem;
        background-color: #374151;
        border-bottom: 1px solid #4b5563;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    h2 {
        margin: 0;
        font-size: 1.25rem;
        color: #e5e7eb;
    }

    .image-container {
      width: 100%;
      height: 300px;
      background-color: #111827;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder {
      color: #6b7280;
      font-style: italic;
    }

    .description {
      padding: 1rem;
      font-size: 1.125rem;
      color: #e5e7eb;
      background: #000
    }

    .navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background-color: #374151;
        border-top: 1px solid #4b5563;
    }

    .round-indicator {
        font-weight: bold;
        color: #9ca3af;
    }

    button {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        border: 1px solid #4b5563;
        background-color: #1f2937;
        color: white;
        cursor: pointer;
        transition: all 0.2s;
    }

    button:hover:not(:disabled) {
        background-color: #4b5563;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .edit-form {
      padding: 1.5rem;
      border-bottom: 1px solid #4b5563;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #9ca3af;
    }

    input, textarea {
      width: 100%;
      padding: 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid #374151;
      background-color: #111827;
      color: white;
      box-sizing: border-box;
      font-family: inherit;
    }

    textarea {
      min-height: 150px;
      resize: vertical;
    }

    .button-row {
      display: flex;
      gap: 0.5rem;
    }

    /* CHAT STYLES */
    .chat-section {
        padding: 1em 1.5rem 1.5rem 1.5rem;
        border-top: 1px solid #4b5563;
        margin-top: 0;
        background-color:#1f2937;
    }

    .chat-header-text {
        font-size: 0.875rem;
        color: #9ca3af;
        margin-bottom: 1rem;
        text-transform: uppercase;
        font-weight: bold;
        padding-top: 1rem;
    }

    .messages-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .message {
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      max-width: 90%;
      word-wrap: break-word;
      font-size: 0.95rem;
      display: flex;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .message.own {
      align-self: flex-end;
      background-color: #3b82f6; /* blue-500 */
      color: white;
      flex-direction: row-reverse;
    }
    
    .message.own .message-sender {
        color: #e0e7ff;
        text-align: right;
    }

    .message.other {
      align-self: flex-start;
      background-color: #374151; /* gray-700 */
      color: #e5e7eb; /* gray-200 */
    }

    .message-content {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .message-sender {
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
      font-weight: bold;
      color: #d1d5db;
    }

    .chat-input-area {
        display: flex;
        gap: 0.5rem;
    }

    /* Message Avatar Styles */
    .message-avatar-container {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #111827;
      position: relative;
      flex-shrink: 0;
      border: 1px solid #4b5563;
    }

    .message-avatar-image {
      width: 256px; /* 8 * 32px */
      height: auto; 
      image-rendering: pixelated;
      position: absolute;
    }

    .private-message {
      color: #cdd379ff;
      margin-top:1em;
    }

    .private-message .content {
      padding: 0.2rem;
    }
  `;

  private _handlePrevRound() {
    this.dispatchEvent(new CustomEvent('view-round-change', {
      detail: { round: this.viewingRound - 1 }
    }));
  }

  private _handleNextRound() {
    this.dispatchEvent(new CustomEvent('view-round-change', {
      detail: { round: this.viewingRound + 1 }
    }));
  }

  private _startEditing() {
    if (this.scene) {
      this._editDescription = this.scene.description;
      this._editImageUrl = this.scene.imageUrl || '';
    } else {
      this._editDescription = '';
      this._editImageUrl = '';
    }
    this._isEditing = true;
  }

  private _cancelEditing() {
    this._isEditing = false;
  }

  private _updateScene() {
    this.dispatchEvent(new CustomEvent('update-scene', {
      detail: {
        description: this._editDescription,
        imageUrl: this._editImageUrl
      },
      bubbles: true,
      composed: true
    }));
    this._isEditing = false;
  }

  // CHAT HANDLERS
  private _handleChatInput(e: Event) {
    this._chatInputValue = (e.target as HTMLInputElement).value;
  }

  private _handleChatKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this._sendChatMessage();
    }
  }

  private _sendChatMessage() {
    if (this._chatInputValue.trim()) {
      this.dispatchEvent(new CustomEvent('message-sent', {
        detail: { message: this._chatInputValue },
        bubbles: true,
        composed: true
      }));
      this._chatInputValue = '';
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('scene') || changedProperties.has('isDirector')) {
      if (this.isDirector && this.viewingRound === this.currentRound) {
        if (!this.scene?.description && !this._isEditing) {
          this._startEditing();
        }
      }
    }
  }

  render() {
    let displayScene = this.scene;
    if (this.viewingRound < this.currentRound) {
      const historicalRound = this.history.find(h => h.round === this.viewingRound);
      if (historicalRound) {
        displayScene = historicalRound.scene;
      }
    }

    // Filter messages for the viewing round
    const roundMessages = this.messages.filter(m => m.round === this.viewingRound && !m.isAction && !m.recipientId);
    const privateMessages = this.messages.filter(m => m.round === this.viewingRound && m.recipientId && (m.recipientId === this.currentUserId || this.isDirector));

    return html`
      <div class="scene-container">
        <div class="header">
            <h2>${this.viewingRound === this.currentRound ? 'Current Scene' : `Round ${this.viewingRound}`}</h2>
            ${this.isDirector && this.viewingRound === this.currentRound && !this._isEditing ? html`
                <button @click="${this._startEditing}" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">Edit Scene</button>
            ` : ''}
        </div>

        ${this._isEditing && this.viewingRound === this.currentRound ? html`
            <div class="edit-form">
                <div class="form-group">
                    <label>Scene Description</label>
                    <textarea
                        .value="${this._editDescription}"
                        @input="${(e: Event) => this._editDescription = (e.target as HTMLTextAreaElement).value}"
                        placeholder="Describe the scene..."
                    ></textarea>
                </div>
                <div class="form-group">
                    <label>Image URL (Optional)</label>
                    <input
                        type="text"
                        .value="${this._editImageUrl}"
                        @input="${(e: Event) => this._editImageUrl = (e.target as HTMLInputElement).value}"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
                <div class="button-row">
                    <button @click="${this._updateScene}" style="background-color: #10b981; border: none;">Save Changes</button>
                    <button @click="${this._cancelEditing}">Cancel</button>
                </div>
            </div>
        ` : ''}

        ${!this._isEditing ? html`
            ${displayScene?.imageUrl ? html`
                <div class="image-container">
                    <img src="${displayScene.imageUrl}" alt="Scene Image" />
                </div>
            ` : ''}
            <div class="description">
            ${displayScene?.description || "Waiting for the director to set the scene..."}

            ${privateMessages.length > 0 ? html`
                ${privateMessages.map(msg => html`
                  <div class="private-message">
                    ${this.isDirector ? html`<div class="info">Secret for ${this.players.find(p => p.id === msg.recipientId)?.name || 'Unknown'}</div>` : ''}
                    <div class="content">${msg.content}</div>
                  </div>
                `)}
            ` : ''}
            </div>


            <!-- CHAT INTEGRATION -->
            <div class="chat-section">
                <div class="messages-list">
                    ${roundMessages.length === 0 ? html`<div style="color: #6b7280; font-style: italic; font-size: 0.9rem;">No messages in this round.</div>` : ''}
                    ${roundMessages.map(msg => {
      const player = this.players.find(p => p.id === msg.senderId);
      const avatarIdx = player?.avatarIndex !== undefined ? player.avatarIndex : 0;
      const col = avatarIdx % 8;
      const row = Math.floor(avatarIdx / 8);
      const xOffset = -(col * 32);
      const yOffset = -(row * 32);

      return html`
                        <div class="message ${msg.senderId === this.currentUserId ? 'own' : 'other'}">
                            <div class="message-avatar-container">
                                <img 
                                    src="/characters.jpg" 
                                    class="message-avatar-image" 
                                    style="transform: translate(${xOffset}px, ${yOffset}px);"
                                    alt="Av"
                                >
                            </div>
                            <div class="message-content">
                                <div class="message-sender">${msg.senderName}</div>
                                <div>${msg.content}</div>
                            </div>
                        </div>
                    `})}
                </div>
                
                ${this.viewingRound === this.currentRound && this.canChat ? html`
                    <div class="chat-input-area">
                        <input 
                            type="text" 
                            .value="${this._chatInputValue}" 
                            @input="${this._handleChatInput}"
                            @keydown="${this._handleChatKeyDown}"
                            placeholder="Type a message..."
                        />
                        <button @click="${this._sendChatMessage}">Send</button>
                    </div>
                ` : ''}
            </div>

        ` : ''}
        
        <div class="navigation">
            <button 
                ?disabled="${this.viewingRound <= 1}"
                @click="${this._handlePrevRound}"
            >
                &larr; Previous Round
            </button>
            <span class="round-indicator">Round ${this.viewingRound} / ${this.currentRound}</span>
            <button 
                ?disabled="${this.viewingRound >= this.currentRound}"
                @click="${this._handleNextRound}"
            >
                Next Round &rarr;
            </button>
        </div>
      </div>
    `;
  }
}

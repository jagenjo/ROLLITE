import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import type { Scene, Message } from '../../shared/types.js';
import './round-selector';



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
  @property({ type: String }) directorId = '';
  @property({ type: String }) sessionId = '';
  @property({ type: Boolean }) canChat = false;
  @property({ type: Boolean }) isEnded = false;
  @property({ type: Boolean }) isRoundActive = false;

  @state() private _isEditing = false;
  private _editDescription = '';

  @state() private _chatInputValue = '';

  static styles = css`
    :host {
      display: block;
      padding-left: 1rem;
      padding-right: 1rem;
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
      background: #000;
      min-height: 400px;
    }

    .description img {
        max-width: 100%;
        height: auto;
        border-radius: 0.25rem;
        margin: 1rem 0;
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
      border: 1px solid #222;
      background-color: #000;
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
        background-color: #111;
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
      max-width: 90%;
      word-wrap: break-word;
      font-size: 0.95rem;
      display: flex;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .message.own {
      align-self: flex-end;
      background-color: #3c3c3c;
      color: white;
      flex-direction: row-reverse;
    }
    
    .message.own .message-sender {
        color: #e0e7ff;
        text-align: right;
    }

    .message.other {
      align-self: flex-start;
      background-color: #242424;
      color: #aaa;
    }

    .message.director {
      background-color: #000;
      color: white;
    }

    .message.director .message-avatar-container, .message.director .message-sender {
      display: none;
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
      width: 256px; 
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

  private _startEditing() {
    if (this.scene) {
      this._editDescription = this.scene.description;
    } else {
      this._editDescription = '';
    }
    this._isEditing = true;
  }

  private _cancelEditing() {
    this._isEditing = false;
  }

  private _updateScene() {
    this.dispatchEvent(new CustomEvent('update-scene', {
      detail: {
        description: this._editDescription
      },
      bubbles: true,
      composed: true
    }));
    this._isEditing = false;
  }

  private _handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  private async _handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        await this._uploadImage(file);
      }
    }
  }

  private async _uploadImage(file: File) {
    if (!this.sessionId) {
      console.error('No session ID available for upload');
      alert('Cannot upload: Session ID missing');
      return;
    }

    const formData = new FormData();
    formData.append('sessionId', this.sessionId);
    formData.append('image', file);

    try {
      const response = await fetch(`/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        // Insert markdown at cursor position or append
        const markdown = `\n![Image](${data.url})\n`;

        // Simple append if textarea reference isn't handy, but we can query it
        const textarea = this.shadowRoot?.querySelector('textarea');
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = this._editDescription;
          this._editDescription = text.substring(0, start) + markdown + text.substring(end);
          this.requestUpdate(); // Force re-render to update textarea value
        } else {
          this._editDescription += markdown;
        }
      } else {
        console.error('Upload failed');
        alert('Failed to upload image');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Error uploading image');
    }
  }

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
            <div style="display: flex; gap: 1rem; align-items: center;">
                <round-selector
                    .currentRound="${this.currentRound}"
                    .viewingRound="${this.viewingRound}"
                ></round-selector>

                ${this.isDirector && this.viewingRound === this.currentRound && !this.isEnded ? html`
                    ${!this.isRoundActive ? html`
                        <button @click="${this._startRound}" style="background-color: #3b82f6; border: none; padding: 0.25rem 0.75rem; font-size: 0.875rem;">Start Round</button>
                    ` : html`
                         <button @click="${this._triggerNextRound}" style="background-color: #fbbf24; color: #1f2937; border: none; padding: 0.25rem 0.75rem; font-size: 0.875rem;">Next Round</button>
                    `}
                    ${!this._isEditing ? html`
                        <button @click="${this._startEditing}" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">Edit Scene</button>
                    ` : ''}
                ` : ''}
                ${this.isEnded ? html`<span style="color: #ef4444; font-weight: bold; margin-left: 1rem;">(GAME ENDED)</span>` : ''}
            </div>
        </div>

        ${this._isEditing && this.viewingRound === this.currentRound ? html`
            <div 
                class="edit-form" 
                @dragover="${this._handleDragOver}" 
                @drop="${this._handleDrop}"
            >
                <div class="form-group">
                    <label>Scene Description (Drag & Drop images here)</label>
                    <textarea
                        .value="${this._editDescription}"
                        @input="${(e: Event) => this._editDescription = (e.target as HTMLTextAreaElement).value}"
                        placeholder="Describe the scene..."
                    ></textarea>
                </div>

                <div class="button-row">
                    <button @click="${this._updateScene}" style="background-color: #10b981; border: none;">Save Changes</button>
                    <button @click="${this._cancelEditing}">Cancel</button>
                </div>
            </div>
        ` : ''}

        ${!this._isEditing ? html`

            <div class="description">
            ${displayScene?.description
          ? unsafeHTML(marked.parse(displayScene.description) as string) // Changed to support Markdown
          : html`<span class="placeholder">Waiting for the director to set the scene...</span>`
        }

            ${privateMessages.length > 0 ? html`
                ${privateMessages.map(msg => html`
                  <div class="private-message">
                    ${this.isDirector ? html`<div class="info">Secret for ${this.players.find(p => p.id === msg.recipientId)?.name || 'Unknown'}</div>` : ''}
                    <div class="content">${msg.content}</div>
                  </div>
                `)}
            ` : ''}

            ${this.messages.filter(m =>
          m.round === this.viewingRound &&
          m.isAction &&
          (this.isDirector || m.senderId === this.currentUserId)
        ).map(actionMsg => html`
                <div style="margin-top: 1rem; padding: 0.5rem; background: #374151; border-radius: 0.25rem; border-left: 3px solid #fbbf24;">
                     <div style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 0.25rem; font-weight: bold;">
                        ${actionMsg.senderId === this.currentUserId ? 'YOUR ACTION' : `ACTION: ${actionMsg.senderName}`}
                     </div>
                     <div style="color: #e5e7eb; font-style: italic;">
                        "${actionMsg.content}"
                     </div>
                </div>
            `)}


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
                        <div class="message ${msg.senderId === this.currentUserId ? 'own' : msg.senderId === this.directorId ? 'director' : 'other'}">
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
                
                ${this.viewingRound === this.currentRound && this.canChat && !this.isEnded ? html`
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
        
      </div>
    `;
  }
}

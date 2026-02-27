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
  @property({ type: String }) llmError = '';
  @property({ type: String }) gameSummary = '';
  @property({ type: Boolean }) showSummaryModal = false;

  @state() private _isEditing = false;
  @state() private _isDragging = false;
  private _editDescription = '';
  @state() private _isEditingSummary = false;
  @state() private _editSummaryValue = '';

  @state() private _chatInputValue = '';
  @state() private _showImageModal = false;
  @state() private _availableImages: string[] = [];

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
      font-family: "Gentium Book Plus", serif;
    }

    /* Animation for loading */
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .generating {
      animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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

    p { 
      text-indent: 30px;
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

    .scene-scroll {
      overflow-y: auto;
      max-height: 65vh;
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
      transform: translate(-30px, 0px); /*avoids indenting image*/        
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
      transition: background-color 0.2s, border-color 0.2s;
      border: 2px dashed transparent; 
    }

    .edit-form.dragging {
      background-color: rgba(59, 130, 246, 0.1);
      border-color: #3b82f6; 
      border-style: dashed;
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
      font-size: 1.125rem;
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
      display: flex;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .message.own {
      align-self: flex-end;
      color: white;
      flex-direction: row-reverse;
    }
    
    .message.own .message-sender {
        color: #e0e7ff;
        text-align: right;
    }

    .message.other {
      align-self: flex-start;
      color: #aaa;
    }

    .message.director {
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

    /* MODAL STYLES */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.75);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: #1f2937;
        border-radius: 0.5rem;
        width: 80%;
        max-width: 800px;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        border: 1px solid #4b5563;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .modal-header {
        padding: 1rem;
        border-bottom: 1px solid #4b5563;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-header h3 {
        margin: 0;
        color: #e5e7eb;
    }

    .modal-close {
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        font-size: 1.5rem;
    }

    .modal-close:hover {
        color: white;
    }

    .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
        padding: 1rem;
        overflow-y: auto;
    }

    .gallery-item {
        cursor: pointer;
        border: 2px solid transparent;
        border-radius: 0.25rem;
        overflow: hidden;
        transition: all 0.2s;
        aspect-ratio: 1;
        position: relative;
    }

    .gallery-item:hover {
        border-color: #3b82f6;
        transform: scale(1.05);
    }

    .gallery-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .gallery-item-name {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.7);
        color: white;
        font-size: 0.75rem;
        padding: 0.25rem;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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

  private _handleDragEnter(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this._isDragging = true;
    console.log('Drag entering zone');
  }

  private _handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we are leaving the main container, not entering a child
    if ((e.relatedTarget as Node) === null || !this.shadowRoot?.contains(e.relatedTarget as Node)) {
      // Simple logic for now, usually checking contains is safer but dragleave relates to the element itself
      // Actually, if we use a specific overlay div it is easier. 
      // For now let's just use a timeout or check coordinates? 
      // Simplest: just set false. If we re-enter child, dragOver sets correct cursor but maybe not state?
      // DragOver fires continuously.
      this._isDragging = false;
      console.log('Drag leaving zone');
    }
  }

  private _handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!this._isDragging) this._isDragging = true;
    // Essential for allowing drop
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }

  private async _handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this._isDragging = false;
    console.log('Drop detected', e.dataTransfer);

    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      console.log('File dropped:', file.type, file.name);
      if (file.type.startsWith('image/')) {
        await this._uploadImage(file);
      } else {
        alert('Please drop an image file.');
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

  private async _openImageGallery() {
    try {
      const response = await fetch('/api/images');
      if (response.ok) {
        this._availableImages = await response.json();
        this._showImageModal = true;
      } else {
        console.error('Failed to fetch images');
      }
    } catch (e) {
      console.error('Error fetching images:', e);
    }
  }

  private _closeImageGallery() {
    this._showImageModal = false;
  }

  private _insertGalleryImage(imageName: string) {
    const markdown = `\n![${imageName}](/data/images/${imageName})\n`;

    const textarea = this.shadowRoot?.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = this._editDescription;
      this._editDescription = text.substring(0, start) + markdown + text.substring(end);
      this.requestUpdate();
    } else {
      this._editDescription += markdown;
    }

    this._closeImageGallery();
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
    if (changedProperties.has('scene') || changedProperties.has('isDirector') || changedProperties.has('llmError')) {
      // Auto-edit removed per user request
    }
  }

  private _handleShowPlotSummary() {
    this._isEditingSummary = false;
    this._editSummaryValue = this.gameSummary || '';
  }

  private _startEditingSummary() {
    this._isEditingSummary = true;
    this._editSummaryValue = this.gameSummary || '';
  }

  private _saveSummary() {
    this.dispatchEvent(new CustomEvent('update-game-summary', {
      detail: { summary: this._editSummaryValue },
      bubbles: true,
      composed: true
    }));
    this._isEditingSummary = false;
  }

  private _cancelEditSummary() {
    this._isEditingSummary = false;
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

                    ${this.isDirector && !this._isEditing ? html`
                        <button @click="${this._startEditing}" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">Edit Scene</button>
                    ` : ''}
                </div>
                ${this.isEnded ? html`<span style="color: #ef4444; font-weight: bold; margin-left: 1rem;">(GAME ENDED)</span>` : ''}
            </div>
            ${this.llmError ? html`
              <div style="padding: 0.5rem 1rem; background-color: rgba(239, 68, 68, 0.1); border-bottom: 1px solid rgba(239, 68, 68, 0.2); color: #fca5a5; font-size: 0.875rem; display: flex; justify-content: space-between; align-items: center;">
                <span><strong>LLM Error:</strong> ${this.llmError}</span>
                <button @click="${() => this.llmError = ''}" style="background: none; border: none; padding: 0.25rem; font-size: 1rem; line-height: 1;">&times;</button>
              </div>
            ` : ''}

        ${this._isEditing && this.viewingRound === this.currentRound ? html`
            <div 
                class="edit-form ${this._isDragging ? 'dragging' : ''}" 
                @dragenter="${this._handleDragEnter}"
                @dragleave="${this._handleDragLeave}"
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

                <div class="form-group">
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <button @click="${(e: Event) => { e.preventDefault(); this._openImageGallery(); }}" style="background-color: #3b82f6; font-size: 0.875rem;">
                            Insert Image from Gallery
                        </button>
                    </div>
                </div>

                <div class="button-row">
                    <button @click="${this._updateScene}" style="background-color: #10b981; border: none;">Save Changes</button>
                    <button @click="${this._cancelEditing}">Cancel</button>
                </div>
            </div>
        ` : ''
      }

        ${!this._isEditing || this.viewingRound < this.currentRound ? html`
          <div class='scene-scroll'>

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
                    ${roundMessages.map(msg => {
          const player = this.players.find(p => p.id === msg.senderId);
          const avatarIdx = player?.avatarIndex !== undefined ? player.avatarIndex : 0;
          const col = avatarIdx % 8;
          const row = Math.floor(avatarIdx / 8);
          const xOffset = -(col * 32);
          const yOffset = -(row * 32);

          return html`
                        <div class="message ${msg.senderId === this.currentUserId ? 'own' : ''} ${msg.senderId === this.directorId ? 'director' : 'other'}">
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
                            placeholder="..."
                        />
                        <button @click="${this._sendChatMessage}">Speak</button>
                    </div>
                ` : ''}
            </div>
            </div>

        ` : ''
      }
        
        ${this._showImageModal ? html`
            <div class="modal-overlay" @click="${this._closeImageGallery}">
                <div class="modal-content" @click="${(e: Event) => e.stopPropagation()}">
                    <div class="modal-header">
                        <h3>Select Image</h3>
                        <button class="modal-close" @click="${this._closeImageGallery}">&times;</button>
                    </div>
                    <div class="image-grid">
                        ${this._availableImages.map(img => html`
                            <div class="gallery-item" @click="${() => this._insertGalleryImage(img)}">
                                <img src="/data/images/${img}" loading="lazy" alt="${img}">
                                <div class="gallery-item-name">${img}</div>
                            </div>
                        `)}
                        ${this._availableImages.length === 0 ? html`
                            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #9ca3af;">
                                No images found in data/images
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        ` : ''
      }

<!-- Plot Summary Modal -->
  ${this.showSummaryModal ? html`
        <div 
            style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100;"
            @click="${() => { this.dispatchEvent(new CustomEvent('close-plot-summary', { bubbles: true, composed: true })); }}"
        >
            <div 
                style="background: #1f2937; padding: 2rem; border-radius: 0.5rem; width: 600px; max-width: 90vw; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); position: relative;"
                @click="${(e: Event) => e.stopPropagation()}"
            >
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid #374151; padding-bottom: 0.5rem;">
                    <h3 style="margin: 0; color: #8b5cf6;">Game Summary</h3>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        ${this.isDirector && !this._isEditingSummary ? html`
                            <button 
                                @click="${this._startEditingSummary}"
                                style="background: #3b82f6; border: none; padding: 0.25rem 0.75rem; border-radius: 0.25rem; font-size: 0.75rem; color: white;"
                            >
                                Edit
                            </button>
                        ` : ''}
                        <button 
                            @click="${() => { this.dispatchEvent(new CustomEvent('close-plot-summary', { bubbles: true, composed: true })); }}"
                            style="background: transparent; border: none; font-size: 1.5rem; line-height: 1; padding: 0; cursor: pointer;"
                        >
                            &times;
                        </button>
                    </div>
                </div>

                <div class="summary-content" style="font-size: 0.95rem; line-height: 1.6; color: #e5e7eb;">
                    ${this._isEditingSummary ? html`
                        <textarea
                            style="width: 100%; min-height: 200px; padding: 0.75rem; border-radius: 0.25rem; border: 1px solid #374151; background: #111827; color: white; font-family: inherit; font-size: 0.95rem; resize: vertical;"
                            .value="${this._editSummaryValue}"
                            @input="${(e: Event) => this._editSummaryValue = (e.target as HTMLTextAreaElement).value}"
                            placeholder="Type the game summary here... (Markdown supported)"
                        ></textarea>
                    ` : html`
                        ${this.gameSummary ? unsafeHTML(marked.parse(this.gameSummary) as string) : html`<p style="font-style: italic; opacity: 0.7;">No summary available yet. It will be generated after the next round.</p>`}
                    `}
                </div>

                <div style="margin-top: 2rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
                    ${this._isEditingSummary ? html`
                        <button 
                            class="btn-primary" 
                            @click="${this._saveSummary}"
                            style="background: #10b981;"
                        >
                            Save Changes
                        </button>
                        <button 
                            style="background: #4b5563; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; color: white; font-weight: bold;"
                            @click="${this._cancelEditSummary}"
                        >
                            Cancel
                        </button>
                    ` : html`
                        <button class="btn-primary" @click="${() => { this.dispatchEvent(new CustomEvent('close-plot-summary', { bubbles: true, composed: true })); }}">Close</button>
                    `}
                </div>
            </div>
        </div>
      ` : ''}

</div>
  `;
  }
}

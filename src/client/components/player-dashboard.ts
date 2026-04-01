import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Round, Message } from '../../shared/types.js';

@customElement('player-dashboard')
export class PlayerDashboard extends LitElement {
  @property({ type: Object }) currentRound: Round | null = null;
  @property({ type: Boolean }) isRoundActive = false;
  @property({ type: Number }) round_number = 0;
  @property({ type: Array }) messages: Message[] = [];
  @property({ type: String }) currentUserId = '';

  @state() private _action = '';

  willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('round_number')) {
      this._action = '';
    }
  }

  static styles = css`
    :host {
      display: block;
      padding-left: 1rem;
      padding-right: 1rem;
      color: white;
    }

    .panel {
      background-color: #1f2937;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    h2 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      font-weight: bold;
    }

    textarea {
      width: 100%;
      padding: 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid #374151;
      background-color: #111827;
      color: white;
      min-height: 100px;
      margin-bottom: 1rem;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: #3b82f6; /* blue-500 */
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-weight: bold;
    }

    button:disabled {
      background-color: #4b5563;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .status-message {
      margin-top: 1rem;
      font-style: italic;
      color: #9ca3af;
    }

    .status-message.waiting {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      min-height: 150px;
    }

    .spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
    
    .submitted-action {
        background-color: #374151;
        padding: 1rem;
        border-radius: 0.25rem;
        margin-top: 1rem;
        border-left: 4px solid #10b981;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  @property({ type: Boolean }) isEnded = false; // NEW

  private _submitAction() {
    if (this._action.trim()) {
      this.dispatchEvent(new CustomEvent('submit-action', {
        detail: { action: this._action },
        bubbles: true,
        composed: true
      }));
    }
  }

  render() {
    // Check if player has already submitted an action for this round from the round character object
    const myChar = this.currentRound?.characters?.find(c => c.playerId === this.currentUserId);
    const submittedActionContent = myChar?.action || '';
    const privateMessage = myChar?.privateMessage || '';

    if (this.isEnded) {
      return html`
          <div class="panel">
            <!--<h2>Your Action</h2>-->
            <div class="status-message" style="color: #ef4444; font-weight: bold;">
                The game has ended. No further actions can be submitted.
            </div>
            ${privateMessage ? html`
              <div style="margin-top: 1rem; padding: 1rem; background-color: rgba(139, 92, 246, 0.1); border-radius: 0.5rem; border: 1px solid #8b5cf6;">
                <div style="font-size: 0.75rem; font-weight: bold; color: #a78bfa; margin-bottom: 0.5rem; text-transform: uppercase;">Direct Message from Director</div>
                <div style="color: #e5e7eb; font-style: italic; line-height: 1.4;">${privateMessage}</div>
              </div>
            ` : ''}
            ${submittedActionContent ? html`
              <div class="submitted-action">
                  <strong>You:</strong> ${submittedActionContent}
              </div>
            ` : ''}
          </div>
        `;
    }

    return html`
      <div class="panel">
        <!--<h2>Your Action</h2>-->
        ${privateMessage ? html`
          <div style="margin-bottom: 1.5rem; padding: 1rem; background-color: rgba(139, 92, 246, 0.1); border-radius: 0.5rem; border: 1px solid #8b5cf6; animation: fadeIn 0.5s ease-out;">
            <div style="font-size: 0.75rem; font-weight: bold; color: #a78bfa; margin-bottom: 0.5rem; text-transform: uppercase;">Direct Message from Director</div>
            <div style="color: #e5e7eb; font-style: italic; line-height: 1.4;">${privateMessage}</div>
          </div>
        ` : ''}
        ${this.isRoundActive ? html`
          ${!submittedActionContent ? html`
            <textarea
              .value="${this._action}"
              @input="${(e: Event) => this._action = (e.target as HTMLTextAreaElement).value}"
              placeholder="What will be your next action?"
            ></textarea>
            <button @click="${this._submitAction}">Submit Action</button>
          ` : html`
            <div class="status-message waiting">
              <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <span>Action submitted. Waiting for next round...</span>
            </div>
            <div class="submitted-action">
                <strong>Your Action:</strong> ${submittedActionContent}
            </div>
          `}
        ` : html`
          <div class="status-message waiting">
            <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            <span>Waiting for the director to start the round...</span>
          </div>
        `}
      </div>
    `;
  }
}

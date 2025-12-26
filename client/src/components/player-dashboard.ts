import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Scene, Message } from '../types';

@customElement('player-dashboard')
export class PlayerDashboard extends LitElement {
  @property({ type: Object }) currentScene: Scene | null = null;
  @property({ type: Boolean }) isRoundActive = false;
  @property({ type: Number }) round = 1;
  @property({ type: Array }) messages: Message[] = [];
  @property({ type: String }) currentUserId = '';

  @state() private _action = '';

  willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('round')) {
      this._action = '';
    }
  }

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
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
    
    .submitted-action {
        background-color: #374151;
        padding: 1rem;
        border-radius: 0.25rem;
        margin-top: 1rem;
        border-left: 4px solid #10b981;
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
    // Check if player has already submitted an action for this round
    const submittedAction = this.messages.find(m =>
      m.isAction &&
      m.senderId === this.currentUserId &&
      m.round === this.round
    );

    if (this.isEnded) {
      return html`
          <div class="panel">
            <h2>Your Action</h2>
            <div class="status-message" style="color: #ef4444; font-weight: bold;">
                The game has ended. No further actions can be submitted.
            </div>
            ${submittedAction ? html`
              <div class="submitted-action">
                  <strong>You:</strong> ${submittedAction.content}
              </div>
            ` : ''}
          </div>
        `;
    }

    return html`
      <div class="panel">
        <h2>Your Action</h2>
        ${this.isRoundActive ? html`
          ${!submittedAction ? html`
            <textarea
              .value="${this._action}"
              @input="${(e: Event) => this._action = (e.target as HTMLTextAreaElement).value}"
              placeholder="What do you want to do?"
            ></textarea>
            <button @click="${this._submitAction}">Submit Action</button>
          ` : html`
            <div class="status-message">Action submitted. Waiting for next round...</div>
            <div class="submitted-action">
                <strong>You:</strong> ${submittedAction.content}
            </div>
          `}
        ` : html`
          <div class="status-message">Waiting for the director to start the round...</div>
          ${submittedAction ? html`
            <div class="submitted-action">
                <strong>You:</strong> ${submittedAction.content}
            </div>
          ` : ''}
        `}
      </div>
    `;
  }
}

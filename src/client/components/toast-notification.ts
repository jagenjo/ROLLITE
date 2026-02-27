import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('toast-notification')
export class ToastNotification extends LitElement {
    @property({ type: String }) message = '';
    @property({ type: String }) type: 'info' | 'success' | 'error' = 'info';
    @property({ type: Number }) duration = 3000;

    static styles = css`
    :host {
      display: block;
      margin-top: 0.5rem;
      pointer-events: auto;
    }

    .toast {
      padding: 0.75rem 1rem;
      border-radius: 0.375rem;
      background-color: #1f2937;
      color: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-left: 4px solid #3b82f6;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: slideIn 0.3s ease-out forwards;
      min-width: 200px;
      max-width: 400px;
    }

    .toast.success {
      border-left-color: #10b981;
    }

    .toast.error {
      border-left-color: #ef4444;
    }

    .message {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    :host(.fade-out) {
        animation: fadeOut 0.3s ease-in forwards;
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
  `;

    connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            this.classList.add('fade-out');
            setTimeout(() => {
                this.dispatchEvent(new CustomEvent('notification-closed', { bubbles: true, composed: true }));
            }, 300);
        }, this.duration);
    }

    render() {
        return html`
      <div class="toast ${this.type}">
        <div class="message">${this.message}</div>
      </div>
    `;
    }
}

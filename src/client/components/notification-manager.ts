import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './toast-notification.js';

interface NotificationItem {
    id: string;
    message: string;
    type: 'info' | 'success' | 'error';
}

@customElement('notification-manager')
export class NotificationManager extends LitElement {
    @state() private notifications: NotificationItem[] = [];

    static styles = css`
    :host {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      pointer-events: none;
    }
  `;

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('show-notification', this._handleNotificationRequest as EventListener);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('show-notification', this._handleNotificationRequest as EventListener);
    }

    private _handleNotificationRequest = (e: CustomEvent) => {
        const { message, type = 'info' } = e.detail;
        const id = Math.random().toString(36).substring(7);
        this.notifications = [...this.notifications, { id, message, type }];
    };

    private _removeNotification(id: string) {
        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    render() {
        return html`
      ${this.notifications.map(n => html`
        <toast-notification 
            .message="${n.message}" 
            .type="${n.type}"
            @notification-closed="${() => this._removeNotification(n.id)}"
        ></toast-notification>
      `)}
    `;
    }
}

// Global helper for dispatching notifications
export const showNotification = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    window.dispatchEvent(new CustomEvent('show-notification', {
        detail: { message, type }
    }));
};

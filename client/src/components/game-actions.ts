import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('game-actions')
export class GameActions extends LitElement {
    @property({ type: Boolean }) isEnded = false;
    @state() private _isOpen = false;

    private _toggleMenu() {
        this._isOpen = !this._isOpen;
    }

    private _closeMenu() {
        this._isOpen = false;
    }

    private _handleSave() {
        this.dispatchEvent(new CustomEvent('save-session', {
            bubbles: true,
            composed: true
        }));
        this._closeMenu();
    }

    private _handleDownload() {
        this.dispatchEvent(new CustomEvent('download-session', {
            bubbles: true,
            composed: true
        }));
        this._closeMenu();
    }

    private _handleEnd() {
        if (confirm('Are you sure you want to END the game? This will disable player interactions.')) {
            this.dispatchEvent(new CustomEvent('end-session', {
                bubbles: true,
                composed: true
            }));
        }
        this._closeMenu();
    }

    render() {
        return html`
            <div class="menu-container">
                <button class="menu-btn" @click="${this._toggleMenu}" title="Game Actions">⋮</button>
                
                ${this._isOpen ? html`
                    <div class="menu-overlay" @click="${this._closeMenu}"></div>
                    <div class="dropdown-menu">
                        <button @click="${this._handleSave}">Save to Server</button>
                        <button @click="${this._handleDownload}">Download JSON</button>
                        ${!this.isEnded ? html`
                            <button class="delete-btn" @click="${this._handleEnd}">End Game</button>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }

    static styles = css`
        :host {
            display: block;
            font-family: 'Inter', sans-serif;
        }

        .menu-container {
            position: relative;
        }

        .menu-btn {
            background: none;
            border: none;
            color: #d1d5db;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0 0.5rem;
            line-height: 1;
            transition: color 0.2s;
        }

        .menu-btn:hover {
            color: #3b82f6;
        }

        .dropdown-menu {
            position: absolute;
            right: 0;
            top: 120%; /* Slight offset from button */
            background-color: #374151;
            border: 1px solid #4b5563;
            border-radius: 0.375rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 50;
            min-width: 160px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .dropdown-menu button {
            background: none;
            border: none;
            color: white;
            padding: 0.75rem 1rem;
            text-align: left;
            cursor: pointer;
            font-size: 0.875rem;
            font-family: inherit;
            transition: background-color 0.1s;
            white-space: nowrap;
        }

        .dropdown-menu button:hover {
            background-color: #4b5563;
        }

        .dropdown-menu button.delete-btn {
            color: #ef4444;
            border-top: 1px solid #4b5563;
        }

        .dropdown-menu button.delete-btn:hover {
            background-color: #fee2e2;
            color: #dc2626;
        }

        .menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 40;
            cursor: default;
        }
    `;
}

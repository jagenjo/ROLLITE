
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Player, Badge } from '../../shared/types.js';
import './avatar-selector';

@customElement('character-sheet')
export class CharacterSheet extends LitElement {
    @property({ type: Object }) player: Player | null = null;
    @property({ type: Boolean }) isDirector = false;
    @property({ type: Boolean }) isOpen = false;
    @property({ type: Array }) badges: Badge[] = [];
    @property({ type: String }) statusText = ''; // Current status (from scene)
    @property({ type: String }) background = ''; // Character background
    @property({ type: String }) sessionId = '';

    private async _copyInviteLink() {
        if (!this.sessionId || !this.player) return;
        const url = `${window.location.origin}/?session=${this.sessionId}&player=${this.player.id}`;
        try {
            await navigator.clipboard.writeText(url);
            alert('Invite link copied!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            prompt('Copy this link:', url);
        }
    }

    @state() private _showAvatarSelector = false;
    @state() private _isEditingName = false;
    @state() private _newBadgeName = '';

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
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            backdrop-filter: blur(2px);
        }

        .sheet-container {
            background: #1f2937;
            color: white;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            border-radius: 0.75rem;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid #374151;
        }

        .header {
            background: #111827;
            padding: 0.75rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #374151;
        }

        .close-btn {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 1.5rem;
            line-height: 1;
        }
        .close-btn:hover { color: white; }

        .content {
            padding: 1.5rem;
            overflow-y: auto;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .profile-header {
            display: flex;
            gap: 1.5rem;
            align-items: flex-start;
        }

        .avatar-wrapper {
            position: relative;
            cursor: pointer;
            width: 120px;
            height: 120px;
            flex-shrink: 0;
        }

        .avatar-container {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
            border: 4px solid #374151;
            background: #000;
        }

        .avatar-image {
            width: 960px; /* 8 * 120px */
            image-rendering: pixelated;
        }

        .edit-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .avatar-wrapper:hover .edit-overlay { opacity: 1; }

        .info-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .name-display {
            font-size: 1.5rem;
            font-weight: bold;
        }

        input.edit-input, textarea.edit-input {
            background: #374151;
            border: 1px solid #4b5563;
            color: white;
            padding: 0.5rem;
            border-radius: 0.25rem;
            width: 100%;
            box-sizing: border-box;
            font-family: inherit;
        }

        textarea.edit-input {
            min-height: 100px;
            resize: vertical;
        }

        .section-title {
            font-size: 0.9rem;
            text-transform: uppercase;
            color: #9ca3af;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
            border-bottom: 1px solid #374151;
            padding-bottom: 0.25rem;
        }

        .badges-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .badge {
            background: #374151;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .badge.hidden {
            border: 1px dashed #fbbf24;
            color: #fbbf24;
        }
        
        .remove-badge {
            color: #f87171;
            cursor: pointer;
            font-weight: bold;
        }
        .remove-badge:hover { color: #ef4444; }

        .btn {
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            border: none;
            cursor: pointer;
            font-weight: bold;
        }
        .btn-primary { background: #3b82f6; color: white; }
        .btn-primary:hover { background: #2563eb; }

        .add-badge-container {
            margin-top: 0.5rem;
            display: flex;
            gap: 0.5rem;
        }

        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #1f2937;
        }
        ::-webkit-scrollbar-thumb {
            background: #4b5563;
            border-radius: 4px;
        }
    `;

    // ...

    private _addBadge() {
        if (this.player && this._newBadgeName.trim()) {
            const name = this._newBadgeName.trim();
            const hidden = name.startsWith('_');
            this.dispatchEvent(new CustomEvent('add-badge', {
                detail: {
                    playerId: this.player.id,
                    badge: name,
                    hidden: hidden
                },
                bubbles: true,
                composed: true
            }));
            this._newBadgeName = '';
        }
    }

    private _close() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    private _handleBackdropClick(e: MouseEvent) {
        if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
            this._close();
        }
    }

    private _handleAvatarClick() {
        if (this.isDirector) {
            this._showAvatarSelector = true;
        }
    }

    private _onAvatarSelected(e: CustomEvent) {
        if (this.player) {
            this.dispatchEvent(new CustomEvent('update-player-avatar', {
                detail: { playerId: this.player.id, avatarIndex: e.detail.index },
                bubbles: true,
                composed: true
            }));
        }
        this._showAvatarSelector = false;
    }

    private _removeBadge(index: number) {
        if (this.player) {
            this.dispatchEvent(new CustomEvent('remove-badge', {
                detail: { playerId: this.player.id, index },
                bubbles: true,
                composed: true
            }));
        }
    }

    private _saveName(e: Event) {
        const input = e.target as HTMLInputElement;
        const newName = input.value.trim();
        if (this.player && newName && newName !== this.player.name) {
            this.dispatchEvent(new CustomEvent('update-player-name', {
                detail: { playerId: this.player.id, name: newName },
                bubbles: true,
                composed: true
            }));
        }
        this._isEditingName = false;
    }

    private _handleNameClick() {
        if (this.isDirector) {
            this._isEditingName = true;
            // Focus next frame
            setTimeout(() => {
                const input = this.shadowRoot?.querySelector('.name-edit-input') as HTMLInputElement;
                if (input) input.focus();
            }, 0);
        }
    }

    render() {
        if (!this.isOpen || !this.player) return null;

        const avatarIdx = this.player.avatarIndex || 0;

        // Filter badges: remove invisible ones (starting with _) unless director
        const visibleBadges = this.isDirector
            ? this.badges
            : this.badges.filter(b => !b.name.startsWith('_'));

        return html`
            <div class="modal-overlay" @click="${this._handleBackdropClick}">
                <div class="sheet-container">
                    <div class="header">
                        <div style="font-size: 1.5rem; font-weight: bold;">Character Sheet</div>
                        <button class="close-btn" @click="${this._close}">&times;</button>
                    </div>

                    <div class="content">

                        <div class="profile-header">
                            <div class="avatar-wrapper" @click="${this._handleAvatarClick}" title="${this.isDirector ? 'Click to change avatar' : ''}">
                                <div class="avatar-container">
                                    <img 
                                        src="/characters.jpg"
                                        class="avatar-image"
                                        style="transform: translate(-${(avatarIdx % 8) * 120}px, -${Math.floor(avatarIdx / 8) * 120}px);"
                                    >
                                </div>
                                ${this.isDirector ? html`<div class="edit-overlay">✎</div>` : ''}
                            </div>

                            <div class="info-section">
                                ${this._isEditingName
                ? html`
                                        <input 
                                            class="name-edit-input"
                                            style="font-size: 1.5rem; font-weight: bold; background: #374151; color: white; border: 1px solid #4b5563; padding: 0.25rem; width: 100%; box-sizing: border-box; border-radius: 0.25rem;"
                                            .value="${this.player.name}"
                                            @blur="${this._saveName}"
                                            @keydown="${(e: KeyboardEvent) => e.key === 'Enter' && this._saveName(e)}"
                                        />
                                    `
                : html`
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <div class="name-display" @click="${this._handleNameClick}" style="${this.isDirector ? 'cursor: pointer; border: 1px dashed transparent; transition: border-color 0.2s;' : ''}" title="${this.isDirector ? 'Click to edit name' : ''}">
                                                ${this.player.name} ${this.isDirector ? '✎' : ''}
                                            </div>
                                            ${this.isDirector ? html`
                                                <button 
                                                    class="btn"
                                                    style="padding: 0.25rem; background: transparent; color: #3b82f6; border: 1px solid #3b82f6;"
                                                    @click="${this._copyInviteLink}"
                                                    title="Copy Invite Link"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                    </svg>
                                                </button>
                                            ` : ''}
                                        </div>
                                    `
            }

                                <!-- Status Section -->
                                <div style="margin-top: 0.5rem;">
                                    ${this.isDirector ? html`
                                        <input 
                                            class="edit-input" 
                                            .value="${this.statusText}"
                                            @change="${(e: Event) => this.dispatchEvent(new CustomEvent('update-player-status', { detail: { playerId: this.player!.id, status: (e.target as HTMLInputElement).value }, bubbles: true, composed: true }))}"
                                            placeholder="Current status..."
                                        >
                                    ` : html`
                                        <div style="font-style: italic; color: #fbbf24;">${this.statusText || html`<span style="color: #6b7280; font-size: 0.9rem;">No status set</span>`}</div>
                                    `}
                                </div>
                            </div>
                        </div>

                        <!-- Badges Section -->
                        <div>
                            <div class="badges-list">
                                ${visibleBadges.map((b, idx) => html`
                                    <div class="badge ${b.hidden ? 'hidden' : ''}">
                                        ${b.name}
                                        ${this.isDirector ? html`
                                            <span class="remove-badge" @click="${() => this._removeBadge(idx)}">&times;</span>
                                        ` : ''}
                                    </div>
                                `)}
                                ${visibleBadges.length === 0 ? html`<span style="color: #6b7280; font-size: 0.9rem;">No badges</span>` : ''}
                            </div>
                            
                            ${this.isDirector ? html`
                                <div class="add-badge-container">
                                    <input 
                                        class="edit-input" 
                                        placeholder="Add badge... (_ for hidden)"
                                        .value="${this._newBadgeName}"
                                        @input="${(e: Event) => this._newBadgeName = (e.target as HTMLInputElement).value}"
                                        @keydown="${(e: KeyboardEvent) => e.key === 'Enter' && this._addBadge()}"
                                    >
                                    <button class="btn btn-primary" @click="${this._addBadge}">Add</button>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Background Section -->
                        <div style="flex: 1; display: flex; flex-direction: column;">
                            <div class="section-title">Background</div>
                            ${this.isDirector ? html`
                                <textarea 
                                    class="edit-input" 
                                    style="flex: 1;"
                                    .value="${this.player.background || ''}"
                                    @change="${(e: Event) => this.dispatchEvent(new CustomEvent('update-player-background', { detail: { playerId: this.player!.id, background: (e.target as HTMLTextAreaElement).value }, bubbles: true, composed: true }))}"
                                    placeholder="Write character background here..."
                                ></textarea>
                            ` : html`
                                <div style="text-align: left; line-height: 1.5; color: #d1d5db;">
                                    ${this.player.background || html`<span style="color: #6b7280; font-size: 0.9rem;">No background information available.</span>`}
                                </div>
                            `}
                        </div>

                    </div>
                </div>
            </div>
        ${this._showAvatarSelector ? html`
             <avatar-selector
                .selectedAvatarIndex="${this.player.avatarIndex || 0}"
                @close="${() => this._showAvatarSelector = false}"
                @avatar-selected="${this._onAvatarSelected}"
            ></avatar-selector>
        ` : ''
            }
        `;
    }
}


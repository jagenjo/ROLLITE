import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('round-selector')
export class RoundSelector extends LitElement {
    @property({ type: Number }) currentRound = 1;
    @property({ type: Number }) viewingRound = 1;

    static styles = css`
        :host {
            display: inline-block;
        }

        .container {
            display: flex;
            align-items: center;
            background-color: #1f2937;
            border-radius: 9999px; /* Pill shape */
            padding: 0.125rem;
            border: 1px solid #4b5563;
        }

        button {
            background: transparent;
            border: none;
            color: #d1d5db;
            cursor: pointer;
            padding: 0.25rem 0.6rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            transition: all 0.2s;
            font-size: 0.875rem;
        }

        button:hover:not(:disabled) {
            background-color: #374151;
            color: white;
        }

        button:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .label {
            padding: 0 0.75rem;
            color: #e5e7eb;
            font-weight: bold;
            font-size: 0.875rem;
            white-space: nowrap;
            user-select: none;
        }

        .highlight {
            color: #fbbf24; /* amber-400 */
        }
    `;

    private _prev() {
        if (this.viewingRound > 1) {
            this.dispatchEvent(new CustomEvent('view-round-change', {
                detail: { round: this.viewingRound - 1 },
                bubbles: true,
                composed: true
            }));
        }
    }

    private _next() {
        if (this.viewingRound < this.currentRound) {
            this.dispatchEvent(new CustomEvent('view-round-change', {
                detail: { round: this.viewingRound + 1 },
                bubbles: true,
                composed: true
            }));
        }
    }

    render() {
        return html`
            <div class="container">
                <button 
                    @click="${this._prev}" 
                    ?disabled="${this.viewingRound <= 1}"
                    title="Previous Round"
                >
                    ❮
                </button>
                
                <div class="label">
                    Round 
                    <span class="${this.viewingRound !== this.currentRound ? 'highlight' : ''}">
                        ${this.viewingRound}
                    </span>
                    <span style="color: #6b7280; font-weight: normal; margin-left: 2px;">/ ${this.currentRound}</span>
                </div>

                <button 
                    @click="${this._next}" 
                    ?disabled="${this.viewingRound >= this.currentRound}"
                    title="Next Round"
                >
                    ❯
                </button>
            </div>
        `;
    }
}

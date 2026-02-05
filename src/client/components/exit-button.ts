import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('exit-button')
export class ExitButton extends LitElement {
    static styles = css`
    button {
      background-color: #ef4444;
      color: white;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      border-radius: 0.25rem;
      border: none;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.2s;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    button:hover {
      background-color: #dc2626;
    }
  `;

    private _handleClick() {
        this.dispatchEvent(new CustomEvent('exit-game', {
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
      <button @click="${this._handleClick}" title="Exit Game">
        Exit
      </button>
    `;
    }
}

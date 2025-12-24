import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { SessionSummary } from '../types';

@customElement('admin-dashboard')
export class AdminDashboard extends LitElement {
  @property({ type: Array }) stats: SessionSummary[] = [];

  @state() private _openMenuSessionId: string | null = null;

  private _toggleMenu(sessionId: string) {
    if (this._openMenuSessionId === sessionId) {
      this._openMenuSessionId = null;
    } else {
      this._openMenuSessionId = sessionId;
    }
    this.requestUpdate();
  }

  private _enterAsDirector(session: any) {
    if (session.directorId) {
      window.open(`/?session=${session.sessionId}&player=${session.directorId}`, '_blank');
    } else {
      alert('Director ID not available');
    }
    this._openMenuSessionId = null;
    this.requestUpdate();
  }

  private _saveSession(sessionId: string) {
    this.dispatchEvent(new CustomEvent('save-session', {
      detail: { sessionId },
      bubbles: true,
      composed: true
    }));
    this._openMenuSessionId = null;
    this.requestUpdate();
  }

  private _endSession(sessionId: string) {
    if (confirm('Are you sure you want to END this session?')) {
      this.dispatchEvent(new CustomEvent('end-session', {
        detail: { sessionId },
        bubbles: true,
        composed: true
      }));
    }
    this._openMenuSessionId = null;
    this.requestUpdate();
  }

  private _deleteSession(sessionId: string) {
    if (confirm('Are you sure you want to DELETE this session? This cannot be undone.')) {
      this.dispatchEvent(new CustomEvent('delete-session', {
        detail: { sessionId },
        bubbles: true,
        composed: true
      }));
    }
    this._openMenuSessionId = null;
    this.requestUpdate();
  }

  private _spectate(sessionId: string) {
    window.open(`/?session=${sessionId}&spectator=true`, '_blank');
  }

  render() {
    return html`
          <div class="admin-dashboard">
              <div class="header">
                  <h2>System Admin Dashboard</h2>
                  <button class="refresh-btn" @click="${() => this.dispatchEvent(new CustomEvent('refresh-stats'))}">
                      Refresh Stats
                  </button>
              </div>

              <div class="stats-table">
                  <table>
                      <thead>
                          <tr>
                              <th>Session ID</th>
                              <th>Game Name</th>
                              <th>Round</th>
                              <th>Total Players</th>
                              <th>Online</th>
                              <th>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${this.stats.map(session => html`
                              <tr class="${session.isEnded ? 'ended-session' : ''}">
                                  <td>${session.sessionId}</td>
                                  <td>${session.gameName}</td>
                                  <td>${session.round}</td>
                                  <td>${session.playerCount}</td>
                                  <td>${session.onlineCount}</td>
                                  <td class="last-col">
                                      <button class="spectate-btn" @click="${() => this._spectate(session.sessionId)}">Spectate</button>
                                      
                                      <div class="menu-container">
                                          <button class="menu-btn" @click="${() => this._toggleMenu(session.sessionId)}">⋮</button>
                                          ${this._openMenuSessionId === session.sessionId ? html`
                                              <div class="dropdown-menu">
                                                  <button @click="${() => this._enterAsDirector(session)}">Enter as Director</button>
                                                  <button @click="${() => this._saveSession(session.sessionId)}">Save Game</button>
                                                  <button @click="${() => this._endSession(session.sessionId)}">End Game</button>
                                                  <button class="delete-btn" @click="${() => this._deleteSession(session.sessionId)}">Delete Game</button>
                                              </div>
                                              <div class="menu-overlay" @click="${() => this._toggleMenu(session.sessionId)}"></div>
                                          ` : ''}
                                      </div>
                                  </td>
                              </tr>
                          `)}
                      </tbody>
                  </table>
                  ${this.stats.length === 0 ? html`<p style="text-align: center; color: #9ca3af; padding: 2rem;">No active sessions found.</p>` : ''}
              </div>
          </div>
      `;
  }

  static styles = css`
      .admin-dashboard {
          color: white;
          font-family: 'Inter', sans-serif;
      }
      .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
      }
      h2 { margin: 0; color: #3b82f6; }
      .refresh-btn {
          background-color: #374151;
          color: white;
          border: 1px solid #4b5563;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
      }
      .refresh-btn:hover { background-color: #4b5563; }
      
      .stats-table {
          background-color: #1f2937;
          border-radius: 0.5rem;
          /* overflow: hidden; Removed to allow dropdown menu to overflow */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      table {
          width: 100%;
          border-collapse: collapse;
      }
      th {
          background-color: #374151;
          text-align: left;
          padding: 1rem;
          font-weight: 600;
          color: #d1d5db;
      }
      td {
          padding: 1rem;
          border-bottom: 1px solid #374151;
          color: #e5e7eb;
      }
      tr.ended-session td {
          color: #9ca3af;
          background-color: #2d313a;
      }
      tr:last-child td { border-bottom: none; }
      
      .last-col {
          display: flex;
          align-items: center;
          gap: 0.5rem;
      }

      .spectate-btn {
          background-color: #eab308; /* yellow-500 */
          color: white;
          border: none;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
      }
      .spectate-btn:hover { background-color: #ca8a04; }

      .menu-container {
          position: relative;
      }
      .menu-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0 0.5rem;
          line-height: 1;
      }
      .menu-btn:hover { color: #3b82f6; }

      .dropdown-menu {
          position: absolute;
          right: 0;
          top: 100%;
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
          transition: background-color 0.1s;
          white-space: nowrap;
      }
      .dropdown-menu button:hover { background-color: #4b5563; }
      .dropdown-menu button.delete-btn { color: #ef4444; }
      .dropdown-menu button.delete-btn:hover { background-color: #fee2e2; color: #dc2626; }

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

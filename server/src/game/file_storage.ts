import fs from 'fs';
import path from 'path';

export class FileStorage {
    private dataDir: string;
    private gamesDir: string;
    private indexFile: string;

    constructor() {
        // Use a persistent location. In a real deployment this might be strictly defined,
        // but for this setup we'll use a 'data' folder in the project root.
        this.dataDir = path.resolve(__dirname, '../../../data');
        this.gamesDir = path.join(this.dataDir, 'games');
        this.indexFile = path.join(this.gamesDir, 'games.json');

        this.ensureDirectories();
    }

    private ensureDirectories() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir);
        }
        if (!fs.existsSync(this.gamesDir)) {
            fs.mkdirSync(this.gamesDir);
        }
    }

    saveGame(gameId: string, state: any) {
        const filePath = path.join(this.gamesDir, `${gameId}.json`);
        try {
            fs.writeFileSync(filePath, JSON.stringify(state, null, 2));
            console.log(`Saved game ${gameId} to ${filePath}`);
        } catch (error) {
            console.error(`Failed to save game ${gameId}:`, error);
        }
    }

    loadGame(gameId: string): any | null {
        const filePath = path.join(this.gamesDir, `${gameId}.json`);
        if (!fs.existsSync(filePath)) {
            return null;
        }
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Failed to load game ${gameId}:`, error);
            return null;
        }
    }

    saveGameIndex(index: any) {
        try {
            fs.writeFileSync(this.indexFile, JSON.stringify(index, null, 2));
            console.log(`Saved game index to ${this.indexFile}`);
        } catch (error) {
            console.error('Failed to save game index:', error);
        }
    }

    loadGameIndex(): any {
        if (!fs.existsSync(this.indexFile)) {
            return { sessions: [] };
        }
        try {
            const data = fs.readFileSync(this.indexFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Failed to load game index:', error);
            return { sessions: [] };
        }
    }
}

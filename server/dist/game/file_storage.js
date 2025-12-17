"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FileStorage {
    constructor() {
        // Use a persistent location. In a real deployment this might be strictly defined,
        // but for this setup we'll use a 'data' folder in the project root.
        this.dataDir = path_1.default.resolve(__dirname, '../../../data');
        this.gamesDir = path_1.default.join(this.dataDir, 'games');
        this.indexFile = path_1.default.join(this.gamesDir, 'games.json');
        this.ensureDirectories();
    }
    ensureDirectories() {
        if (!fs_1.default.existsSync(this.dataDir)) {
            fs_1.default.mkdirSync(this.dataDir);
        }
        if (!fs_1.default.existsSync(this.gamesDir)) {
            fs_1.default.mkdirSync(this.gamesDir);
        }
    }
    saveGame(gameId, state) {
        const filePath = path_1.default.join(this.gamesDir, `${gameId}.json`);
        try {
            fs_1.default.writeFileSync(filePath, JSON.stringify(state, null, 2));
            console.log(`Saved game ${gameId} to ${filePath}`);
        }
        catch (error) {
            console.error(`Failed to save game ${gameId}:`, error);
        }
    }
    loadGame(gameId) {
        const filePath = path_1.default.join(this.gamesDir, `${gameId}.json`);
        if (!fs_1.default.existsSync(filePath)) {
            return null;
        }
        try {
            const data = fs_1.default.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error(`Failed to load game ${gameId}:`, error);
            return null;
        }
    }
    saveGameIndex(index) {
        try {
            fs_1.default.writeFileSync(this.indexFile, JSON.stringify(index, null, 2));
            console.log(`Saved game index to ${this.indexFile}`);
        }
        catch (error) {
            console.error('Failed to save game index:', error);
        }
    }
    loadGameIndex() {
        if (!fs_1.default.existsSync(this.indexFile)) {
            return { sessions: [] };
        }
        try {
            const data = fs_1.default.readFileSync(this.indexFile, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Failed to load game index:', error);
            return { sessions: [] };
        }
    }
}
exports.FileStorage = FileStorage;

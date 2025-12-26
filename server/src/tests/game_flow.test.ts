
import { GameManager } from '../game/GameManager';
import { FileStorage } from '../game/file_storage';
import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

async function runTests() {
    console.log('Starting Game Flow Tests (using Real Persistence)...');

    // Use proper real FileStorage
    const fileStorage = new FileStorage();
    const gameManager = new GameManager(fileStorage);
    // Wait, GameManager constructor in server.ts is "new GameManager()". 
    // In GameManager.ts: "private sessions...". It doesn't take storage in constructor?
    // Let's check GameManager.ts again.
    // Ah, GameManager methods take storage as arg for save/delete/end.
    // It does NOT take storage in constructor.

    let sessionId: string;
    let directorId: string = 'DirectorUser';
    let playerId: string;

    // 1. Create Session
    console.log('Test 1: Create Session');
    sessionId = gameManager.createSession(directorId, 'DirectorName', 'Test Game', 0);
    assert.ok(sessionId, 'Session ID should be generated');

    const session = gameManager.getSession(sessionId);
    assert.strictEqual(session?.gameName, 'Test Game');
    assert.strictEqual(session?.director.name, 'DirectorName');

    // Verify it persists? createSession doesn't automatically save to disk in GameManager.ts logic usually?
    // Let's check. createSession just puts in Map.
    // server.ts doesn't call save immediately.
    // But we can trigger a manual save to test persistence.
    console.log('  PASS (Memory)');

    // 2. Test Manual Save (Persistence)
    console.log('Test 2: Manual Save & Persistence Check');
    gameManager.saveSession(sessionId);

    // Verify file exists
    // The path logic in FileStorage is path.resolve(__dirname, '../../../data/games') relative to its own file.
    // In the test (running from src/tests), the relative path might be different if we reconstructed it, 
    // but we can trust FileStorage knows where it put it.
    // We'll construct the expected path based on project root structure knowing where we are.
    // user workspace is e:\PROJECTS\WEB\ROLLITE
    const expectedPath = path.resolve(__dirname, '../../../data/games', `${sessionId}.json`);

    // Wait, __dirname in ts-node context inside src/tests?
    // server/src/tests -> ../../../ -> server dir? No.
    // server/src/tests -> ../../ -> server/src -> ../ -> server -> ../ -> project root?
    // FileStorage is in server/src/game.
    // ../../../ from server/src/game goes to:
    // server/src/game -> server/src -> server -> project root? No.
    // server is current root?
    // Let's check FileStorage again: path.resolve(__dirname, '../../../data');
    // server/src/game -> server/src -> server -> ROOT -> ROOT/data
    // So data is sibling to server?
    // user workspace: e:\PROJECTS\WEB\ROLLITE
    // server is: e:\PROJECTS\WEB\ROLLITE\server
    // So ROOT is ROLLITE.
    // Tests are in e:\PROJECTS\WEB\ROLLITE\server\src\tests.
    // So __dirname is .../server/src/tests
    // We want e:\PROJECTS\WEB\ROLLITE\data\games
    const projectRoot = path.resolve(__dirname, '../../../');
    const gameFile = path.join(projectRoot, 'data', 'games', `${sessionId}.json`);

    if (fs.existsSync(gameFile)) {
        console.log(`  PASS: File created at ${gameFile}`);
    } else {
        throw new Error(`File not found at ${gameFile}`);
    }

    // 3. Create Player
    console.log('Test 3: Create Player');
    const player = gameManager.createPlayer(sessionId, 'PlayerOne', 1, []);
    assert.ok(player, 'Player should be created');
    playerId = player!.id;
    console.log('  PASS');

    // 4. Update Scene
    console.log('Test 4: Update Scene');
    const newScene = { description: 'A dark room', image: 'img.jpg', playerStatuses: {} };
    gameManager.updateScene(sessionId, newScene);
    gameManager.startRound(sessionId);
    const sessionActive = gameManager.getSession(sessionId);
    assert.strictEqual(sessionActive?.currentScene?.description, 'A dark room');
    console.log('  PASS');

    // 5. End Session
    console.log('Test 5: End Session');
    gameManager.endSession(sessionId);
    const sessionEnded = gameManager.getSession(sessionId);
    assert.strictEqual(sessionEnded?.isEnded, true);

    // Verify End state persisted
    const savedData = JSON.parse(fs.readFileSync(gameFile, 'utf-8'));
    assert.strictEqual(savedData.isEnded, true);
    console.log('  PASS: End state persisted');

    // 6. Cleanup (Delete)
    console.log('Test 6: Delete Session (Cleanup)');
    gameManager.deleteSession(sessionId);
    assert.strictEqual(gameManager.getSession(sessionId), undefined);

    if (!fs.existsSync(gameFile)) {
        console.log('  PASS: File deleted');
    } else {
        throw new Error('File was not deleted');
    }

    console.log('\nAll tests passed successfully!');
}

runTests().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});

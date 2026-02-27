
import { GameManager } from '../game/GameManager.js';
import { FileStorage } from '../game/file_storage.js';
import { LLMService } from '../services/LLMService.js';
import * as assert from 'assert';

async function runTests() {
    console.log('Starting LLM Generation Tests...');

    // Mock FileStorage (we don't need real persistence for this logic test)
    const fileStorage = new FileStorage();
    const gameManager = new GameManager(fileStorage);
    const llmService = new LLMService();

    let sessionId: string;
    let directorId: string = 'DirectorUser';
    let playerId: string;

    // 1. Setup Session
    console.log('Test 1: Setup Session');
    sessionId = gameManager.createSession(directorId, 'DirectorName', 'Test Game', 0);
    const p = gameManager.createPlayer(sessionId, 'PlayerOne', 1, []);
    playerId = p!.id;
    assert.ok(sessionId, 'Session ID should be created');
    console.log('  PASS');

    // 2. Test LLM Service (Mock Response)
    // Since we likely don't have an API Key, this checks the graceful fallback
    console.log('Test 2: LLM Service Graceful Fallback (Mock)');
    const session = gameManager.getSession(sessionId);
    assert.ok(session, 'Session should exist');

    const result = await llmService.generateNextRound(
        session!.history,
        session!.players,
        [], // no messages
        session!.currentScene
    );

    assert.ok(result.description, 'Should return a description');
    assert.ok(result.description.includes('mock'), 'Should be the mock response (presuming no API key)');
    console.log('  PASS');


    // 3. Test GameManager.applyNextRoundUpdates
    console.log('Test 3: Apply Next Round Updates');

    const mockUpdates = {
        description: 'New LLM Round Description',
        characterUpdates: [
            { id: playerId, statusText: 'Scared' },
            { id: playerId, badge: { name: 'Survivor', hidden: false } },
            { id: playerId, privateMessage: 'You hear a whisper.' }
        ]
    };

    const updatedSession = gameManager.applyNextRoundUpdates(
        sessionId,
        mockUpdates.description,
        mockUpdates.characterUpdates
    );

    assert.ok(updatedSession, 'Should return updated session');
    assert.strictEqual(updatedSession!.pendingScene?.description, mockUpdates.description);
    assert.strictEqual(updatedSession!.pendingScene?.playerStatuses?.[playerId], 'Scared');
    assert.strictEqual(updatedSession!.pendingScene?.privateMessages?.[playerId], 'You hear a whisper.');
    assert.strictEqual(updatedSession!.pendingScene?.playerBadges?.[playerId].length, 1);
    assert.strictEqual(updatedSession!.pendingScene?.playerBadges?.[playerId][0].name, 'Survivor');

    console.log('  PASS');

    console.log('\nAll LLM tests passed successfully!');
}

runTests().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});

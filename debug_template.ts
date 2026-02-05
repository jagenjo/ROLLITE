
import fs from 'fs';
import path from 'path';

// Mock types
interface Player { id: string; name: string; avatarIndex: number; }
interface GameState {
    director: Player;
    players: Player[];
    round: number;
    currentScene: any;
    pendingScene: any;
    sessionId: string;
    players_online: Player[];
    submittedActions: any[];
    messages: any[];
    history: any[];
    gameName: string;
    isRoundActive: boolean;
    isEnded: boolean;
}

const templatePath = path.resolve('data/templates/dnd_starter.json');

console.log(`Loading template from ${templatePath}`);
try {
    const templateRaw = fs.readFileSync(templatePath, 'utf-8');
    const template = JSON.parse(templateRaw);
    console.log('Template loaded.');
    console.log('Template Director ID:', template.director.id);
    console.log('Template Players IDs:', template.players.map((p: any) => p.id));

    // Mock Session
    const mockDirector = { id: 'user_real_director', name: 'Real Director', avatarIndex: 0 };
    const session: GameState = {
        sessionId: 'test_session',
        director: mockDirector,
        players: [mockDirector], // Initially only director
        players_online: [mockDirector],
        round: 1,
        currentScene: null,
        pendingScene: null,
        submittedActions: [],
        messages: [],
        history: [],
        gameName: 'Test Game',
        isRoundActive: false,
        isEnded: false
    };

    console.log('\n--- Simulating loadTemplateIntoSession ---');

    if (session.round > 1) {
        console.log('Round > 1, abort.');
    } else {
        // Merge Logic copied from GameManager
        session.currentScene = template.currentScene;
        session.pendingScene = template.pendingScene;

        const director = session.director;

        // Filter out the OLD director from the template players
        const templatePlayers = template.players.filter((p: Player) => p.id !== template.director.id);

        console.log('Filtered Template Players:', templatePlayers.map((p: Player) => `${p.name} (${p.id})`));

        // Reconstruct player list
        session.players = [director, ...templatePlayers];

        console.log('\nResulting Session Players:');
        session.players.forEach(p => {
            const isDirector = p.id === session.director.id;
            console.log(`- ${p.name} (${p.id}) [Director? ${isDirector}]`);
        });

        const ghostDirector = session.players.find(p => p.id === template.director.id);
        if (ghostDirector) {
            console.log('\nFAIL: Old template director found in list!');
        } else {
            console.log('\nSUCCESS: Old template director correctly filtered out.');
        }
    }

} catch (e) {
    console.error('Error:', e);
}

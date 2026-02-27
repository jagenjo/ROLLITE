
import { Scene, Player, GameState, Message } from '../../shared/types.js';

interface GameHistory {
    round: number;
    scene: Scene;
}

interface CharacterUpdate {
    id: string;
    statusText?: string;
    badge?: { name: string, hidden: boolean };
    privateMessage?: string;
}

interface LLMResponse {
    description: string;
    gameSummary: string;
    goals: { description: string, isCompleted: boolean }[];
    characterUpdates: CharacterUpdate[];
}

const systemPrompt = `
You are a Dungeon Master (Director) assistant for a role-playing game. 
Your task is to generate the description for the NEXT round of the game based on the previous context.
To generate the description for the next round keep the next rules in mind:
- You will receive a summary of the game and the actions performed by players in the previous round.
- When writing the description, you should mention the action performed by each player individually, unless they were secret and couldnt be seen by the rest, even if the action was ignored
- When writing the description, insert the actions of players like - PlayerA did X and... - or - PlayerA tried to do X and... - unless it was hidden. 
- You must check that player actions are consistent with their character traits and skills, and do not use any items or skills that the character does not have. If player tries to use and item or skills he obviously doesnt have, you should send him a private message telling him that he cant do that and ignore his action (do not write about it in the description or summary). 
- Never assume players know what their peers tried to do, unless they explicitly said it or it was obvious from the description.
- If some piece of information should only be know by one player, use the secret messages to deliver it. 
- Do not use the secret messages to give hints or tips to players.
- Players can speak during the round, and their messages are visible to all players. Take into account the information.
- Use the player's status to display player visible state, like sleeping, dead, etc.
- Do not use the player's status for thoughts or internal information.
- You can create goals internally to track the progress of players, but do not reveal them unless the players discover them on their own.
- Goals should be milestones to be achieved by players, important quests. Not common actions.
- If a character gains an item or an skill, use the badges to store that information. 
- If the character loses an item or an skill, remove the badge.
- Use the hidden badges to track player state that is not visible to players or hidden state. For example, if a player picked a disease or a curse, you can add a hidden badge to track that.
- Try to keep description short and concise, but informative. Do not repeat information that is already known to the players.

You must ensure that the game continues to be interesting and engaging, and that the story progresses in a logical and coherent manner.

Output Format:
You must respond with a JSON object wrapped in specific tags: <JSON> ... </JSON>.
The JSON object must have the following structure:
{
  "description": "The detailed narrative description of the scene for the new round. Use markdown for formatting.",
  "gameSummary": "A text summarizing the whole game so far, removing unnecessary text, focusing on actions and consequences, and plot development.",
  "goals": [
    {
      "description": "Description of a goal the players should try to achieve.",
      "isCompleted": boolean
    }
  ],
  "characterUpdates": [
    {
      "id": "playerId",
      "statusText": "New status text (optional)",
      "badge": { "name": "Badge Name", "hidden": boolean } (optional),
      "privateMessage": "Secret message for this player" (optional)
    }
  ]
}

Keep the description engaging, atmospheric, and reactive to player actions.
`;

export class LLMService {
    private apiKey: string;
    private apiUrl: string;
    private model: string;

    constructor() {
        this.apiKey = process.env.LLM_API_KEY || '';
        this.apiUrl = process.env.LLM_API_URL || 'http://192.168.0.15:11434/api/chat'//'https://api.openai.com/v1/chat/completions';
        this.model = process.env.LLM_MODEL || 'kimi-k2.5:cloud' //'gpt-4o';
        this.preload();
    }

    async preload() {
        await fetch(this.apiUrl, {
            method: 'POST',
            body: JSON.stringify({
                model: this.model
            })
        });
    }

    async validateService(): Promise<boolean> {
        console.log('Validating LLM Service...');
        try {
            const response = await this._callLLM('system', 'Respond only with the word APPLE');
            const isValid = response.trim().toUpperCase().includes('APPLE');
            if (isValid) {
                console.log('LLM Service validation successful.');
            } else {
                console.warn('LLM Service validation returned unexpected response:', response);
            }
            return isValid;
        } catch (error) {
            console.error('LLM Service validation failed:', error);
            return false;
        }
    }

    async generateNextRound(
        history: { round: number; scene: Scene }[],
        players: Player[],
        lastMessages: Message[],
        currentScene: Scene | null,
        directives?: string
    ): Promise<LLMResponse> {

        if (!this.apiUrl) {
            console.warn('No LLM_API_URL found. Returning mock response.');
            return this.getMockResponse(players);
        }

        const userPrompt = this.constructUserPrompt(history, players, lastMessages, currentScene, directives);
        console.log('User Prompt:', userPrompt);

        try {
            const content = await this._callLLM(systemPrompt, userPrompt);
            const response = this.parseResponse(content);
            if (!response) {
                //this may happend if the LLM finds the prompt goes against its safe-rails
                throw new Error('Invalid LLM response structure');
            }
            return response;
        } catch (error) {
            console.error('LLM Generation failed:', error);
            throw error;
        }
    }

    private async _callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
        if (!this.apiUrl) {
            throw new Error('LLM_API_URL is not configured');
        }

        console.log("LLM Request: ", userPrompt);

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                stream: false,
                keep_alive: -1
            })
        });

        if (!response.ok) {
            console.error('LLM API error:', response);
            throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('LLM API response:', data);

        if (!data?.message?.content) {
            throw new Error(`LLM API error: Response is empty`);
        }

        return data.message.content;
    }

    private constructUserPrompt(
        history: { round: number; scene: Scene }[],
        players: Player[],
        lastMessages: Message[],
        currentScene: Scene | null,
        directives?: string
    ): string {
        let prompt = ``;

        if (directives) {
            prompt += `DIRECTOR DIRECTIVES (IMPORTANT):\n${directives}\n\n`;
        }

        prompt += `Current Game Context:\n\n`;

        // recent history (last 2 rounds)
        const relevantHistory = history.slice(-2);
        if (relevantHistory.length > 0) {
            prompt += `Previous Scenes:\n`;
            relevantHistory.forEach(h => {
                prompt += `Round ${h.round}: ${h.scene.description}\n\n`;
            });
        }

        if (currentScene) {
            prompt += `Current Round Description: ${currentScene.description}\n\n`;
        }

        prompt += `Players:\n`;
        players.forEach((p, i) => {
            if (i == 0) return; //skip director
            prompt += `${i + 1}. ${p.name} (ID: ${p.id}): Status="${p.statusText || ''}"`;
            if (p.background) {
                prompt += `\n  Background: "${p.background}"\n`;
            }
            prompt += `Action this round: "${lastMessages.find(m => m.senderId == p.id && m.isAction)?.content || ''}"\n`;
            prompt += `\n`;
        });

        prompt += `\nRecent Messages said by players:\n`;
        lastMessages.forEach(m => {
            if (m.senderId == players[0].id || m.isAction) return;
            prompt += `[${m.senderName}]: "${m.content}" \n`;
        });

        prompt += `\nPlease generate the next round's scene description and any necessary character updates.`;
        return prompt;
    }

    private parseResponse(content: string): LLMResponse | null {
        // Robust parsing: find <JSON> tags or try to find the first '{' and last '}'
        let jsonStr = '';
        const tagMatch = content.match(/<JSON>([\s\S]*?)<\/JSON>/);

        if (tagMatch) {
            jsonStr = tagMatch[1];
        } else {
            // Fallback: look for generic json block
            const start = content.indexOf('{');
            const end = content.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                jsonStr = content.substring(start, end + 1);
            }
        }

        try {
            if (!jsonStr) {
                console.error('No JSON found in response');
                return null;
            }
            return JSON.parse(jsonStr) as LLMResponse;
        } catch (e) {
            console.error('Failed to parse LLM response:', content);
            return null;
        }
    }

    private getMockResponse(players: Player[]): LLMResponse {
        return {
            description: "### The Next Chapter\n\n(This is a mock generated description because no API key was configured)\n\nThe shadows lengthen as the party considers their next move. A strange silence falls over the area.",
            gameSummary: "### Game Summary\n\n(This is a mock generated summary because no API key was configured)\n\nThe shadows lengthen as the party considers their next move. A strange silence falls over the area.",
            goals: [],
            characterUpdates: []
        };
    }
}

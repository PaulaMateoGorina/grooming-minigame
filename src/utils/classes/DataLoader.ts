import groomingSnippetsJson from '@/assets/json/groomingSnippetsESP.json'
import normalSnippetsJson from '@/assets/json/normalSnippetsESP.json'

import Snippet from '@/utils/classes/Snippet'
import Message from '@/utils/classes/Message'
import EStage from '@/utils/EStage'
import EStageIdx from '@/utils/EStageIdx'
import * as gameConstants from '@/utils/constants'

class DataLoader{
    private groomingSnippets: Snippet[][];
    private normalSnippets: Snippet[];

    constructor(){
        this.groomingSnippets = [];
        for (let idx = 0; idx < gameConstants.NUM_STAGES; idx++) {
            this.groomingSnippets.push([])
        }
        this.loadGroomingSnippets();

        this.normalSnippets = [];
        this.loadNormalSnippets();
    }

    private createMessage(messageId: number, data: {sender: string; text: string}): Message | undefined{
        let result: Message | undefined = undefined;

        try {
            result =  new Message(messageId, data.sender, data.text)
        } 
        catch (error) {
            console.error(`Error creating new message instance. ${error}`);
        }
        
        return result;
    }

    private createSnippet(snippetId:number, data: { arrayIdx?: number; stage: number; Messages: { sender: string; text: string; }[] }): Snippet | undefined{
        let result: Snippet | undefined = undefined;

        try {
            const snippetMessages:Message[] = [];
            let messageId = 0;

            for(const message of data.Messages){
                const snippetMessage: Message | undefined = this.createMessage(messageId, message);

                if(snippetMessage === undefined){
                    throw("Snippet message created was undefined.");
                }
                else{
                    snippetMessages.push(snippetMessage);
                    messageId++;
                }
            }

            result = new Snippet(snippetId, data.stage, snippetMessages);
        } 
        catch (error) {
            console.error(`Error creating new snippet instance. ${error}`);
        }
        return result;
    }

    private loadGroomingSnippets(): void{
        try{
            const jsonSnippets = groomingSnippetsJson as { arrayIdx: number; stage: number; Messages: { sender: string; text: string; }[] }[];
            let id = 0;

            for(const snippetJson of jsonSnippets){
                const snippet : Snippet | undefined = this.createSnippet(id, snippetJson);

                if(snippet === undefined){
                    throw("Snippet created was undefined.");
                }
                else{
                    this.groomingSnippets[snippetJson.arrayIdx].push(snippet);
                    id++;
                }
            }
        }
        catch (error) {
            console.error(`Error loading grooming snippets. ${error}`);   
        }
    }

    private loadNormalSnippets(): void{
        try {
            const jsonSnippets = normalSnippetsJson as { stage: number; Messages: { sender: string; text: string; }[] }[];
            let id = 0;

            for(const snippetJson of jsonSnippets){
                const snippet : Snippet | undefined = this.createSnippet(id, snippetJson);

                if(snippet === undefined){
                    throw("Snippet created was undefined.");
                }
                else{
                    this.normalSnippets.push(snippet);
                    id++;
                }
            }
        }
        catch (error) {
            console.error(`Error loading normal snippets. ${error}`);   
        }
    }

    public getGroomingSnippet(stage?: EStage) : Snippet | undefined{
        let result: Snippet | undefined = undefined;
        
        try{
            let rand = Math.random();

            let stageSnippetListLength = 0;

            if(stage){
                stageSnippetListLength = this.groomingSnippets[stage].length
            }
            else {
                stage = ~~(rand * gameConstants.NUM_STAGES);
                stageSnippetListLength = this.groomingSnippets[stage].length
            }

            rand = Math.random();
            result = this.groomingSnippets[stage][~~(rand * stageSnippetListLength)];
        }
        catch (error){
            console.error(`Error getting a random grooming snippet. ${error}`);   
        }

        return result;
    }

    public getNormalSnippet(): Snippet | undefined{
        let result: Snippet | undefined = undefined;
        
        try{
            const rand = Math.random();
            const snippetLengthList = this.normalSnippets.length;
            result = this.normalSnippets[~~(rand * snippetLengthList)];
        }
        catch (error){
            console.error(`Error getting a random normal snippet. ${error}`);   
        }

        return result;
    }
}

export default DataLoader;
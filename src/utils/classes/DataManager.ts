import groomingSnippetsJson from '@/assets/json/groomingSnippetsESP.json'
import normalSnippetsJson from '@/assets/json/normalSnippetsESP.json'

import Snippet from '@/utils/classes/Snippet'
import Message from '@/utils/classes/Message'
import EStage from '@/utils/enums/EStage'
import Report from '@/utils/classes/Report'
// import EStageIdx from '@/utils/EStageIdx'
import * as gameConstants from '@/utils/constants'

class DataManager{
    private static instance: DataManager | null

    private groomingSnippets: Snippet[][];
    private normalSnippets: Snippet[];

    constructor(){
        this.groomingSnippets = [];
        for (let idx = 0; idx < gameConstants.NUM_GROOMING_STAGES; idx++) {
            this.groomingSnippets.push([])
        }
        this.loadGroomingSnippets();

        this.normalSnippets = [];
        this.loadNormalSnippets();
    }

    public static getInstance(): DataManager {
        if (!DataManager.instance) {
          DataManager.instance = new DataManager();
        }
        return DataManager.instance;
    }
    
    // #region methods to create instances from data
    private createMessage(messageId: number, data: {sender: string; text: string}): Message | undefined{
        let result: Message | undefined = undefined;

        try {
            result =  new Message(messageId, data.sender, data.text)
        } 
        catch (error) {
            console.error(`createMessage > ERROR creating new message instance. ${error}`);
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
            console.error(`createSnippet > ERROR creating new snippet instance. ${error}`);
        }
        return result;
    }
    // #endregion

    // #region methods to load data
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
            console.error(`loadGroomingSnippets > ERROR loading grooming snippets. ${error}`);   
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
            console.error(`loadNormalSnippets > ERROR loading normal snippets. ${error}`);   
        }
    }
    // #endregion

    // #region helper methods to generate data structures
    private generateGroomingSnippetList(numSnippets: number): Snippet[]{
        const result: Snippet[] = [];

        try {
            const rand = Math.random();
            let hasNormalSnippet = false;
            if(numSnippets > gameConstants.MIN_SNIPPETS_PER_REPORT)
                hasNormalSnippet = rand > gameConstants.HALF; 

            const normalSnippetIdx = hasNormalSnippet ? ~~(rand * numSnippets) : -1;

            for (let i = 0; i < numSnippets; i++) {
                let snippet: Snippet | undefined = undefined;

                if(i === normalSnippetIdx)
                    snippet = this.sampleNormalSnippet();
                else
                    snippet = this.sampleGroomingSnippet();

                if(snippet)
                    result.push(snippet);                            
            }
        } catch (error) {
            console.error(`generateGroomingSnippetList > ERROR generating grooming snippet list. ${error}`);   
        }

        return result;
    }

    private generateNormalSnippetList(numSnippets: number): Snippet[]{
        const result: Snippet[] = [];

        try {
            for (let i = 0; i < numSnippets; i++) {
                const snippet: Snippet | undefined = this.sampleNormalSnippet();
                if(snippet)
                    result.push(snippet);                    
            }
        } catch (error) {
            console.error(`generateGroomingSnippetList > ERROR generating grooming snippet list. ${error}`);   
        }

        return result;
    }

    private generateSnippetList(isGrooming: boolean): Snippet[]{
        let result: Snippet[] = [];
        
        try {
            const numSnippets = gameConstants.MIN_SNIPPETS_PER_REPORT + ~~(Math.random() * (gameConstants.MAX_SNIPPETS_PER_REPORT - gameConstants.MIN_SNIPPETS_PER_REPORT));
            result = isGrooming ? this.generateGroomingSnippetList(numSnippets) : this.generateNormalSnippetList(numSnippets);

        } catch (error) {
            console.error(`generateSnippetList > ERROR generating snippet list. ${error}`);   
        }

        return result;
    }
    // #endregion

    // #region public methods
    public sampleGroomingSnippet(stage?: EStage) : Snippet | undefined{
        let result: Snippet | undefined = undefined;
        
        try{
            let rand = Math.random();

            let stageSnippetListLength = 0;

            if(stage){
                stageSnippetListLength = this.groomingSnippets[stage].length
            }
            else {
                stage = ~~(rand * gameConstants.NUM_GROOMING_STAGES);
                stageSnippetListLength = this.groomingSnippets[stage].length
            }

            rand = Math.random();
            result = this.groomingSnippets[stage][~~(rand * stageSnippetListLength)];
        }
        catch (error){
            console.error(`sampleGroomingSnippet > ERROR sampling a random grooming snippet. ${error}`);   
        }

        return result;
    }

    public sampleNormalSnippet(): Snippet | undefined{
        let result: Snippet | undefined = undefined;
        
        try{
            const rand = Math.random();
            const snippetLengthList = this.normalSnippets.length;
            result = this.normalSnippets[~~(rand * snippetLengthList)];
        }
        catch (error){
            console.error(`sampleNormalSnippet > ERROR sampling a random normal snippet. ${error}`);   
        }

        return result;
    }

    //TODO: Adapt so that you can choose to have it with or without snippets
    public generateReport(isGrooming: boolean): Report | undefined{
        let result: Report | undefined = undefined;

        try {
            const snippets: Snippet[] = this.generateSnippetList(isGrooming);
            
            if(snippets.length > 0)
                result = new Report(isGrooming, snippets);
            else
                throw("The snippets array was empty.");

        } catch (error) {
            console.error(`generateReport > ERROR generating a report. ${error}`);   
        }
        return result;
    }
    // #endregion
}

export default DataManager;
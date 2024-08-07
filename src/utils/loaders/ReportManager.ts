import * as utils from '../utils'

import groomingSnippetsJson from '@/assets/json/groomingSnippetsESP.json'
import normalSnippetsJson from '@/assets/json/normalSnippetsESP.json'

import Snippet from '@/utils/model/Snippet'
import Profile from '@/utils/model/Profile'
import Message from '@/utils/model/Message'
import Report from '@/utils/model/Report'
import { DayConfiguration } from '@/utils/model/Day'
import { EStageIdx } from '@/utils/enums'
import { NUM_CONSTANTS, STAGE_CONSTANTS, REPORT_CONSTANTS, PROFILE_CONSTANTS, FRIENDSHIP_TIME_CONSTANTS, DATA_SAVER_CONSTANTS } from '@/utils/constants'
import { LogLevel, WriteLog } from '../logger'
import DataService from '../DataService'
import { DayData } from '../model/UserData'

class ReportManager{
    private static instance: ReportManager | null

    private groomingSnippets: Snippet[][];
    private numGroomingSnippets: number[];
    private normalSnippets: Snippet[];
    private numNormalSnippets: number;

    constructor(){
        this.groomingSnippets = [];
        for (let idx = NUM_CONSTANTS.ZERO; idx < STAGE_CONSTANTS.NUM_GROOMING_STAGES; idx++) {
            this.groomingSnippets.push([])
        }
        
        const offset = this.loadGroomingSnippets();

        this.numGroomingSnippets=[];
        for(const stageSnippetList of this.groomingSnippets){
            this.numGroomingSnippets.push(stageSnippetList.length);
        }

        this.normalSnippets = [];
        this.loadNormalSnippets(offset);
        this.numNormalSnippets = this.normalSnippets.length;
    }

    public static getInstance(): ReportManager {
        if (!ReportManager.instance) {
            ReportManager.instance = new ReportManager();
        }
        return ReportManager.instance;
    }
    
    // #region methods to create instances from data
    private createMessage(messageId: number, data: {sender: string; text: string}): Message | undefined{
        let result: Message | undefined = undefined;

        try {
            result =  new Message(messageId, data.sender, data.text)
        } 
        catch (error) {
            WriteLog(`ReportManager.ts > createMessage > ERROR creating new message instance. #ERROR: ${error}`, LogLevel.ERROR);
        }
        
        return result;
    }

    private createSnippet(snippetId:number, data: { arrayIdx?: number; stage: number; Messages: { sender: string; text: string; }[] }): Snippet | undefined{
        let result: Snippet | undefined = undefined;

        try {
            const snippetMessages:Message[] = [];
            let messageId = NUM_CONSTANTS.ZERO;

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
            
            if(snippetMessages.length > NUM_CONSTANTS.ZERO)
                result = new Snippet(snippetId, data.stage, snippetMessages);
            else
                throw("The snippet had no messages");
        } 
        catch (error) {
            WriteLog(`ReportManager.ts > createSnippet > ERROR creating new snippet instance. #ERROR: ${error}`, LogLevel.ERROR);
        }
        return result;
    }
    // #endregion

    // #region methods to load data
    private loadGroomingSnippets(): number{
        let numTotalSnippets = NUM_CONSTANTS.ZERO;
        try{
            const jsonSnippets = groomingSnippetsJson as { arrayIdx: number; stage: number; Messages: { sender: string; text: string; }[] }[];
            let id = NUM_CONSTANTS.ZERO;
            
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

            numTotalSnippets = id;
        }
        catch (error) {
            WriteLog(`ReportManager.ts > loadGroomingSnippets > ERROR loading grooming snippets. #ERROR: ${error}`, LogLevel.ERROR);   
        }
        return numTotalSnippets;
    }

    private loadNormalSnippets(offset: number): void{
        try {
            const jsonSnippets = normalSnippetsJson as { stage: number; Messages: { sender: string; text: string; }[] }[];
            let id = NUM_CONSTANTS.ZERO;

            for(const snippetJson of jsonSnippets){
                const snippet : Snippet | undefined = this.createSnippet(id + offset, snippetJson);
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
            WriteLog(`ReportManager.ts > loadNormalSnippets > ERROR loading normal snippets. #ERROR: ${error}`, LogLevel.ERROR);   
        }
    }
    // #endregion

    // #region helper methods to generate data structures
    private generateGroomingSnippetList(numDay: number, numSnippets: number, selectableStagesIdx?: number[]): Snippet[]{
        const result: Snippet[] = [];

        try {
            const rand = Math.random();
            let hasNormalSnippet = false;
            if(numSnippets > REPORT_CONSTANTS.MIN_SNIPPETS_PER_REPORT)
                hasNormalSnippet = rand > NUM_CONSTANTS.HALF; 

            const normalSnippetIdx = hasNormalSnippet ? utils.getRandomIdx(numSnippets) : -1;

            let i = NUM_CONSTANTS.ZERO;
            const snippetIds: number[] = [];

            while(i < numSnippets) {
                let snippet: Snippet | undefined = undefined;

                if(i === normalSnippetIdx)
                    snippet = this.sampleNormalSnippet(numDay);
                else{
                    if(selectableStagesIdx !== null && selectableStagesIdx !== undefined && selectableStagesIdx.length > 0){
                        const idx = utils.getRandomIdx(selectableStagesIdx.length)
                        const snippetStage = selectableStagesIdx[idx];
                        snippet = this.sampleGroomingSnippet(numDay, snippetStage)
                    }
                    else{
                        snippet = this.sampleGroomingSnippet(numDay);
                    }
                }

                if(snippet && !snippetIds.includes(snippet.id)){
                    snippet.chosen = true;
                    result.push(snippet);             
                    snippetIds.push(snippet.id);
                    i++;             
                }
            }
        } catch (error) {
            WriteLog(`ReportManager.ts > generateGroomingSnippetList > ERROR generating grooming snippet list. #ERROR: ${error}`, LogLevel.ERROR);   
        }

        return result;
    }

    private generateNormalSnippetList(numDay:number, numSnippets: number): Snippet[]{
        const result: Snippet[] = [];

        try {
            let i = NUM_CONSTANTS.ZERO;
            const snippetIds: number[] = [];

            while(i < numSnippets) {
                const snippet: Snippet | undefined = this.sampleNormalSnippet(numDay);

                if(snippet && !snippetIds.includes(snippet.id)){
                    result.push(snippet);             
                    snippetIds.push(snippet.id);
                    i++;      
                }
            }
        } catch (error) {
            WriteLog(`ReportManager.ts > generateGroomingSnippetList > ERROR generating grooming snippet list. #ERROR: ${error}`, LogLevel.ERROR);   
        }

        return result;
    }

    private generateSnippetList(numDay: number, isGrooming: boolean, selectableStagesIdx?: number[]): Snippet[]{
        let result: Snippet[] = [];
        
        try {
            const numSnippets = utils.getRandomNumber(REPORT_CONSTANTS.MAX_SNIPPETS_PER_REPORT, REPORT_CONSTANTS.MIN_SNIPPETS_PER_REPORT);
            result = isGrooming ? this.generateGroomingSnippetList(numDay, numSnippets, selectableStagesIdx) : this.generateNormalSnippetList(numDay, numSnippets);

        } catch (error) {
            WriteLog(`ReportManager.ts > generateSnippetList > ERROR generating snippet list. #ERROR: ${error}`, LogLevel.ERROR);   
        }

        return result;
    }

    private generateGroomerProfile(doAgesMatch: boolean, minAge?: number, maxAge?: number): Profile | undefined{
        let profile: Profile | undefined = undefined;
        const min = minAge ? minAge : PROFILE_CONSTANTS.MIN_AGE_GROOMER;
        const max = maxAge ? maxAge : PROFILE_CONSTANTS.MAX_AGE_GROOMER;

        try {
            const realAge: number = utils.getRandomNumber(min, max);
            const onlineAge: number = doAgesMatch ? realAge : utils.getRandomNumber(PROFILE_CONSTANTS.MAX_AGE_TEENAGER, PROFILE_CONSTANTS.MIN_AGE_FAKE);
            
            profile = new Profile(PROFILE_CONSTANTS.PLACEHOLDER_URL, PROFILE_CONSTANTS.PLACEHOLDER_USERNAME, onlineAge, realAge);
        } 
        catch (error) {
            WriteLog(`ReportManager.ts > generateTeenProfile > ERROR not generate a teenager profile. #ERROR: ${error}`, LogLevel.ERROR);
        }
        return profile;
    }
    
    private generateTeenProfile(doAgesMatch: boolean): Profile| undefined{
        let profile: Profile | undefined = undefined;
        try {
            const realAge: number = utils.getRandomNumber(PROFILE_CONSTANTS.MAX_AGE_TEENAGER, PROFILE_CONSTANTS.MIN_AGE_TEENAGER);
            const onlineAge: number = doAgesMatch ? realAge : utils.getRandomNumber(realAge + PROFILE_CONSTANTS.MAX_AGE_DIFFERENCE_TEENAGER, realAge);

            profile = new Profile(PROFILE_CONSTANTS.PLACEHOLDER_URL, PROFILE_CONSTANTS.PLACEHOLDER_USERNAME, realAge, onlineAge);
        } 
        catch (error) {
            WriteLog(`ReportManager.ts > generateTeenProfile > ERROR not generate a teenager profile. #ERROR: ${error}`, LogLevel.ERROR);
        }
        return profile;
    }

    private generateNormalProfile(doAgesMatch: boolean): Profile| undefined{
        let profile: Profile | undefined = undefined;
        try {
            const realAge: number = utils.getRandomNumber(PROFILE_CONSTANTS.MAX_AGE_NORMAL, PROFILE_CONSTANTS.MIN_AGE_NORMAL);
            const onlineAge: number = doAgesMatch ? realAge : utils.getRandomNumber(realAge + PROFILE_CONSTANTS.MAX_AGE_DIFFERENCE_TEENAGER, realAge);

            profile = new Profile(PROFILE_CONSTANTS.PLACEHOLDER_URL, PROFILE_CONSTANTS.PLACEHOLDER_USERNAME, realAge, onlineAge);
        } 
        catch (error) {
            WriteLog(`ReportManager.ts > generateTeenProfile > ERROR not generate a teenager profile. #ERROR: ${error}`, LogLevel.ERROR);
        }
        return profile;
    }

    // #endregion

    // #region public methods
    public sampleGroomingSnippet(numDay: number, stage?: EStageIdx) : Snippet | undefined{
        let result: Snippet | undefined = undefined;
        
        try{
            let stageSnippetListLength = NUM_CONSTANTS.ZERO;

            if(stage === null || stage === undefined){
                stage = utils.getRandomIdx(STAGE_CONSTANTS.NUM_GROOMING_STAGES);
            }
            stageSnippetListLength = this.numGroomingSnippets[stage]

            result = this.groomingSnippets[stage][utils.getRandomIdx(stageSnippetListLength)];
            DataService.getInstance().add1ToDayData(numDay, DATA_SAVER_CONSTANTS.N_SNIPPETS_PER_STAGE as keyof DayData, stage + 1);
        }
        catch (error){
            WriteLog(`ReportManager.ts > sampleGroomingSnippet > ERROR sampling a random grooming snippet. #ERROR: ${error}`, LogLevel.ERROR);   
        }

        return result;
    }

    public sampleNormalSnippet(numDay: number): Snippet | undefined{
        let result: Snippet | undefined = undefined;
        
        try{
            result = this.normalSnippets[utils.getRandomIdx(this.numNormalSnippets)];
            DataService.getInstance().add1ToDayData(numDay, DATA_SAVER_CONSTANTS.N_SNIPPETS_PER_STAGE as keyof DayData, 0);
        }
        catch (error){
            WriteLog(`ReportManager.ts > sampleNormalSnippet > ERROR sampling a random normal snippet. #ERROR: ${error}`, LogLevel.ERROR);   
        }

        return result;
    }

    public generateReport(numDay: number, configuration: DayConfiguration): Report | undefined{
        const isGrooming = utils.getBoolean(configuration.groomingProbability);
        let result: Report | undefined = undefined;

        try {
            // profiles
            const agesMatchUser1: boolean = utils.getBoolean(NUM_CONSTANTS.HALF);
            const profile1Nullable: Profile | undefined = isGrooming ? 
                this.generateGroomerProfile(agesMatchUser1, configuration.minAgeGroomer, configuration.maxAgeGroomer) 
                : 
                this.generateNormalProfile(agesMatchUser1);

            const agesMatchUser2: boolean = utils.getBoolean(NUM_CONSTANTS.HALF);
            const profile1Nullable2: Profile | undefined = this.generateTeenProfile(agesMatchUser2);

            if(profile1Nullable === undefined || profile1Nullable2 === undefined)
                throw new Error("User profiles could not be created properly.");

            // friendship time
            const friendshipTime = [
                utils.getRandomNumber(FRIENDSHIP_TIME_CONSTANTS.MIN_DAYS, FRIENDSHIP_TIME_CONSTANTS.MAX_DAYS),
                utils.weightedSample(FRIENDSHIP_TIME_CONSTANTS.MONTH_SAMPLES),
                utils.weightedSample(FRIENDSHIP_TIME_CONSTANTS.YEAR_SAMPLES)
            ];

            //snippets
            let snippets: Snippet[] = [];
            if(configuration.hasSnippets){
                snippets = this.generateSnippetList(numDay, isGrooming, configuration.selectableStagesIdx);
            }
            result = new Report(isGrooming, profile1Nullable, profile1Nullable2, friendshipTime, snippets);

        } catch (error) {
            WriteLog(`ReportManager.ts > generateReport > ERROR generating a report. #ERROR: ${error}`, LogLevel.ERROR);   
        }
        return result;
    }
    // #endregion
}

export default ReportManager;
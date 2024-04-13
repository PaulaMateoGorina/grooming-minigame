/* eslint-disable @typescript-eslint/no-var-requires */

import Report from '@/utils/model/Report'
import ReportManager from '@/utils/loaders/ReportManager';
import DailyQuiz from '@/utils/model/DailyQuiz';
import QuizManager from '@/utils/loaders/QuizManager';
import NarrationNode from '@/utils/model/NarrationNode';

import { IMPORT_CONSTANTS } from '@/utils/constants'

export interface DayConfiguration{
    shouldSkipQuiz: boolean;
    hasSnippets: boolean;
    selectSnippets: boolean;
    selectSnippetStages: boolean;
    groomingProbability: number;
    minAgeGroomer: number;
    maxAgeGroomer: number;
    selectableStagesIdx?: number[];
}

export class Day{
    public numReports: number;
    configuration: DayConfiguration;
    public narrationNodes: NarrationNode[];

    // generated
    public reports: Report[];
    public dailyQuiz?: DailyQuiz;
    public numDay: number;

    constructor(numDay:number, numReports: number, configuration: DayConfiguration, narrationNodes: NarrationNode[]) {
        this.reports = [];
        this.numDay = numDay;
        this.numReports = numReports;
        this.configuration = configuration;

        // Create the narration nodes
        this.narrationNodes = narrationNodes;
        for(const node of this.narrationNodes){
            node.goTo--;
            if(node.options){
                for(const option of node.options){
                    option.goTo--;
                }
            }
        }
        
        const initialPath = IMPORT_CONSTANTS.ESP_AUDIO;
        for(const narrationNode of narrationNodes){
            narrationNode.audio = new Audio(require(`@/assets/${initialPath}/${narrationNode.audioFile}`));
        }

        // Create the reports and daily quiz
        this.resetReports();
        this.resetDailyQuiz();
    }

    public resetReports():void{
        const reportManager = ReportManager.getInstance();

        this.reports = [];
        for(let i = 0; i < this.numReports;){
            const report: Report | undefined = reportManager.generateReport(this.configuration);
            
            if(report !== undefined){
                this.reports.push(report);
                i++;
            }
        }
    }

    public resetDailyQuiz():void{
        const quizManager = QuizManager.getInstance();

        if(!this.configuration.shouldSkipQuiz){
            const dailyQuiz = quizManager.sampleDailyQuiz(this.numDay);
            if(dailyQuiz)
                this.dailyQuiz = dailyQuiz;
        }
    }
}
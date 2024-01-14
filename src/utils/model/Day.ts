import Report from '@/utils/model/Report'
import ReportManager from '@/utils/loaders/ReportManager';
import DailyQuiz from '@/utils/model/DailyQuiz';
import QuizManager from '@/utils/loaders/QuizManager';
import NarrationNode from '@/utils/model/NarrationNode';

import * as utils from '../utils'

class Day{
    //TODO: add narration
    public numReports: number;
    public selectSnippets: boolean;
    public selectSnippetStages: boolean;
    public probabilities: number[];
    public narrationNodes: NarrationNode[];

    // generated
    public reports: Report[];
    public dailyQuiz?: DailyQuiz;

    constructor(numDay:number, numReports: number, selectSnippets: boolean, selectSnippetStages: boolean, probabilities: number[], narrationNodes: NarrationNode[]) {
        const reportManager = ReportManager.getInstance();
        const quizManager = QuizManager.getInstance();

        this.numReports = numReports;
        this.selectSnippets = selectSnippets;
        this.selectSnippetStages = selectSnippets && selectSnippetStages;
        this.probabilities = probabilities;
        
        this.narrationNodes = narrationNodes;
        for(const node of this.narrationNodes){
            node.goTo--;
            if(node.options){
                for(const option of node.options){
                    option.goTo--;
                }
            }
        }


        this.reports = [];
        for(let i = 0; i < numReports;){
            const report: Report | undefined = reportManager.generateReport(utils.getBoolean(probabilities[0]));
            
            if(report !== undefined){
                this.reports.push(report);
                i++;
            }
        }
        
        const dailyQuiz = quizManager.sampleDailyQuiz(numDay);
        if(dailyQuiz)
            this.dailyQuiz = dailyQuiz;
    }
}

export default Day;
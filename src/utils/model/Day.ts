import Report from '@/utils/model/Report'
import ReportManager from '@/utils/loaders/ReportManager';
import DailyQuiz from '@/utils/model/DailyQuiz';
import QuizManager from '@/utils/loaders/QuizManager';

import * as utils from '../utils'

class Day{
    //TODO: add narration
    public numReports: number;
    public selectSnippets: boolean;
    public selectSnippetReason: boolean;
    public probabilities: number[];

    // generated
    public reports: Report[];
    public dailyQuiz?: DailyQuiz;

    constructor(numDay:number, numReports: number, selectSnippets: boolean, selectSnippetReason: boolean, probabilities: number[]) {
        const reportManager = ReportManager.getInstance();
        const quizManager = QuizManager.getInstance();

        this.numReports = numReports;
        this.selectSnippets = selectSnippets;
        this.selectSnippetReason = selectSnippetReason;
        this.probabilities = probabilities;

        this.reports = [];
        for(let i = 0; i < numReports; i++){
            const report: Report | undefined = reportManager.generateReport(utils.getBoolean(probabilities[0]));
            
            if(report)
                this.reports.push();
        }

        const dailyQuiz = quizManager.sampleDailyQuiz(numDay);
        if(dailyQuiz)
            this.dailyQuiz = dailyQuiz;
    }
}

export default Day;
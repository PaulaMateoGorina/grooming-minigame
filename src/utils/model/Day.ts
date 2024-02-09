import Report from '@/utils/model/Report'
import ReportManager from '@/utils/loaders/ReportManager';
import DailyQuiz from '@/utils/model/DailyQuiz';
import QuizManager from '@/utils/loaders/QuizManager';
import NarrationNode from '@/utils/model/NarrationNode';

export interface DayConfiguration{
    shouldSkipQuiz: boolean;
    hasSnippets: boolean;
    selectSnippets: boolean;
    selectSnippetStages: boolean;
    groomingProbability: number;
    minAgeGroomer: number;
    maxAgeGroomer: number;
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
        const reportManager = ReportManager.getInstance();
        const quizManager = QuizManager.getInstance();

        this.numDay = numDay;
        this.numReports = numReports;
        this.configuration = configuration;
        
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
            const report: Report | undefined = reportManager.generateReport(this.configuration);
            
            if(report !== undefined){
                this.reports.push(report);
                i++;
            }
        }
        
        if(!configuration.shouldSkipQuiz){
            const dailyQuiz = quizManager.sampleDailyQuiz(numDay);
            if(dailyQuiz)
                this.dailyQuiz = dailyQuiz;
        }
    }
}
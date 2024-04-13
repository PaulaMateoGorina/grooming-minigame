import * as utils from '@/utils/utils'
import { STAGES, GAME_CONSTANTS } from '@/utils/constants'

export class DayData{
    public numDay: number;

    // report related
    public numGroomingReports: number;
    public numGroomingReportsFlagged: number;
    public numNormalReports: number;
    public numNormalReportsCorrect: number;

    // snippet related
    public numSnippetsPerStage: number[];
    public numFlaggedSnippetsPerStage: number[];
    public numCorrectSnippetsPerStage: number[];

    constructor(numDay: number){
        this.numDay = numDay;
        this.numGroomingReports = 0;
        this.numGroomingReportsFlagged = 0;
        this.numNormalReports = 0;
        this.numNormalReportsCorrect = 0;
        this.numSnippetsPerStage = Array(STAGES.length).fill(0);
        this.numFlaggedSnippetsPerStage = Array(STAGES.length).fill(0);
        this.numCorrectSnippetsPerStage = Array(STAGES.length).fill(0);
    }
}

export class UserData{
    public userId: string;
    public daysData: DayData[];
    public answerThinksKnowsGrooming: number;
    public answerKnowsGrooming: number;
    public run: number

    constructor() {
        this.userId = utils.generateRandomId();
        this.answerThinksKnowsGrooming = -1;
        this.answerKnowsGrooming = -1;
        this.run = 0;

        this.daysData = [];
        for(const numDay of Array(GAME_CONSTANTS.NUM_DAYS).keys()){
            this.daysData.push(new DayData(numDay));
        }
    }

    public reset(): void{
        this.answerThinksKnowsGrooming = -1;
        this.answerKnowsGrooming = -1;
        this.run++;
    }
}

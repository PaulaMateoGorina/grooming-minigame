import Message from './Message'

import { DATA_SAVER_CONSTANTS, NUM_CONSTANTS, STAGES_TO_IDX } from '@/utils/constants'
import { EStage, ECorrectness } from '@/utils/enums'
import { LogLevel, WriteLog } from '../logger';
import DataService from '../DataService';
import { DayData } from './UserData';

class Snippet {
    public id: number;
    public stage: EStage;
    public messages: Message[];
    public chosen: boolean;

    constructor(id:number, stage:number, messages: Message[]) {
        this.id = id;
        this.stage = stage;
        this.messages = messages;
        this.chosen = false;
    }

    public getAnswerResult(stageSelected: EStage, checkStageSelected: boolean, numDay: number) : ECorrectness{
        let result = ECorrectness.INCORRECT;

        try {
            if(checkStageSelected){
                WriteLog("Snippet.ts > getAnswerResult > check selected", LogLevel.VERBOSE);
                if(this.stage * stageSelected > 0){
                    const stageIdx = STAGES_TO_IDX.get(this.stage);
                    DataService.getInstance().add1ToDayData(numDay, DATA_SAVER_CONSTANTS.N_FLAGGED_SNIPPETS_PER_STAGE as keyof DayData, stageIdx)

                    if(this.stage === stageSelected){
                        result = ECorrectness.CORRECT;
                        DataService.getInstance().add1ToDayData(numDay, DATA_SAVER_CONSTANTS.N_CORRECT_SNIPPETS_PER_STAGE as keyof DayData, stageIdx)
                    }
                    else{
                        result = ECorrectness.PARTIALLY_CORRECT;
                    }
                }
            }
            else{
                // We take advantage of the fact that normal snippets have a negative value for the stage, 
                // and the equivalent for the grooming snippets -> If the product is positive, they have the
                // same sign and the player's answer is correct.
                if(this.stage * stageSelected > NUM_CONSTANTS.ZERO){
                    result = ECorrectness.CORRECT;

                    const stageIdx = STAGES_TO_IDX.get(this.stage);
                    DataService.getInstance().add1ToDayData(numDay, DATA_SAVER_CONSTANTS.N_CORRECT_SNIPPETS_PER_STAGE as keyof DayData, stageIdx)
                }
            }
            
        } catch (error) {
            WriteLog(`Snippet.ts > getAnswerResult > Could not compare answers for the chat snippet. #ERROR: ${error}`, LogLevel.ERROR);        
        }

        return result;
    }
}

export default Snippet;
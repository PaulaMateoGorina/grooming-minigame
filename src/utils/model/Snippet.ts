import Message from './Message'
import EStage from '@/utils/enums/EStage'

import { NUM_CONSTANTS } from '@/utils/constants'
import ECorrectness from '@/utils/enums/ECorrectness'
import { LogLevel, WriteLog } from '../logger';

class Snippet {
    public id: number;
    public stage: EStage;
    public messages: Message[];

    constructor(id:number, stage:number, messages: Message[]) {
        this.id = id;
        this.stage = stage;
        this.messages = messages;
    }

    public getAnswerResult(stageSelected: EStage, checkStageSelected: boolean) : ECorrectness{
        let result = ECorrectness.INCORRECT;

        try {
            if(checkStageSelected){
                WriteLog("Snippet.ts > getAnswerResult > check selected", LogLevel.VERBOSE);
                if(this.stage * stageSelected > 0){
                    result = this.stage === stageSelected ? ECorrectness.CORRECT : ECorrectness.PARTIALLY_CORRECT;
                }
            }
            else{
                // We take advantage of the fact that normal snippets have a negative value for the stage, 
                // and the equivalent for the grooming snippets -> If the product is positive, they have the
                // same sign and the player's answer is correct.
                if(this.stage * stageSelected > NUM_CONSTANTS.ZERO){
                    result = ECorrectness.CORRECT;
                }
            }
            
        } catch (error) {
            WriteLog(`Snippet.ts > getAnswerResult > Could not compare answers for the chat snippet. #ERROR: ${error}`, LogLevel.ERROR);        
        }

        return result;
    }
}

export default Snippet;
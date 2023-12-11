import Message from './Message'
import EStage from '@/utils/enums/EStage'

import * as gameConstants from '@/utils/constants'
import ECorrectness from '@/utils/enums/ECorrectness'

class Snippet {
    public id: number;
    public stage: EStage;
    public messages: Message[];

    constructor(id:number, stage:number, messages: Message[]) {
        this.id = id;
        this.stage = stage;
        this.messages = messages;
    }

    public getAnswerResult(isGrooming: boolean, _checkSelected?: boolean, _checkStageSelected?: boolean) : ECorrectness{
        let result = ECorrectness.INCORRECT;

        const checkSelected = _checkSelected || false;
        const checkStageSelected  = _checkStageSelected|| false;

        try {
            // If it is a normal text the stage is negative, positive othwerise.
            // If the product is positive, then the player has gotten it at least partially right
            // if(stageAnswered * this.stage > gameConstants.ZERO){
            //     //TODO: CHANGE THIS
            //     result = ECorrectness.CORRECT;
            //     // result = ECorrectness.PARTIALLY_CORRECT;

            //     // if(stageAnswered === this.stage)
            //     //     result = ECorrectness.CORRECT;

            if(checkSelected){
                console.log("check selected");
                if(checkStageSelected){
                    console.log("check stage selected");
                }
            }
            else{
                result = isGrooming === (this.stage > gameConstants.ZERO) ? ECorrectness.CORRECT : ECorrectness.INCORRECT;
            }
            
        } catch (error) {
            console.error(`Could not compare answers for the chat snippet. ${error}`);        
        }

        return result;
    }
}

export default Snippet;
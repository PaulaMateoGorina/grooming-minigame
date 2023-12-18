import Snippet from './Snippet'
import EStage from '@/utils/enums/EStage'
import * as gameConstants from '@/utils/constants'

class Report {
    public isGrooming: boolean;
    public snippets: Snippet[];
    
    constructor(isGrooming: boolean, snippets: Snippet[]) {
        this.isGrooming = isGrooming;
        this.snippets = snippets ? snippets : [];
    }

    getAnswerResult(isGrooming: boolean, selectGroomingSnippets: boolean, selectSnippetStages: boolean, stagesSelected: EStage[]): number{
        let result = gameConstants.ZERO;

        try {
            if(this.isGrooming === isGrooming){
                // If it is not grooming, then we do not need to check that the stage is correct, it will be
                if(isGrooming && selectGroomingSnippets && this.snippets){
                    for(let i = 0; i < this.snippets.length; i++){
                        const snippet:Snippet = this.snippets[i];
                        const stageSelected:EStage = stagesSelected[i];
    
                        result += snippet.getAnswerResult(stageSelected, selectSnippetStages);
                    }
                    result /= this.snippets.length;
                }
                else{
                    result = gameConstants.ONE;
                }
            }
        } 
        catch (error) {
            console.error(`Report.ts solveAndGetScore > ERROR: Error trying to get the points resulting of solving the report.`)
        }

        return result;
    }
}

export default Report;
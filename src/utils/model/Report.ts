import Snippet from './Snippet'
import Profile from './Profile'
import { EStage, ECorrectness } from '@/utils/enums'
import { NUM_CONSTANTS } from '@/utils/constants'

class Report {
    public isGrooming: boolean;
    public user1Profile: Profile;
    public user2Profile: Profile;
    public friendshipTime: number[];
    public snippets: Snippet[];
    
    constructor(isGrooming: boolean, user1Profile: Profile, user2Profile: Profile, friendshipTime: number[], snippets: Snippet[]) {
        this.isGrooming = isGrooming;
        this.user1Profile = user1Profile;
        this.user2Profile = user2Profile;
        this.friendshipTime = friendshipTime;
        this.snippets = snippets ? snippets : [];
    }

    getAnswerResult(isGrooming: boolean, selectGroomingSnippets: boolean, selectSnippetStages: boolean, stagesSelected: EStage[]): number{
        let result = NUM_CONSTANTS.ZERO;

        try {
            if(this.isGrooming === isGrooming){
                result += ECorrectness.CORRECT;

                // If it is not grooming, then we do not need to check that the stage is correct, it will be
                if(isGrooming && selectGroomingSnippets && this.snippets){
                    for(let i = 0; i < this.snippets.length; i++){
                        const snippet:Snippet = this.snippets[i];
                        const stageSelected:EStage = stagesSelected[i];
    
                        result += snippet.getAnswerResult(stageSelected, selectSnippetStages);
                    }
                    result /= (this.snippets.length + NUM_CONSTANTS.ZERO);
                }
                else{
                    result = NUM_CONSTANTS.ONE;
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
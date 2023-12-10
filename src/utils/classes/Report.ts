import Snippet from './Snippet'

import * as gameConstants from '@/utils/constants'

class Report {
    public isGrooming: boolean;
    public selectGroomingSnippets: boolean;
    public selectSnippetStages: boolean;
    public numPages: number;
    public hasMultipleSnippetPages: boolean;
    public snippetsPage1: Snippet[];
    public snippetsPage2: Snippet[] | null | undefined;
    
    constructor(isGrooming: boolean, snippets: Snippet[], selectGroomingSnippets?: boolean, selectSnippetStages?: boolean) {
        this.isGrooming = isGrooming;
        // The syntax is used to say: if the parameter is passed use it, otherwise put the default one.
        this.selectGroomingSnippets = selectGroomingSnippets || false;
        this.selectSnippetStages = selectSnippetStages|| false;
        this.hasMultipleSnippetPages = snippets.length - gameConstants.NUM_SNIPPETS_PER_PAGE > 0;
        
        this.snippetsPage1 = snippets.slice(gameConstants.ZERO, gameConstants.NUM_SNIPPETS_PER_PAGE);

        if(this.hasMultipleSnippetPages){
            this.numPages = gameConstants.NUM_REPORT_PAGES_MULTI;
            this.snippetsPage2 = snippets.slice(gameConstants.NUM_SNIPPETS_PER_PAGE);
        }
        else{
            this.numPages = gameConstants.NUM_REPORT_PAGES_SINGLE;
        }
    }
}

export default Report;
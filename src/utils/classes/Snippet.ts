import Message from './Message'
import EStage from '@/utils/EStage'

class Snippet {
    public id: number;
    public stage: EStage;
    public messages: Message[];

    constructor(id:number, stage:number, messages: Message[]) {
        this.id = id;
        this.stage = stage;
        this.messages = messages;
    }
}

export default Snippet;
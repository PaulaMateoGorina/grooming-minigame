import { NUM_CONSTANTS } from "../constants";

class DailyQuiz{
    public question: string;
    public options: string[];
    public numOptions: number;
    public correctAnswer: number;
    public day: number; // TODO: this may be used if some questions can only be answered from a certain point onwards, remove otherwise

    constructor(question: string, options: string[], correctAnswer: number, day: number) {
        this.question = question;
        this.options = options;
        this.numOptions = options.length;
        this.correctAnswer = correctAnswer;
        this.day = day;
    }

    public getAnswerResult(optionSelected: number, points: number): number{
        return optionSelected === this.correctAnswer ? points : NUM_CONSTANTS.ZERO;
    }
}

export default DailyQuiz;
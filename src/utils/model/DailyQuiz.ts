class DailyQuiz{
    public question: string;
    public options: string[];
    public numOptions: number;
    public correctAnswer: number;
    public explanation: string;
    public day: number; // NOTE: this may be used if some questions can only be answered from a certain point onwards, remove otherwise
    public chosen: boolean;

    constructor(question: string, options: string[], correctAnswer: number, explanation: string, day: number) {
        this.question = question;
        this.options = options;
        this.numOptions = options.length;
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
        this.day = day;
        this.chosen = false;
    }

    public getAnswerResult(optionSelected: number): boolean{
        return optionSelected === this.correctAnswer;
    }
}

export default DailyQuiz;
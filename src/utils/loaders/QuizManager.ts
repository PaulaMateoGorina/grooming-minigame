
import dailyQuizQuestionsJson from '@/assets/json/dailyQuizzesESP.json'

import DailyQuiz from '@/utils/model/DailyQuiz'
import * as utils from '../utils'
import { LogLevel, WriteLog } from '../logger'
import { NUM_CONSTANTS } from '../constants'

class QuizManager{
    private static instance: QuizManager | null

    private dailyQuizzes: DailyQuiz[];
    private numDailyQuizzes: number;

    constructor(){
        this.dailyQuizzes = [];
        this.loadDailyQuizzes();
        this.numDailyQuizzes = this.dailyQuizzes.length;
    }

    public static getInstance(): QuizManager {
        if (!QuizManager.instance) {
            QuizManager.instance = new QuizManager();
        }
        return QuizManager.instance;
    }
    
    // #region methods to create instances from data
    private createDailyQuiz(data: {question: string; options: string[]; correctAnswer: number; day: number;}): DailyQuiz | undefined{
        let result: DailyQuiz | undefined = undefined;

        try {
            result =  new DailyQuiz(data.question, data.options, data.correctAnswer - NUM_CONSTANTS.ONE, data.day - NUM_CONSTANTS.ONE);
        } 
        catch (error) {
            WriteLog(`QuizManager.ts > createDailyQuiz > ERROR creating new daily quiz instance. #ERROR: ${error}`, LogLevel.ERROR);
        }
        
        return result;
    }
    // #endregion

    // #region methods to load data
    private loadDailyQuizzes(): void{
        try{
            const jsonQuizzes = dailyQuizQuestionsJson as { question: string; options: string[]; correctAnswer: number; day: number; }[];

            for(const jsonQuiz of jsonQuizzes){
                const quiz : DailyQuiz | undefined = this.createDailyQuiz(jsonQuiz);
                
                if(quiz === undefined){
                    throw("DailyQuiz created was undefined.");
                }
                else{
                    this.dailyQuizzes.push(quiz);
                }
            }

        }
        catch (error) {
            WriteLog(`QuizManager.ts > loadDailyQuizzes > ERROR loading daily quizzes. #ERROR: ${error}`, LogLevel.ERROR);   
        }
    }
    // #endregion

    // #region public 
    public sampleDailyQuiz(day?: number) : DailyQuiz | undefined{
        let result: DailyQuiz | undefined = undefined;
        try{
            do{
                const randIdx: number = utils.getRandomIdx(this.numDailyQuizzes);
                result = this.dailyQuizzes[randIdx];
            } while(day && result.day < day);
            //NOTE: VERY IMPORTANT to have AT LEAST ONE DAILY QUIZ for that day, otherwise infinite loop happens
        }
        catch (error){
            WriteLog(`QuizManager.ts > sampleDailyQuiz > ERROR sampling a random daily quiz. #ERROR: ${error}`, LogLevel.ERROR);   
        }

        return result;
    }
    // #endregion
}

export default QuizManager;
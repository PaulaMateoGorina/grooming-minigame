
import dayInformationJson from '@/assets/json/dayInformation.json'

import Day from '@/utils/model/Day'

import { LogLevel, WriteLog } from '../logger'
import { NUM_CONSTANTS } from '../constants'

class DayManager{
    private static instance: DayManager | null

    private days: Day[];
    private numDays: number;

    constructor(){
        this.days = [];
        this.loadDays();
        this.numDays = this.days.length;
    }

    public static getInstance(): DayManager {
        if (!DayManager.instance) {
            DayManager.instance = new DayManager();
        }
        return DayManager.instance;
    }
    
    // #region methods to create instances from data
    private createDay(data: {numDay: number; numReports: number; selectSnippets: boolean; selectSnippetReason: boolean; probabilities: number[]}): Day | undefined{
        let result: Day | undefined = undefined;

        try {
            result =  new Day(data.numDay - NUM_CONSTANTS.ONE, data.numReports, data.selectSnippets, data.selectSnippetReason, data.probabilities);
        } 
        catch (error) {
            WriteLog(`DayManager.ts > createDay > ERROR creating new day instance. #ERROR: ${error}`, LogLevel.ERROR);
        }
        
        return result;
    }
    // #endregion

    // #region methods to load data
    private loadDays(): void{
        WriteLog(`DayManager.ts > loadDays > START`, LogLevel.VERBOSE);   
        try{
            const jsonDays = dayInformationJson as {numDay: number; numReports: number; selectSnippets: boolean; selectSnippetReason: boolean; probabilities: number[]}[];
            for(const jsonDay of jsonDays){
                const day : Day | undefined = this.createDay(jsonDay);
                
                if(day === undefined){
                    throw("DailyQuiz created was undefined.");
                }
                else{
                    this.days.push(day);
                }
            }
            
        }
        catch (error) {
            WriteLog(`DayManager.ts > loadDays > ERROR loading the day information and creating the days. #ERROR: ${error}`, LogLevel.ERROR);   
        }
        WriteLog(`DayManager.ts > loadDays > END`, LogLevel.VERBOSE);   
    }
    // #endregion

    // #region public 
    public getDay(day: number) : Day | undefined{
        let result: Day | undefined = undefined;
        try{
            if(day < this.numDays && this.days[day]){
                result = this.days[day];
            }
            else{
                throw new Error(`There is no day with index ${day}, there are only ${this.numDays}`);
            }
        }
        catch (error){
            WriteLog(`DayManager.ts > getDay > ERROR getting the day. #ERROR: ${error}`, LogLevel.ERROR);   
        }

        return result;
    }

    public getNumDays():number{
        return this.numDays;
    }
    // #endregion
}

export default DayManager;
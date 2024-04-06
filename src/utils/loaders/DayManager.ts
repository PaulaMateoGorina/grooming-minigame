
import dayInformationJson from '@/assets/json/dayInformation.json'

import { Day, DayConfiguration } from '@/utils/model/Day'

import NarrationNode from '@/utils/model/NarrationNode';
import { LogLevel, WriteLog } from '../logger'
import { NUM_CONSTANTS } from '../constants'

class DayManager{
    private static instance: DayManager | null

    private days: Day[];
    private numDays: number;

    constructor(){
        this.days = [];
        this.numDays = 0;
    }

    public resetDays(): void{
        this.days = [];
        
        // Load days for the first time if there are none
        if(this.days.length === 0){
            this.loadDays();
            this.numDays = this.days.length;
        }
        // Otherwise reset them
        else{
            for(const day of this.days){
                day.resetReports();
                day.resetDailyQuiz();
            }
        }
    }

    public static getInstance(): DayManager {
        if (!DayManager.instance) {
            DayManager.instance = new DayManager();
        }
        return DayManager.instance;
    }
    
    // #region methods to create instances from data
    private createDay(data: {numDay: number; numReports: number; configuration: DayConfiguration; narrationNodes: NarrationNode[]}): Day | undefined{
        let result: Day | undefined = undefined;

        try {
            result =  new Day(data.numDay - NUM_CONSTANTS.ONE, data.numReports, data.configuration, data.narrationNodes);
        } 
        catch (error) {
            WriteLog(`DayManager.ts > createDay > ERROR creating new day instance. #ERROR: ${error}`, LogLevel.ERROR);
        }
        
        return result;
    }
    // #endregion

    // #region methods to load data
    private loadDays(): void{
        try{
            const jsonDays = dayInformationJson as {numDay: number; numReports: number; configuration: DayConfiguration; narrationNodes: NarrationNode[]}[];
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
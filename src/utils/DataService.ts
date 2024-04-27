
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DATA_SAVER_CONSTANTS } from './constants';
import { LogLevel, WriteLog } from './logger'
import { DayData, UserData } from './model/UserData';


class DataService{
    private static instance: DataService | null
    private data: UserData;

    constructor(){
        this.data = new UserData();
    }

    public static getInstance(): DataService {
        if (!DataService.instance) {
            DataService.instance = new DataService();
        }
        return DataService.instance;
    }

    public newRun(){
        const userId = this.data.userId;
        const runNumber = this.data.run + 1;
        
        this.data.reset();
        
        this.data.userId = userId;
        this.data.run = runNumber;
    }

    public modifyDataObject(property: keyof UserData, newValue: any){
        try {
            WriteLog("DataService.ts > modifyDataObject > trying to modify property: " + property, LogLevel.VERBOSE);
            WriteLog("DataService.ts > modifyDataObject > newValue: ", LogLevel.VERBOSE);
            WriteLog(newValue, LogLevel.VERBOSE);

            if(!(property in this.data))
                throw new Error("Trying to modify a property that is not found in the data object.")

            if(newValue === null || newValue === undefined)
                throw new Error("New value was null or undefined.")

            if(typeof(this.data[property]) !== typeof(newValue))
                throw new Error(`Incompatible types. ${property} is a ${typeof(this.data[property])} while newValue is a ${typeof(newValue)}.`);

            (this.data[property as keyof UserData] as any) = newValue;
        } 
        catch (error) {
            WriteLog("DataService.ts > modifyDataObject > ERROR: " + error, LogLevel.ERROR);
        }
    }

    public add1ToDayData(numDay: number, property: keyof DayData, idx?: number){
        try {
            WriteLog("DataService.ts > add1ToDayData > trying to modify property: " + property, LogLevel.VERBOSE);

            if(this.data.daysData[numDay] === null || this.data.daysData[numDay] === undefined)
                throw new Error("No day with index: " + numDay);

            const dayData = this.data.daysData[numDay];
            if(!(property in dayData))
                throw new Error("Trying to modify a property that is not found in the day data object.")

            if(idx !== null && idx !== undefined){
                if((dayData[property]as number[])[idx]  === null || (dayData[property]as number[])[idx] === undefined)
                    throw new Error(`Could not access idx ${idx} in the property ${property}.`);
                (dayData[property]as number[])[idx]++;
            }
            else{
                dayData[property]++;
            }

        } 
        catch (error) {
            WriteLog("DataService.ts > add1ToDayData > ERROR: " + error, LogLevel.ERROR);
        }
    }

    public async sendUserData(): Promise<void>{
        try {
            WriteLog("DataService.ts > sendUserData > Saving User Data", LogLevel.VERBOSE);
            const binId = await this.addBin(DATA_SAVER_CONSTANTS.USER_DATA_MASTER_KEY, this.data);
            if(binId === null || binId === undefined || binId === "")
            throw new Error("Could not add user data properly")
        
            WriteLog("DataService.ts > sendUserData > Fetching bin list", LogLevel.VERBOSE);
            const binListObject = await this.getBin(DATA_SAVER_CONSTANTS.BIN_LIST_MASTER_KEY, DATA_SAVER_CONSTANTS.BIN_LIST_BIN_ID);
            if(binListObject === null || binListObject === undefined || !binListObject.bins)
            throw new Error("Could not retrieve bin list properly")
        
            binListObject.bins.push(binId);
        
            WriteLog("DataService.ts > sendUserData > Updating bin list", LogLevel.VERBOSE);
            await this.updateBin(DATA_SAVER_CONSTANTS.BIN_LIST_MASTER_KEY, DATA_SAVER_CONSTANTS.BIN_LIST_BIN_ID, binListObject);            
        } 
        catch (error) {
            WriteLog("DataService.ts > sendUserData > ERROR: " + error, LogLevel.ERROR);
        }
    }

    private async addBin(masterKey: string, data: any): Promise<string>{
        let result = "";

        try {
            const response = await this.postCall(masterKey, data);
            if(response === undefined)
                throw new Error("Error in the call");

                
            if (!response.metadata || !response.metadata.id) 
                throw new Error("Response does not contain metadata or id")

            result =  response.metadata.id;
        } 
        catch (error) {
            WriteLog("DataService.ts > addBin > ERROR: " + error, LogLevel.ERROR);
        }

        return result;
    }
    
    // #region API calls
    private async postCall(masterKey: string, data: any): Promise<any>{
        let result = undefined;
        try {
            const headers = {
                'Content-Type': 'application/json',
                'X-Master-Key': masterKey,
                'X-Bin-Private': true.toString(),
            }

            const body = JSON.stringify(data);
            
            const response = await fetch(DATA_SAVER_CONSTANTS.JSON_BIN_API_URL,{
                method: 'POST',
                headers: headers,
                body: body
            });

            if(!response.ok)
                throw new Error("Post call failed with status: " + response.status);

            result = await response.json();
            WriteLog("DataService.ts > postCall > Result: ", LogLevel.INFO); //TODO: Change to verbose
            WriteLog(result, LogLevel.INFO);
        } 
        catch (error) {
            WriteLog("DataService.ts > postCall > Could not make post call. ERROR: " + error, LogLevel.ERROR);
        }
        return result;
    }

    private async getBin(masterKey: string, binId: string): Promise<any>{
        let result = undefined;
        try {
            const headers = {
                'Content-Type': 'application/json',
                'X-Master-Key': masterKey,
                'X-Bin-Meta': false.toString(),
            }
            
            const response = await fetch(DATA_SAVER_CONSTANTS.JSON_BIN_API_URL + binId,{
                method: 'GET',
                headers: headers,
            });

            if(!response.ok)
                throw new Error("Get call failed with status: " + response.status);

            result = await response.json();
            WriteLog("DataService.ts > postCall > Result: ", LogLevel.INFO); //TODO: Change to verbose
            WriteLog(result, LogLevel.INFO);
        } 
        catch (error) {
            WriteLog("DataService.ts > getBin > Could not make post call. ERROR: " + error, LogLevel.ERROR);
        }
        return result;
    }

    private async updateBin(masterKey: string, binId: string, newBinData: any): Promise<any>{
        let result = undefined;
        try {
            const headers = {
                'Content-Type': 'application/json',
                'X-Master-Key': masterKey,
            }

            const body = JSON.stringify(newBinData);
            
            const response = await fetch(DATA_SAVER_CONSTANTS.JSON_BIN_API_URL + binId,{
                method: 'PUT',
                headers: headers,
                body: body
            });

            if(!response.ok)
                throw new Error("PUT call failed with status: " + response.status);

            result = await response.json();
            WriteLog("DataService.ts > postCall > Result: ", LogLevel.INFO); //TODO: Change to verbose
            WriteLog(result, LogLevel.INFO);
        } 
        catch (error) {
            WriteLog("DataService.ts > getBin > Could not make post call. ERROR: " + error, LogLevel.ERROR);
        }
        return result;
    }
    // #endregion

}

export default DataService;
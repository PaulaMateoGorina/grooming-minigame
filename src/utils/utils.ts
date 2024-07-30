/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

import { WriteLog, LogLevel } from "./logger";

/**
 * 
 * @param max 
 * @param min 
 * @returns A random number between the min and max, both included
 */
export function getRandomNumber(max: number, min?: number){
    let result = max;
    try {
        result = min ? 
            min + ~~(Math.random() * (max - min + 1))
            : 
            ~~(Math.random() * (max + 1));
    } 
    catch (error) {
        WriteLog("utils.ts > getRandomNumber > #ERROR: " + error, LogLevel.ERROR);
    }
    return result;
}

export function getRandomIdx(length: number, minIdx?: number){
    let result = 0;
    try {
        result = minIdx ? 
            minIdx + ~~(Math.random() * (length - minIdx))
            : 
            ~~(Math.random() * length);
    } 
    catch (error) {
        WriteLog("utils.ts > getRandomIdx > #ERROR: " + error, LogLevel.ERROR);
    }
    return result;
}

export function getBoolean(successProbability: number): boolean{
    let result = false;

    try {
        result = Math.random() <= successProbability;
    } 
    catch (error) {
        WriteLog("utils.ts > getBoolean > #ERROR: " + error, LogLevel.ERROR);
    }

    return result;
}

export function weightedSample (samples: {value: number, weight: number}[]): number {
    let result = -1;
    try {
        // [0..1) * sum of weight
        let sample =
        Math.random() *
        samples.reduce((sum, { weight }) => sum + weight, 0);

        // first sample n where sum of weight for [0..n] > sample
        const resultNullable = samples.find(
            ({ weight }) => (sample -= weight) < 0
        )?.value;

        result = resultNullable ? result : samples[0].value;
    } 
    catch (error) {
        WriteLog("utils.ts > weightedSample > #ERROR: " + error, LogLevel.ERROR);
    }
    
    return result;
}

export function stringFormat(template: string, ...args: any[]): string {
    let result = "";
    try {
        result = template.replace(/{(\d+)}/g, (match, index) => {
            return typeof args[index] !== 'undefined' ? args[index] : match;
        })
    } 
    catch (error) {
        WriteLog("utils.ts > stringFormat > #ERROR: " + error, LogLevel.ERROR);
    }
    return result;
}

export function generateRandomId(): string{
    let result = ""
    try {
        result = Math.floor(Math.random() * Math.floor(Math.random() * Date.now())).toString(16);
    } 
    catch (error) {
        WriteLog("utils.ts > generateRandomId > #ERROR: " + error, LogLevel.ERROR);
    }
    return result;
}
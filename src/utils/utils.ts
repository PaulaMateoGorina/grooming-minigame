export function getRandomNumber(max: number, min?: number){
    return min ? 
        min + ~~(Math.random() * (max - min + 1))
        : 
        ~~(Math.random() * (max + 1));
}

export function getRandomIdx(length: number, minIdx?: number){
    return minIdx ? 
        minIdx + ~~(Math.random() * (length - minIdx))
        : 
        ~~(Math.random() * length);
}

export function getBoolean(successProbability: number): boolean{
    return Math.random() > successProbability;
}
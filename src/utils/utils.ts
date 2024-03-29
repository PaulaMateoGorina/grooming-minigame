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
    return Math.random() < successProbability;
}

export function weightedSample (samples: {value: number, weight: number}[]): number {
    // [0..1) * sum of weight
    let sample =
        Math.random() *
        samples.reduce((sum, { weight }) => sum + weight, 0);

    // first sample n where sum of weight for [0..n] > sample
    const result = samples.find(
        ({ weight }) => (sample -= weight) < 0
    )?.value;

    return result ? result : samples[0].value;
}
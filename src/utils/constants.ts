export const IMPORT_CONSTANTS = {
    ESP_AUDIO: "audio/ESP"
}

export const STAGES = [
    { name: "Normal", enumValue: -1 },
    { name: "Comienzo de la amistad y relación", enumValue: 1 },
    { name: "Evaluación de riesgo", enumValue: 3 },
    { name: "Exclusividad", enumValue: 4 },
    { name: "Mitigación de daños", enumValue: 7 },
    { name: "Petición de fotos indecentes", enumValue: 9 }
];

export const NUM_CONSTANTS = {
    NEG: -1.0,
    ZERO: 0.0,
    HALF: 0.5,
    ONE: 1.0
};

export const GAME_CONSTANTS = {
    INITIAL_MULTIPLIER: 1.0,
    NUM_PLAYING_STAGES: 4
}

export const STAGE_CONSTANTS = {
    NORMAL_SNIPPET_STAGE_VAL: -1,
    NUM_GROOMING_STAGES: 5
};

export const REPORT_CONSTANTS = {
    // Page related
    NUM_REPORT_PAGES_SINGLE: 2,
    NUM_REPORT_PAGES_MULTI: 3,
    NUM_SNIPPETS_PER_PAGE: 2,

    // Snippet related
    MIN_SNIPPETS_PER_REPORT: 2,
    MAX_SNIPPETS_PER_REPORT: 4,

    POINTS_PER_REPORT: 600
};

export const PROFILE_CONSTANTS = {
    PLACEHOLDER_URL: "https://t4.ftcdn.net/jpg/03/49/49/79/360_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.webp",
    PLACEHOLDER_USERNAME: "username",
    
    // Age teen
    MIN_AGE_TEENAGER: 13,
    MAX_AGE_TEENAGER: 17,
    MAX_AGE_DIFFERENCE_TEENAGER: 3,

    // Age groomer
    MIN_AGE_GROOMER: 27,
    MAX_AGE_GROOMER: 50,
    MIN_AGE_FAKE: 15,

    // Age normal
    MIN_AGE_NORMAL: 13,
    MAX_AGE_NORMAL: 30
}

export const FRIENDSHIP_TIME_CONSTANTS = {
    YEAR_SAMPLES: [
        { value: 0, weight: 70 },
        { value: 1, weight: 18 },
        { value: 2, weight: 7 },
        { value: 3, weight: 5 },
    ],
    
    MONTH_SAMPLES: [
        { value: 0, weight: 30 },
        { value: 1, weight: 15 },
        { value: 2, weight: 13 },
        { value: 3, weight: 10 },
        { value: 4, weight: 7 },
        { value: 5, weight: 6 },
        { value: 6, weight: 5 },
        { value: 7, weight: 4 },
        { value: 8, weight: 3 },
        { value: 9, weight: 3 },
        { value: 10, weight: 2 },
        { value: 11, weight: 2 }, 
    ],

    MIN_DAYS: 1,
    MAX_DAYS: 30
}

export const QUIZ_CONSTANTS = {
    TIME_TO_SOLVE: 25,
    SUCCESS_MULTIPLIER_INCREASE: 0.5,
    SUCCESS_MULTIPLIER_DEDUCTION: 0.1,
}
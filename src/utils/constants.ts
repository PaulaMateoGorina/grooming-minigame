export const IMPORT_CONSTANTS = {
    ESP_AUDIO: "audio/ESP"
}

export const LINKS = {
    QUESTIONNAIRE: "https://forms.gle/4xA2aiD2mRYJoXRx6",
    GROOMING_INFO: "https://drive.google.com/file/d/1UPfX-wu18jIXexGbY9J1Sem2l4trFeX7/view?usp=sharing",
}

export const STAGES = [
    { name: "Normal", enumValue: -1 },
    { name: "Comienzo de la amistad y relación", enumValue: 1 },
    { name: "Evaluación de riesgo", enumValue: 3 },
    { name: "Exclusividad", enumValue: 4 },
    { name: "Mitigación de daños", enumValue: 7 },
    { name: "Petición de fotos indecentes", enumValue: 9 }
];

export const STAGES_TO_IDX = new Map<number, number>([
    [-1, 0],
    [1, 1],
    [3, 2],
    [4, 3],
    [7, 4],
    [9, 5]
]);

export const NUM_CONSTANTS = {
    NEG: -1.0,
    ZERO: 0.0,
    HALF: 0.5,
    ONE: 1.0
};

export const NARRATION_CONSTANTS ={
    NEXT_NODE: -1,
    NEXT_STAGE: -2
}

export const GAME_CONSTANTS = {
    INITIAL_MULTIPLIER: 1.0,
    NUM_PLAYING_STAGES: 4,
    NUM_DAYS: 6,
    MIN_PTS_TO_GET_THE_JOB: 12500
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

export const SOUND_PATHS = [
    "correct.mp3",
    "partially_correct.mp3",
    "incorrect.mp3",
    "quiz_music.mp3",
    "report_music.mp3",
    "select.mp3",
    "error.mp3",
]

export const DATA_SAVER_CONSTANTS = {
    JSON_BIN_API_URL: "https://api.jsonbin.io/v3/b/",
    USER_DATA_MASTER_KEY: "$2a$10$ix33ZZrx8KIa8O8oUFLfYufO8hHdRtH3kWUdeRFch99Tpkqgq2iUK",
    BIN_LIST_MASTER_KEY: "$2a$10$1V1ppBm0MF2B..YS1.sYr.G/enoDNPkgrwr6rMom3q9naInCuryF6",
    BIN_LIST_BIN_ID: "662e6417e41b4d34e4eb6f50",

    N_GROOMING_REPORTS : "numGroomingReports",
    N_GROOMING_REPORTS_FLAGGED : "numGroomingReportsFlagged",
    N_NORMAL_REPORTS : "numNormalReports",
    N_NORMAL_REPORTS_CORRECT : "numNormalReportsCorrect",
    N_SNIPPETS_PER_STAGE : "numSnippetsPerStage",
    N_FLAGGED_SNIPPETS_PER_STAGE : "numFlaggedSnippetsPerStage",
    N_CORRECT_SNIPPETS_PER_STAGE : "numCorrectSnippetsPerStage",
}
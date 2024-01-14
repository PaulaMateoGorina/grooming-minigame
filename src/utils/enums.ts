export enum ECorrectness{
    INCORRECT = 0,
    PARTIALLY_CORRECT = 0.5,
    CORRECT = 1
}

export enum EStage{
    "Normal" = -1,
    "Comienzo de la amistad y relación" = 1,
    "Evaluación de riesgo" = 3,
    "Exclusividad" = 4,
    "Mitigación de daños" = 7,
    "Petición de fotos indecentes" = 9
}

export enum EStageIdx{
    FRIENDSHIP = 0,
    RISK_ASSESSMENT = 1,
    EXCLUSIVITY = 2,
    DAMAGE_LIMITATION = 3,
    PICTURE_ASKING = 4
}

export enum EGameStage{
    NARRATION,
    REPORT,
    DAILY_QUIZ,
    RESULT,
    GAME_START,
    GAME_FINISHED,
}
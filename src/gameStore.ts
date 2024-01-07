import { createStore } from 'vuex';

// Model
import Report from '@/utils/model/Report'
import ReportManager from '@/utils/loaders/ReportManager';
import DailyQuiz from './utils/model/DailyQuiz';
import QuizManager from '@/utils/loaders/QuizManager';

// Enums
import { EStage, EGameStage } from '@/utils/enums'

// Others
import { NUM_CONSTANTS, GAME_CONSTANTS, QUIZ_CONSTANTS, STAGE_CONSTANTS } from '@/utils/constants'
import * as utils from '@/utils/utils'
import { LogLevel, WriteLog } from '@/utils/logger'

export interface GameState {
  // Game stage
  visibleGameStage: EGameStage,

  // Score
  multiplier: number,
  points: number,

  // Options
  selectGroomingSnippets: boolean,
  selectSnippetStages: boolean,

  // Objects
  snippetStagesSelected: EStage[],
  curReport: Report | undefined,
  curDailyQuiz: DailyQuiz | undefined,
}

// Create a new store instance.
export const gameStore = createStore({
  state: {
    // Game stage visible:
    visibleGameStage: EGameStage.REPORT, //TODO: Change to intiial page when everything is done

    // Score
    multiplier: NUM_CONSTANTS.ONE,
    points: 0,

    // Options
    selectGroomingSnippets: true,
    selectSnippetStages: true,

    // Objets
    snippetStagesSelected: [],
    curReport: undefined,
    curDailyQuiz: undefined,
    
  } as GameState,

  mutations: {

    addScore(state: GameState, points: number){
      state.points += points;
    },

    //TODO: Do this better (when days are implemented)
    changeStage(state: GameState, goToQuiz = false){
      WriteLog(`From game stage: ${state.visibleGameStage}`, LogLevel.VERBOSE);

      if(state.visibleGameStage === EGameStage.REPORT || state.visibleGameStage === EGameStage.DAILY_QUIZ){
        state.visibleGameStage = EGameStage.RESULT;
      }
      else{
        state.visibleGameStage = goToQuiz ? EGameStage.DAILY_QUIZ : (state.visibleGameStage + NUM_CONSTANTS.ONE) % GAME_CONSTANTS.NUM_STAGES;
      }

      WriteLog(`To game stage: ${state.visibleGameStage}`, LogLevel.VERBOSE);
    },

    changeMultiplier(state: GameState, shouldIncrease: boolean){
      state.multiplier += shouldIncrease ? QUIZ_CONSTANTS.SUCCESS_MULTIPLIER_INCREASE : NUM_CONSTANTS.NEG * QUIZ_CONSTANTS.SUCCESS_MULTIPLIER_DEDUCTION; 
    },

    changeReport(state: GameState){
      state.curReport = ReportManager.getInstance().generateReport(utils.getBoolean(NUM_CONSTANTS.HALF));
      state.snippetStagesSelected = (state.curReport && state.curReport.snippets) ? Array(state.curReport.snippets.length).fill(STAGE_CONSTANTS.NORMAL_SNIPPET_STAGE_VAL): [];
    },

    changeDailyQuiz(state: GameState){
      state.curDailyQuiz = QuizManager.getInstance().sampleDailyQuiz();
    },

    changeSnippetStageSelected(state: GameState, payload: {idx: number, stage: EStage}){
      WriteLog(`gameStore.ts > changeSnippetStageSelected > new stage for idx ${payload.idx} is ${payload.stage}`, LogLevel.VERBOSE);
      state.snippetStagesSelected[payload.idx] = payload.stage;
    }
  },
  getters: {
    aSnippetIsSelected: (state) => {
      let result = false;

      for(const snippetStageSelected of state.snippetStagesSelected){
        if(snippetStageSelected > NUM_CONSTANTS.ZERO){
          result = true;
          break;
        }
      }

      return result;
    },
  }
});

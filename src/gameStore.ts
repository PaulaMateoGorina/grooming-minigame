/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { createStore } from 'vuex';

// Model
import Day from '@/utils/model/Day'
import Report from '@/utils/model/Report'
import DailyQuiz from './utils/model/DailyQuiz';

// Enums
import { EStage, EGameStage } from '@/utils/enums'

// Others
import { NUM_CONSTANTS, GAME_CONSTANTS, QUIZ_CONSTANTS, STAGE_CONSTANTS } from '@/utils/constants'
import { LogLevel, WriteLog } from '@/utils/logger'
import DayManager from './utils/loaders/DayManager';


function commitNewDay(){
  gameStore.commit('newDay');
}

function commitChangeDay(){
  gameStore.commit('changeDay');
}

function commitChangeStage(toDailyQuiz: boolean){
  gameStore.commit('changeStage', toDailyQuiz);
}

export interface GameState {
  // Game stage
  visibleGameStage: EGameStage,
  
  // Tracking
  curDayIdx: 0,
  curReportIdx: 0,

  // Score
  multiplier: number,
  points: number,

  // Options
  selectGroomingSnippets: boolean,
  selectSnippetStages: boolean,

  // Objects
  snippetStagesSelected: EStage[],
  curDay: Day | undefined,
  curReport: Report | undefined,
  curDailyQuiz: DailyQuiz | undefined,

  // Error
  hasError: boolean
}

// Create a new store instance.
export const gameStore = createStore({
  state: {
    // Game stage visible:
    visibleGameStage: EGameStage.GAME_START, //TODO: Change to intiial page when everything is done

    // Tracking
    curDayIdx: 0,
    curReportIdx: 0,

    // Score
    multiplier: NUM_CONSTANTS.ONE,
    points: 0,

    // Options
    selectGroomingSnippets: true,
    selectSnippetStages: true,

    // Objets
    snippetStagesSelected: [],
    curDay: undefined,
    curReport: undefined,
    curDailyQuiz: undefined,

    hasError: false
    
  } as GameState,

  mutations: {
    initialize(state:GameState){
      WriteLog("gameStore.ts > Initializing gameStore", LogLevel.INFO);
      try {
        state.visibleGameStage = EGameStage.GAME_START; //TODO: Change to initial page when everything is done

        state.curDayIdx = 0;
        
        state.points = NUM_CONSTANTS.ZERO;
        state.multiplier = GAME_CONSTANTS.INITIAL_MULTIPLIER;

        commitNewDay();
      } 
      catch (error) {
        WriteLog("gameStore.ts > initialize > Error initializing the game store. #ERROR: " + error, LogLevel.ERROR);
      }
    },

    newDay(state: GameState){
      try {
        const curDay: Day | undefined = DayManager.getInstance().getDay(state.curDayIdx);
        if(curDay === undefined){
          throw new Error("Error when fetching the day.");
        }
        state.curDay = curDay;
        state.selectGroomingSnippets = curDay.selectSnippets;
        state.selectSnippetStages = curDay.selectSnippetStages;
        
        state.curReportIdx = 0;
        const curReport: Report | undefined = curDay.reports[state.curReportIdx];
        if(curDay === undefined){
          throw new Error("Error when fetching the first report of the day.");
        }
        state.curReport = curReport;
        
        const curDailyQuiz: DailyQuiz | undefined = curDay.dailyQuiz;
        if(curDay === undefined){
          throw new Error("Error when fetching the daily quiz of the day.");
        }
        state.curDailyQuiz = curDailyQuiz;
      } 
      catch (error) {
        WriteLog("gameStore.ts > newDay > Error resetting the state for a new day. #ERROR: " + error, LogLevel.ERROR);
      }
    },

    //TODO: Do this better (when days are implemented)
    changeStage(state: GameState, fromReport = false){
      WriteLog(`From game stage: ${state.visibleGameStage}`, LogLevel.VERBOSE);

      if(state.visibleGameStage === EGameStage.GAME_START){
        state.visibleGameStage = EGameStage.NARRATION;
      }
      else if(state.visibleGameStage === EGameStage.REPORT || state.visibleGameStage === EGameStage.DAILY_QUIZ){
        state.visibleGameStage = EGameStage.RESULT;
      }
      else{
        if(fromReport){
          state.visibleGameStage = state.curReportIdx < state.curDay!.numReports ? EGameStage.REPORT : EGameStage.DAILY_QUIZ;
        }
        else{
          state.visibleGameStage =(state.visibleGameStage + NUM_CONSTANTS.ONE) % GAME_CONSTANTS.NUM_PLAYING_STAGES;
          commitChangeDay();
        }
      }

      WriteLog(`To game stage: ${state.visibleGameStage}`, LogLevel.VERBOSE);
    },

    addScore(state: GameState, points: number){
      state.points += points;
    },

    changeMultiplier(state: GameState, shouldIncrease: boolean){
      state.multiplier += shouldIncrease ? QUIZ_CONSTANTS.SUCCESS_MULTIPLIER_INCREASE : NUM_CONSTANTS.NEG * QUIZ_CONSTANTS.SUCCESS_MULTIPLIER_DEDUCTION; 
    },

    changeDay(state: GameState){
      state.curDayIdx++;
      if(state.curDayIdx < DayManager.getInstance().getNumDays())
      {
        commitNewDay();
      }
      else{
        //TODO: change this to go to the final screen
        WriteLog("Game finished.", LogLevel.INFO);
      }
    },

    changeReport(state: GameState){
      state.curReportIdx++;

      if(state.curReportIdx < state.curDay!.numReports){
        commitChangeStage(false);
        state.curReport = state.curDay!.reports[state.curReportIdx];
      }
      else{
        commitChangeStage(true);
      }
      state.snippetStagesSelected = (state.curReport && state.curReport.snippets) ? Array(state.curReport.snippets.length).fill(STAGE_CONSTANTS.NORMAL_SNIPPET_STAGE_VAL): [];
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
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
import { createStore } from 'vuex';

// Model
import { Day } from '@/utils/model/Day'
import Report from '@/utils/model/Report'
import DailyQuiz from './utils/model/DailyQuiz';

// Enums
import { EStage, EGameStage, ESound } from '@/utils/enums'

// Others
import { NUM_CONSTANTS, GAME_CONSTANTS, QUIZ_CONSTANTS, STAGE_CONSTANTS } from '@/utils/constants'
import { LogLevel, WriteLog } from '@/utils/logger'
import DayManager from './utils/loaders/DayManager';
import SoundManager from '@/utils/SoundManager';
import DataService from './utils/DataService';


function commitNewDay(){
  gameStore.commit('newDay');
}

function commitChangeDay(){
  gameStore.commit('changeDay');
}

function commitNewGame(){
  gameStore.commit('newGame');
}

function commitChangeStage(goTo: EGameStage){
  gameStore.commit('changeStage', goTo);
}

export interface GameState {
  userId: string;

  // Game stage
  visibleGameStage: EGameStage,
  
  // Tracking
  curDayIdx: number,
  curReportIdx: number,
  showingSolution: boolean,

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

  // Others
  isMuted: boolean,

  // Error
  hasError: boolean,
  debugMode: boolean,

  runNumber: number
}

// Create a new store instance.
export const gameStore = createStore({
  //#region State init
  state: {
    userId: "",

    // Game stage visible:
    visibleGameStage: EGameStage.GAME_START,

    // Tracking
    curDayIdx: 0,
    curReportIdx: 0,
    showingSolution: false,

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

    // Others
    isMuted: false,

    hasError: false,
    debugMode: true,
    runNumber: 0
    
  } as GameState,
  //#endregion

  mutations: {
    initialize(){
      WriteLog("gameStore.ts > Initializing gameStore", LogLevel.INFO);
      try {
        commitNewGame();
      } 
      catch (error) {
        WriteLog("gameStore.ts > initialize > Error initializing the game store. #ERROR: " + error, LogLevel.ERROR);
      }
    },

    newGame(state: GameState){
      WriteLog("gameStore.ts > newGame", LogLevel.INFO);
      state.userId = DataService.getInstance().getUserId();
      DayManager.getInstance().resetDays();
      SoundManager.getInstance();

      if(state.debugMode){
        state.visibleGameStage = EGameStage.GAME_START;
  
        state.curDayIdx = 0; 
        state.showingSolution = false;
        
        state.points = NUM_CONSTANTS.ZERO;
        state.multiplier = GAME_CONSTANTS.INITIAL_MULTIPLIER;
  
        state.isMuted = false;
      }
      else{
        state.visibleGameStage = EGameStage.GAME_START;
  
        state.curDayIdx = 0; 
        
        state.points = NUM_CONSTANTS.ZERO;
        state.multiplier = GAME_CONSTANTS.INITIAL_MULTIPLIER;
  
        state.isMuted = false;
      }
      commitNewDay();
    },

    newDay(state: GameState){
      try {
        const curDay: Day | undefined = DayManager.getInstance().getDay(state.curDayIdx);
        if(curDay === undefined){
          throw new Error("Error when fetching the day.");
        }
        state.curDay = curDay;
        state.selectGroomingSnippets = curDay.configuration.selectSnippets;
        state.selectSnippetStages = curDay.configuration.selectSnippetStages;
        
        state.curReportIdx = 0;
        if(curDay.reports.length > 0){
          const curReport: Report | undefined = curDay.reports[state.curReportIdx];
          if(curReport === undefined){
            throw new Error("Error when fetching the first report of the day.");
          }
          state.curReport = curReport;
        }
        state.snippetStagesSelected = (state.curReport && state.curReport.snippets.length > 0) ? Array(state.curReport.snippets.length).fill(-1): [];
        
        const curDailyQuiz: DailyQuiz | undefined = curDay.dailyQuiz;
        state.curDailyQuiz = curDailyQuiz;
      } 
      catch (error) {
        WriteLog("gameStore.ts > newDay > Error resetting the state for a new day. #ERROR: " + error, LogLevel.ERROR);
      }
    },

    changeStage(state: GameState, toStage: EGameStage){
      // If we want to move to the next report, and we do not come from the narration
      if(toStage === EGameStage.REPORT){
        if(state.visibleGameStage !== EGameStage.NARRATION)
          state.curReportIdx++;

        // If there are still reports left unsolved, then we change the curReport accordingly and display it
        if(state.curReportIdx < state.curDay!.numReports){
          state.curReport = state.curDay!.reports[state.curReportIdx];
          state.snippetStagesSelected = (state.curReport && state.curReport.snippets) ? Array(state.curReport.snippets.length).fill(STAGE_CONSTANTS.NORMAL_SNIPPET_STAGE_VAL): [];
        
          if(state.visibleGameStage !== EGameStage.RESULT && !state.showingSolution)
            SoundManager.getInstance().stopSounds();
          SoundManager.getInstance().playSoundEffect(ESound.REPORT_MUSIC, true);

          state.visibleGameStage = EGameStage.REPORT;
        }
        // If not, then we must move to the daily quiz, if there is any
        else{
          if(state.curDay && state.curDay.configuration.shouldSkipQuiz){
            commitChangeDay();
            SoundManager.getInstance().stopSounds();
            state.visibleGameStage = EGameStage.NARRATION;
          }
          else
          {
            state.visibleGameStage = EGameStage.DAILY_QUIZ;
            SoundManager.getInstance().stopSounds();
            SoundManager.getInstance().playSoundEffect(ESound.QUIZ_MUSIC, true);
          }
        }
      }
      // If we are trying to go to a narration, then it is a new day, unless the previous state was the initial page
      else if(toStage === EGameStage.NARRATION && state.visibleGameStage !== EGameStage.GAME_START)
      {
        SoundManager.getInstance().stopSounds();
        state.visibleGameStage = EGameStage.NARRATION
        commitChangeDay();
      }
      else{
        state.visibleGameStage = toStage;
      } 
    },

    addScore(state: GameState, points: number){
      state.points = Math.round(state.points + points);
    },

    changeMultiplier(state: GameState, shouldIncrease: boolean){
      if(state.curDay && (state.curDay.numDay !== 0 || shouldIncrease))
        state.multiplier += shouldIncrease ? QUIZ_CONSTANTS.SUCCESS_MULTIPLIER_INCREASE : NUM_CONSTANTS.NEG * QUIZ_CONSTANTS.SUCCESS_MULTIPLIER_DEDUCTION; 
    },

    changeDay(state: GameState){
      state.curDayIdx++;
      if(state.curDayIdx < DayManager.getInstance().getNumDays())
      {
        commitNewDay();
      }
      else{
        // Game has been finished!
        state.visibleGameStage = EGameStage.GAME_FINISHED
      }
    },

    changeSnippetStageSelected(state: GameState, payload: {idx: number, stage: EStage}){
      WriteLog(`gameStore.ts > changeSnippetStageSelected > new stage for idx ${payload.idx} is ${payload.stage}`, LogLevel.VERBOSE);
      state.snippetStagesSelected[payload.idx] = payload.stage;
    },

    showSolution(state:GameState){
      state.visibleGameStage = EGameStage.REPORT;
      state.showingSolution = true;
    },

    solutionSeen(state:GameState){
      state.showingSolution = false;
      commitChangeStage(EGameStage.RESULT);
    },

    nextPlaythrough(state){
      state.runNumber++;
      DataService.getInstance().newRun();
    },

    toggleMute(state){
      if(state.isMuted){
        SoundManager.getInstance().unmute();
        state.isMuted = false;
      }
      else
      {
        SoundManager.getInstance().mute();
        state.isMuted = true;
      }
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

    isFirstDay: (state) => {
      return state.curDay?.numDay === 0 ;
    },

    isDebugMode: (state) => {
      return state.debugMode;
    },

    isFirstPlaythrough: (state) => {
      return state.runNumber === 0;
    },

    isMuted: (state) => {
      return state.isMuted;
    },
    
    showingSolution: (state) => {
      return state.showingSolution;
    },

    numDay: (state) => {
      return state.curDay!.numDay;
    },

    selectableStages: (state) => {
      if(state.curDay === undefined || state.curDay.configuration.selectableStagesIdx === undefined)
        return []
      else
        return state.curDay.configuration.selectableStagesIdx;
    },

    userId: (state) => {
      return state.userId;
    },
  }
});
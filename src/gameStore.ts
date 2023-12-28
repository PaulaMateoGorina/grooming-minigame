import { createStore } from 'vuex';

// Model
import Report from '@/utils/model/Report'
import ReportManager from '@/utils/model/ReportManager';

// Enums
import EStage from '@/utils/enums/EStage'

// Others
import { NUM_CONSTANTS, STAGE_CONSTANTS } from '@/utils/constants'
import * as utils from '@/utils/utils'

export interface GameState {
  selectGroomingSnippets: boolean,
  selectSnippetStages: boolean,
  snippetStagesSelected: EStage[],
  curReport: Report | undefined,
  points: number
}

// Create a new store instance.
export const gameStore = createStore({
  state: {
    selectGroomingSnippets: true,
    selectSnippetStages: true,
    snippetStagesSelected: [],
    curReport: undefined,
    points: 0
  } as GameState,

  mutations: {
    changeReport(state: GameState){
      state.curReport = ReportManager.getInstance().generateReport(utils.getBoolean(NUM_CONSTANTS.HALF));
      state.snippetStagesSelected = (state.curReport && state.curReport.snippets) ? Array(state.curReport.snippets.length).fill(STAGE_CONSTANTS.NORMAL_SNIPPET_STAGE_VAL): [];
    },

    addScore(state: GameState, points: number){
      state.points += points;
    },

    changeSnippetStageSelected(state: GameState, payload: {idx: number, stage: EStage}){
      console.log(`new stage for idx ${payload.idx} is ${payload.stage}`);
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

import { createStore } from 'vuex';

// Model
import Report from '@/utils/model/Report'
import DataManager from '@/utils/model/DataManager';

// Enums
import EStage from '@/utils/enums/EStage'

// Others
import * as gameConstants from '@/utils/constants'

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
      state.curReport = DataManager.getInstance().generateReport(Math.random() > 0.5);
      state.snippetStagesSelected = (state.curReport && state.curReport.snippets) ? Array(state.curReport.snippets.length).fill(gameConstants.NORMAL_SNIPPET_STAGE_VAL): [];
    },

    addScore(state: GameState, points: number){
      state.points += points;
    },

    changeSnippetStageSelected(state: GameState, payload: {idx: number, stage: EStage}){
      console.log(`new stage is ${payload.stage}`);
      state.snippetStagesSelected[payload.idx] = payload.stage;
    }
  },
  getters: {
    aSnippetIsSelected: (state) => {
      let result = false;

      for(const snippetStageSelected of state.snippetStagesSelected){
        if(snippetStageSelected > gameConstants.ZERO){
          result = true;
          break;
        }
      }

      return result;
    },
  }
});

<template>
  <div class="game">
    <ReportComponent @solveReport="handleSolveReport"/>
    <div>{{points}}</div>
    <div>{{isGrooming}}</div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import ReportComponent from './ChatReport.vue'
import {GameState, gameStore} from '@/gameStore'

import * as gameConstants from '@/utils/constants'

export default defineComponent({
  name: 'GameComponent',
  components: {
    ReportComponent,
  },
  methods: {
    handleSolveReport(isGrooming: boolean) {
      const curState: GameState = gameStore.state;
      let multiplier = gameConstants.ZERO;

      if(curState.curReport)
        multiplier = curState.curReport.getAnswerResult(isGrooming, curState.selectGroomingSnippets, curState.selectSnippetStages, curState.snippetStagesSelected);

      gameStore.commit('addScore', gameConstants.POINTS_PER_REPORT * multiplier);
      gameStore.commit('changeReport');
    },
  },
  created() {
    gameStore.commit('changeReport');
  },
  computed : {
    points(){
      return gameStore.state.points;
    },
    isGrooming(){
      return gameStore.state.curReport ?  gameStore.state.curReport.isGrooming : false;
    }
  }
});

</script>
    
<style scoped>
.game {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>@/utils/model/Report
<template>
  <div class="game">
    <ReportComponent @solveReport="handleSolveReport"/>
    <div>{{points}}</div>
    <div>{{isGrooming}}</div>

    <DailyQuizCardComponent @solveDailyQuiz="handleSolveDailyQuiz"/>

  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import ReportComponent from '@/components/report/ChatReport.vue'
import DailyQuizCardComponent from '@/components/DailyQuizCard.vue'
import {GameState, gameStore} from '@/gameStore'

import { NUM_CONSTANTS, REPORT_CONSTANTS, QUIZ_CONSTANTS } from '@/utils/constants'

export default defineComponent({
  name: 'GameComponent',
  components: {
    ReportComponent,
    DailyQuizCardComponent
  },
  methods: {
    handleSolveReport(isGrooming: boolean) {
      const curState: GameState = gameStore.state;
      let score = NUM_CONSTANTS.ZERO;

      if(curState.curReport)
        score = curState.curReport.getAnswerResult(isGrooming, curState.selectGroomingSnippets, curState.selectSnippetStages, curState.snippetStagesSelected, REPORT_CONSTANTS.POINTS_PER_REPORT);

      gameStore.commit('addScore', score);
      gameStore.commit('changeReport');
    },

    handleSolveDailyQuiz(optionSelected: number){
      const curState: GameState = gameStore.state;

      let score = NUM_CONSTANTS.ZERO;
      if(curState.curDailyQuiz)
        score = curState.curDailyQuiz.getAnswerResult(optionSelected, QUIZ_CONSTANTS.POINTS_PER_QUIZ);

      gameStore.commit('addScore', score);
      gameStore.commit('changeDailyQuiz');
    }
  },
  created() {
    gameStore.commit('changeReport');
    gameStore.commit('changeDailyQuiz');
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
</style>
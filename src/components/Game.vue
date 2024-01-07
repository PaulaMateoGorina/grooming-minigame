<template>
  <div class="game">
    <ReportComponent @solveReport="handleSolveReport"/>
    <div class="info">
      <p class="info-text">Puntuación: {{points}} pts</p>
      <p class="info-text">Informes restantes: X / X</p>
    </div>

    <DailyQuizCardComponent @solveDailyQuiz="handleSolveDailyQuiz"/>

    <ResultCardComponent :isReportResult="true" :correctness="1" :pointsGotten="pointsGotten"/>

  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import ReportComponent from '@/components/report/ChatReport.vue'
import DailyQuizCardComponent from '@/components/DailyQuizCard.vue'
import ResultCardComponent from '@/components/ResultCard.vue'

import {GameState, gameStore} from '@/gameStore'

import { NUM_CONSTANTS, REPORT_CONSTANTS } from '@/utils/constants'

export default defineComponent({
  name: 'GameComponent',
  components: {
    ReportComponent,
    DailyQuizCardComponent,
    ResultCardComponent
  },
  data() {
    return{
      pointsGotten: 0
    }
  },
  methods: {
    handleSolveReport(isGrooming: boolean) {
      const curState: GameState = gameStore.state;
      let score = NUM_CONSTANTS.ZERO;

      if(curState.curReport)
        score = curState.curReport.getAnswerResult(isGrooming, curState.selectGroomingSnippets, curState.selectSnippetStages, curState.snippetStagesSelected, REPORT_CONSTANTS.POINTS_PER_REPORT);

      score = gameStore.state.multiplier * score;
      this.pointsGotten = score; 

      gameStore.commit('addScore', score);
      gameStore.commit('changeReport');
    },

    handleSolveDailyQuiz(optionSelected: number){
      
      const curState: GameState = gameStore.state;

      let wasCorrect = false;
      if(curState.curDailyQuiz)
        wasCorrect = curState.curDailyQuiz.getAnswerResult(optionSelected);
      
      gameStore.commit('changeMultiplier', wasCorrect);
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
@import '@/css/game.css'
</style>
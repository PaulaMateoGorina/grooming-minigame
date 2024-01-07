<template>
  <div class="game">
    <div>
      <ReportComponent @solveReport="handleSolveReport"/>
    
      <div class="info">
        <p class="info-text">Puntuación: {{points}} pts</p>
        <p class="info-text">Informes restantes: X / X</p>
      </div>
    </div>

    <DailyQuizCardComponent v-if="true == false" @solveDailyQuiz="handleSolveDailyQuiz"/>

    <ResultCardComponent v-if="true == false" :isReportResult="true" :correctness="correctness" :pointsGotten="pointsGotten"/>

  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import ReportComponent from '@/components/report/ChatReport.vue'
import DailyQuizCardComponent from '@/components/DailyQuizCard.vue'
import ResultCardComponent from '@/components/ResultCard.vue'

import {GameState, gameStore} from '@/gameStore'

import { NUM_CONSTANTS, REPORT_CONSTANTS } from '@/utils/constants'
import { ECorrectness } from '@/utils/enums';

export default defineComponent({
  name: 'GameComponent',
  components: {
    ReportComponent,
    DailyQuizCardComponent,
    ResultCardComponent
  },
  data() {
    return{
      pointsGotten: 0,
      correctness: ECorrectness.INCORRECT
    }
  },
  methods: {
    handleSolveReport(isGrooming: boolean) {
      const curState: GameState = gameStore.state;
      let score = NUM_CONSTANTS.ZERO;

      if(curState.curReport)
        score = curState.curReport.getAnswerResult(isGrooming, curState.selectGroomingSnippets, curState.selectSnippetStages, curState.snippetStagesSelected);

      if(score === NUM_CONSTANTS.ONE)
        this.correctness = ECorrectness.CORRECT;
      else if(score > NUM_CONSTANTS.ZERO)
        this.correctness = ECorrectness.PARTIALLY_CORRECT;
      else
        this.correctness = ECorrectness.INCORRECT;

      score = gameStore.state.multiplier * REPORT_CONSTANTS.POINTS_PER_REPORT * score;
      this.pointsGotten = score; 
      
      gameStore.commit('addScore', score);
      gameStore.commit('changeReport');
    },

    handleSolveDailyQuiz(optionSelected: number){
      
      const curState: GameState = gameStore.state;

      let wasCorrect = false;
      if(curState.curDailyQuiz)
        wasCorrect = curState.curDailyQuiz.getAnswerResult(optionSelected);
      
      this.correctness = wasCorrect ? ECorrectness.CORRECT : ECorrectness.INCORRECT;

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
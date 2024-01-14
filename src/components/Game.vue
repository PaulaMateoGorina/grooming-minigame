<template>
  <div class="game flex-center-aligned">
    <!-- Start / End Game -->
    <Transition name="fade">
      <TitleScreenComponent 
        v-if="curGameStage === EGameStage.GAME_START || curGameStage === EGameStage.GAME_FINISHED" 
        :isStart="curGameStage === EGameStage.GAME_START"
      />
    </Transition>

    <!-- Narration -->
    <Transition name="fade">
      <div v-if="curGameStage === EGameStage.NARRATION">
        HERE WOULD BE THE NARRATION
        <div @click="next">CLICKME</div>
      </div>
    </Transition>

    
    <!-- Report -->
    <Transition name="fade">
      <ReportComponent @solveReport="handleSolveReport" v-if="curGameStage === EGameStage.REPORT"/>
    </Transition>

    <Transition name="slide-fade">
      <div v-if="curGameStage === EGameStage.REPORT" class="info">
        <p class="info-text">Puntuación: {{points}} pts</p>
        <p class="info-text">Informes restantes: X / X</p>
      </div>
    </Transition>

    <!-- Daily quiz -->
    <Transition name="slide-fade">
      <DailyQuizCardComponent 
        v-if="curGameStage === EGameStage.DAILY_QUIZ" 
        @solveDailyQuiz="handleSolveDailyQuiz"
      />
    </Transition>
    
    <!-- Result -->
    <Transition name="slide-fade">
      <ResultCardComponent 
        v-if="curGameStage === EGameStage.RESULT" 
        :isReportResult="pointsGotten >= 0" 
        :correctness="correctness" 
        :pointsGotten="pointsGotten"
      />
    </Transition>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import TitleScreenComponent from '@/components/TitleScreen.vue'
import ReportComponent from '@/components/report/ChatReport.vue'
import DailyQuizCardComponent from '@/components/DailyQuizCard.vue'
import ResultCardComponent from '@/components/ResultCard.vue'

import { GameState, gameStore } from '@/gameStore'

import { NUM_CONSTANTS, REPORT_CONSTANTS } from '@/utils/constants'
import { ECorrectness, EGameStage } from '@/utils/enums';

export default defineComponent({
  name: 'GameComponent',
  components: {
    TitleScreenComponent,
    ReportComponent,
    DailyQuizCardComponent,
    ResultCardComponent,
  },
  data() {
    return{
      pointsGotten: NUM_CONSTANTS.NEG,
      correctness: ECorrectness.INCORRECT,
      EGameStage: EGameStage,
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
      gameStore.commit('changeStage', EGameStage.RESULT);
    },

    next(){
      gameStore.commit('changeStage', EGameStage.REPORT);//TODO: Change this
    },

    handleSolveDailyQuiz(optionSelected: number){
      
      const curState: GameState = gameStore.state;

      let wasCorrect = false;
      if(curState.curDailyQuiz)
        wasCorrect = curState.curDailyQuiz.getAnswerResult(optionSelected);
      
      this.correctness = wasCorrect ? ECorrectness.CORRECT : ECorrectness.INCORRECT;
      this.pointsGotten = NUM_CONSTANTS.NEG;

      gameStore.commit('changeMultiplier', wasCorrect);
      gameStore.commit('changeStage', EGameStage.RESULT);
      
    }
  },
  created() {
    gameStore.commit('initialize');
  },
  computed : {
    points(){
      return gameStore.state.points;
    },
    isGrooming(){
      return gameStore.state.curReport ?  gameStore.state.curReport.isGrooming : false;
    },
    curGameStage(){
      return gameStore.state.visibleGameStage;
    }
  }
});

</script>
    
<style scoped>
@import '@/css/game.css'
</style>
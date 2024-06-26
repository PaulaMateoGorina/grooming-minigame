<template>
  <div class="game flex-center-aligned">
    <!-- Mute icon -->
    <button id="muteButton" @click="muteGame">
      <p class="iconButton" v-if="isMuted">&#128264;</p>
      <p class="iconButton" v-if="!isMuted">&#128266;</p>
    </button>

    <!-- Start / End Game -->
    <TitleScreenComponent 
      v-if="curGameStage === EGameStage.GAME_START || curGameStage === EGameStage.GAME_FINISHED" 
      :isStart="curGameStage === EGameStage.GAME_START"
    />

    <!-- Narration -->
    <NarrativeScreenComponent class="fade-in" v-if="curGameStage === EGameStage.NARRATION"/>
    
    <!-- Report -->
    <ReportComponent @solveReport="handleSolveReport" v-if="curGameStage === EGameStage.REPORT" class="fade-in" :correctness="correctness" />

    <Transition name="slide-fade">
      <div v-if="curGameStage === EGameStage.REPORT" class="info">
        <p class="info-text">{{pointsText}}</p>
        <p class="info-text">{{reportsRemainingText}}</p>
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
import NarrativeScreenComponent from '@/components/NarrativeScreen.vue'
import ReportComponent from '@/components/report/ChatReport.vue'
import DailyQuizCardComponent from '@/components/DailyQuizCard.vue'
import ResultCardComponent from '@/components/ResultCard.vue'

import { GameState, gameStore } from '@/gameStore'
import { GENERAL_STRINGS } from '@/assets/stringsESP';

import { NUM_CONSTANTS, REPORT_CONSTANTS } from '@/utils/constants'
import { ECorrectness, EGameStage, ESound } from '@/utils/enums';
import SoundManager from '@/utils/SoundManager'

import { cilVolumeHigh, cilVolumeOff } from '@coreui/icons';
import { stringFormat } from '@/utils/utils';

export default defineComponent({
  name: 'GameComponent',
  components: {
    TitleScreenComponent,
    NarrativeScreenComponent,
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
  setup() {
    return {
      cilVolumeHigh,
      cilVolumeOff,
    }
  },
  methods: {
    handleSolveReport(isGrooming: boolean) {
      const curState: GameState = gameStore.state;
      let score = NUM_CONSTANTS.ZERO;

      if(curState.curReport){
        const numDay = gameStore.getters.numDay;
        score = curState.curReport.getAnswerResult(isGrooming, curState.selectGroomingSnippets, curState.selectSnippetStages, curState.snippetStagesSelected, numDay);
      }

      if(score >= NUM_CONSTANTS.ONE){
        this.correctness = ECorrectness.CORRECT;
        SoundManager.getInstance().playSoundEffect(ESound.CORRECT);
      }
      else if(score > NUM_CONSTANTS.ZERO){
        this.correctness = ECorrectness.PARTIALLY_CORRECT;
        SoundManager.getInstance().playSoundEffect(ESound.PARTIALLY_CORRECT);
      }
      else{
        this.correctness = ECorrectness.INCORRECT;
        SoundManager.getInstance().playSoundEffect(ESound.INCORRECT);
      }

      score = gameStore.state.multiplier * REPORT_CONSTANTS.POINTS_PER_REPORT * score;
      this.pointsGotten = score; 
      
      gameStore.commit('addScore', score);
      gameStore.commit('changeStage', EGameStage.RESULT);
    },

    handleSolveDailyQuiz(optionSelected: number){
      
      const curState: GameState = gameStore.state;

      let wasCorrect = false;
      if(curState.curDailyQuiz)
        wasCorrect = curState.curDailyQuiz.getAnswerResult(optionSelected);
      
      if(wasCorrect){
        SoundManager.getInstance().playSoundEffect(ESound.CORRECT);
        this.correctness = ECorrectness.CORRECT;
      }
      else{
        this.correctness = ECorrectness.INCORRECT;
        SoundManager.getInstance().playSoundEffect(ESound.INCORRECT);
      }
      this.pointsGotten = NUM_CONSTANTS.NEG;

      gameStore.commit('changeMultiplier', wasCorrect);
      gameStore.commit('changeStage', EGameStage.RESULT);
      
    },
    
    muteGame(): void {
      gameStore.commit('toggleMute');
    }
  },
  created() {
    gameStore.commit('initialize');
  },
  computed : {
    pointsText(){
      return stringFormat(GENERAL_STRINGS.POINTS_INFO, gameStore.state.points.toString());
    },
    reportsRemainingText(){
      // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
      const totalNumReports = gameStore.state.curDay!.numReports;
      const reportsDone = gameStore.state.curReportIdx;
      return stringFormat(GENERAL_STRINGS.REPORTS_REMAINING, reportsDone.toString(), totalNumReports.toString());
    },
    isGrooming(){
      return gameStore.state.curReport ?  gameStore.state.curReport.isGrooming : false;
    },
    curGameStage(){
      return gameStore.state.visibleGameStage;
    },
    isMuted(){
      return gameStore.getters.isMuted;
    }
  }
});

</script>
    
<style scoped>
@import '@/css/game.css'
</style>
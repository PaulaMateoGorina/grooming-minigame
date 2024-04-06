<template>
    <CCard class="text-center card result-card">
        <CCardBody class="card-body">
            <div class="non-selectable-text">
                <p class="big-text">Tu respuesta fue:</p>

                <div class="main-info">
                    <!-- Correctness message -->
                    <p class="answer correct" v-if="correctness === ECorrectness.CORRECT">{{ RESULT_CARD_STRINGS.CORRECT }}</p>

                    <p class="answer partially-correct" v-else-if="correctness === ECorrectness.PARTIALLY_CORRECT">{{ RESULT_CARD_STRINGS.PARTIALLY_CORRECT }}</p>
                    
                    <div v-else-if="correctness === ECorrectness.INCORRECT">
                        <p class="answer incorrect">{{ RESULT_CARD_STRINGS.INCORRECT }}</p>
                    </div>
                    
                    <!-- Message with new score / multiplier-->
                    <p class="medium-big-text accepts-new-line" v-if="!isReportResult">{{ explanation }}</p>
                    <p class="big-text bold accepts-new-line">{{ newScoreOrMultiplierMessage }}</p>
                </div>

                <p class="medium-big-text accepts-new-line">{{ message }}</p>
                
                <div class="card-button-container">
                    <div class="my-button card-button" @click="showResult" v-if="isReportResult">{{ RESULT_CARD_STRINGS.SHOW_SOLUTION }}</div>
                    <div class="my-button card-button" @click="handleContinue">{{ GENERAL_STRINGS.CONTINUE }}</div>
                </div>
            </div>
        </CCardBody>
    </CCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CCard, CCardBody} from '@coreui/vue'

import { gameStore } from '@/gameStore'
import { WriteLog, LogLevel } from '@/utils/logger'

import { ECorrectness, EGameStage, ESound } from '@/utils/enums';
import { RESULT_CARD_STRINGS, GENERAL_STRINGS } from '@/assets/stringsESP';
import { stringFormat } from '@/utils/utils';
import SoundManager from '@/utils/SoundManager';

export default defineComponent({
    name: 'ResultCardComponent',
    data(){
        return{
            ECorrectness: ECorrectness,
            RESULT_CARD_STRINGS: RESULT_CARD_STRINGS,
            GENERAL_STRINGS: GENERAL_STRINGS
        }
    },
    components: {
        CCard,
        CCardBody
    },
    props: {
        isReportResult: Boolean,
        correctness: Number,
        pointsGotten: Number
    },
    methods:{
        handleContinue(){
            gameStore.commit('changeStage', this.isReportResult ? EGameStage.REPORT : EGameStage.NARRATION);
        },
        showResult(){
            SoundManager.getInstance().playSoundEffect(ESound.SELECT);
            gameStore.commit('showSolution');
        }
    },
    computed: {
        message(){
            let result = "";
            try {
                if(this.isReportResult){
                    if(this.correctness === ECorrectness.CORRECT)
                        result = stringFormat(RESULT_CARD_STRINGS.REPORT_CORRECT, this.pointsGotten ? this.pointsGotten.toString() : "0");

                    else if(this.correctness === ECorrectness.PARTIALLY_CORRECT)
                        result =  stringFormat(RESULT_CARD_STRINGS.REPORT_P_CORRECT, this.pointsGotten ? this.pointsGotten.toString() : "0");

                    else
                        result = RESULT_CARD_STRINGS.REPORT_INCORRECT;

                }
                else{
                    if(this.isFirstDay)
                        result = "";
                    else
                        result = this.correctness === ECorrectness.CORRECT ? RESULT_CARD_STRINGS.QUIZ_CORRECT : RESULT_CARD_STRINGS.QUIZ_INCORRECT;
                }   
            }
            catch (error) {
                WriteLog("ResultCard.vue > Computed - message > Error computing the message, ERROR: " + error, LogLevel.ERROR);
            }
            return result;
        },

        newScoreOrMultiplierMessage(){
            let result = "";
            try {
                result = this.isReportResult ? 
                    stringFormat(RESULT_CARD_STRINGS.NEW_SCORE, gameStore.state.points.toString())
                    :
                    stringFormat(RESULT_CARD_STRINGS.NEW_MULTIPLIER, gameStore.state.multiplier.toString())
            } 
            catch (error) {
                WriteLog("ResultCard.vue > Computed - newScoreOrMultiplierMessage > ERROR: " + error, LogLevel.ERROR);
            }
            return result;
        },

        explanation(){
            let result = "";
            try {
                result = gameStore.state.curDailyQuiz ? gameStore.state.curDailyQuiz?.explanation : "";
                if(result === ""){
                    throw new Error("Could not get the explanation for the correct answer to the daily quiz.");
                }           
            } 
            catch (error) {
                WriteLog("ResultCard.vue > Computed - correctAnswer > ERROR: " + error, LogLevel.ERROR);
            }
            return result;
        },

        isFirstDay(){
            return gameStore.getters.isFirstDay;
        }
    }
})
</script>

<style scoped>
@import '@/css/common.css';
@import '@/css/card.css';
@import '@/css/result-card.css';
</style>
@/utils/enums/enums@/assets/stringsESP
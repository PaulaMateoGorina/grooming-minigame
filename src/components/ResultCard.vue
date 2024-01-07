<template>
    <CCard class="text-center card result-card">
        <CCardBody class="card-body">
            <div class="non-selectable-text">
                <p class="big-text">Tu respuesta fue:</p>

                <div class="main-info">
                    <!-- Correctness message -->
                    <div v-if="correctness === ECorrectness.CORRECT">
                        <p class="answer correct">CORRECTA</p>
                    </div>

                    <div v-else-if="correctness === ECorrectness.PARTIALLY_CORRECT">
                        <p class="answer partially-correct">PARCIALMENTE CORRECTA</p>
                    </div>

                    <div v-else-if="correctness === ECorrectness.INCORRECT">
                        <p class="answer incorrect">INCORRECTA</p>
                    </div>

                    <!-- Message with new score / multiplier-->
                    <p class="big-text bold accepts-new-line">{{ newScoreOrMultiplierMessage }}</p>
                </div>

                <p class="medium-big-text accepts-new-line">{{ message }}</p>
                
                <div class="my-button card-button" @click="handleContinue">{{ RESULT_CARD_STRINGS.CONTINUE }}</div>
            </div>
        </CCardBody>
    </CCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CCard, CCardBody} from '@coreui/vue'

import { gameStore } from '@/gameStore'
import { WriteLog, LogLevel } from '@/utils/logger'

import { ECorrectness } from '@/utils/enums';
import { RESULT_CARD_STRINGS } from '@/assets/stringsESP';

export default defineComponent({
    name: 'ResultCardComponent',
    data(){
        return{
            ECorrectness: ECorrectness,
            RESULT_CARD_STRINGS: RESULT_CARD_STRINGS
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
            gameStore.commit('changeStage', this.isReportResult);
        }
    },
    computed: {
        message(){
            let result = "";
            try {
                if(this.isReportResult){
                    if(this.correctness === ECorrectness.CORRECT)
                        result = RESULT_CARD_STRINGS.REPORT_CORRECT.replace(RESULT_CARD_STRINGS.NUM_PLACEHOLDER, this.pointsGotten ? this.pointsGotten.toString() : "0");

                    else if(this.correctness === ECorrectness.PARTIALLY_CORRECT)
                        result = RESULT_CARD_STRINGS.REPORT_P_CORRECT.replace(RESULT_CARD_STRINGS.NUM_PLACEHOLDER, this.pointsGotten ? this.pointsGotten.toString() : "0");

                    else
                        result = RESULT_CARD_STRINGS.REPORT_INCORRECT;

                }
                else{
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
                    RESULT_CARD_STRINGS.NEW_SCORE.replace(RESULT_CARD_STRINGS.NUM_PLACEHOLDER, gameStore.state.points.toString())
                    :
                    RESULT_CARD_STRINGS.NEW_MULTIPLIER.replace(RESULT_CARD_STRINGS.NUM_PLACEHOLDER, gameStore.state.multiplier.toString())
            } 
            catch (error) {
                WriteLog("ResultCard.vue > Computed - newScoreOrMultiplierMessage > ERROR: " + error, LogLevel.ERROR);
            }
            return result;
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
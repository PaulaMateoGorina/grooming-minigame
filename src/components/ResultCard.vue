<template>
    <CCard class="text-center card result-card">
        <CCardBody class="card-body">
            <div class="non-selectable-text">
                <p class="big-text">Tu respuesta fue:</p>

                <div class="main-info">
                    <!-- Correctness message -->
                    <div v-if="correctness === 1">
                        <p class="answer correct">CORRECTA</p>
                    </div>

                    <div v-else-if="correctness === 0.5">
                        <p class="answer partially-correct">PARCIALMENTE CORRECTA</p>
                    </div>

                    <div v-else-if="correctness === 0">
                        <p class="answer incorrect">INCORRECTA</p>
                    </div>

                    <!-- Message with new score / multiplier-->
                    <p class="big-text bold accepts-new-line">{{ newScoreOrMultiplierMessage }}</p>
                </div>

                <p class="medium-big-text accepts-new-line">{{ message }}</p>
                
            </div>
        </CCardBody>
    </CCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CCard, CCardBody} from '@coreui/vue'

import {gameStore} from '@/gameStore'
import { WriteLog, LogLevel } from '@/utils/logger'

import { QUIZ_CONSTANTS } from '@/utils/constants'
import ECorrectness from '@/utils/enums/ECorrectness';

export default defineComponent({
    name: 'ResultCardComponent',
    components: {
        CCard,
        CCardBody
    },
    props: {
        isReportResult: Boolean,
        correctness: Number,
        pointsGotten: Number
    },
    computed: {
        message(){
            let result = "";
            try {
                if(this.isReportResult){
                    if(this.correctness === ECorrectness.CORRECT)
                        result = `¡Enhorabuena! Has sumado ${this.pointsGotten} puntos.\n ¡Sigue así!`

                    else if(this.correctness === ECorrectness.PARTIALLY_CORRECT)
                        result = `Has sumado ${this.pointsGotten} puntos, pero no te confíes. \n¡Sigamos mejorando!`

                    else
                        result = "Esta vez no has sumado puntos, pero no desistas. \n¡Sigamos mejorando!";

                }
                else{
                    result = this.correctness === ECorrectness.CORRECT ? 
                        `¡Enhorabuena! Se ha añadido ${QUIZ_CONSTANTS.SUCCESS_MULTIPLIER_INCREASE} a tu multiplicador de puntuación.` 
                        : 
                        `Se ha restado ${QUIZ_CONSTANTS.SUCCESS_MULTIPLIER_DEDUCTION} a tu multiplicador de puntuación.`;
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
                    `Nueva puntuación: ${gameStore.state.points} pts.`
                    :
                    `Nuevo multiplicador: x${gameStore.state.multiplier}.`
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

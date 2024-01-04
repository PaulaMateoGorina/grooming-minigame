<template>
    <CCard class="text-center quiz-card">
        <CCardBody class="quiz-body">
            <div class="non-selectable-text">
                <p class="big-text">¡Hora de poner a prueba lo aprendido!</p>
                <div class="circle time-circle">{{ timeRemaining }}</div>
                <p class="medium-big-text">Pregunta</p>
                
                <div v-for="idx in numOptions" :key="idx">
                    <div class="my-button quiz-option" @click="sendSolveDailyQuiz(idx - 1)">{{ options[idx - 1] }}</div>
                </div>
            </div>
        </CCardBody>
    </CCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CCard, CCardBody} from '@coreui/vue'

import { NUM_CONSTANTS, QUIZ_CONSTANTS } from '@/utils/constants'
import { LogLevel, WriteLog } from '@/utils/logger'

import { gameStore } from '@/gameStore'

export default defineComponent({
    name: 'DailyQuizCardComponent',
    components: {
        CCard,
        CCardBody
    },
    
    data(){
        return{
            timeRemaining: QUIZ_CONSTANTS.TIME_TO_SOLVE,
        }
    },

    mounted (){
        this.countdownTimer()
    },

    methods: {
        countdownTimer(){
            if (this.timeRemaining > 0){
                setTimeout( () => {
                    this.timeRemaining -= 1;
                    this.countdownTimer()
                }, 1000)
            }
        },

        sendSolveDailyQuiz(selectedOption: number){
            WriteLog(`DailyQuizCard.vue > sendSolveDailyQuiz > selectedOption: ${selectedOption}`, LogLevel.VERBOSE);
            try {
                this.$emit('solveDailyQuiz', selectedOption);
                this.timeRemaining = QUIZ_CONSTANTS.TIME_TO_SOLVE;
            } catch (error) {
                WriteLog(`ChatReport.vue > sendSolveReport > ERROR: Could not emit event. #ERROR: ${error}`, LogLevel.ERROR);
            }
        }
    },

    computed: {
        options(): string[]{
            const dailyQuiz = gameStore.state.curDailyQuiz;
            return dailyQuiz ? dailyQuiz.options : [];
        },
        numOptions(): number{
            const dailyQuiz = gameStore.state.curDailyQuiz;
            return dailyQuiz ? dailyQuiz.numOptions : NUM_CONSTANTS.ZERO;
        }
    },
})
</script>

<style scoped>
@import '@/css/common.css';
@import '@/css/quiz.css';
</style>

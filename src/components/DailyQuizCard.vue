<template>
    <CCard class="text-center card">
        <CCardBody class="card-body">
            <div class="non-selectable-text">
                <p class="big-text">{{ GENERAL_STRINGS.DAILY_QUIZ_TIME }}</p>
                <div class="circle time-circle">{{ timeRemaining }}</div>
                <p class="medium-big-text">{{ question }}</p>
                
                <div v-for="idx in numOptions" :key="idx">
                    <div class="my-button card-button" @click="sendSolveDailyQuiz(idx - 1)">{{ options[idx - 1] }}</div>
                </div>
            </div>
        </CCardBody>
    </CCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CCard, CCardBody} from '@coreui/vue'

import { GENERAL_STRINGS } from '@/assets/stringsESP';
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
            active: false,
            GENERAL_STRINGS: GENERAL_STRINGS
        }
    },

    mounted (){
        this.active = true;
        this.timeRemaining = QUIZ_CONSTANTS.TIME_TO_SOLVE;
        this.countdownTimer();
    },

    unmounted(){
        this.active = false;
    },

    methods: {
        countdownTimer(){
            if (this.active){
                if(this.timeRemaining > 0){
                    setTimeout( () => {
                        this.timeRemaining -= 1;
                        this.countdownTimer()
                    }, 1000)
                }
                else{
                    this.sendSolveDailyQuiz(NUM_CONSTANTS.NEG);
                }
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
        question(): string{
            const dailyQuiz = gameStore.state.curDailyQuiz;
            return dailyQuiz ? dailyQuiz.question : "";
        },

        options(): string[]{
            const dailyQuiz = gameStore.state.curDailyQuiz;
            return dailyQuiz ? dailyQuiz.options : [];
        },
        numOptions(): number{
            const dailyQuiz = gameStore.state.curDailyQuiz;
            return dailyQuiz ? dailyQuiz.numOptions : NUM_CONSTANTS.ZERO;
        }
    }
})
</script>

<style scoped>
@import '@/css/common.css';
@import '@/css/card.css';
</style>

<template>
    <CCard class="text-center quiz-card">
        <CCardBody class="quiz-body">
            <div class="non-selectable-text">
                <p class="big-text">¡Hora de poner a prueba lo aprendido!</p>
                <div class="circle time-circle">{{ timeRemaining }}</div>
                <p class="medium-big-text">Pregunta</p>
                
                <div v-for="option in options" :key="option">
                    <div class="my-button quiz-option">{{ option }}</div>
                </div>
            </div>
        </CCardBody>
    </CCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CCard, CCardBody} from '@coreui/vue'

export default defineComponent({
    name: 'QuizCardComponent',
    components: {
    CCard,
    CCardBody
},
    data(){
        return{
            timeRemaining: 20,
            options: ["Answer 1", "Answer 2", "Answer 3", "Answer 4                                          "]
        }
    },
    methods: {
        countdownTimer(){
            if (this.timeRemaining > 0){
                setTimeout( () => {
                    this.timeRemaining -= 1;
                    this.countdownTimer()
                }, 1000)
            }
        }
    },
    mounted (){
        this.countdownTimer()
    }
})
</script>

<style scoped>
@import '@/css/common.css';
@import '@/css/quiz.css';
</style>

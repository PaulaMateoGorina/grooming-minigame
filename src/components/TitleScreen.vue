<template>
    <div id="title-screen-background" class="flex-center-aligned non-selectable-text">
        <div class="title-screen-container flex-center-aligned flex-column">
                <!-- Starting screen -->
            <div v-if="isStart" class="fade-in flex-center-aligned flex-column non-selectable-text">
                <p class="game-title">{{GENERAL_STRINGS.GAME_TITLE}}</p>
                <div class="divisor"/>
                <p class="game-subtitle">{{GENERAL_STRINGS.GAME_SUBTITLE}}</p>
                <div class="title-screen-button flex-center-aligned" @click="startGame">{{ GENERAL_STRINGS.START }}</div>
            </div>

            <!-- End screen -->
            <div  v-if="!isStart" class="flex-center-aligned flex-column">
                <p class="game-title">{{GENERAL_STRINGS.END_TITLE}}</p>
                <div class="divisor"/>
                <p class="game-subtitle">{{GENERAL_STRINGS.END_PTS_TEXT}}</p>
                <p class="title-screen-points">{{total_points}} pts</p>
                <div class="title-screen-button flex-center-aligned" @click="resetGame">{{ GENERAL_STRINGS.PLAY_AGAIN }}</div>
            </div>
        </div>
    </div>

    <CModal alignment="center" :visible="questionnaireModalOpen" @close="() => { closeModal() }">
        <CModalBody>
            <h4 style="font-size: 18px;">{{ GENERAL_STRINGS.PROMPT_QUESTIONNAIRE }}</h4>
            <a href="https://forms.gle/wwxafQtGNyxz2Fn76" style="font-size: 18px;">{{ GENERAL_STRINGS.CLICK_TO_QUESTIONNAIRE }}</a>
        </CModalBody>
        <CModalFooter>
            <CButton variant="outline" @click="closeModal" class="title-screen-button play-again-button">{{ GENERAL_STRINGS.PLAY_AGAIN }}</CButton>
        </CModalFooter>
    </CModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { GENERAL_STRINGS } from '@/assets/stringsESP';
import { gameStore } from '@/gameStore';
import { EGameStage } from '@/utils/enums';

import { CModal, CModalBody, CModalFooter, CButton } from '@coreui/vue'


export default defineComponent({
    name: 'TitleScreenComponent',

    data(){
        return{
            GENERAL_STRINGS: GENERAL_STRINGS,
            questionnaireModalOpen: false
        }
    },
    components: {
        CModal,
        CModalBody,
        CModalFooter,
        CButton
    },
    props: {
        isStart: Boolean
    },
    
    methods:{
        startGame(){
            gameStore.commit('changeStage', EGameStage.NARRATION);
        },
        resetGame(){
            if(this.firstPlaythrough){
                this.questionnaireModalOpen = true;
            }
            else{
                gameStore.commit('newGame');
            }
        },
        closeModal(){
            this.questionnaireModalOpen = false;
            gameStore.commit('newGame');
            gameStore.commit('nextPlaythrough');
        }
    },
    
    computed:{
        total_points(){
            return gameStore.state.points;
        },

        firstPlaythrough(){
            return gameStore.getters.isFirstPlaythrough;
        }
    }
})
</script>

<style scoped>
@import '@/css/title-screen.css';
@import '@/css/common.css';
</style>

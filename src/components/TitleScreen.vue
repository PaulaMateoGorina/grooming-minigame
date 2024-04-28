<template>
    <div id="title-screen-background" class="flex-center-aligned non-selectable-text">
        <div class="title-screen-container flex-center-aligned flex-column">
                <!-- Starting screen -->
            <div v-if="isStart" class="fade-in flex-center-aligned flex-column non-selectable-text">
                <p class="game-title">{{GENERAL_STRINGS.GAME_TITLE}}</p>
                <div class="divisor"/>
                <p class="game-subtitle">{{GENERAL_STRINGS.GAME_SUBTITLE}}</p>
                <div class="title-screen-button wide flex-center-aligned" @click="startGame" >{{ GENERAL_STRINGS.START }}</div>
            </div>

            <!-- End screen -->
            <div  v-if="!isStart" class="flex-center-aligned flex-column text-align-center">
                <p class="game-title">{{GENERAL_STRINGS.END_TITLE}}</p>
                <div class="divisor"/>
                <p class="game-subtitle" v-html="pointsMessage"></p>
                <p class="game-subtitle-2" v-html="gotTheJobMessage"></p>
                <div v-if="sawConsequences || !firstPlaythrough" class="title-screen-button flex-center-aligned" @click="resetGame">{{ GENERAL_STRINGS.PLAY_AGAIN }}</div>
                <div v-else class="title-screen-button wide flex-center-aligned" @click="showConsequences">{{ showConsequencesMessage }}</div>
            </div>
        </div>
    </div>

    <!-- Consequences modal -->
    <CModal scrollable size="xl" alignment="center" :visible="consequencesModalOpen" @close="() => { closeModal(true) }">
        <CModalBody>
            <p class="consequences-explanation" v-html="GENERAL_STRINGS.CONSEQUENCES"></p>
        </CModalBody>
        <CModalFooter>
            <p v-html="GENERAL_STRINGS.REMIND_QUESTIONNAIRE"></p>
            <CButton variant="outline" @click="closeModal" class="title-screen-button play-again-button">{{ GENERAL_STRINGS.CLOSE }}</CButton>
        </CModalFooter>
    </CModal>

    <!-- Play again modal -->
    <CModal alignment="center" :visible="questionnaireModalOpen" @close="() => { closeModal(false) }">
        <CModalBody style="text-align:justify">
            <span v-if="isStart">
                <p style="font-size: 18px; white-space: pre-wrap;" v-html="questionnairePromptMessage"></p>
            </span>
            <span v-else style="font-size: 18px; white-space: pre-wrap;" v-html="GENERAL_STRINGS.PROMPT_QUESTIONNAIRE_RESET"></span>
            <button class="invisibleButton" v-if="isStart" @click="questionnaireClicked"><a :href="LINKS.QUESTIONNAIRE" target="_blank" style="font-size: 18px;">{{ GENERAL_STRINGS.CLICK_TO_QUESTIONNAIRE }}</a></button>
            <a v-else :href="LINKS.GROOMING_INFO" target="_blank" style="font-size: 18px;">{{ GENERAL_STRINGS.PROMPT_MORE_INFO }}</a>
        </CModalBody>
        <CModalFooter>
            <CButton v-if="isStart" variant="outline" @click="startGame" class="title-screen-button play-again-button" :disabled="!clickedOnQuestionnaire">{{ GENERAL_STRINGS.START }}</CButton>
            <CButton v-else variant="outline" @click="closeModal(false)" class="title-screen-button play-again-button">{{ GENERAL_STRINGS.PLAY_AGAIN }}</CButton>
        </CModalFooter>
    </CModal>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-var-requires */
import { defineComponent } from 'vue'
import { GENERAL_STRINGS } from '@/assets/stringsESP';
import { gameStore } from '@/gameStore';
import { EGameStage, ESound } from '@/utils/enums';
import { GAME_CONSTANTS, LINKS } from '@/utils/constants';

import { CModal, CModalBody, CModalFooter, CButton } from '@coreui/vue'

import SoundManager from '@/utils/SoundManager'
import { stringFormat } from '@/utils/utils';

export default defineComponent({
    name: 'TitleScreenComponent',

    data(){
        return{
            GENERAL_STRINGS: GENERAL_STRINGS,
            LINKS: LINKS,
            questionnaireModalOpen: false,
            clickedOnQuestionnaire: false,
            consequencesModalOpen: false,
            questionnairePromptMessage: "",
            pointsMessage: "",
            gotTheJobMessage:"",
            showConsequencesMessage: "",
            firstPlaythrough: true,
            sawConsequences: false
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
            if(gameStore.getters.isFirstPlaythrough && !this.clickedOnQuestionnaire){
                this.questionnaireModalOpen = true;
            }
            else{
                gameStore.commit('changeStage', EGameStage.NARRATION);
                SoundManager.getInstance().playSoundEffect(ESound.SELECT);
            }
        },
        resetGame(){
            if(this.firstPlaythrough){
                this.questionnaireModalOpen = true;
            }
            else{
                this.questionnaireModalOpen = false;
                gameStore.commit('newGame');
                gameStore.commit('nextPlaythrough');
                SoundManager.getInstance().playSoundEffect(ESound.SELECT);
            }
            SoundManager.getInstance().playSoundEffect(ESound.SELECT);
        },
        showConsequences(){
            SoundManager.getInstance().playSoundEffect(ESound.SELECT);
            this.consequencesModalOpen = true;
            this.sawConsequences = true;
        },
        questionnaireClicked(){
            this.clickedOnQuestionnaire = true;
            navigator.clipboard.writeText(gameStore.getters.userId);
        },
        closeModal(isConsequencesModal: boolean){
            if(isConsequencesModal){
                this.consequencesModalOpen = false;
            }
            else{
                this.questionnaireModalOpen = false;
                gameStore.commit('newGame');
                gameStore.commit('nextPlaythrough');
            }
            SoundManager.getInstance().playSoundEffect(ESound.SELECT);
        }
    },
    
    mounted(){
        this.pointsMessage =  stringFormat(GENERAL_STRINGS.END_PTS_TEXT, gameStore.state.points.toString());

        if(gameStore.state.points >= GAME_CONSTANTS.MIN_PTS_TO_GET_THE_JOB){
            this.gotTheJobMessage = GENERAL_STRINGS.GOT_THE_JOB;
            this.showConsequencesMessage = GENERAL_STRINGS.CONSEQUENCES_GOOD;
        }
        else{
            this.gotTheJobMessage = GENERAL_STRINGS.DID_NOT_GET_THE_JOB
            this.showConsequencesMessage = GENERAL_STRINGS.CONSEQUENCES_BAD;
        }

        this.questionnairePromptMessage = stringFormat(GENERAL_STRINGS.PROMPT_QUESTIONNAIRE_START, gameStore.getters.userId);

        this.firstPlaythrough = gameStore.getters.isFirstPlaythrough;
    }
})
</script>

<style scoped>
@import '@/css/title-screen.css';
@import '@/css/common.css';
</style>

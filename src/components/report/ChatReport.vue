<template>
    <div>
        <div 
            :class="{ 
                'report': true, 
                'flex-center-aligned': true, 
                'report-correct': isSolution && correctness === ECorrectness.CORRECT,
                'report-partially-correct': isSolution && correctness === ECorrectness.PARTIALLY_CORRECT,
                'report-incorrect': isSolution && correctness === ECorrectness.INCORRECT,
            }"
        >
            <div class="report-content">
                <div v-if="currentPage === 0">
                    <ProfilesPageComponent v-if="user1 && user2 && friendshipTime" 
                        :user1="user1" :user2="user2" :friendshipTime="friendshipTime" 
                    />

                    <div v-if="isSolution" 
                        :class="{
                            'flex-center-aligned': true,
                            'centered-text': true,
                            'medium-big-text': true,
                            'semi-bold': true,
                            'correct': correctness === ECorrectness.CORRECT, 
                            'partially-correct': correctness === ECorrectness.PARTIALLY_CORRECT,
                            'incorrect': correctness === ECorrectness.INCORRECT
                        }"
                    >
                        {{solution}}
                    </div>
                </div>

                <div v-if="currentPage === 1 && snippetIdxPairsPage1.length > 0">
                    <ChatSnippetPageComponent :snippetIdxPairs="snippetIdxPairsPage1" :isGrooming="isGrooming" :correctness="correctness"/>
                </div>

                <div v-if="currentPage === 2 && snippetIdxPairsPage2.length > 0">
                    <ChatSnippetPageComponent :snippetIdxPairs="snippetIdxPairsPage2" :isGrooming="isGrooming" :correctness="correctness"/>
                </div>
            </div>
            
            <div v-if="showReportButtonsContainerInside" 
                :class="{ 
                    'report-buttons-container': true, 
                    'non-selectable-text': true,
                    'flex-center-aligned': true,
                    'flex-col': true,
                    'flex-spaced-out': isSolution
                }"
            >
                <div @click="changePage(false)" :class="{ 'report-button': true, 'prev-button': true, 'invisible': currentPage === 0 }">&#8249;</div>
                <div v-if="isSolution" class="my-button report-go-back-button" @click="handleSolutionSeen">{{ GENERAL_STRINGS.GO_BACK }}</div>
                <CButton v-if="!isSolution" color="danger" variant="outline" @click="sendSolveReport(true)" class="answer-button my-button">Grooming</CButton>
                <CButton v-if="!isSolution" color="success" variant="outline" @click="sendSolveReport(false)" class="answer-button my-button">Normal</CButton>
                <div @click="changePage(true)" :class="{ 'report-button': true, 'next-button': true, 'invisible': currentPage === numPages - 1 }">&#8250;</div>
            </div>
            
            <ErrorModalComponent @closeModal="handleCloseModal" :visibility="solveReportErrorModalVisible" :message="'NO puedes marcar un informe como normal si tienes un snippet seleccionado.'"/>
        </div>

        <div v-if="!showReportButtonsContainerInside" class="bottom-report-buttons-container non-selectable-text flex-center-aligned flex-col">
            <div @click="changePage(false)" :class="{ 'report-button': true, 'prev-button': true, 'invisible': currentPage === 0 }">&#8249;</div>
            <div @click="changePage(true)" :class="{ 'report-button': true, 'next-button': true, 'invisible': currentPage === numPages - 1 }">&#8250;</div>
        </div>

        <div v-if="!isSolution && !showReportButtonsContainerInside" class="floating-report-buttons-container non-selectable-text">
            <p>{{ GENERAL_STRINGS.ANSWER }}</p>
            <CButton color="danger" variant="outline" @click="sendSolveReport(true)" class="answer-button my-button">Grooming</CButton>
            <CButton color="success" variant="outline" @click="sendSolveReport(false)" class="answer-button my-button">Normal</CButton>
        </div>

        <div v-if="isSolution && !showReportButtonsContainerInside" class="floating-report-buttons-container my-button report-go-back-button" @click="handleSolutionSeen">{{ GENERAL_STRINGS.GO_BACK }}</div>

    </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { defineComponent } from 'vue'
import { gameStore } from '@/gameStore'

import { LogLevel, WriteLog } from '@/utils/logger'

import ChatSnippetPageComponent from './ChatSnippetPage.vue'
import ProfilesPageComponent from './ProfilesPage.vue'
import ErrorModalComponent from '@/components/ErrorModal.vue'

import Snippet from '@/utils/model/Snippet'
import Profile from '@/utils/model/Profile'
import { NUM_CONSTANTS, REPORT_CONSTANTS } from '@/utils/constants'
import { ECorrectness, ESound } from '@/utils/enums'
import { GENERAL_STRINGS, SOLUTION_STRINGS } from '@/assets/stringsESP';

import { CButton } from '@coreui/vue'
import SoundManager from '@/utils/SoundManager'
import { stringFormat } from '@/utils/utils'

export default defineComponent({
    name: 'ReportComponent',
    components: {
        ChatSnippetPageComponent,
        ProfilesPageComponent,
        ErrorModalComponent,
        CButton
    },
    data() {
        return {
            currentPage: 0,
            solveReportErrorModalVisible: false,
            GENERAL_STRINGS: GENERAL_STRINGS,
            ECorrectness: ECorrectness
        };
    },
    props: {
        correctness: Number,
    },
    methods: {
        changePage(isNext: boolean) {
            try {
                const numPages = this.numPages ? this.numPages : 1;
                this.currentPage = isNext ? Math.min(this.currentPage + 1, numPages - 1) : Math.max(this.currentPage - 1, 0);
                SoundManager.getInstance().playSoundEffect(ESound.SELECT);
            } 
            catch (error) {
                WriteLog("ChatReport.vue > changePage > #ERROR: " + error, LogLevel.ERROR);
            }
        },

        sendSolveReport(isGrooming: boolean){
            try {
                WriteLog(`ChatReport.vue > sendSolveReport > Grooming: ${isGrooming}`, LogLevel.VERBOSE);
                if(!isGrooming && gameStore.getters.aSnippetIsSelected){
                    this.solveReportErrorModalVisible = true;
                    SoundManager.getInstance().playSoundEffect(ESound.ERROR);
                }
                else{
                    this.$emit('solveReport', isGrooming);
                    this.currentPage = NUM_CONSTANTS.ZERO;
                }
            } 
            catch (error) {
                WriteLog(`ChatReport.vue > sendSolveReport > ERROR: Could not emit event. #ERROR: ${error}`, LogLevel.ERROR);
            }
        },

        handleCloseModal(){
            try {
                this.solveReportErrorModalVisible = false;
                SoundManager.getInstance().playSoundEffect(ESound.SELECT);
            } 
            catch (error) {
                WriteLog("ChatReport.vue > handleCloseModal > #ERROR: " + error, LogLevel.ERROR);
            }
        },

        handleSolutionSeen(){
            try {
                SoundManager.getInstance().playSoundEffect(ESound.SELECT);
                gameStore.commit('solutionSeen');
            } 
            catch (error) {
                WriteLog("ChatReport.vue > handleSolutionSeen > #ERROR: " + error, LogLevel.ERROR);
            }
        }
    },
    computed: {
        showReportButtonsContainerInside() {
            return window.innerHeight >= 850;
        },

        snippetIdxPairsPage1(): [Snippet, number][] {
            let result: [Snippet, number][] = []
            try {
                const chatReport = gameStore.state.curReport;

                result = chatReport && chatReport.snippets ?
                    chatReport.snippets.slice(NUM_CONSTANTS.ZERO, REPORT_CONSTANTS.NUM_SNIPPETS_PER_PAGE)
                        .map((snippet: Snippet, index: number) => [snippet, index])
                    : 
                    [];
            } 
            catch (error) {
                WriteLog("ChatReport.vue > computed > snippetIdxPairsPage1 > #ERROR: " + error, LogLevel.ERROR);
            }
            return result
            
        },

        snippetIdxPairsPage2(): [Snippet, number][] {
            let result: [Snippet, number][] = []
            try {
                const chatReport = gameStore.state.curReport;

                result = chatReport && chatReport.snippets && chatReport.snippets.length > REPORT_CONSTANTS.NUM_SNIPPETS_PER_PAGE ? 
                    chatReport.snippets
                        .slice(REPORT_CONSTANTS.NUM_SNIPPETS_PER_PAGE, 2 * REPORT_CONSTANTS.NUM_SNIPPETS_PER_PAGE)
                        .map((snippet: Snippet, index: number) => [snippet, index + REPORT_CONSTANTS.NUM_SNIPPETS_PER_PAGE])
                    : 
                    [];
            } 
            catch (error) {
                WriteLog("ChatReport.vue > computed > snippetIdxPairsPage2 > #ERROR: " + error, LogLevel.ERROR);
            }
            return result
        },

        isGrooming(): boolean {
            let result = false
            try {
                const chatReport = gameStore.state.curReport;
                result = chatReport ? chatReport.isGrooming : false;
            } 
            catch (error) {
                WriteLog("ChatReport.vue > computed > isGrooming > #ERROR: " + error, LogLevel.ERROR);
            }
            return result;
        },

        numPages(): number{
            let result = 1;
            try {
                
                const chatReport = gameStore.state.curReport;

                if(chatReport && chatReport.snippets.length > 0){
                    result = chatReport.snippets.length > REPORT_CONSTANTS.NUM_SNIPPETS_PER_PAGE ?
                        REPORT_CONSTANTS.NUM_REPORT_PAGES_MULTI
                        :
                        REPORT_CONSTANTS.NUM_REPORT_PAGES_SINGLE;
                }
            } 
            catch (error) {
                WriteLog("ChatReport.vue > computed > numPages > #ERROR: " + error, LogLevel.ERROR);
            }
            return result;
        },

        user1(): Profile | undefined{
            let result = undefined;

            try {
                const chatReport = gameStore.state.curReport;
                if(chatReport && chatReport.user1Profile)
                    result = chatReport.user1Profile
            } 
            catch (error) {
                WriteLog("ChatReport.vue > computed > user1 > #ERROR: " + error, LogLevel.ERROR);
            }

            return result
        },

        user2(): Profile | undefined{
            let result = undefined;

            try {
                const chatReport = gameStore.state.curReport;
                if(chatReport && chatReport.user2Profile)
                    result = chatReport.user2Profile
            } 
            catch (error) {
                WriteLog("ChatReport.vue > computed > user2 > #ERROR: " + error, LogLevel.ERROR);
            }

            return result
        },

        friendshipTime(): number[] | undefined{
            let result = undefined;

            try {
                const chatReport = gameStore.state.curReport;
                if(chatReport && chatReport.friendshipTime)
                    result = chatReport.friendshipTime
            } 
            catch (error) {
                WriteLog("ChatReport.vue > computed > friendshipTime > #ERROR: " + error, LogLevel.ERROR);
            }

            return result
        },

        isSolution(): boolean{
            return gameStore.getters.showingSolution;
        },

        solution(): string{
            let result = "";
            try {
                const correct = gameStore.state.curReport!.isGrooming ? "grooming" : "normal";
                const incorrect = !gameStore.state.curReport!.isGrooming ? "grooming" : "normal";

                if(gameStore.getters.showingSolution){
                    if( this.correctness === ECorrectness.INCORRECT)
                        result = stringFormat(SOLUTION_STRINGS.GROOMING_SELECTION_INCORRECT, incorrect, correct);

                    else if(this.correctness === ECorrectness.PARTIALLY_CORRECT)
                        result = stringFormat(SOLUTION_STRINGS.GROOMING_SELECTION_PARTIALLY_CORRECT, correct);
                    
                    else
                        result = stringFormat(SOLUTION_STRINGS.GROOMING_SELECTION_CORRECT, correct);
                }
            } 
            catch (error) {
                WriteLog("ChatReport.vue > computed > friendshipTime > #ERROR: " + error, LogLevel.ERROR);
            }
            return result;
        }
    }
})
</script>


<style scoped>
@import '@/css/report.css';
@import '@/css/common.css'; 
</style>, SOUND_CONSTANTS
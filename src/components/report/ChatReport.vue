<template>
    <div class="report flex-center-aligned">
        <div v-if="currentPage === 0">
            <ProfilesPageComponent v-if="user1 && user2 && friendshipTime" 
                :user1="user1" :user2="user2" :friendshipTime="friendshipTime" 
            />
        </div>

        <div v-if="currentPage === 1 && snippetIdxPairsPage1.length > 0">
            <ChatSnippetPageComponent :snippetIdxPairs="snippetIdxPairsPage1"/>
        </div>

        <div v-if="currentPage === 2 && snippetIdxPairsPage2.length > 0">
            <ChatSnippetPageComponent :snippetIdxPairs="snippetIdxPairsPage2"/>
        </div>
        
        <div v-if="this.showReportButtonsContainerInside" class="report-buttons-container non-selectable-text flex-center-aligned flex-col">
            <div @click="changePage(false)" :class="{ 'report-button': true, 'prev-button': true, 'invisible': currentPage === 0 }">&#8249;</div>
            <CButton color="danger" variant="outline" @click="sendSolveReport(true)" class="answer-button my-button">Grooming</CButton>
            <CButton color="success" variant="outline" @click="sendSolveReport(false)" class="answer-button my-button">Normal</CButton>
            <div @click="changePage(true)" :class="{ 'report-button': true, 'next-button': true, 'invisible': currentPage === numPages - 1 }">&#8250;</div>
        </div>
        
        <ErrorModalComponent @closeModal="handleCloseModal" :visibility="solveReportErrorModalVisible" :message="'NO puedes marcar un informe como normal si tienes un snippet seleccionado.'"/>
    </div>

    <div v-if="!this.showReportButtonsContainerInside" class="bottom-report-buttons-container non-selectable-text flex-center-aligned flex-col">
        <div class="button-container">
            <div @click="changePage(false)" :class="{ 'report-button': true, 'prev-button': true, 'invisible': currentPage === 0 }">&#8249;</div>
        </div>
        <div class="button-container">
            <div @click="changePage(true)" :class="{ 'report-button': true, 'next-button': true, 'invisible': currentPage === numPages - 1 }">&#8250;</div>
        </div>
    </div>

    <div v-if="!this.showReportButtonsContainerInside" class="floating-report-buttons-container non-selectable-text">
        <p>{{ GENERAL_STRINGS.ANSWER }}</p>
        <CButton color="danger" variant="outline" @click="sendSolveReport(true)" class="answer-button my-button">Grooming</CButton>
        <CButton color="success" variant="outline" @click="sendSolveReport(false)" class="answer-button my-button">Normal</CButton>
    </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { gameStore } from '@/gameStore'

import { LogLevel, WriteLog } from '@/utils/logger'

import ChatSnippetPageComponent from './ChatSnippetPage.vue'
import ProfilesPageComponent from './ProfilesPage.vue'
import ErrorModalComponent from '@/components/ErrorModal.vue'

import Snippet from '@/utils/model/Snippet'
import Profile from '@/utils/model/Profile'
import { NUM_CONSTANTS, REPORT_CONSTANTS } from '@/utils/constants'
import { GENERAL_STRINGS } from '@/assets/stringsESP';

import { CButton } from '@coreui/vue'

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
            liveExampleVisible: false,
            GENERAL_STRINGS: GENERAL_STRINGS
        };
    },
    methods: {
        changePage(isNext: boolean) {
            const numPages = this.numPages ? this.numPages : 1;
            this.currentPage = isNext ? Math.min(this.currentPage + 1, numPages - 1) : Math.max(this.currentPage - 1, 0);
        },
        sendSolveReport(isGrooming: boolean){
            WriteLog(`ChatReport.vue > sendSolveReport > Grooming: ${isGrooming}`, LogLevel.VERBOSE);
            try {
                if(!isGrooming && gameStore.getters.aSnippetIsSelected){
                    this.solveReportErrorModalVisible = true;
                }
                else{
                    this.$emit('solveReport', isGrooming);
                    this.currentPage = NUM_CONSTANTS.ZERO;
                }
            } catch (error) {
                WriteLog(`ChatReport.vue > sendSolveReport > ERROR: Could not emit event. #ERROR: ${error}`, LogLevel.ERROR);
            }
        },
        handleCloseModal(){
            this.solveReportErrorModalVisible = false;
        }
    },
    computed: {
        showReportButtonsContainerInside() {
            return window.innerHeight >= 850;
        },

        snippetIdxPairsPage1(): [Snippet, number][] {
            const chatReport = gameStore.state.curReport;

            return chatReport && chatReport.snippets ?
                chatReport.snippets.slice(NUM_CONSTANTS.ZERO, REPORT_CONSTANTS.NUM_SNIPPETS_PER_PAGE)
                    .map((snippet: Snippet, index: number) => [snippet, index])
                : 
                [];
        },

        snippetIdxPairsPage2(): [Snippet, number][] {
            const chatReport = gameStore.state.curReport;

            return chatReport && chatReport.snippets && chatReport.snippets.length > REPORT_CONSTANTS.NUM_SNIPPETS_PER_PAGE ? 
                chatReport.snippets
                    .slice(REPORT_CONSTANTS.NUM_SNIPPETS_PER_PAGE, 2 * REPORT_CONSTANTS.NUM_SNIPPETS_PER_PAGE)
                    .map((snippet: Snippet, index: number) => [snippet, index + REPORT_CONSTANTS.NUM_SNIPPETS_PER_PAGE])
                : 
                [];
        },

        numPages(): number{
            let result = 1;
            const chatReport = gameStore.state.curReport;

            if(chatReport && chatReport.snippets.length > 0){
                result = chatReport.snippets.length > REPORT_CONSTANTS.NUM_SNIPPETS_PER_PAGE ?
                    REPORT_CONSTANTS.NUM_REPORT_PAGES_MULTI
                    :
                    REPORT_CONSTANTS.NUM_REPORT_PAGES_SINGLE;
            }
            return result;
        },

        user1(): Profile | undefined{
            const chatReport = gameStore.state.curReport;
            return chatReport && chatReport.user1Profile ? chatReport.user1Profile : undefined;
        },

        user2(): Profile | undefined{
            const chatReport = gameStore.state.curReport;
            return chatReport && chatReport.user2Profile ? chatReport.user2Profile : undefined;
        },

        friendshipTime(): number[] | undefined{
            const chatReport = gameStore.state.curReport;
            return chatReport && chatReport.friendshipTime ? chatReport.friendshipTime : undefined;
        }
    }
})
</script>


<style scoped>
@import '@/css/report.css';
@import '@/css/common.css'; 
</style>
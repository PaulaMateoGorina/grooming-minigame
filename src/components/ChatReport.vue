<template>
    <div class="report">
        <div v-if="currentPage === 0">
            Profile pages
        </div>

        <div v-if="currentPage === 1 && snippetIdxPairsPage1">
            <ChatSnippetPageComponent :snippetIdxPairs="snippetIdxPairsPage1"/>
        </div>

        <div v-if="currentPage === 2 && snippetIdxPairsPage2">
            <ChatSnippetPageComponent :snippetIdxPairs="snippetIdxPairsPage2"/>
        </div>
        
        <div class="report-buttons-container">
            <div @click="changePage(false)" class="report-button prev-button">&#8249;</div>
            <div class="answer-buttons-container">
                <div class="report-button answer-button grooming" @click="sendSolveReport(true)">Grooming</div>
                <div class="report-button answer-button clear" @click="sendSolveReport(false)">Clear</div>
            </div>
            <div @click="changePage(true)" class="report-button next-button">&#8250;</div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import ChatSnippetPageComponent from './ChatSnippetPage.vue'
import { gameStore } from '@/gameStore'
import Snippet from '@/utils/model/Snippet'
import * as gameConstants from '@/utils/constants'

export default defineComponent({
    name: 'ReportComponent',
    components: {
        ChatSnippetPageComponent,
    },
    data() {
        return {
            currentPage: 0,
        };
    },
    methods: {
        changePage(isNext: boolean) {
            const numPages = this.numPages ? this.numPages : 1;
            this.currentPage = isNext ? Math.min(this.currentPage + 1, numPages - 1) : Math.max(this.currentPage - 1, 0);
        },
        sendSolveReport(isGrooming: boolean){
            console.log(`Grooming: ${isGrooming}`);
            try {
                //TODO: DO THIS BETTER
                if(!isGrooming && gameStore.getters.aSnippetIsSelected){
                    window.alert("NO puedes marcar un informe como 'clear' si tienes un snippet seleccionado.");
                }
                else{
                    this.$emit('solveReport', isGrooming);
                    this.currentPage = gameConstants.ZERO;
                }
            } catch (error) {
                console.error(`ChatReport.vue > sendSolveReport > ERROR: Could not emit event. ${error}`);
            }
        }
    },
    computed: {
        snippetIdxPairsPage1(): [Snippet, number][] {
            const chatReport = gameStore.state.curReport;

            return chatReport && chatReport.snippets ?
                chatReport.snippets.slice(gameConstants.ZERO, gameConstants.NUM_SNIPPETS_PER_PAGE)
                    .map((snippet: Snippet, index: number) => [snippet, index])
                : 
                [];
        },

        snippetIdxPairsPage2(): [Snippet, number][] {
            const chatReport = gameStore.state.curReport;

            return chatReport && chatReport.snippets && chatReport.snippets.length > gameConstants.NUM_SNIPPETS_PER_PAGE ? 
                chatReport.snippets
                    .slice(gameConstants.NUM_SNIPPETS_PER_PAGE, 2 * gameConstants.NUM_SNIPPETS_PER_PAGE)
                    .map((snippet: Snippet, index: number) => [snippet, index + gameConstants.NUM_SNIPPETS_PER_PAGE])
                : 
                [];
        },

        numPages(): number{
            const chatReport = gameStore.state.curReport;
            return chatReport && chatReport.snippets && chatReport.snippets.length > gameConstants.NUM_SNIPPETS_PER_PAGE ?
            gameConstants.NUM_REPORT_PAGES_MULTI
            :
            gameConstants.NUM_REPORT_PAGES_SINGLE;
        }
    }
})
</script>


<style scoped>
@import '@/css/report.css'
</style>
<template>
    <div class="report">
        <div v-if="currentPage === 0">
            Profile pages
        </div>

        <div v-if="currentPage === 1 && chatReport?.snippetsPage1">
            <div v-for="snippet in chatReport.snippetsPage1" :key="snippet.id">
                <ChatSnippetComponent :chatSnippet="snippet" />
            </div>
        </div>

        <div v-if="currentPage === 2 && chatReport?.snippetsPage2">
            <div v-for="snippet in chatReport.snippetsPage2" :key="snippet.id">
                <ChatSnippetComponent :chatSnippet="snippet" />
            </div>
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
import ChatSnippetComponent from './ChatSnippet.vue';
import Report from '@/utils/classes/Report'
import * as gameConstants from '@/utils/constants'

export default defineComponent({
    name: 'ReportComponent',
    data() {
        return {
            currentPage: 0,
        };
    },
    methods: {
        changePage(isNext: boolean) {
            const numPages = this.chatReport ? this.chatReport.numPages : 1;
            this.currentPage = isNext ? Math.min(this.currentPage + 1, numPages - 1) : Math.max(this.currentPage - 1, 0);
        },
        sendSolveReport(isGrooming: boolean){
            console.log(`Grooming: ${isGrooming}`);
            try {
                this.$emit('solveReport', isGrooming);
                this.currentPage = gameConstants.ZERO;
            } catch (error) {
                console.error(`sendSolveReport > ERROR: Could not emit event. ${error}`);
            }
        }
    },
    components: {
        ChatSnippetComponent,
    },
    props: {
        chatReport: Report
    }
})
</script>


<style scoped>
@import '@/css/report.css'
</style>
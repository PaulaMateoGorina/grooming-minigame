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
                <div class="report-button answer-button grooming">Grooming</div>
                <div class="report-button answer-button clear">Clear</div>
            </div>
            <div @click="changePage(true)" class="report-button next-button">&#8250;</div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import ChatSnippetComponent from './ChatSnippet.vue';
import Report from '@/utils/classes/Report'

export default defineComponent({
    name: 'ReportComponent',
    data() {
        return {
            currentPage: 0,
        };
    },
    methods: {
        changePage(isNext: boolean) {
            this.currentPage = isNext ? Math.min(this.currentPage + 1, this.chatReport!.numPages - 1) : Math.max(this.currentPage - 1, 0);
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
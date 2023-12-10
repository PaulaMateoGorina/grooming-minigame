<template>
    <div class="report">
        <div v-if="currentPage === 0">
            Profile pages
        </div>

        <div v-if="currentPage === 1 && chatReport?.snippetsPage1">
            <div v-for="snippet in chatReport.snippetsPage1" :key="snippet.id">
                <ChatSnippetComponent :chatSnippet="snippet"/>
            </div>
        </div>

        <div v-if="currentPage === 2 && chatReport?.snippetsPage2">
            <div v-for="snippet in chatReport.snippetsPage2" :key="snippet.id">
                <ChatSnippetComponent :chatSnippet="snippet"/>
            </div>
        </div>

        <div v-if="currentPage > 0" @click="changePage(false)" class="nav-button prev-button">&#8249;</div>
        <div v-if="currentPage < (chatReport!.numPages-1)" @click="changePage(true)" class="nav-button next-button">&#8250;</div>
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
        changePage(isNext: boolean){
            this.currentPage = isNext ? this.currentPage + 1 : this.currentPage - 1;
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
.report{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90vh;
    position: relative;
    width: 650px;
    background-image: url('@/assets/report.png');
    background-position: center; 
    background-repeat: no-repeat;
    min-height: 0;
    overflow: hidden;
}

.report-wrapper {
  position: relative;
}

.nav-button {
  font-size: 50px;
  position: absolute;
  bottom: 27px;
  padding: 10px;
  cursor: pointer;
}

.prev-button {
  left: 50px; /* Adjust the distance from the left */
}

.next-button {
  right: 50px; /* Adjust the distance from the right */
}
</style>
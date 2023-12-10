<template>
  <div class="game">
    <ReportComponent :chatReport = "chatReport"/>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import ReportComponent from './ChatReport.vue'

import DataManager from '@/utils/classes/DataManager';

import Report from '@/utils/classes/Report'

export default defineComponent({
  name: 'GameComponent',
  components: {
    ReportComponent,
  },
  setup() {
    const dataManager: DataManager = DataManager.getInstance();

    // Initialize the snippet data property
    const chatReport: Report | undefined = dataManager.generateReport(true);

    // Return the reactive properties and methods
    return {
      chatReport
    };
  },
});
</script>
    
<style scoped>
.game {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
<template>
  <div class="game">
    <ReportComponent :chatReport = "chatReport" @solveReport="handleSolveReport"/>
    <p>{{points}}</p>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import ReportComponent from './ChatReport.vue'

import DataManager from '@/utils/classes/DataManager';
import Report from '@/utils/classes/Report'
import * as gameConstants from '@/utils/constants'

export default defineComponent({
  name: 'GameComponent',
  components: {
    ReportComponent,
  },
  data() {
    return {
      points: 0,
      chatReport: undefined as Report | undefined,
    };
  },
  methods: {
    handleSolveReport(isGrooming: boolean) {
      const multiplier = this.chatReport ? this.chatReport.getAnswerResult(isGrooming) : gameConstants.ZERO;
      this.points += gameConstants.POINTS_PER_REPORT * multiplier;

      // Generate a new report
      this.chatReport = DataManager.getInstance().generateReport(Math.random() > 0.5);
    },
  },
  created() {
    // Initialize the snippet data property
    this.chatReport = DataManager.getInstance().generateReport(Math.random() > 0.5);
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
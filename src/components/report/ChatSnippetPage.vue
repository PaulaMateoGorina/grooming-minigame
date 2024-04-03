<template>
  <div v-for="snippetIdxPair in snippetIdxPairs" :key="snippetIdxPair[0].id">
    <ChatSnippetComponent :chatSnippet="snippetIdxPair[0]" :arrayIdx="snippetIdxPair[1]" :isGrooming="isGrooming"/>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import ChatSnippetComponent from './ChatSnippet.vue';
import Snippet from '@/utils/model/Snippet';

export default defineComponent({
  name: 'ChatSnippetPageComponent',
  components: {
      ChatSnippetComponent,
  },
  props: {
    snippetIdxPairs: {
      type: Array as () => [Snippet, number][]
    },
    isGrooming: Boolean
  }
})
</script>

<style scoped>
</style>
  
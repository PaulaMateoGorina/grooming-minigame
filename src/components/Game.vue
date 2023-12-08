<template>
    <ChatSnippetComponent :chatSnippet = "snippet"/>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import ChatSnippetComponent from './ChatSnippet.vue'

import DataLoader from '@/utils/classes/DataLoader';

import Snippet from '@/utils/classes/Snippet'

export default defineComponent({
  name: 'GameComponent',
  components: {
    ChatSnippetComponent
  },
  setup() {
    const dataLoader: DataLoader = new DataLoader();

    // Initialize the snippet data property
    const snippet: Snippet | undefined = dataLoader.getGroomingSnippet();

    // Return the reactive properties and methods
    return {
      snippet,
    };
  },
});
</script>
    
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
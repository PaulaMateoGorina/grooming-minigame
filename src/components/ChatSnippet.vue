<template>
    <div v-if="chatSnippet">
        <div v-for="message in chatSnippet!.messages" :key="message.id" :class="message.sender">
            {{ message.text }}
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import Snippet from '@/utils/classes/Snippet';

export default defineComponent({
    name: 'ChatSnippetComponent',
    props: {
        chatSnippet: Snippet
    }
})
</script>

<style scoped>

</style>../classes/Snippet
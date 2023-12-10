<template>
    <div v-if="chatSnippet" class="chat-snippet">
        <div v-for="message in chatSnippet!.messages" :key="message.id" :class="message.sender">
           <p class="message-text">{{ message.text }}</p> 
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
@import '@/css/messages.css'
</style>
<template>
    <div :class="{ 'chat-snippet': stage < 0, 'chat-snippet-selected': stage > 0 }" @click="handleClick">
        <div v-for="message in chatSnippet!.messages" :key="message.id" :class="message.sender">
           <p class="message-text">{{ message.text }}</p> 
        </div>
    </div>
    {{ chatSnippet?.stage }}
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { gameStore } from '@/gameStore'

import Snippet from '@/utils/model/Snippet'
import EStage from '@/utils/enums/EStage'

export default defineComponent({
    name: 'ChatSnippetComponent',
    data() {
        return {
            stage: EStage.Clear,
        };
    },
    props: {
        chatSnippet: Snippet,
        arrayIdx: Number
    },
    computed: {
        selectSnippet(): boolean {
            return gameStore.state.selectGroomingSnippets;
        },
        
        selectSnippetStage(): boolean {
            return gameStore.state.selectSnippetStages;
        }
    },
    methods: {
        handleClick(){
            if(this.selectSnippet){
                if(this.selectSnippetStage){
                    console.log("TODO");
                }
                else{
                    this.stage = this.stage * EStage.Clear;
                    gameStore.commit('changeSnippetStageSelected', { idx: this.arrayIdx, stage: this.stage })
                }
            }
        }
    },
    created(){
        if(this.chatSnippet && this.chatSnippet.id === 10)
            console.log(this.chatSnippet);
    }
})
</script>

<style scoped>
@import '@/css/messages.css'
</style>
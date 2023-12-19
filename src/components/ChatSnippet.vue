<template>
    <OnClickOutside @trigger="hideOptions">
        <div 
        id="message-container"
        :class="{ 'non-selectable-text': true, 'chat-snippet': stage < 0, 'chat-snippet-selected': stage > 0 }"
        @click="handleClickInside"
        >
            <div v-for="message in chatSnippet!.messages" :key="message.id" :class="message.sender">
            <p class="message-text">{{ message.text }}</p> 
            </div>
        </div>

        <div v-show="selectSnippetStage && stageSelectorVisible" class="stages-list"
        :style="{ marginLeft: mousePosition.x + 'px', top: mousePosition.y + 'px' }">
            <div v-for="stage in stages" :key="stage[0]">
                {{ stage[0] }}
            </div>
        </div>
    </OnClickOutside>
    
    {{ chatSnippet?.stage }}
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { gameStore } from '@/gameStore'

import Snippet from '@/utils/model/Snippet'
import EStage from '@/utils/enums/EStage'

//external imports
import { OnClickOutside } from '@vueuse/components'

export default defineComponent({
    name: 'ChatSnippetComponent',
    components: {
        OnClickOutside,
    },
    data() {
        return {
            stage: EStage.Clear,
            stageSelectorVisible: false,
            mousePosition: {x: 0, y: 0}
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
        },

        stages(): [string, number][] {
            return Object.entries(EStage)
                .filter(([, value]) => typeof value === 'number') as [string, number][];
        }
    },
    methods: {
        handleClickInside(event: MouseEvent){
            try {
                const parentRect = document.getElementById('message-container');
                if(parentRect === null)
                    throw new Error("Parent element was null");

                this.mousePosition.x = event.pageX - parentRect.getBoundingClientRect().x;
                this.mousePosition.y = event.pageY;

                console.log(this.mousePosition.x, " ", this.mousePosition.y);

                if (this.selectSnippet) {
                    if(this.selectSnippetStage){
                        this.stageSelectorVisible = !this.stageSelectorVisible;
                    }
                    else{
                        this.stage = this.stage * EStage.Clear;
                        gameStore.commit('changeSnippetStageSelected', { idx: this.arrayIdx, stage: this.stage })
                    }
                }
            } catch (error) {
                console.error(`ChatSnippet.vue > handleClickInside > Could not handle click inside element correctly. #ERROR: ${error}`);
            }
        },
        hideOptions(){
            this.stageSelectorVisible = false;
        }        
    },
    created(){
        if(this.chatSnippet && this.chatSnippet.id === 10)
            console.log(this.chatSnippet);
    }
})
</script>

<style scoped>
@import '@/css/messages.css';
@import '@/css/common.css';
</style>
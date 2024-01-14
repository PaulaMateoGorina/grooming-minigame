<template>
    <OnClickOutside @trigger="nextDialogue">
        <div 
            id="narrative-text-container" 
            class="flex-center-aligned non-selectable-text"
            @click="nextDialogue"
        >
            <TypewriterTextComponent 
                :textToWriteProp="texts[curTextIdx]"
                :newTextDelayProp="newTextDelay"
                :typingSpeed="typingSpeed"
                @finishedTyping="handleFinishedTyping"
            />
            <p id="continue-narration" class="pulsating-element" v-if="showContinueMessage">{{ GENERAL_STRINGS.CONTINUE_NARRATION }}</p>
        </div>
    </OnClickOutside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TypewriterTextComponent from '@/components/TypewriterText.vue'

import { GENERAL_STRINGS } from '@/assets/stringsESP';
import { NUM_CONSTANTS } from '@/utils/constants';
import { EGameStage } from '@/utils/enums';

import { gameStore } from '@/gameStore';

import { OnClickOutside } from '@vueuse/components'

export default defineComponent({
    name: 'NarrativeScreenComponent',
    components:{
        TypewriterTextComponent,
        OnClickOutside
    },
    data(){
        return{
            typingSpeed: 50,
            newTextDelay: 0,
            showContinueMessage: false,
            GENERAL_STRINGS : GENERAL_STRINGS,
            curText: "",
            texts: ["This is an example of the text to write.", "Another example of the text to write."],
            curTextIdx: 0
        }
    },
    methods:{
        handleFinishedTyping(){
            this.showContinueMessage = true;
        },
        nextDialogue(){
            console.log("next");
            if(this.showContinueMessage){
                this.curTextIdx++;

                if(this.curTextIdx < this.texts.length){
                    this.curText = this.texts[this.curTextIdx];
                }
                else{
                    gameStore.commit('changeStage', EGameStage.REPORT);
                }
            }
        },
    },
    created(){
        this.curText = this.texts[NUM_CONSTANTS.ZERO];
    }
})
</script>

<style scoped>
@import '@/css/common.css';
@import '@/css/narrative-screen.css';
</style>

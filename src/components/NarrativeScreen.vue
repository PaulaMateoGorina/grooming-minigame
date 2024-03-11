<template>
    <OnClickOutside @trigger="nextDialogue">
        <div 
            id="narrative-text-container" 
            class="flex-center-aligned non-selectable-text flex-column"
            @click="nextDialogue(curNode ? curNode.goTo : -1)"
        >
            <TypewriterTextComponent 
                :textToWriteProp="curNode!.text"
                :newTextDelayProp="newTextDelay"
                :typingSpeed="typingSpeed"
                @finishedTyping="handleFinishedTyping"
            />

            <div v-if="curNode && curNode.options !== undefined && showContinueMessage" class="fade-in narrative-option-container">
                <div v-for="option in curNode.options" :key="option.text" @click.stop="goTo(option.goTo)" class="narrative-option">
                    {{ option.text }}
                </div>
            </div>

            <p id="continue-narration" class="pulsating-element" v-if="showContinueMessage && !curNodeHasOptions">{{ GENERAL_STRINGS.CONTINUE_NARRATION }}</p>
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
import NarrationNode from '@/utils/model/NarrationNode';

import { OnClickOutside } from '@vueuse/components'

export default defineComponent({
    name: 'NarrativeScreenComponent',
    components:{
        TypewriterTextComponent,
        OnClickOutside
    },
    data(){
        return{
            GENERAL_STRINGS : GENERAL_STRINGS,
            typingSpeed: 40,
            curNode: undefined as NarrationNode | undefined,
            curNodeHasOptions: false,
            newTextDelay: 0,
            showContinueMessage: false,
        }
    },
    methods:{
        handleFinishedTyping(){
            this.showContinueMessage = true;
        },
        nextDialogue(to: number){
            if(this.showContinueMessage){
                if(!this.curNodeHasOptions){
                    this.showContinueMessage = false;
                    if(to > 0){
                        this.curNode = this.narrationNodes[to];
                        this.curNodeHasOptions = this.narrationNodes[to].options !== undefined;
                        if(this.curNode.audio)
                            this.curNode.audio.play();
                    }
                    else{
                        gameStore.commit('changeStage', EGameStage.REPORT);
                    }
                }
            }
        },
        goTo(to: number){
            if(to > 0){
                this.curNode = this.narrationNodes[to];
                this.curNodeHasOptions = this.narrationNodes[to].options !== undefined;
                this.showContinueMessage = false;
                if(this.curNode.audio)
                    this.curNode.audio.play();
            }
            else{
                gameStore.commit('changeStage', EGameStage.REPORT);
            }
        }
    },
    computed:{
        narrationNodes(){
            return gameStore.state.curDay && gameStore.state.curDay.narrationNodes ? gameStore.state.curDay.narrationNodes : []
        }
    },
    created(){
        this.curNode = this.narrationNodes[NUM_CONSTANTS.ZERO];
        this.curNodeHasOptions = this.curNode.options !== undefined && this.curNode.options.length > 0;
        if(this.curNode.audio)
            this.curNode.audio.play();
    }
})
</script>

<style scoped>
@import '@/css/common.css';
@import '@/css/narrative-screen.css';
</style>

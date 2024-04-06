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

            <div v-if="curNode && curNode.options !== undefined && typingFinished && (voiceOverFinished || isMuted)" class="fade-in narrative-option-container">
                <div v-for="(option, idx) in curNode.options" :key="option.text" @click.stop="goTo(option.goTo, idx)" class="narrative-option">
                    {{ option.text }}
                </div>
            </div>
            <p id="continue-narration" class="pulsating-element" v-if="typingFinished && (voiceOverFinished || isMuted) && !curNodeHasOptions">{{ GENERAL_STRINGS.CONTINUE_NARRATION }}</p>
            
            <div v-if="!firstRun" @click.stop="skip" class="skip-button">{{ GENERAL_STRINGS.SKIP }}</div> 
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
import SoundManager from '@/utils/SoundManager';

import { OnClickOutside } from '@vueuse/components'
import DataService from '@/utils/DataService';
import { UserData } from '@/utils/model/UserData';

export default defineComponent({
    name: 'NarrativeScreenComponent',
    components:{
        TypewriterTextComponent,
        OnClickOutside
    },
    data(){
        return{
            GENERAL_STRINGS : GENERAL_STRINGS,
            typingSpeed: 35,
            curNode: undefined as NarrationNode | undefined,
            curNodeHasOptions: false,
            newTextDelay: 0,
            typingFinished: false,
            voiceOverFinished: false
        }
    },
    methods:{
        handleFinishedTyping(){
            this.typingFinished = true;
        },
        nextDialogue(goto: number){
            let to = -1;
            
            if(!isNaN(goto))
                to = goto;
            else if(this.curNode)
                to = this.curNode.goTo;

            if(this.typingFinished && (this.isMuted || this.voiceOverFinished)){
                if(!this.curNodeHasOptions){
                    this.typingFinished = false;
                    this.voiceOverFinished = false;

                    if(to > 0){
                        this.curNode = this.narrationNodes[to];
                        this.curNodeHasOptions = this.narrationNodes[to].options !== undefined;
                        SoundManager.getInstance().stopSounds();

                        if(this.curNode.audio){
                            SoundManager.getInstance().playSound(this.curNode.audio).then(()=>{
                                this.voiceOverFinished = true;
                            })
                        }
                    }
                    else{
                        gameStore.commit('changeStage', EGameStage.REPORT);
                    }
                }
            }
        },
        goTo(to: number, answerIdx: number){
            if(this.curNode !== undefined && this.curNode.dataUserProperty !== undefined){
                const userPropertyKey: keyof UserData = this.curNode.dataUserProperty as keyof UserData;
                DataService.getInstance().modifyDataObject(userPropertyKey, answerIdx);
            }

            if(to > 0){
                this.curNode = this.narrationNodes[to];
                this.curNodeHasOptions = this.narrationNodes[to].options !== undefined;
                this.typingFinished = false;
                this.voiceOverFinished = false;
                
                if(this.curNode.audio){
                    SoundManager.getInstance().playSound(this.curNode.audio).then(()=>{
                        this.voiceOverFinished = true;
                    })
                }
            }
            else{
                gameStore.commit('changeStage', EGameStage.REPORT);
            }
        },
        skip(){
            gameStore.commit('changeStage', EGameStage.REPORT);
        }
    },
    computed:{
        narrationNodes(){
            return gameStore.state.curDay && gameStore.state.curDay.narrationNodes ? gameStore.state.curDay.narrationNodes : []
        },

        isMuted(){
            return gameStore.getters.isMuted;
        },

        firstRun(){
            return gameStore.getters.isFirstPlaythrough;
        }
    },
    created(){
        this.curNode = this.narrationNodes[NUM_CONSTANTS.ZERO];
        this.curNodeHasOptions = this.curNode.options !== undefined && this.curNode.options.length > 0;
        if(this.curNode.audio){
            SoundManager.getInstance().playSound(this.curNode.audio).then(()=>{
                this.voiceOverFinished = true;
            })
        }
    }
})
</script>

<style scoped>
@import '@/css/common.css';
@import '@/css/narrative-screen.css';
</style>

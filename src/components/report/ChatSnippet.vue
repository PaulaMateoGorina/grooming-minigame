<template>
    <div>
        <!-- Snippet -->
        <OnClickOutside @trigger="hideOptions" @contextmenu.prevent="handleRightClick()">
            <div
                id="message-container"
                :class="{ 
                    'non-selectable-text': true, 
                    'chat-snippet': true, 
                    'chat-snippet-selected': (!isSolution && stage > 0) || (isSolution && stage !== chatSnippet!.stage),
                    'chat-snippet-correct': isSolution && isGrooming && stage === chatSnippet!.stage
                }"
                @click="handleClickInside"
                @mouseenter="handleMouseOver" 
                @mouseleave="handleMouseOut"
            >
                <div v-for="message in chatSnippet!.messages" :key="message.id" :class="message.sender">
                    <p class="message-text">{{ message.text }}</p>
                </div>

                <!-- Floating text showing the stage selected -->
                <Transition>
                    <div v-if="isSolution">
                        <div v-if="showSolution">
                            <div v-if="stage === chatSnippet!.stage" :class="selectSnippetStage ? 'floating-text-wrapper': 'invisible'">
                                {{selectedStageName}}
                            </div>
                            <div v-else class="floating-text-wrapper quick-fade-in">
                                {{ correctSolution }}
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="selectSnippetStage && stage > 0" class="floating-text-wrapper">
                            {{selectedStageName}}
                        </div>
                    </div>
                </Transition>
            </div>
            
        </OnClickOutside>
        
        <!-- Stage selector -->
        <Transition>
            <div v-if="selectSnippetStage && stageSelectorVisible" class="non-selectable-text stages-list"
            :style="{ marginLeft: mousePosition.x + 'px', top: mousePosition.y + 'px' }">
                <div class="stages-list-item" v-for="stage in STAGES" :key="stage.enumValue" @click="handleClickStage({name: stage.name, enumVal: stage.enumValue})">
                {{ debugMode? stage.enumValue + ": " : ""}}{{ stage.name }}
                </div>
            </div>
        </Transition>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { gameStore } from '@/gameStore'

import { LogLevel, WriteLog } from '@/utils/logger'

import Snippet from '@/utils/model/Snippet'
import { EStage, ESound } from '@/utils/enums'

//external imports
import { OnClickOutside } from '@vueuse/components'
import { STAGES, STAGE_CONSTANTS } from '@/utils/constants'
import SoundManager from '@/utils/SoundManager'
import { stringFormat } from '@/utils/utils'
import { SOLUTION_STRINGS } from '@/assets/stringsESP'


export default defineComponent({
    name: 'ChatSnippetComponent',
    components: {
        OnClickOutside,
    },
    data() {
        return {
            stageSelectorVisible: false,
            mousePosition: {x: 0, y: 0},
            STAGES: STAGES,
            showSolution: false,
        };
    },
    props: {
        chatSnippet: Snippet,
        arrayIdx: Number,
        isGrooming: Boolean
    },
    methods: {
        hideOptions(){
            this.stageSelectorVisible = false;
        },

        handleClickInside(event: MouseEvent){
            if(!this.isSolution){
                try {
                    const messageContainer = document.getElementById('message-container');
                    if(messageContainer === null)
                        throw new Error("Parent element was null");
    
                    this.mousePosition.x = event.pageX - messageContainer.getBoundingClientRect().x;
                    //TODO: FIX THIS
                    this.mousePosition.y = event.pageY + 10;
    
                    if (this.selectSnippet) {
                        if(this.selectSnippetStage){
                            this.stageSelectorVisible = !this.stageSelectorVisible;
                        }
                        else{
                            const auxStage = this.stage * EStage.Normal;
                            gameStore.commit('changeSnippetStageSelected', { idx: this.arrayIdx, stage: auxStage })
                        }
                        SoundManager.getInstance().playSoundEffect(ESound.SELECT);
                    }
                } catch (error) {
                    WriteLog(`ChatSnippet.vue > handleClickInside >#ERROR: #ERROR: ${error}`, LogLevel.ERROR);
                }
            }
        },

        handleClickStage(stage: {name: string, enumVal: number}){
            if(!this.isSolution){
                try {
                    if(stage.name === null || stage.name === ""){
                        throw new Error("Stage name was null or empty.");
                    }
                    if(stage.enumVal === null || isNaN(stage.enumVal)) {
                        throw new Error("Value for the enum was null or not a numerical value");
                    }
                    
                    const possibleEnumValues = Object.values(EStage).filter((value) => typeof value === 'number') as EStage[];
                    if (!possibleEnumValues.includes(stage.enumVal)) {
                        throw new Error("Value for the enum was not valid.");
                    }

                    WriteLog(`ChatSnippet.vue > handleClickStage > ${stage.name} ${stage.enumVal}`, LogLevel.VERBOSE);
                    gameStore.commit('changeSnippetStageSelected', { idx: this.arrayIdx, stage: stage.enumVal })
                    this.stageSelectorVisible = false;
                    SoundManager.getInstance().playSoundEffect(ESound.SELECT);
                } 
                catch (error) {
                    WriteLog(`ChatSnippet.vue > handleClickStage > #ERROR: #ERROR: ${error}`, LogLevel.ERROR);
                }
            }
        },
        
        handleRightClick(){
            gameStore.commit('changeSnippetStageSelected', { idx: this.arrayIdx, stage: STAGE_CONSTANTS.NORMAL_SNIPPET_STAGE_VAL });
            SoundManager.getInstance().playSoundEffect(ESound.SELECT);
        },

        handleMouseOver(){
            console.log("HERE")
            if(this.isSolution && this.stage !== this.chatSnippet!.stage)
                this.showSolution = true;
        },

        handleMouseOut(){
            if(this.isSolution && this.showSolution)
                this.showSolution = false;
        }
    },
    computed: {
        selectSnippet(): boolean {
            return gameStore.state.selectGroomingSnippets;
        },
        
        selectSnippetStage(): boolean {
            return gameStore.state.selectSnippetStages;
        },

        stage(): number{
            return this.arrayIdx !== undefined && gameStore.state.snippetStagesSelected.length > this.arrayIdx ? gameStore.state.snippetStagesSelected[this.arrayIdx] : -1;
        },
        
        selectedStageName(): string{
            let result = "";
            result = STAGES.filter(stage => stage.enumValue === this.stage)[0].name;
            return result;
        },

        correctSolution(): string{
            let result = "";
            const isSolution = gameStore.getters.showingSolution;
            const chosenStageName = STAGES.filter(stage => stage.enumValue === this.stage)[0].name;
            const correctStageName = STAGES.filter(stage => stage.enumValue === this.chatSnippet!.stage)[0].name;

            if(isSolution && this.stage !== this.chatSnippet!.stage){
                if(gameStore.state.selectSnippetStages)
                    result = stringFormat(SOLUTION_STRINGS.SELECTED_STAGE_SOLUTION, chosenStageName, correctStageName);
                else
                {
                    result = this.chatSnippet!.stage > 0 ? SOLUTION_STRINGS.SELECTED_SNIPPET_SOLUTION_GROOMING : SOLUTION_STRINGS.SELECTED_SNIPPET_SOLUTION_NORMAL;
                }
            }
            return result;
        },

        debugMode(): boolean{
            return gameStore.getters.isDebugMode;
        },

        isSolution(): boolean{
            return gameStore.getters.showingSolution;
        }
    }
})
</script>

<style scoped>
@import '@/css/message.css';
@import '@/css/common.css';
</style>ESound, 
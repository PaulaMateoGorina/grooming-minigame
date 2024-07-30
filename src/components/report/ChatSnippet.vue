<template>
    <div>
        <!-- Snippet -->
        <OnClickOutside @trigger="hideOptions" @contextmenu.prevent="handleRightClick()">
            <div
                id="message-container"
                :class="{ 
                    'non-selectable-text': true, 
                    'chat-snippet': true, 
                    'chat-snippet-selected': (!isSolution && stage > 0) || (isSolution && !isSolutionCorrect),
                    'chat-snippet-correct': isSolution && isSolutionCorrect && (selectSnippet || selectSnippetStage) && correctness !== ECorrectness.INCORRECT && isGrooming
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
                    <div v-if="isSolution && isGrooming" 
                        :class="{ 
                            'floating-text-wrapper': true, 
                            'invisible': !showSolution || (!selectSnippet && !selectSnippetStage)
                        }"
                        v-html="solutionMessage"
                    >
                    </div>
                    <div v-else>
                        <div v-if="!isSolution && selectSnippetStage && stage > 0" class="floating-text-wrapper">
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
                <div class="stages-list-item" v-for="stage in visibleStages" :key="stage.enumValue" @click="handleClickStage({name: stage.name, enumValue: stage.enumValue})">
                {{ debugMode? stage.enumValue + ": " : ""}}{{ stage.name }}
                </div>
            </div>
        </Transition>
    </div>
</template>
  
<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { defineComponent } from 'vue'
import { gameStore } from '@/gameStore'

import { LogLevel, WriteLog } from '@/utils/logger'

import Snippet from '@/utils/model/Snippet'
import { EStage, ESound, ECorrectness } from '@/utils/enums'

//external imports
import { OnClickOutside } from '@vueuse/components'
import { NUM_CONSTANTS, STAGES, STAGE_CONSTANTS } from '@/utils/constants'
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
            allStages: STAGES,
            showSolution: false,
            isSolutionCorrect: true,
            solutionMessage: "",
            ECorrectness: ECorrectness
        };
    },
    props: {
        chatSnippet: Snippet,
        arrayIdx: Number,
        isGrooming: Boolean,
        correctness: Number
    },
    methods: {
        hideOptions(){
            try {
                this.stageSelectorVisible = false;
            } 
            catch (error) {
                WriteLog(`ChatSnippet.vue > hideOptions > #ERROR: ${error}`, LogLevel.ERROR);
            }
        },

        handleClickInside(event: MouseEvent){
            try {
                if(!this.isSolution){

                    const messageContainer = document.getElementById('message-container');
                    if(messageContainer === null)
                        throw new Error("Parent element was null");
    
                    this.mousePosition.x = event.pageX - messageContainer.getBoundingClientRect().x;
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
                }
            } catch (error) {
                WriteLog(`ChatSnippet.vue > handleClickInside > #ERROR: ${error}`, LogLevel.ERROR);
            }
        },

        handleClickStage(stage: {name: string, enumValue: number}){
            try {
                if(!this.isSolution){
                    if(stage.name === null || stage.name === ""){
                        throw new Error("Stage name was null or empty.");
                    }
                    if(stage.enumValue === null || isNaN(stage.enumValue)) {
                        throw new Error("Value for the enum was null or not a numerical value");
                    }
                    
                    const possibleEnumValues = Object.values(EStage).filter((value) => typeof value === 'number') as EStage[];
                    if (!possibleEnumValues.includes(stage.enumValue)) {
                        throw new Error("Value for the enum was not valid.");
                    }

                    WriteLog(`ChatSnippet.vue > handleClickStage > ${stage.name} ${stage.enumValue}`, LogLevel.VERBOSE);
                    gameStore.commit('changeSnippetStageSelected', { idx: this.arrayIdx, stage: stage.enumValue })
                    this.stageSelectorVisible = false;
                    SoundManager.getInstance().playSoundEffect(ESound.SELECT);
                }
            } 
            catch (error) {
                WriteLog(`ChatSnippet.vue > handleClickStage > #ERROR: ${error}`, LogLevel.ERROR);
            }
        },
        
        handleRightClick(){
            try {
                gameStore.commit('changeSnippetStageSelected', { idx: this.arrayIdx, stage: STAGE_CONSTANTS.NORMAL_SNIPPET_STAGE_VAL });
                SoundManager.getInstance().playSoundEffect(ESound.SELECT);
            } 
            catch (error) {
                WriteLog(`ChatSnippet.vue > handleRightClick > #ERROR: ${error}`, LogLevel.ERROR);
            }
        },

        handleMouseOver(){
            try {
                if(this.isSolution)
                    this.showSolution = false;
            } 
            catch (error) {
                WriteLog(`ChatSnippet.vue > handleMouseOver > #ERROR: ${error}`, LogLevel.ERROR);
            }
        },

        handleMouseOut(){
            try {
                if(this.isSolution)
                    this.showSolution = true;
            } 
            catch (error) {
                WriteLog(`ChatSnippet.vue > handleMouseOver > #ERROR: ${error}`, LogLevel.ERROR);
            }
        }
    },
    computed: {
        selectSnippet(): boolean {
            let result = false;
            try {
                result = gameStore.state.selectGroomingSnippets;
            } 
            catch (error) {
                WriteLog(`ChatSnippet.vue > computed > selectSnippet > #ERROR: ${error}`, LogLevel.ERROR);
            }
            return result;
        },
        
        selectSnippetStage(): boolean {
            let result = false;
            try {
                result = gameStore.state.selectSnippetStages;
            } 
            catch (error) {
                WriteLog(`ChatSnippet.vue > computed > selectSnippetStage > #ERROR: ${error}`, LogLevel.ERROR);
            }
            return result;
        },

        stage(): number{
            let result = NUM_CONSTANTS.NEG;
            try {
                if(this.arrayIdx !== undefined && gameStore.state.snippetStagesSelected.length > this.arrayIdx)
                    result = gameStore.state.snippetStagesSelected[this.arrayIdx]
            } 
            catch (error) {
                WriteLog(`ChatSnippet.vue > computed > stage > #ERROR: ${error}`, LogLevel.ERROR);
            }
            return result;
        },
        
        selectedStageName(): string{
            let result = "";
            try {
                result = STAGES.filter(stage => stage.enumValue === this.stage)[0].name;
            } 
            catch (error) {
                WriteLog(`ChatSnippet.vue > computed > selectedStageName > #ERROR: ${error}`, LogLevel.ERROR);
            }
            return result;
        },
        
        debugMode(): boolean{
            let result = false;
            try {
                result = gameStore.getters.isDebugMode;
            } 
            catch (error) {
                WriteLog(`ChatSnippet.vue > computed > debugMode > #ERROR: ${error}`, LogLevel.ERROR);
            }
            return result;
        },

        isSolution(): boolean{
            let result = false;
            try {
                result =  gameStore.getters.showingSolution;
            } 
            catch (error) {
                WriteLog(`ChatSnippet.vue > computed > isSolution > #ERROR: ${error}`, LogLevel.ERROR);
            }
            return result;
        },

        visibleStages(): {name: string, enumValue: number}[]{
            let stages: {name: string, enumValue: number}[] = [];
            try {
                const selectableStages: number[] = [...new Set(gameStore.getters.selectableStages)] as number[];

                if(gameStore.state.selectSnippetStages && selectableStages.length > 0){
                    stages.push(this.allStages[0]);

                    selectableStages.forEach(stageIdx => {
                        stages.push(this.allStages[stageIdx + 1])
                    });
                }
                else{
                    stages = this.allStages;
                }
            } 
            catch (error) {
                WriteLog(`ChatSnippet.vue > computed > visibleStages > #ERROR: ${error}`, LogLevel.ERROR);
            }
            return stages;
        }
    },
    mounted() {
        try {
            const isSolution = gameStore.getters.showingSolution;
            if(isSolution){
                this.showSolution = true;
                if(gameStore.state.selectSnippetStages){
                    // Correct solution
                    if(this.stage == this.chatSnippet!.stage || this.correctness === ECorrectness.INCORRECT){
                        this.solutionMessage = STAGES.filter(stage => stage.enumValue === this.chatSnippet!.stage)[0].name;
                    }
                    else{
                        this.isSolutionCorrect = false;
                        const chosenStageName = STAGES.filter(stage => stage.enumValue === this.stage)[0].name;
                        const correctStageName = STAGES.filter(stage => stage.enumValue === this.chatSnippet!.stage)[0].name;
                        this.solutionMessage =  stringFormat(SOLUTION_STRINGS.SELECTED_STAGE_SOLUTION, chosenStageName, correctStageName);
                    }
                }
                else if(gameStore.state.selectGroomingSnippets)
                {
                    // Correct solution
                    if(this.stage * this.chatSnippet!.stage > 0 || this.correctness === ECorrectness.INCORRECT){
                        this.solutionMessage = this.chatSnippet!.stage > 0 ? SOLUTION_STRINGS.CORRECT_SELECTED_SNIPPET_SOLUTION_GROOMING : SOLUTION_STRINGS.CORRECT_SELECTED_SNIPPET_SOLUTION_NORMAL;
                    }
                    else{
                        this.isSolutionCorrect = false;
                        this.solutionMessage = this.chatSnippet!.stage > 0 ? SOLUTION_STRINGS.INCORRECT_SELECTED_SNIPPET_SOLUTION_GROOMING : SOLUTION_STRINGS.INCORRECT_SELECTED_SNIPPET_SOLUTION_NORMAL;
                    }
                }
            }
        } 
        catch (error) {
            WriteLog("ChatSnippet.vue > isSolutionCorrect > Error computing whether the solution given was correct or not: " + error, LogLevel.ERROR);
        }
    },
})
</script>

<style scoped>
@import '@/css/message.css';
@import '@/css/common.css';
</style>ESound, 
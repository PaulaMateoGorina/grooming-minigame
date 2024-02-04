<template>
    <!-- Snippet -->
    <OnClickOutside @trigger="hideOptions" @contextmenu.prevent="handleRightClick()">
        <div
        id="message-container"
        :class="{ 'non-selectable-text': true, 'chat-snippet': true, 'chat-snippet-selected': stage > 0 }"
        @click="handleClickInside"
        >
            <div v-for="message in chatSnippet!.messages" :key="message.id" :class="message.sender">
                <p class="message-text">{{ message.text }}</p>
            </div>

            <!-- Floating text showing the stage selected -->
            <Transition>
                <div v-if="selectSnippetStage && stage > 0" class="floating-text-wrapper">
                    {{selectedStageName}}
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
{{ debugMode ? chatSnippet?.stage : "" }}
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { gameStore } from '@/gameStore'

import { LogLevel, WriteLog } from '@/utils/logger'

import Snippet from '@/utils/model/Snippet'
import { EStage } from '@/utils/enums'

//external imports
import { OnClickOutside } from '@vueuse/components'
import { STAGES, STAGE_CONSTANTS } from '@/utils/constants'

export default defineComponent({
    name: 'ChatSnippetComponent',
    components: {
        OnClickOutside,
    },
    data() {
        return {
            stageSelectorVisible: false,
            mousePosition: {x: 0, y: 0},
            STAGES: STAGES
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

        stage(): number{
            return this.arrayIdx && gameStore.state.snippetStagesSelected.length > this.arrayIdx ? gameStore.state.snippetStagesSelected[this.arrayIdx] : -1;
        },
        
        selectedStageName(): string{
            let result = "";
            if(this.stage > 0)
            {
                result = STAGES.filter(stage => stage.enumValue === this.stage)[0].name;
            }
            return result;
        },

        debugMode(): boolean{
            return gameStore.getters.isDebugMode();
        }
    },
    methods: {
        hideOptions(){
            this.stageSelectorVisible = false;
        },

        handleClickInside(event: MouseEvent){
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
                        this.stage = this.stage * EStage.Normal;
                        gameStore.commit('changeSnippetStageSelected', { idx: this.arrayIdx, stage: this.stage })
                    }
                }
            } catch (error) {
                WriteLog(`ChatSnippet.vue > handleClickInside >#ERROR: #ERROR: ${error}`, LogLevel.ERROR);
            }
        },

        handleClickStage(stage: {name: string, enumVal: number}){
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
            } catch (error) {
                WriteLog(`ChatSnippet.vue > handleClickStage > #ERROR: #ERROR: ${error}`, LogLevel.ERROR);
            }
        },
        
        handleRightClick(){
            gameStore.commit('changeSnippetStageSelected', { idx: this.arrayIdx, stage: STAGE_CONSTANTS.NORMAL_SNIPPET_STAGE_VAL });
        }
    }
})
</script>

<style scoped>
@import '@/css/message.css';
@import '@/css/common.css';
</style>
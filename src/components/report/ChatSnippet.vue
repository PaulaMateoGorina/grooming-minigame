<template>
    <!-- Snippet -->
    <OnClickOutside @trigger="hideOptions" @contextmenu.prevent="handleRightClick()">
        <div
        id="message-container"
        :class="{ 'non-selectable-text': true, 'chat-snippet': stage < 0, 'chat-snippet-selected': stage > 0 }"
        @click="handleClickInside"
        >
            <div v-for="message in chatSnippet!.messages" :key="message.id" :class="message.sender">
                <p class="message-text">{{ message.text }}</p>
            </div>

            <!-- Floating text showing the stage selected -->
            <Transition>
                <div v-if="stage > 0" class="floating-text-wrapper">
                    {{selectedStageName}}
                </div>
            </Transition>
        </div>
        
    </OnClickOutside>
    
    <!-- Stage selector -->
    <Transition>
        <div v-if="selectSnippetStage && stageSelectorVisible" class="non-selectable-text stages-list"
        :style="{ marginLeft: mousePosition.x + 'px', top: mousePosition.y + 'px' }">
            <div class="stages-list-item" v-for="stage in stages" :key="stage[0]" @click="handleClickStage({name: stage[0], enumVal: stage[1]})">
            {{ stage[1] }}: {{ stage[0] }}
            </div>
        </div>
    </Transition>
{{ chatSnippet?.stage }}
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { gameStore } from '@/gameStore'

import { LogLevel, WriteLog } from '@/utils/logger'

import Snippet from '@/utils/model/Snippet'
import { EStage } from '@/utils/enums'

//external imports
import { OnClickOutside } from '@vueuse/components'
import { STAGE_CONSTANTS } from '@/utils/constants'

export default defineComponent({
    name: 'ChatSnippetComponent',
    components: {
        OnClickOutside,
    },
    data() {
        return {
            stage: EStage.Normal,
            selectedStageName: "",
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

                this.selectedStageName = stage.name;
                this.stage = stage.enumVal;
                gameStore.commit('changeSnippetStageSelected', { idx: this.arrayIdx, stage: stage.enumVal })
                this.stageSelectorVisible = false;
            } catch (error) {
                WriteLog(`ChatSnippet.vue > handleClickStage > #ERROR: #ERROR: ${error}`, LogLevel.ERROR);
            }
        },
        
        handleRightClick(){
            this.stage = STAGE_CONSTANTS.NORMAL_SNIPPET_STAGE_VAL;
            gameStore.commit('changeSnippetStageSelected', { idx: this.arrayIdx, stage: STAGE_CONSTANTS.NORMAL_SNIPPET_STAGE_VAL });
        }
    },
})
</script>

<style scoped>
@import '@/css/message.css';
@import '@/css/common.css';
</style>
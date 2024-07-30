<template>
    <div class="flex-center-aligned non-selectable-text typewriter-container">
        <span class="typed-text">{{ curText }}</span>
    </div>
</template>

<script lang="ts">
import { NUM_CONSTANTS } from '@/utils/constants';
import { WriteLog, LogLevel } from '@/utils/logger';
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'TypewriterTextComponent',
    data: () => {
        return {
            curText: "",
            typeStatus: false,
            charIndex: NUM_CONSTANTS.ZERO,
        };
    },
    props: {
        textToWriteProp: String,
        newTextDelayProp: Number,
        typingSpeed: Number,
    },
    methods: {
        typeText() {
            try {
                if (this.charIndex < this.textToWrite.length) {
                    if (!this.typeStatus) this.typeStatus = true;
                        this.curText += this.textToWrite.charAt(this.charIndex);

                    this.charIndex += 1;
                    setTimeout(this.typeText, this.typingSpeed);
                }
                else{
                    this.$emit('finishedTyping');
                }
            } 
            catch (error) {
                WriteLog(`TypewriterText.vue > handleClickInside >#ERROR: #ERROR: ${error}`, LogLevel.ERROR);
            }
        }
    },
    watch: {
        textToWriteProp(){
            try {
                this.curText = "";
                this.charIndex = NUM_CONSTANTS.ZERO;
                setTimeout(this.typeText, this.typingSpeed);
            } 
            catch (error) {
                WriteLog(`TypewriterText.vue > watch > textToWriteProp > #ERROR: #ERROR: ${error}`, LogLevel.ERROR);
            }
        }
    },
    computed:{
        textToWrite(){
            return this.textToWriteProp ? this.textToWriteProp : "";
        },
        newTextDelay(){
            return this.newTextDelayProp ? this.newTextDelayProp : 0;
        }
    },
    created() {
        setTimeout(this.typeText, this.newTextDelay + 200);
    },
})
</script>

<style scoped>
@import '@/css/common.css';
@import '@/css/typewriter.css';
</style>

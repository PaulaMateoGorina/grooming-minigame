<template>
    <div id="title-screen-background" class="flex-center-aligned">
        <div class="title-screen-container flex-center-aligned flex-column">
                <!-- Starting screen -->
            <div v-if="isStart" class="fade-in flex-center-aligned flex-column">
                <p class="game-title">{{GENERAL_STRINGS.GAME_TITLE}}</p>
                <div class="divisor"/>
                <p class="game-subtitle">{{GENERAL_STRINGS.GAME_SUBTITLE}}</p>
                <div class="title-screen-button flex-center-aligned" @click="startGame">{{ GENERAL_STRINGS.START }}</div>
            </div>

            <!-- End screen -->
            <div  v-if="!isStart" class="flex-center-aligned flex-column">
                <p class="game-title">{{GENERAL_STRINGS.END_TITLE}}</p>
                <div class="divisor"/>
                <p class="game-subtitle">{{GENERAL_STRINGS.END_PTS_TEXT}}</p>
                <p class="title-screen-points">{{total_points}} pts</p>
                <div class="title-screen-button flex-center-aligned" @click="resetGame">{{ GENERAL_STRINGS.PLAY_AGAIN }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { GENERAL_STRINGS } from '@/assets/stringsESP';
import { gameStore } from '@/gameStore';

export default defineComponent({
    name: 'TitleScreenComponent',

    data(){
        return{
            GENERAL_STRINGS: GENERAL_STRINGS
        }
    },

    props: {
        isStart: Boolean
    },
    
    methods:{
        startGame(){
            gameStore.commit('changeStage');
        },
        resetGame(){
            gameStore.commit('newGame');
        }
    },
    
    computed:{
        total_points(){
            return gameStore.state.points;
        }
    }
})
</script>

<style scoped>
@import '@/css/title-screen.css';
@import '@/css/common.css';
</style>

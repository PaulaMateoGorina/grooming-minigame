<template>
    <div class="starting-screen">
        <div id="game-title-container">
            <p id="game-title">{{GENERAL_STRINGS.GAME_TITLE}}</p>
            <p id="game-subtitle">{{GENERAL_STRINGS.GAME_SUBTITLE}}</p>
            <div id="start-button" @click="startGame">{{ GENERAL_STRINGS.START }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { GENERAL_STRINGS } from '@/assets/stringsESP';
import { gameStore } from '@/gameStore';

export default defineComponent({
    name: 'StartingScreenComponent',

    data(){
        return{
            GENERAL_STRINGS: GENERAL_STRINGS
        }
    },
    
    methods:{
        startGame(){
            gameStore.commit('changeStage');
        }
    }
})
</script>

<style scoped>
@import '@/css/starting-screen.css';
@import '@/css/common.css';
</style>

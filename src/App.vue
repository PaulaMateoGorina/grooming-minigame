<template>
  <GameComponent/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GameComponent from './components/Game.vue';

export default defineComponent({
  name: 'App',
  components: {
    GameComponent
  }
})
</script>

<style>
</style>

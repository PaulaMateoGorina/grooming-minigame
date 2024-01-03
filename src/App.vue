<template>
  <GameComponent/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import '@coreui/coreui/dist/css/coreui.min.css'
import GameComponent from './components/Game.vue';

export default defineComponent({
  name: 'App',
  components: {
    GameComponent
  }
})
</script>

<style>
body, p, div, span, h1, h2, h3, h4, h5, h6 {
    font-family: 'Open Sans', sans-serif;
    font-size: 17px;
}
</style>

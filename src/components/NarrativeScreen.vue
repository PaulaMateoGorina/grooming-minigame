<template>
    <div 
        id="narrative-text-container" 
        class="flex-center-aligned non-selectable-text"
    >
    <TypewriterTextComponent/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TypewriterTextComponent from '@/components/TypewriterText.vue'

export default defineComponent({
    name: 'NarrativeScreenComponent',
    components:{
        TypewriterTextComponent
    }
})
</script>

<style scoped>
@import '@/css/common.css';
@import '@/css/narrative-screen.css';
</style>

<template>
    <div class="flex-center-aligned non-selectable-text typewriter-text-container">
        <span class="typed-text">{{ typeValue }}</span>
        <span class="blinking-cursor">|</span>
        <span class="cursor" :class="{ typing: typeStatus }">&nbsp;</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'TypewriterTextComponent',
    data: () => {
        return {
        typeValue: "",
        typeStatus: false,
        displayTextArray: ["YouTuber", "Developer", "Blogger", "Designer", "Freelancer"],
        typingSpeed: 100,
        erasingSpeed: 100,
        newTextDelay: 2000,
        displayTextArrayIndex: 0,
        charIndex: 0,
        };
    },
    methods: {
        typeText() {
            if (this.charIndex < this.displayTextArray[this.displayTextArrayIndex].length) {
                if (!this.typeStatus) this.typeStatus = true;
                this.typeValue += this.displayTextArray[this.displayTextArrayIndex].charAt(
                this.charIndex
                );
                this.charIndex += 1;
                setTimeout(this.typeText, this.typingSpeed);
            } else {
                this.typeStatus = false;
                setTimeout(this.eraseText, this.newTextDelay);
            }
        },
        eraseText() {
            if (this.charIndex > 0) {
                if (!this.typeStatus) this.typeStatus = true;
                this.typeValue = this.displayTextArray[this.displayTextArrayIndex].substring(
                0,
                this.charIndex - 1
                );
                this.charIndex -= 1;
                setTimeout(this.eraseText, this.erasingSpeed);
            } else {
                this.typeStatus = false;
                this.displayTextArrayIndex += 1;
                if (this.displayTextArrayIndex >= this.displayTextArray.length)
                this.displayTextArrayIndex = 0;
                setTimeout(this.typeText, this.typingSpeed + 1000);
            }
        },
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

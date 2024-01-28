<template>
    <div class="flex-center-aligned flex-column">
        <ProfileComponent :user="user1"/>
        <ProfileComponent :user="user2"/>
        <p>{{PROFILE_STRINGS.FRIENDSHIP_START}} {{ friendshipTime![2] }} {{PROFILE_STRINGS.FRIENDSHIP_YEARS}}
            {{ friendshipTime![1] }} {{PROFILE_STRINGS.FRIENDSHIP_MONTHS}} {{ friendshipTime![0] }} {{PROFILE_STRINGS.FRIENDSHIP_DAYS}}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Profile from '@/utils/model/Profile';
import ProfileComponent from './Profile.vue'
import { PROFILE_STRINGS } from '@/assets/stringsESP';

export default defineComponent({
    name: 'ProfilesPageComponent',
    data(){
        return{
            PROFILE_STRINGS: PROFILE_STRINGS
        }
    },
    components: {
        ProfileComponent,
    },
    props: {
        user1: Profile,
        user2: Profile,
        friendshipTime: {
            type: Array as () => number[]
        }
    }
})
</script>

<style scoped>
@import '@/css/profile.css';
</style>

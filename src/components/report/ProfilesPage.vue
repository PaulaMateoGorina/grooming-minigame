<template>
    <div class="flex-center-aligned flex-column">
        <ProfileComponent :user="user1"/>
        <ProfileComponent :user="user2"/>
        <p>Han sido amigos por: {{ friendshipTime![2] }} años, {{ friendshipTime![1] }} meses y {{ friendshipTime![0] }} días</p>
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

<template>
    <div class="profile-page">
        <ProfileComponent :user="user1"/>
        <ProfileComponent :user="user2"/>
        <p>Han sido amigos por: {{ friendshipTime![2] }} años, {{ friendshipTime![1] }} meses y {{ friendshipTime![0] }} días</p>
    </div>
</template>

<script lang="ts">
import Profile from '@/utils/model/Profile';
import ProfileComponent from './Profile.vue'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ProfilesPageComponent',
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

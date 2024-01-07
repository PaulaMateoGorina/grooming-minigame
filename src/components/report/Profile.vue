<template>
    <div class="profile-container">
        <img :src="user!.avatar" alt="User 1 profile picture" class="my-avatar">
        <div class="profile-info">
            <p>{{PROFILE_STRINGS.USERNAME}} {{ user!.username }}</p>
            <p>{{PROFILE_STRINGS.ONLINE_AGE}} {{ user!.onlineAge }}</p>
            <p>{{PROFILE_STRINGS.REAL_AGE}} {{ user!.realAge }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import Profile from '@/utils/model/Profile';
import { PROFILE_STRINGS } from '@/assets/stringsESP';
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ProfileComponent',
    data(){
        return{
            PROFILE_STRINGS: PROFILE_STRINGS
        }
    },
    props: {
        user: Profile
    }
})
</script>

<style scoped>
@import '@/css/common.css';
@import '@/css/profile.css';
</style>

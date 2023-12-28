<template>
    <div class="profile-container">
        <img :src="user!.avatar" alt="User 1 profile picture" class="avatar">
        <div class="profile-info">
            <p>Username: {{ user!.username }}</p>
            <p>Age Online: {{ user!.onlineAge }}</p>
            <p>Real Age: {{ user!.realAge }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import Profile from '@/utils/model/Profile';
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ProfileComponent',
    props: {
        user: Profile
    }
})
</script>

<style scoped>
@import '@/css/common.css';
@import '@/css/profile.css';
</style>

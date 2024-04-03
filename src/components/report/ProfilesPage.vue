<template>
    <div class="flex-center-aligned flex-column">
        <ProfileComponent :user="user1"/>
        <ProfileComponent :user="user2"/>
        <p>{{ friendshipTimeString }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Profile from '@/utils/model/Profile';
import ProfileComponent from './Profile.vue'
import { PROFILE_STRINGS } from '@/assets/stringsESP';
import { stringFormat } from '@/utils/utils';

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
    },
    computed: {
        friendshipTimeString(): string{
            const result = this.friendshipTime && this.friendshipTime.length === 3 ? 
                stringFormat(PROFILE_STRINGS.FRIENDSHIP, this.friendshipTime[2], this.friendshipTime[1], this.friendshipTime[0])
                :
                stringFormat(PROFILE_STRINGS.FRIENDSHIP, 0, 0, 0)
            return result;
        }
    }
})
</script>

<style scoped>
@import '@/css/profile.css';
</style>

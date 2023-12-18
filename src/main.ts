import { createApp } from 'vue'
import { gameStore } from './gameStore'
import App from './App.vue'

const app = createApp(App);
app.use(gameStore);
app.mount('#app');

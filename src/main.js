import { createApp } from 'vue';
import Game from './Game.vue';
import '@/styles/main.css';
import store from './store';


const app = createApp(Game, {store: store,});
app.use(store).mount('#app');
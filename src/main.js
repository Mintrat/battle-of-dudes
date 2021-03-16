import { createStore } from 'vuex';
import { createApp } from 'vue';
import Game from './Game.vue';
import '@/styles/main.css';

const store = createStore({
    state () {
        return {
            field: {
                size: {},
                position: {},
            },
            bullets: {},
            bulletStoreKey: 0,
        }
    },
    mutations: {
        fieldUpdateSize (state, payload) {
            state.field.size = payload;
        },

        bulletAdd (state, direction) {
            state.bullets[state.bulletStoreKey] = direction;
            state.bulletStoreKey++;
        },

        bulletDelete (state, key) {
            delete state.bullets[key];
        }
    }
})

const app = createApp(Game, {store: store,});
app.use(store).mount('#app');
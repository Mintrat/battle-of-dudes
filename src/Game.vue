<template>
  <div class="game-board">
    <Field />
  </div>
</template>

<script>
import Field from './components/Field.vue';
export default {
    name: "Game",

    data() {
        return {}
    },

    components: {
        Field
    },

    mounted() {
        this.$store.commit('websocketsConnect');
        this.websocketsInit();
    },

    unmounted() {
        this.$store.commit('websocketsClose');
    },

    methods: {
        websocketsInit() {
            this.$store.commit('websocketsSubscribe', {
                action: 'updatePlayers',
                callback: this.updatePlayers,
            });

            this.$store.commit('websocketsSubscribe', {
                action: 'setPlayerId',
                callback: this.setPlayerId,
            });

            this.$store.commit('websocketsSubscribe', {
                action: 'updatePlayerPosition',
                callback: this.updatePlayerPosition,
            });

            this.$store.commit('websocketsSubscribe', {
                action: 'onOpen',
                callback: this.initPlayer,
            });

            this.$store.commit('websocketsSubscribe', {
                action: 'removePlayer',
                callback: (playerId) => {
                    this.$store.commit('removePlayer', playerId);
                },
            });
        },

        initPlayer() {
            this.$store.commit('websocketsSend', {
                action: 'initPlayer',
                data: {}
            });
        },

        updatePlayers(players) {
            this.$store.commit('updatePlayers', players);
        },

        setPlayerId(id) {
            this.$store.commit('setPlayerId', id);
        },

        updatePlayerPosition(newPosition) {
            this.$store.commit('updatePlayerPosition', newPosition);
        },
    },
}
</script>

<style scoped>
.game-board {
  padding: 30px;
  height: 100vh;
}
</style>


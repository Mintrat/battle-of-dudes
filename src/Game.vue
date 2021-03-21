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
                action: 'updatePlayer',
                callback: (data) => {
                    this.$store.commit('updatePlayer', data);
                },
            });

            this.$store.commit('websocketsSubscribe', {
                action: 'setPlayerId',
                callback: () => {
                    this.$store.commit('websocketsSend', {
                        action: 'updatePlayer',
                        data: {
                            playerId: this.$store.state.myPlayerId,
                            data: {},
                        }
                    });

                    this.$store.commit('websocketsSend', {
                        action: 'getPlayers',
                        data: {}
                    });
                },
            });

            this.$store.commit('websocketsSubscribe', {
                action: 'onOpen',
                callback: () => {
                    this.$store.commit('websocketsSend', {
                        action: 'getPlayerId',
                        data: {}
                    });
                },
            });

            this.$store.commit('websocketsSubscribe', {
                action: 'removePlayer',
                callback: (playerId) => {
                    this.$store.commit('removePlayer', playerId);
                },
            });

            this.$store.commit('websocketsSubscribe', {
                action: 'addBullet',
                callback: (data) => {
                    this.$store.commit('bulletAdd', data);
                },
            });

            this.$store.commit('websocketsSubscribe', {
                action: 'deleteBullet',
                callback: (data) => {
                    this.$store.commit('bulletDelete', data);
                },
            });
        },

        updatePlayers(players) {
            this.$store.commit('updatePlayers', players);
        },

        setPlayerId(id) {
            this.$store.commit('setPlayerId', id);
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


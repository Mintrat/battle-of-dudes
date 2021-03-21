<template>
    <div  class="field" tabindex="33" >
        <Dude
            v-for="(player, index) in $store.state.players" :key="index"

            :playerId="index"
            :playerPosition="player.position"
            :myPlayer="index === $store.state.myPlayerId"
        />
        <Bullet
            v-for="(bullet, index) in $store.state.bullets" :key="index"

            :playerId="bullet.playerId"
            :direction="bullet.direction"
            :storeKey="index"
            />
    </div>
</template>

<script>
import Dude from './Dude.vue'
import Bullet from './Bullet.vue'
export default {
    components: {
        Dude: Dude,
        Bullet: Bullet,
    },
    name: "Field",

    data: function() {
        return {
            size: {
                width: 0,
                height: 0,
            },
            position: {
                top: 0,
                left: 0,
            }
        }
    },

    watch: {
        size (newSize) {
            this.$store.commit('fieldUpdateSize', newSize);
        },

        position (newPosition) {
            this.$store.commit('fieldUpdatePosition', newPosition);
        },
    },

    mounted () {
        this.calculateSize();
        this.setSizeOnResize();

        this.$store.commit('setupField', this);
    },

    unmounted() {
        this.removeHandlers();
    },

    methods: {
        setSizeOnResize() {
            window.addEventListener('resize', this.calculateSize);
        },

        calculateSize() {
            const fieldSize = this.$el.getBoundingClientRect();
            this.size = {
                width: fieldSize.width - 2, //borders
                height: fieldSize.height - 2,
            }
            this.position = {
                top: fieldSize.top,
                left: fieldSize.left,
            }
        },

        removeHandlers() {
            window.removeEventListener('resize', this.calculateSize);
        },
    },
}
</script>

<style scoped>
    .field {
        height: 100%;
        cursor: url(../assets/cursor-target.png), auto;
        overflow: hidden;
        border: 1px solid #bebebe;
        border-radius: 5px;
        position: relative;
    }
</style>
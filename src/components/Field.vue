<template>
    <div  class="field" tabindex="33" >
        <Dude />
        <Bullet
            v-for="(bullet, index) in $store.state.bullets" :key="index"

            :direction="bullet"
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
            }
        }
    },

    mounted () {
        this.calculateSize();
        this.setSizeOnResize();
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
            this.$store.commit('fieldUpdateSize', this.size);
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
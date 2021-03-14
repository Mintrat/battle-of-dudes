<template>
    <div  class="field" tabindex="33" >
        <Dude
            :fieldBounds="bounds"
            :initDude="calculateSize"
            />
    </div>
</template>

<script>
import Dude from './Dude.vue'
export default {
    components: {
        Dude: Dude
    },
    name: "Field",

    data: function() {
        return {
            bounds: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            }
        }
    },

    mounted () {
        this.calculateSize();
        this.setSizeOnResize();
    },

    methods: {
        setSizeOnResize() {
            window.addEventListener('resize', this.calculateSize);
        },

        calculateSize() {
            const fieldSize = this.$el.getBoundingClientRect();
            this.bounds = {
                left: fieldSize.left,
                right: fieldSize.left + fieldSize.width,
                top: fieldSize.top,
                bottom: fieldSize.top + fieldSize.height,
            }
        }
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
  }
</style>
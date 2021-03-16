<template>
    <div
        class="weapon"
         :style="{
            width: width,
        }"></div>
</template>

<script>
export default {
    name: "weapon",

    props: {
    },

    data: function () {
        return {
            rawWidth: 40,
            cursorSize: 32,
            shootKeys: [

            ],
        }
    },

    mounted() {
        this.initKeys();
    },

    unmounted() {
        this.removeHandlers();
    },

    computed: {
        width() {
            return this.rawWidth + 'px'
        },
    },

    watch: {

    },

    methods: {
        shoot(event) {
            const currentPosition = this.$el.getBoundingClientRect();
            const lookLeft = this.$parent.rad > 1.5 || this.$parent.rad < -1.5;
            const lookTop = this.$parent.rad < 0;
            const direction = {
                start: {
                    x: lookLeft ? currentPosition.left : currentPosition.right,
                    y: lookTop ? currentPosition.top : currentPosition.bottom,
                },
                end: {
                    x: event.clientX + this.cursorSize/2,
                    y: event.clientY + this.cursorSize/2,
                }
            };

            this.$store.commit('bulletAdd', direction);
        },

        initKeys() {
            window.addEventListener('click', this.shoot);
        },

        removeHandlers() {
            window.removeEventListener('click', this.shoot);
        }
    }
}
</script>

<style scoped>
    .weapon {
        background-color: grey;
        position: absolute;
        height: 5px;
        border: 1px solid black;
        width: 40px;
        transform: translateX(50%);
        top: calc(50% - 4px);
    }
</style>
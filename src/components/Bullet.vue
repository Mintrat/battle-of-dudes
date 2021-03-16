<template>
    <span
        class="bullet"
        :style="{
            height: rawHeight,
            width: rawWidth,
            top: rawTop,
            left: rawLeft,
        }"
        ></span>
</template>

<script>
export default {
    name: "Bullet",

    props: {
        direction: {},
        storeKey: {},
    },

    data: function () {
        return {
            speed: 2,
            height: 30,
            width: 30,
            currentPosition: {
                x: 0,
                y: 0
            }
        }
    },

    computed: {
        angle() {
            return Math.atan2(this.direction.end.y - this.direction.start.y, this.direction.end.x - this.direction.start.x);
        },

        rawHeight() {
            return this.height + 'px';
        },

        rawWidth() {
            return this.width + 'px';
        },

        rawTop() {
            return this.currentPosition.y + 'px';
        },

        rawLeft() {
            return this.currentPosition.x + 'px';
        }
    },

    beforeMount() {
        this.currentPosition = {
            x: this.direction.start.x - 30 - this.width/2,
            y: this.direction.start.y - 30 - this.height/2
        };
    },

    mounted () {
        this.init();
    },

    methods: {
        init: function() {
            let counter = 0;
            let timer = setInterval(() => {
                if(counter >= 150) {
                    clearTimeout(timer);
                    this.$store.commit('bulletDelete', this.storeKey);
                }

                this.updatePosition();
                counter++;
            }, 10);
        },

        updatePosition: function() {
            const xDiff = this.speed * Math.cos(this.angle);
            const yDiff = this.speed * Math.sin(this.angle);
            this.currentPosition = {
                x: this.currentPosition.x + xDiff,
                y: this.currentPosition.y + yDiff,
            }
        }
    }
}
</script>

<style scoped>
    .bullet {
        background: black;
        border-radius: 50%;

        position: absolute;
    }
</style>
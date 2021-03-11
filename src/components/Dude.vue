<template>
    <div class="dude"
    :style="{
            transform: rotate,
            width: width,
            height: height,
            left: left,
            top: top
        }">
        <div class="weapone"></div>
    </div>
</template>

<script>
export default {
    name: "dude",
    data: function () {
        return {
            rawWidth: 50,
            rawHeight: 50,
            rawLeft: 0,
            rawTop: 0,
            rad: 0,
            mapKeys: {
                'ArrowUp': 'up',
                'ArrowLeft': 'left',
                'ArrowDown': 'down',
                'ArrowRight': 'right',
                'KeyW': 'up',
                'KeyA': 'left',     
                'KeyS': 'down',
                'KeyD': 'right'
            },
            step: 10,

            moveList : {
                up: () => {
                    this.rawTop -= this.step;
                },

                left: () => {
                    this.rawLeft -= this.step;
                },

                down: () => {
                    this.rawTop += this.step;
                },

                right: () => {
                    this.rawLeft += this.step;
                }
            }
        }
    },

    computed: {
        rotate() {
            let rad = 'rotate(' + this.rad + 'rad)';
            return rad;
        },
        
        width() {
            return this.rawWidth + 'px'
        },

        height() {
            return this.rawHeight + 'px'
        },

        left() {
            const left = this.rawLeft;
            return left === 0 ? left : left + 'px';
        },

        top() {
            const top = this.rawTop;
            return top === 0 ? top : top + 'px';
        },
    },

    mounted() {
        this.startFollowingCursor();
        this.startFollowingKeyboard();
    },

    methods: {
        getCenter() {
            const {x, y} = this.$el.getBoundingClientRect();
            
            return {
                x: x + this.rawWidth / 2,
                y: y + this.rawHeight / 2
            }
        },

        startFollowingCursor() {
            window.onmousemove = (even) => {
                this.lookAtTheCursor(even.clientX, even.clientY);
            }
        },

        lookAtTheCursor(positionCursorX, positionCursorY) {
            const {y, x} = this.getCenter();
            const absoluteY = positionCursorY - y;
            const absoluteX = positionCursorX - x;
            const rad = (Math.atan(absoluteY / absoluteX)).toFixed(2)
            this.rad = rad;
        },

        startFollowingKeyboard() {
            window.addEventListener('keydown', (e) => {
                const direction = this.getMoveByKeyCode(e.code);
                if (direction) {
                    this.moveList[direction]();
                }
            });
        },

        getMoveByKeyCode(keyCode) {
            const moveDirection = this.mapKeys[keyCode];
            return moveDirection || null;
        },
    }
}
</script>

<style scoped>
    .dude {
        background-color: black;
        border: 1px solid black;
        border-radius: 50%;
        position: absolute;
        transition: left 0.3s, top 0.3s;
    }

    .weapone {
        background-color: grey;
        position: absolute;
        height: 5px;
        border: 1px solid black;
        width: 40px;
        transform: translateX(50%);
        top: calc(50% - 4px);
    }
</style>
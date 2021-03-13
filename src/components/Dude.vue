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
            step: 10,
            cursorPosition: {
                x: 0,
                y: 0
            },
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
                this.cursorPosition.x = even.clientX;
                this.cursorPosition.y = even.clientY;
                this.lookAtTheCursor(this.cursorPosition.x, this.cursorPosition.y);
            }
        },

        lookAtTheCursor(positionCursorX, positionCursorY) {
            const bcr = this.$el.getBoundingClientRect();
            const cx = bcr.left + bcr.width / 2, cy = bcr.top + bcr.height / 2;
            const rad = Math.atan2(positionCursorY - cy, positionCursorX - cx);
            this.rad = rad;
        },

        startFollowingKeyboard() {
            window.addEventListener('keydown', (e) => {
                const direction = this.getMoveByKeyCode(e.code);
                if (direction) {
                    e.preventDefault();
                    this.moveList[direction]();
                    this.lookAtTheCursor(this.cursorPosition.x, this.cursorPosition.y);
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
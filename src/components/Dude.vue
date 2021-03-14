<template>
    <div class="dude"
    :style="{
            transform: rotate,
            width: width,
            height: height,
            left: left,
            top: top
        }">
        <div class="weapon"></div>
    </div>
</template>

<script>
export default {
    name: "dude",

    props: {
        fieldBounds: {}
    },

    data: function () {
        return {
            rawWidth: 50,
            rawHeight: 50,
            rawLeft: -1000,
            rawTop: -1000,
            rad: 0,
            step: 2,
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
            actionList : {
                up: () => {
                    if(this.rawTop > this.fieldBounds.top) {
                        this.rawTop -= this.step;
                    }
                },

                left: () => {
                    if(this.rawLeft > this.fieldBounds.left) {
                        this.rawLeft -= this.step;
                    }
                },

                down: () => {
                    if(this.rawTop < this.fieldBounds.bottom - this.rawHeight) {
                        this.rawTop += this.step;
                    }
                },

                right: () => {
                    if(this.rawLeft < this.fieldBounds.right - this.rawWidth) {
                        this.rawLeft += this.step;
                    }
                }
            },
            runTimeActions: {}
        }
    },

    computed: {
        rotate() {
            return 'rotate(' + this.rad + 'rad)';
        },
        
        width() {
            return this.rawWidth + 'px'
        },

        height() {
            return this.rawHeight + 'px'
        },

        left() {
            return this.rawLeft + 'px';
        },

        top() {
            return this.rawTop + 'px';
        },
    },

    mounted() {
        this.startFollowingCursor();
        this.startFollowingKeyboard();
        this.setStartPos();
    },

    methods: {
        getCenter() {
            const {left, top, height, width} = this.$el.getBoundingClientRect();
            return {
                x: left + width / 2,
                y: top + height / 2
            }
        },

        startFollowingCursor() {
            window.onmousemove = (event) => {
                this.cursorPosition.x = event.clientX;
                this.cursorPosition.y = event.clientY;
                this.lookAtTheCursor(this.cursorPosition.x, this.cursorPosition.y);
            }
        },

        lookAtTheCursor(posCursorX, posCursorY) {
            const center = this.getCenter();
            this.rad = Math.atan2(posCursorY - center.y, posCursorX - center.x);
        },

        startFollowingKeyboard() {
            window.addEventListener('keydown', e => {
                const action = this.getActionByKeyCode(e.code);
                if (action) {
                    e.preventDefault();
                    this.startAction(action);
                    this.lookAtTheCursor(this.cursorPosition.x, this.cursorPosition.y);
                }
            });

            window.addEventListener('keyup', e => {
                const action = this.getActionByKeyCode(e.code);
                if (action) {
                    this.endAction(action);
                }
            });
        },

        setStartPos() {
            document.addEventListener("DOMContentLoaded", () => {
                this.rawLeft = this.fieldBounds.left;
                this.rawTop = this.fieldBounds.top;
            });
        },

        getActionByKeyCode(keyCode) {
            const moveDirection = this.mapKeys[keyCode];
            return moveDirection || null;
        },

        startAction(action) {
            if (!this.runTimeActions[action]) {
                const timerId = setInterval(() => {
                    this.actionList[action]();
                });
                
                this.runTimeActions[action] = {timerId: timerId};
            }
        },

        endAction(action) {
            if (this.runTimeActions[action]) {
                clearTimeout(this.runTimeActions[action].timerId);
                delete this.runTimeActions[action];
            }
        }
    }
}
</script>

<style scoped>
    .dude {
        background-color: black;
        border: 1px solid black;
        border-radius: 50%;
        position: absolute;
        /* transition: left 0.3s, top 0.3s; */
    }

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
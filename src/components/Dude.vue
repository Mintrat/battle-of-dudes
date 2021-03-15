<template>
    <div class="dude"
    :style="{
            transform: rotate,
            width: width,
            height: height,
            left: left,
            top: top
        }">
        <Weapon
            @shoot="shootHandler"
            ></Weapon>
    </div>
</template>

<script>
import Weapon from './Weapon.vue';
export default {
    name: "dude",

    props: {
        fieldSize: {}
    },

    components: {
        Weapon: Weapon
    },

    data: function () {
        return {
            rawWidth: 50,
            rawHeight: 50,
            rawLeft: 0,
            rawTop: 0,
            rad: 0,
            step: 2,
            cursorSize: 32,
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
                    if(this.rawTop > 0) {
                        this.rawTop -= this.step;
                    }
                },

                left: () => {
                    if(this.rawLeft > 0) {
                        this.rawLeft -= this.step;
                    }
                },

                down: () => {
                    if(this.rawTop < this.fieldSize.height - this.rawHeight) {
                        this.rawTop += this.step;
                    }
                },

                right: () => {
                    if(this.rawLeft < this.fieldSize.width - this.rawWidth) {
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

    watch: {
        fieldSize: function() {
            this.correctPosition();
        }
    },

    mounted() {
        this.startFollowingCursor();
        this.startFollowingKeyboard();
        this.setStartPos();
    },

    methods: {
        startFollowingCursor() {
            window.onmousemove = (event) => {
                this.cursorPosition.x = event.clientX + this.cursorSize/2;
                this.cursorPosition.y = event.clientY + this.cursorSize/2;
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
            });
        },

        shootHandler(position) {
            this.$emit('shoot', position);
        },

        getCenter() {
            const {left, top, height, width} = this.$el.getBoundingClientRect();
            return {
                x: left + width / 2,
                y: top + height / 2
            }
        },

        correctPosition() {
            if(this.rawTop > this.fieldSize.height - this.rawHeight) {
                this.rawTop = this.fieldSize.height - this.rawHeight;
            }

            if(this.rawLeft > this.fieldSize.width - this.rawHeight) {
                this.rawLeft = this.fieldSize.width - this.rawHeight;
            }
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
    }
</style>
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
            :myPlayer="myPlayer"
            />
    </div>
</template>

<script>
import Weapon from './Weapon.vue';
export default {
    name: "dude",

    props: {
        playerPosition: {},
        myPlayer: {},
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
                        this.wsUpdatePos({y: this.rawTop});
                    }
                },

                left: () => {
                    if(this.rawLeft > 0) {
                        this.rawLeft -= this.step;
                        this.wsUpdatePos({x: this.rawLeft});
                    }
                },

                down: () => {
                    if(this.rawTop < this.fieldSize.height - this.rawHeight) {
                        this.rawTop += this.step;
                        this.wsUpdatePos({y: this.rawTop});
                    }
                },

                right: () => {
                    if(this.rawLeft < this.fieldSize.width - this.rawWidth) {
                        this.rawLeft += this.step;
                        this.wsUpdatePos({x: this.rawLeft});
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

        fieldSize() {
            return this.$store.state.field.size;
        },
    },

    watch: {
        fieldSize: function() {
            this.correctPosition();
        },

        playerPosition: function (newPosition) {
            newPosition = Object.assign({
                x: this.rawLeft,
                y: this.rawTop,
                rotate: this.rad,
            }, newPosition);

            this.rawLeft = newPosition.x;
            this.rawTop = newPosition.y;
            this.rad = newPosition.rotate;
        },
    },

    mounted() {
        this.startFollowingCursor();
        this.startFollowingKeyboard();
        this.setStartPos();
    },

    methods: {
        startFollowingCursor() {
            if(!this.myPlayer)
                return;

            this.$store.state.field.component.$el.onmousemove = (event) => {
                this.cursorPosition.x = event.clientX + this.cursorSize/2;
                this.cursorPosition.y = event.clientY + this.cursorSize/2;
                this.lookAtTheCursor(this.cursorPosition.x, this.cursorPosition.y);
            }
        },

        lookAtTheCursor(posCursorX, posCursorY) {
            const center = this.getCenter();
            this.rad = Math.atan2(posCursorY - center.y, posCursorX - center.x);
            this.wsUpdatePos({rotate: this.rad});
        },

        wsUpdatePos(data) {
            data = {
                playerId: this.$store.state.myPlayerId,
                position: data,
            };
            this.$store.commit('websocketsSend', {
                action: 'updatePosition',
                data: data,
            });
        },

        startFollowingKeyboard() {
            if(!this.myPlayer)
                return;

            this.$store.state.field.component.$el.addEventListener('keydown', e => {
                const action = this.getActionByKeyCode(e.code);
                if (action) {
                    e.preventDefault();
                    this.startAction(action);
                    this.lookAtTheCursor(this.cursorPosition.x, this.cursorPosition.y);
                }
            });

            this.$store.state.field.component.$el.addEventListener('keyup', e => {
                const action = this.getActionByKeyCode(e.code);
                if (action) {
                    this.endAction(action);
                }
            });
        },

        setStartPos() {
            if(!this.myPlayer)
                return;

            document.addEventListener("DOMContentLoaded", () => {
            });
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
<template>
    <div class="dude"
         :style="{
            left: left,
            top: top
        }">
        <span class="dude__hp">{{health}}</span>
        <div class="dude_body"
            :style="{
                transform: rotate,
                width: width,
                height: height,
            }">
            <Weapon
                :myPlayer="myPlayer"
                />
        </div>
    </div>
</template>

<script>
import Weapon from './Weapon.vue';
export default {
    name: "dude",

    props: {
        playerPosition: {},
        myPlayer: {},
        playerId: {},
    },

    components: {
        Weapon: Weapon
    },

    data: function () {
        return {
            maxHealth: 100,
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
                        this.wsUpdatePlayer();
                    }
                },

                left: () => {
                    if(this.rawLeft > 0) {
                        this.rawLeft -= this.step;
                        this.wsUpdatePlayer();
                    }
                },

                down: () => {
                    if(this.rawTop < this.fieldSize.height - this.rawHeight) {
                        this.rawTop += this.step;
                        this.wsUpdatePlayer();
                    }
                },

                right: () => {
                    if(this.rawLeft < this.fieldSize.width - this.rawWidth) {
                        this.rawLeft += this.step;
                        this.wsUpdatePlayer();
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

        health() {
            const player = this.$store.state.players[this.playerId];
            if(player && player.health !== undefined) {
                return player.health;
            } else {
                return this.maxHealth;
            }
        },
    },

    watch: {
        fieldSize: function() {
            this.correctPosition();
        },

        playerPosition: function (newPosition) {
            if(!this.myPlayer) {
                newPosition = Object.assign({
                    x: this.rawLeft,
                    y: this.rawTop,
                    rotate: this.rad,
                }, newPosition);

                this.rawLeft = newPosition.x;
                this.rawTop = newPosition.y;
                this.rad = newPosition.rotate;
            }
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
            this.wsUpdatePlayer();
        },

        wsUpdatePlayer() {
            if(!this.myPlayer)
                return;

            const positionSendDelay = 10;
            let data = {
                position: {
                    x: this.rawLeft,
                    y: this.rawTop,
                    rotate: this.rad,
                }
            };

            if(!this.updatepositionTimer) {
                this.updatepositionTimer = setTimeout(() => {
                    this.sendPlayerData(data);
                    this.updatepositionTimer = null;
                }, positionSendDelay);
            }
        },

        sendPlayerData(data) {
            data = {
                playerId: this.$store.state.myPlayerId,
                data: data
            };

            this.$store.commit('websocketsSend', {
                action: 'updatePlayer',
                data: data,
            });
        },

        startFollowingKeyboard() {
            if(!this.myPlayer)
                return;

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
            if(this.myPlayer) {
                const max = {
                    x: this.$store.state.field.size.width - this.rawWidth,
                    y: this.$store.state.field.size.height - this.rawHeight,
                }
                this.rawLeft = Math.floor(Math.random() * Math.floor(max.x));
                this.rawTop = Math.floor(Math.random() * Math.floor(max.y));

                this.sendPlayerData({
                    health: this.health,
                    position: {
                        x: this.rawLeft,
                        y: this.rawTop,
                    },
                    size: {
                        width: this.rawWidth,
                        height: this.rawHeight,
                    }
                });
            } else {
                if(this.playerPosition !== undefined) {
                    this.rawLeft = this.playerPosition.x;
                    this.rawTop = this.playerPosition.y;
                }
            }
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
        position: absolute;
    }

    .dude_body {
        background-color: black;
        border: 1px solid black;
        border-radius: 50%;
    }

    .dude__hp {
        position: absolute;
        top: -35px;
        text-align: center;
        width: 100%;
        border: 1px solid #ebebeb;
        padding: 3px 0;
        border-radius: 4px;
    }
</style>
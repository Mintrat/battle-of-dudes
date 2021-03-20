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
        playerId: {},
    },

    data: function () {
        return {
            speed: 5,
            distance: 1300,
            height: 10,
            width: 10,
            currentPosition: {
                x: 0,
                y: 0
            },
            timer: null,
            damage: 10,
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
            x: this.direction.start.x - this.$store.state.field.position.top - this.width/2,
            y: this.direction.start.y - this.$store.state.field.position.left - this.height/2
        };
    },

    mounted () {
        this.init();
    },

    methods: {
        init: function() {
            let counter = 0;
            this.timer = setInterval(() => {
                if(counter >= this.distance/this.speed) {
                    this.delete();
                    return;
                }

                this.updatePosition();
                counter++;
            }, 1);
        },

        delete: function() {
            clearTimeout(this.timer);
            this.$store.commit('websocketsSend', {
                action: 'deleteBullet',
                data: this.storeKey,
            });
        },

        updatePosition: function() {
            const xDiff = this.speed * Math.cos(this.angle);
            const yDiff = this.speed * Math.sin(this.angle);
            this.currentPosition = {
                x: this.currentPosition.x + xDiff,
                y: this.currentPosition.y + yDiff,
            }

            const myBullet = this.playerId === this.$store.state.myPlayerId;
            if(myBullet) {
                this.findPlayerCollisions();
            }
        },

        findPlayerCollisions: function() {
            const players = this.$store.state.players;
            for(let playerId in players) {
                if(playerId !== this.playerId) {
                    const player = players[playerId];
                    if(player.position && player.size) {
                        const playerPosition = {
                            x1: player.position.x,
                            x2: player.position.x + player.size.width,
                            y1: player.position.y,
                            y2: player.position.y + player.size.height,
                        }
                        const collision = this.checkCollision(playerPosition);
                        if(collision) {
                            this.$store.commit('websocketsSend', {
                                action: 'updatePlayer',
                                data: {
                                    playerId: playerId,
                                    data: {
                                        health: player.health - this.damage,
                                    }
                                },
                            });
                            this.delete();
                        }
                    }
                }
            }
        },

        checkCollision(objectPosition) {
            const collisionX = objectPosition.x1 <= this.currentPosition.x && this.currentPosition.x <= objectPosition.x2;
            const collisionY = objectPosition.y1 <= this.currentPosition.y && this.currentPosition.y <= objectPosition.y2;
            return collisionX && collisionY;
        },
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
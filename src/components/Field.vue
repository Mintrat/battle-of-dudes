<template>
    <div  class="field" tabindex="33" >
        <Dude
            :fieldSize="size"
            @shoot="shootHandler"
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
            size: {
                width: 0,
                height: 0,
            }
        }
    },

    mounted () {
        this.calculateSize();
        this.setSizeOnResize();
    },

    unmounted() {
        this.removeHandlers();
    },

    methods: {
        setSizeOnResize() {
            window.addEventListener('resize', this.calculateSize);
        },

        calculateSize() {
            const fieldSize = this.$el.getBoundingClientRect();
            this.size = {
                width: fieldSize.width - 2, //borders
                height: fieldSize.height - 2,
            }
        },

        removeHandlers() {
            window.removeEventListener('resize', this.calculateSize);
        },

        shootHandler(position) {
            const speed = 2;
            let angle = Math.atan2(position.end.y - position.start.y, position.end.x - position.start.x);
            let newPosition = {
                x: position.start.x + speed * Math.cos(angle),
                y: position.start.y + speed * Math.sin(angle),
            }

            let bullet = document.createElement('span');
            bullet.classList.add('bullet');
            bullet.style.position = 'absolute';
            let currentBulletPosition = {
                x: newPosition.x - 30 - 15,
                y: newPosition.y - 30 - 15,
            };
            bullet.style.top = currentBulletPosition.y + 'px';
            bullet.style.left = currentBulletPosition.x + 'px';
            this.$el.appendChild(bullet);

            let counter = 0;
            let timer = setInterval(function() {
                if(counter >= 150) {
                    clearTimeout(timer);
                    bullet.remove();
                }

                currentBulletPosition = {
                    x: currentBulletPosition.x + speed * Math.cos(angle),
                    y: currentBulletPosition.y + speed * Math.sin(angle),
                }
                bullet.style.top = currentBulletPosition.y + 'px';
                bullet.style.left = currentBulletPosition.x + 'px';

                counter++;
            }, 10);
        },
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
        position: relative;
    }
</style>
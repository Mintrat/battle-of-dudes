<template>
  <div class="game-board">
    <Field />
  </div>
</template>

<script>
import Field from './components/Field.vue';
export default {
    name: "Game",
    components: {
        Field
    },
    data: function () {
        return {}
    },

    mounted() {

    },

    methods: {
        
    }
}
</script>

<style scoped>
.game-board {
  padding: 30px;
  height: 100vh;
}
</style>


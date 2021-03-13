<template>
    <Field @mousemove="mouseMove"/>
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
        mouseMove($event) {
            console.log($event);
        }
    }
}
</script>

<style scoped>
.field {
    height: 1000px;
}
</style>


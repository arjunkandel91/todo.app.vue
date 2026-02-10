<script setup>

    import Storage from '@/scripts/Storage';

    const ClearStorage = () => {
        Storage.remove();
    };

</script>

<template>
    <div class="todo-app">
        <slot></slot>
    </div>

    <div class="info">
        <a href="https://github.com/arjunkandel91/todo.app.vue" target="_blank">This project was built using Vue.js</a>
        <a href="#" @click="ClearStorage">Clear Storage</a>
    </div>
</template>
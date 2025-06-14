<script setup>
    const props = defineProps({
        content: {
            type: String,
            default: 'Task Updated!'
        }
    });
</script>

<template>
    <div class="notification">
        <img src="./../images/bell.svg" />
        <p>{{ content }}</p>
    </div>
</template>
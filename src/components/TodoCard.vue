<script setup>

    // props
    const props = defineProps({
        todo: {
            type: Object,
            default: {}
        }
    });

    // emits
    const emit = defineEmits(['edit', 'delete', 'editCancel']);

</script>

<template>
    <li :class="[todo.completed ? 'complete' : null, todo.edit ? 'edit' : null]">
        <div class="radio" @click="todo.completed = !todo.completed"></div>
        <div class="content">
            <h3>{{ todo.title }}</h3>
            <p>{{ todo.description }}</p>
        </div>
        <div class="action">
            <img v-if="!todo.completed" src="./../images/edit.svg" @click="emit('edit', todo)"> 
            <img @click="emit('delete', todo)" src="./../images/delete.svg">
        </div>
        <div class="editaction">
            <button @click="emit('editCancel')">Cancel</button>
            <button class="addbtn">Save</button>
        </div>
    </li>
</template>
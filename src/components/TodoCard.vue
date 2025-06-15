<script setup>
    
    import { ref } from 'vue';

    // props
    const props = defineProps({
        todo: {
            type: Object,
            default: {}
        }
    });

    // emits
    const emits = defineEmits(['editInit', 'edit', 'delete', 'editCancel', 'complete']);

    let FormError = ref(false);
    let title = props.todo.title;
    let description = props.todo.description;

    const Submit = () => {
        // validation
        if (title.length <= 4) {
            FormError.value = true;
            return;
        }

        emits('edit', props.todo.id, title, description);
    };

</script>

<template>
    <li v-if="!todo.hide" :class="[todo.completed ? 'complete' : null, todo.edit ? 'edit' : null]">
        <div class="radio" @click="emits('complete', todo)"></div>
        <div v-if="!todo.edit" class="content">
            <h3>{{ todo.title }}</h3>
            <p>{{ todo.description }}</p>
        </div>
        <div v-else class="content">
            <input :class="FormError ? '__error' : null" type="text" placeholder="Title" v-model="title">
            <p v-if="FormError" class="__error_txt">Todo title is required!</p>
            <input type="text" placeholder="Description" v-model="description">
        </div>
        <div class="action">
            <img v-if="!todo.completed" src="./../images/edit.svg" @click="emits('editInit', todo)"> 
            <img @click="emits('delete', todo)" src="./../images/delete.svg">
        </div>
        <div class="editaction">
            <button @click="emits('editCancel')">Cancel</button>
            <button class="addbtn" @click="Submit">Save</button>
        </div>
    </li>
</template>
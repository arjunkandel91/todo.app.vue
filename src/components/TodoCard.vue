<script setup>
    // vue import
    import { ref } from 'vue';

    // component props
    const props = defineProps({
        todo: {
            type: Object,
            default: {}
        }
    });

    // emits
    // editInit -> initiate edit action, shows input fields etc
    // edit -> updates the task with updated title and descriptions
    // delete -> initiate the delete function
    // editCancel -> cancel the edit action (once clicked the 'cancel' button)
    // complete -> toggle complete action of the task
    const emits = defineEmits(['editInit', 'edit', 'delete', 'editCancel', 'complete']);

    // for editing
    let FormError = ref(false);
    let title = props.todo.title;
    let description = props.todo.description;

    // edit submission
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
        <!-- complete or incomplete toggle radio -->
        <div class="radio" @click="emits('complete', todo)"></div>

        <!-- content, title and description -->
        <div v-if="!todo.edit" class="content">
            <h3>{{ todo.title }}</h3>
            <p>{{ todo.description }}</p>
        </div>

        <!-- content, while current todo is on edit mode -->
        <div v-else class="content">
            <input :class="FormError ? '__error' : null" type="text" placeholder="Title" v-model="title">
            <p v-if="FormError" class="__error_txt">Todo title is required!</p>
            <input type="text" placeholder="Description" v-model="description">
        </div>

        <!-- action to edit and delete the todo -->
        <div class="action">
            <img v-if="!todo.completed" src="./../images/edit.svg" @click="emits('editInit', todo)"> 
            <img @click="emits('delete', todo)" src="./../images/delete.svg">
        </div>

        <!-- action to save or cancel while todo is on edit mode -->
        <div class="editaction">
            <button @click="emits('editCancel')">Cancel</button>
            <button class="addbtn" @click="Submit">Save</button>
        </div>
    </li>
</template>
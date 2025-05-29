<script setup>
    import { ref } from 'vue';

    let props = defineProps({
        count: {
            type: Number,
            default: 0
        }
    });

    let emit = defineEmits(['add']);

    let ShowSearch = ref(false);
    let ShowInput = ref(false);
    let FormError = ref(false);

    // v-model
    let title = '';
    let description = '';

    const ClearForm = () => {
        title = '';
        description = '';
        FormError.value = false;
        ShowInput.value = false;
    }

    const Submit = () => {
        // validation
        if (title.length <= 4) {
            FormError.value = true;
            return;
        }

        // if success move ahead to add task
        let NewTask = {
            id: Math.round(Math.random() * 1000),
            title: title,
            description: description
        }

        // send collected info to parent comp
        emit('add', NewTask);

        // finally hide the input box
        ClearForm();
    }

</script>

<template>
    <header>
        <div class="app-search">
            <h1>Todo List ({{ count }})</h1>
            <div class="actions">
                <img v-if="!ShowSearch" src="./../images/search.svg" @click="ShowSearch = true">
                <div v-if="ShowSearch" class="search-box">
                    <input type="text" placeholder="Search">
                    <img @click="ShowSearch = false" src="./../images/close.svg" />
                </div>
                <img src="./../images/filter.svg">
                <img src="./../images/mode.svg">
            </div>
        </div>

        <div v-if="!ShowInput" class="add-task" @click="ShowInput = true">
            <img src="./../images/add.svg" />
            <p>Add Task</p>
        </div>

        <div v-if="ShowInput" class="input-box">
            <div class="input">
                <input :class="FormError ? '__error' : null" type="text" placeholder="Title" v-model="title">
                <p v-if="FormError" class="__error_txt">Todo title is required!</p>
                <input type="text" placeholder="Description" v-model="description">
            </div>
            <div class="button">
                <button @click="ClearForm">Cancel</button>
                <button @click="Submit" class="addbtn">Add task</button>
            </div>
        </div>
    </header>
</template>
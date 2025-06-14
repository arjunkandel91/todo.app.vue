<script setup>
    
    import { ref, useTemplateRef } from 'vue';
    
    // vue use
    import { onClickOutside, useDark, useToggle } from '@vueuse/core';

    // scripts
    import { FilterTodo, SearchTodoList } from '@/scripts/Todo';

    let props = defineProps({
        count: {
            type: Number,
            default: 0
        }
    });

    let emit = defineEmits(['add']);

    // dark and light theme toggle 
    // on the fly if device changes the theme settings
    const isDark = useDark({
        selector: 'body',
        attribute: 'class',
        valueDark: 'dark-mode',
        valueLight: ''
    });
    const toggleDark = useToggle(isDark);

    let ToggleDarkMode = () => {
        isDark.value = !isDark.value;
    };

    // click outside of filter menu
    let filterMenu = useTemplateRef('filterMenu');

    let ShowSearch = ref(false);
    let ShowInput = ref(false);
    let FormError = ref(false);
    let ShowFilterMenu = ref(false);
    let SearchTxt = "";

    // v-model
    let title = '';
    let description = '';

    onClickOutside(filterMenu, (event) => {
        ShowFilterMenu.value = false;
    });

    const Filter = (type) => {
        if (type !== 'none') {

            FilterMenuContent.value.map(f => {
                if (f.type == type) f.active = true;
                else f.active = false;
                return f;
            });

            FilterTodo(type);
            ShowFilterMenu.value = false;
        }
    }

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
            title: title,
            description: description
        }

        // send collected info to parent comp
        emit('add', NewTask);

        // finally hide the input box
        ClearForm();
    }


    const FilterMenuContent = ref([
        {
            id: 1,
            name: 'Sort by',
            type: 'none',
            active: false
        },
        {
            id: 2,
            name: 'Todo Title',
            type: 'title',
            active: false
        },
        {
            id: 3,
            name: 'Incomplete (default)',
            type: 'incomplete',
            active: true
        },
        {
            id: 4,
            name: 'Completed',
            type: 'completed',
            active: false
        },
        {
            id: 5,
            name: 'Created date',
            type: 'date',
            active: false
        }
    ]);

</script>

<template>
    <header>
        <div class="app-search">
            <h1>Todo List ({{ count }})</h1>
            <div class="actions">
                <img v-if="!ShowSearch" src="./../images/search.svg" @click="ShowSearch = true">
                <div v-if="ShowSearch" class="search-box">
                    <input type="text" placeholder="Search" v-model="SearchTxt" @keyup="SearchTodoList(SearchTxt)">
                    <img @click="ShowSearch = false" src="./../images/close.svg" />
                </div>
                <img src="./../images/filter.svg" @click="ShowFilterMenu = true">
                <div v-if="ShowFilterMenu" class="filter-todo" ref="filterMenu">
                    <ul>
                        <li :class="menu.active ? 'active' : null" v-for="menu in FilterMenuContent" :key="menu.id" @click="Filter(menu.type)">
                            <span><img src="./../images/check.svg" /></span>
                            <p>{{ menu.name }}</p>
                        </li>
                    </ul>
                </div>
                <img src="./../images/mode.svg" @click="ToggleDarkMode">
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
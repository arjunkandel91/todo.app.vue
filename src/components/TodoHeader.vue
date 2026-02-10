<script setup>    
    // vue
    import { ref, useTemplateRef } from 'vue';
    
    // vue use
    import { onClickOutside, useDark, useToggle } from '@vueuse/core';

    // scripts
    import { FilterTodo, SearchTodoList, Filters } from '@/scripts/Todo';

    // component props
    let props = defineProps({
        count: {
            type: Number,
            default: 0
        }
    });

    // component emits
    let emits = defineEmits(['add']);

    // dark and light theme toggle 
    // on the fly if device changes the theme settings
    // this api is used from https://vueuse.org/
    const isDark = useDark({
        selector: 'body',
        attribute: 'class',
        valueDark: 'dark-mode',
        valueLight: ''
    });
    const toggleDark = useToggle(isDark);
    // dark and light theme toggle

    // light and dark theme toggle button click handler
    let ToggleDarkMode = () => {
        isDark.value = !isDark.value;
    };

    // component variables and v-models
    let ShowSearch = ref(false);
    let ShowInput = ref(false);
    let FormError = ref(false);
    let ShowFilterMenu = ref(false);
    let SearchTxt = "";

    // v-model (task input fields)
    let title = '';
    let description = '';

    // array of filter context menu
    const FilterMenuContent = ref(Filters);

    // click outside of filter menu
    // this api is used from https://vueuse.org/
    let filterMenu = useTemplateRef('filterMenu');
    onClickOutside(filterMenu, (event) => {
        ShowFilterMenu.value = false;
    });

    // Function triggered when an option in the filter menu is clicked  
    // Activates the selected option and calls the function to filter the to-do list based on the chosen menu item  
    const Filter = (type) => {
        if (type !== 'none') {
            FilterMenuContent.value.map(f => f.type == type ? f.active = true : f.active = false);

            FilterTodo(type);
            ShowFilterMenu.value = false;
        }
    }

    // clear form data and hide input boxes etc.
    const ClearForm = () => {
        title = '';
        description = '';
        FormError.value = false;
        ShowInput.value = false;
    }

    // called after clicking 'submit' button to create task
    const Submit = () => {
        // validation
        if (title.length <= 4) {
            FormError.value = true;
            return;
        }

        // if success move ahead to add task
        // send collected info to parent component
        emits('add', {title, description});

        // finally hide the input box 
        // & clear data from input field
        ClearForm();
    }


    // This function hides the search input field  
    // It also ensures all tasks are displayed when the user closes the input field with a keyword  
    // By resetting the keyword to blank, the full list becomes visible again  
    const CloseSearchInput = () => {
        ShowSearch.value = false;
        SearchTodoList('');
    }

</script>

<template>
    <header>
        <div class="app-search">
            <h1>Todo List ({{ count }})</h1>
            <div class="actions">
                <!-- search action -->
                <img v-if="!ShowSearch" src="./../images/search.svg" @click="ShowSearch = true">
                <div v-if="ShowSearch" class="search-box">
                    <input type="text" placeholder="Search" v-model="SearchTxt" @keyup="SearchTodoList(SearchTxt)">
                    <img @click="CloseSearchInput" src="./../images/close.svg" />
                </div>

                <!-- filter action -->
                <img src="./../images/filter.svg" @click="ShowFilterMenu = true">
                <div v-if="ShowFilterMenu" class="filter-todo" ref="filterMenu">
                    <ul>
                        <li :class="menu.active ? 'active' : null" v-for="menu in FilterMenuContent" :key="menu.id" @click="Filter(menu.type)">
                            <span><img src="./../images/check.svg" /></span>
                            <p>{{ menu.name }}</p>
                        </li>
                    </ul>
                </div>

                <!-- dark and light theme toggle action -->
                <img src="./../images/mode.svg" @click="ToggleDarkMode">
            </div>
        </div>

        <!-- add task button -->
        <div v-if="!ShowInput" class="add-task" @click="ShowInput = true">
            <img src="./../images/add.svg" />
            <p>Add Task</p>
        </div>

        <!-- input box to add new todo -->
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
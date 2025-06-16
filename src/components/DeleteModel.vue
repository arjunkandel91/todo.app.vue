<script setup>

    // props
    const props = defineProps({
        task: {
            type: Object,
            default: {}
        }
    });

    // emits
    // cancel => to close the model
    // delete => to delete the selected todo
    const emits = defineEmits(['cancel', 'delete']);

</script>

<template>
    <div class="delete-box">
        <div class="close"><img @click="emit('cancel')" src="./../images/close.svg" /></div>
        <div class="content">
            <h4>Do you want to delete <strong>{{ task.title }}</strong> ?</h4>
        </div>
        <div class="action">
            <button @click="emits('cancel')">Cancel</button>
            <button @click="emits('delete')" class="addbtn">Delete</button>
        </div>
    </div>
    <div class="overlay"></div>
</template>
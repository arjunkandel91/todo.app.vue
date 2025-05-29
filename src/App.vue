<script setup>

  // vue import
  import { ref, onMounted } from 'vue';

  // scripts
  import { NotifyPop } from './scripts/Todo';

  // components
  import { TodoWrap, TodoHeader, TodoCard, 
            EmptyTask, Skeleton, DeleteModel, Notification } from './components';

  const TodoList = ref([
    {
      id: 1,
      title: 'Task content here',
      description: 'your task title and description goes here',
      completed: false
    },
    {
      id: 2,
      title: 'Task content here',
      description: 'your task title and description goes here',
      completed: true
    }
  ]);

  const isLoading = ref(true);
  const DeleteTodo = ref({
    show: false,
    task: {}
  });

  const Notify = ref({
    show: false,
    content: ''
  });

  // user click on the edit icon
  // this method will enable the task edit mode
  // the selected task will have property edit: true, and false to other all
  const EditTask = (task) => {
    TodoList.value.map(todo => {
      if (todo.id == task.id) todo.edit = true;
      else todo.edit = false;
      return todo;
    });
  };

  const EditCancel = () => {
    TodoList.value.map(todo => todo.edit = false);
  }

  const DeleteInitiate = (task) => {
    DeleteTodo.value = {
      show: true,
      task: task
    }
  }

  const DeleteTask = () => {
    let toDelete = DeleteTodo.value.task.id;
    TodoList.value = TodoList.value.filter(todo => todo.id !== toDelete);

    // hide the model
    DeleteTodo.value.show = false;

    // toast notify
    NotifyPop(Notify, 'Task successfully deleted');
  }

  const AddNewTask = (task) => {
    TodoList.value.unshift(task);

    // toast notify
    NotifyPop(Notify, 'New task added!');
  }


  // component onMounted
  onMounted(() => {
    setTimeout(() => isLoading.value = false, 500);
  });

</script>

<template>
  <TodoWrap>
    <!-- Header content / search / task search 
     Add new task / task input section
    -->
    <TodoHeader :count="TodoList.length" @add="AddNewTask" />

    <!-- Task App List contains all task list created -->
    <ul class="todo-list">
      <TodoCard v-for="todo in TodoList" :key="todo.id" :todo="todo" @edit="EditTask" @delete="DeleteInitiate" @editCancel="EditCancel" />
    </ul>
    <!-- Task App List /-->

    <!-- Empty Task contains element hidden but shown only there are no tasks -->
    <EmptyTask v-if="TodoList.length === 0 && !isLoading" />
    <!-- Empty Task /-->

    <!-- Task Loader -- loading state while loading the app and task list -->
    <!-- This is just an example but useful when we connect with back-end -->
    <Skeleton v-if="isLoading" />
    <!-- Task Loader /-->

    <!-- Delete Task Modal -->
    <Teleport to="body">
      <DeleteModel v-if="DeleteTodo.show" :task="DeleteTodo.task" @cancel="DeleteTodo.show = false" @delete="DeleteTask" />
    </Teleport>
    <!-- Delete Task Modal /-->

    <!-- Notification -- only shown when task is deleted, updated, created etc  -->
    <Teleport to="body">
      <Notification v-if="Notify.show" :content="Notify.content" />
    </Teleport>
    <!-- Notification  /-->
  </TodoWrap>
</template>
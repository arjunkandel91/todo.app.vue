<script setup>

  // vue import
  import { ref, onMounted } from 'vue';

  // scripts
  import Storage from './scripts/Storage';
  import { TodoList, FilterTodo, TodoUniqueId, NotifyPop } from './scripts/Todo';

  // components
  import { TodoWrap, TodoHeader, TodoCard, 
  EmptyTask, DeleteModel, Notification } from './components';
  
  
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
  const EditTaskInitiate = (task) => {
    TodoList.value.map(todo => {
      if (todo.id == task.id) todo.edit = true;
      else todo.edit = false;
      return todo;
    });
  };

  const EditTask = (id, title, description) => {
    TodoList.value.filter(t => {
      if (t.id == id) {
        t.title = title;
        t.description = description;
        t.edit = false;
      }
    });

    // update storage
    Storage.store(TodoList.value);

    // toast notify
    NotifyPop(Notify, 'Task successfully updated!');
  }

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

    // update storage
    Storage.store(TodoList.value);

    // toast notify
    NotifyPop(Notify, 'Task successfully deleted');
  }

  // complete or incomplete tasks
  const ToggleComplete = (task) => {
    TodoList.value.map(t => t.id === task.id ? t.completed = !t.completed : null);

    // default filter
    FilterTodo('incomplete');

    // update storage
    Storage.store(TodoList.value);

    // toast notify
    NotifyPop(Notify, 'Task updated');
  };

  const AddNewTask = (task) => {
    task['id'] = TodoUniqueId();
    TodoList.value.unshift(task);

    // update local storage
    Storage.store(TodoList.value);

    // toast notify
    NotifyPop(Notify, 'New task added!');
  }


  onMounted(() => {
    FilterTodo('incomplete');
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
      <TodoCard v-for="todo in TodoList" :key="todo.id" 
                :todo="todo" 
                @editInit="EditTaskInitiate" 
                @edit="EditTask"  
                @delete="DeleteInitiate" 
                @editCancel="EditCancel"
                @complete="ToggleComplete" />
    </ul>
    <!-- Task App List /-->

    <!-- Empty Task contains element hidden but shown only there are no tasks -->
    <EmptyTask v-if="TodoList.length === 0" />
    <!-- Empty Task /-->

    <!-- Delete Task Modal -->
    <Teleport to="body">
      <DeleteModel v-if="DeleteTodo.show" 
                    :task="DeleteTodo.task" 
                    @cancel="DeleteTodo.show = false" 
                    @delete="DeleteTask" />
    </Teleport>
    <!-- Delete Task Modal /-->

    <!-- Notification -- only shown when task is deleted, updated, created etc  -->
    <Teleport to="body">
      <Notification v-if="Notify.show" :content="Notify.content" />
    </Teleport>
    <!-- Notification  /-->
  </TodoWrap>
</template>
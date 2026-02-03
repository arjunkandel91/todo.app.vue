<script setup>

  // vue
  import { ref, onMounted } from 'vue';

  // scripts
  import Storage from './scripts/Storage';
  import { TodoList, FilterTodo, TodoUniqueId, NotifyPop } from './scripts/Todo';

  // components
  import { TodoWrap, TodoHeader, TodoCard, 
  EmptyTask, DeleteModel, Notification } from './components';
  
  // todo delete object ref, property [show: true] will show the delete model 
  // (delete this line later, this is test from codespaces)
  // and property [task] contains the object which user want to delete
  const DeleteTodo = ref({
    show: false,
    task: {}
  });

  // toast notification object ref, property [show: true] will show the toast
  // it will be hidden within 2 seconds automatically
  // property [content] will be updated according to the activity on todo list
  const Notify = ref({
    show: false,
    content: ''
  });

  /**
   * This function initiate the edit todo
   * @param {Object} task 
   * the selected task will have property edit: true, and false to other all
  */
  const EditTaskInitiate = (task) => {
    TodoList.value.map(todo => {
      if (todo.id == task.id) todo.edit = true;
      else todo.edit = false;
      return todo;
    });
  };

  // This function disable all todo edit mode 
  const EditCancel = () => {
    TodoList.value.map(todo => todo.edit = false);
  }

  /**
   * This function is called from the child component 'TodoCard.vue' after submission to update the selected task
   * @param {String} id 
   * @param {String} title updated title
   * @param {String} description updated description
  */

  const EditTask = (id, title, description) => {
    TodoList.value.filter(t => {
      if (t.id == id) {
        t.title = title;
        t.description = description;
        t.edit = false;
      }
    });

    // update local storage
    Storage.store(TodoList.value);

    // toast notify
    NotifyPop(Notify, 'Task successfully updated!');
  }

  // This function initiate the delete function
  // delete model will be shown and the task which user want to delete will be updated to the ref
  const DeleteInitiate = (task) => {
    DeleteTodo.value = {
      show: true,
      task: task
    }
  }

  // This function finally delete the selected task
  // step1: removed from the todo array list
  // step2: delete model will be closed
  // step3: update the local storage
  // step4: show toast notification to the user
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

  // complete or incomplete tasks (toggled)
  const ToggleComplete = (task) => {
    TodoList.value.map(t => t.id === task.id ? t.completed = !t.completed : null);

    // default filter
    FilterTodo('incomplete');

    // update storage
    Storage.store(TodoList.value);

    // toast notify
    NotifyPop(Notify, 'Task updated');
  };

  // this function add new task with unique id to the todo array list
  // also update the local storage and show the toast notification
  const AddNewTask = (task) => {
    task['id'] = TodoUniqueId();
    TodoList.value.unshift(task);

    // update local storage
    Storage.store(TodoList.value);

    // toast notify
    NotifyPop(Notify, 'New task added!');
  }

  // once the component mounted 
  // filtered the todo list with incomplete first and completed (default filter)
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
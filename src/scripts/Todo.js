import { ref } from "vue";
import Storage from "./Storage";

export const TodoList = ref(Storage.get());

/**
 * This function show/hide toast notification on every action on the app
 * like new task added, updated, deleted etc
 * @param {Object} notify (ref) data
 * @param {String} content message to show on the notification
 * 
*/

export const NotifyPop = (notify, content = "Task Updated!") => {
    notify.value.content = content;
    notify.value.show = true;

    setTimeout(() => notify.value.show = false, 2000);
};

export const FilterTodo = (type) => {
    switch (type) {
        case 'title':
            FilterTodoTitle();
            break;
        
        case 'date':
            FilterTodoDate();
            break;
        
        case 'completed':
            FilterComplete(type);
            break;
        
        case 'incomplete':
            FilterComplete(type);
            break;
    
        default:
            break;
    }
};

export const TodoUniqueId = () => {
    let unique = 1;
    TodoList.value.forEach(t => {
        if (t.id >= unique) unique = t.id + 1;
    });

    return unique;
};

export const SearchTodoList = (keyword) => {
    TodoList.value.map(t => {
        if (t.title.toLowerCase().includes(keyword.toLowerCase())) t.hide = false;
        else t.hide = true;
        return t;
    });
};


const FilterTodoTitle = () => {
    TodoList.value.sort((a, b) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
        else if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
        else return 0;
    });
}

const FilterTodoDate = () => {
    TodoList.value.sort((a, b) => {
        if (a.id < b.id) return -1;
        else if (a.id > b.id) return 1;
        else return 0;
    });
};

const FilterComplete = (type) => {
    let begin = [] 
    let end = [];
    TodoList.value.forEach(t => {
        if (type == 'completed') {
            if (t.completed) begin.push(t);
            else end.push(t);
        }else {
            if (t.completed) end.push(t);
            else begin.push(t);
        }
    });

    // your code here
};

export default {

}
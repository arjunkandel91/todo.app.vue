const LocalStorage = window.localStorage;
const key = "todo-list";

const store = (data) => {
    try {
        LocalStorage.setItem(key, JSON.stringify(data));
        return true;
    }catch (e) {
        return false;
    }
}

const get = () => {
    try {
        let data = JSON.parse(LocalStorage.getItem(key));
        if (data == null) return [];
        else return data;
    }catch (e) {
        return null;
    }
};

const remove = () => {
    try {
        LocalStorage.removeItem(key);
        return true;
    }catch (e) {
        return null;
    }
};

export default {
    store,
    get,
    remove,
}
export const NotifyPop = (notify, content = "Task Updated!") => {
    notify.value.content = content;
    notify.value.show = true;

    setTimeout(() => notify.value.show = false, 2000);
}
export default class CompleteFilter {
    htmlIdentifier = "complete-filter-btn";
    active = false;
    filter = (toDoItem) => {
        return this.active ? !toDoItem.Complete : true
    }
}
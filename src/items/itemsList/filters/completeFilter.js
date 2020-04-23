export default class CompleteFilter {
    htmlIdentifier;
    name;
    active;
    filter;
    type;
    constructor(isActive = false) {
        this.type = "button";
        this.htmlIdentifier = "complete-filter-btn";
        this.name = "complete";
        this.active = isActive;
        this.filter = (toDoItem) => {
            return this.active ? !toDoItem.Complete : true
        }
    }
}
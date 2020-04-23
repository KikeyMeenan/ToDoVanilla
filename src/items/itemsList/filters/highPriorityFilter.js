export default class HighPriorityFilter {
    htmlIdentifier;
    name;
    active;
    type;
    constructor(isActive = false) {
        this.type = "button";
        this.htmlIdentifier = "high-priority-filter-btn";
        this.name = "high priority";
        this.active = isActive;
        this.filter = (toDoItem) => {
            return this.active ? toDoItem.Priority >= 2 : true
        }
    }
}
import template from './template.html';
import { toggleItemComplete, deleteItem } from '../../services/itemsService'
import { getCurrentUserId } from '../../services/sessionService'
import PubSub from '../../pubsub'

const templateEl = document.createElement('template');
templateEl.innerHTML = template;

export class ListItem extends HTMLElement {
  CategoryEl;
  NameEl;
  CompleteByEl;
  EffortEl;
  AssignedToEl;
  DecsriptionEl;
  CompleteButtonEl;
  CompleteButtonDisplayEl;
  DeleteButtonEl;
  PriorityEl;
  EditBtnLinkEl;
  Item;

  constructor(itemData) {
    super();
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.appendChild(templateEl.content.cloneNode(true));

    this.Item = itemData;

    this.className = 'toDoItem';
    this.setAttribute('id', this.Item.Id);

    this.EditBtnLinkEl = shadow.getElementById('edit-btn-link');
    this.EditBtnLinkEl.setAttribute('href', `/items/edit?id=${this.Item.Id}`);

    if (this.Item.Name !== null) {
      this.NameEl = shadow.getElementById('item__name');
      this.NameEl.textContent = this.Item.Name;
    }

    if (this.Item.CompleteBy !== null) {
      this.CompleteByEl = shadow.getElementById('item__complete-by');
      //would be good to hide entire p tag instead
      this.CompleteByEl.innerHTML = '<i class="material-icons text-icon">alarm</i> ' + new Date(this.Item.CompleteBy).toDateString();
    }

    if (this.Item.Effort !== null) {
      this.EffortEl = shadow.getElementById('item__effort');
      this.EffortEl.innerHTML = '<i class="material-icons text-icon">hourglass_full</i> ' + this.Item.Effort;
    }
    
    if (this.Item.AssignedUserName !== null) {
      this.AssignedToEl = shadow.getElementById('item__assigned-to');
      this.AssignedToEl.innerHTML = '<i class="material-icons text-icon">face</i> ' + this.Item.AssignedUserName;
    }

    if (this.Item.Description !== null) {
      this.DescriptionEl = shadow.getElementById('item__description');
      this.DescriptionEl.textContent = this.Item.Description;
    }

    if (this.Item.CategoryName !== null) {
      this.CategoryEl = shadow.getElementById('item__category');
      this.CategoryEl.textContent = this.Item.CategoryName;
    }

    if (this.Item.Priority !== null) {
      this.PriorityEl = shadow.getElementById('item__priority');
      let priorityDisplay;
      switch(this.Item.Priority){
        case 0: {
          priorityDisplay = '<span class="badge badge-success badge-pill">L</span>'
          break;
        }
        case 1: {
          priorityDisplay = '<span class="badge badge-warning badge-pill">M</span>'
          break;
        }
        default : {
          priorityDisplay = '<span class="badge badge-danger badge-pill">H</span>'
        }
      }
      this.PriorityEl.innerHTML = priorityDisplay;
    }

    this.CompleteButtonEl = shadow.getElementById('item-complete-btn');
    if (this.CompleteButtonEl === null) {
      return;
    }
    
    this.CompleteButtonDisplayEl = shadow.getElementById('item-complete-btn__display');
    if (this.CompleteButtonDisplayEl === null) {
      return;
    }

    this.DeleteButtonEl = shadow.getElementById('item-delete-btn');
    if (this.DeleteButtonEl === null) {
      return;
    }

    this.updateCompleteElAndBtnText();

    //move the guts of this into a function out of constructor
    this.CompleteButtonEl.addEventListener('click', async () => {
      
      this.Item.Complete = !this.Item.Complete;

      const userId = await getCurrentUserId();

      //do something with this response?
      var res = await toggleItemComplete(this.Item.Id, this.Item.Complete, userId);
      if(res.status == 200){
        //may be better to totally re-do list instead
        this.updateCompleteElAndBtnText();
        PubSub.publish("filterListEvent");
      }
      else {
        alert('uh ooohhh')
      }
    })

    //move the guts of this into a function out of constructor
    this.DeleteButtonEl.addEventListener('click', async () => {
      this.DeleteButtonEl.disabled = true;
      var res = await deleteItem(this.Item.Id);

      if(res.status == 200)
      {
        this.remove();
        return;
      }
      
      alert('aaaaah an error! tell michael!')
      
      this.DeleteButtonEl.disabled = false;
    })
  }

  updateCompleteElAndBtnText = () => {
    this.CompleteButtonDisplayEl.textContent = this.Item.Complete === true ? 'clear' : 'done';
  }
}
window.customElements.define('list-item', ListItem);

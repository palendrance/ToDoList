import {Component, OnInit} from '@angular/core';
import {ToDoItemService} from '../services/to-do-item.service';
import {ToDoItem} from '../interfaces/to-do';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string = 'ToDoList';

  newItemLabel: string = '';

  toDoItems: ToDoItem[];
  incompleteItems: ToDoItem[];
  completeItems: ToDoItem[];

  activeInput: number = null;

  constructor(private toDoItemService: ToDoItemService) {
  }

  ngOnInit(): void {
    this.toDoItemService.initializeToDoDB();
    this.loadTodoItems();
  }

  loadTodoItems(): void {
    this.toDoItemService.getItems().subscribe(res => {
      this.toDoItems = res;

      this.incompleteItems = this.toDoItems.filter(item => !item.isComplete);
      this.completeItems = this.toDoItems.filter(item => item.isComplete);
    });
  }

  addTodoItem(label: string): void {
    if (label) {
      const newItem: ToDoItem = {
        id: null,
        label: label,
        isComplete: false,
      };

      this.toDoItemService.setItem(newItem).subscribe(
        _res => {
          setTimeout(() => {
            this.loadTodoItems();
          });
        },
      );

      this.newItemLabel = '';
    }
  }

  updateToDoItem(item: ToDoItem): void {
    this.toDoItemService.setItem(item).subscribe(
      _res => {
        this.loadTodoItems();
      },
    );
  }

  deleteTodoItem(id: string): void {
    this.toDoItemService.deleteItem(id).subscribe(
      _res => {
        setTimeout(() => {
          this.loadTodoItems();
        });
      },
    );
  }

  startEditing(i: number) {
    this.activeInput = i;
  }

  stopEditing(item: ToDoItem): void {
    this.activeInput = null;

    this.updateToDoItem(item);
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from 'src/api/api.service';
import { Todo } from 'src/types/interfaces';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  constructor(private _apiService: ApiService) {}

  todos: Todo[];

  ngOnInit(): void {
    this.getTodos().subscribe((todos) => (this.todos = todos));
  }

  getTodos() {
    return this._apiService.getTodos();
  }

  onToggle(status: boolean, todoId: number) {
    const updatedTodoIndex = this.todos.findIndex((todo) => todo.id === todoId);
    if (updatedTodoIndex) this.todos[updatedTodoIndex].completed = status;
  }
  
}

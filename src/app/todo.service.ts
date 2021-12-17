import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


import { ApiService } from 'src/api/api.service';
import { Todo } from 'src/types/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TodoService implements OnInit {
  userId=12345;
  constructor(private _apiService: ApiService) { }
  ngOnInit(): void {
  }

  getTodos(): Observable<Todo[]> {
    return this._apiService.getTodos();
  }

  createTodos(todo: Todo): Observable<Todo> {
    return this._apiService.createTodos(todo);
  }

  createSubTaskTodos(todoId: number, subTaskTodo: Todo): Observable<Todo> {
    return this._apiService.createSubTaskTodos(todoId, subTaskTodo);
  }

  updateTodos(todo: Todo): Observable<Todo> {
    return this._apiService.updateTodos(todo);
  }

  updateSubTaskTodos(todoId: number, subTaskTodo: Todo): Observable<Todo> {
    return this._apiService.updateSubTaskTodos(todoId, subTaskTodo);
  }

  deleteTodos(todoId: number, subTaskTodoId?: number): Observable<boolean> {
    return this._apiService.deleteTodos(todoId, subTaskTodoId);
  }

  updateTodoStatus(status: boolean, todoId: number, subTaskTodoId?: number) {
    return this._apiService.updateTodoStatus(status, todoId, subTaskTodoId);
  }

}

import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Todo } from 'src/types/interfaces';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  constructor(private todoService: TodoService) { }

  todos: Todo[];

  editId: number;
  editSubtaskId: number;

  ngOnInit(): void {
    this.getTodos().subscribe((todos) => {
      this.todos = todos.map(t => {
        return { ...t, key: t.id }
      })
    });
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (!checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  getTodos() {
    return this.todoService.getTodos();
  }

  onToggle(status: boolean, todoId: number) {
    this.todoService.updateTodoStatus(status, todoId).subscribe((newStatus) => {
      if (newStatus === status) {
        const updatedTodoIndex = this.findTodoIndex(todoId);
        if (updatedTodoIndex) this.todos[updatedTodoIndex].completed = status;
      }
    })
  }

  onToggleSubTask(status: boolean, todoId: number, subTaskTodoId: number) {
    this.todoService.updateTodoStatus(status, todoId, subTaskTodoId).subscribe((newStatus) => {
      if (newStatus === status) {
        const selectedTodo = this.todos.find(t => t.id === todoId);
        if (selectedTodo) {
          const updatedSubtaskIndex = selectedTodo.subTasks.findIndex(t => t.id === subTaskTodoId);
          if (updatedSubtaskIndex > -1) {
            selectedTodo.subTasks[updatedSubtaskIndex].completed = newStatus;;
            selectedTodo.subTasks = [...selectedTodo.subTasks];

            this.resetEdit();
          }

        }

      }
    })
  }

  private resetEdit() {
    this.editId = undefined;
    this.editSubtaskId = undefined;
  }

  /**
   * Add new todo item 
   */
  addNewTodo() {
    const newTodo = {
      userId: this.todoService.userId,
      id: Date.now(),
      title: '',
      completed: false
    };
    this.resetEdit();

    this.todoService.createTodos(newTodo)
      .subscribe((todo) => {
        this.todos = [
          todo,
          ...this.todos,
        ];
        this.editId = todo.id;
      });

  }

  /**
   * Add new todo sub task item 
   */
  addNewSubTask(todoId: number) {
    const newTodo = {
      userId: this.todoService.userId,
      id: Date.now(),
      title: '',
      completed: false
    };

    this.resetEdit();

    this.todoService.createSubTaskTodos(todoId, newTodo)
      .subscribe((task) => {
        const selectedTodo = this.todos.find(t => t.id === todoId);
        selectedTodo.subTasks = [
          task,
          ...(selectedTodo.subTasks || []),
        ];
        this.todos = [...this.todos];
        this.editSubtaskId = task.id;
        this.editId = todoId;
        this.onExpandChange(todoId, true);
      });

  }


  deleteTodo(todoId: number) {
    this.todoService.deleteTodos(todoId).subscribe((status) => {
      if (status) {
        this.todos = this.todos.filter(t => t.id !== todoId);
      }
    })
  }


  startEdit(todoId: number): void {
    this.resetEdit();
    this.editId = todoId;
  }

  stopEdit(): void {
    const todoIndex = this.findTodoIndex(this.editId);
    if (todoIndex > -1) {
      this.saveTodo(this.todos[todoIndex]);
    }
  }

  saveTodo(todo: Todo) {
    this.todoService.updateTodos(todo).subscribe((updatedTodo) => {
      const updatedTodoIndex = this.findTodoIndex(updatedTodo.id);
      if (updatedTodoIndex > -1) {
        this.todos[updatedTodoIndex] = updatedTodo;
        this.todos = [...this.todos];
        this.resetEdit();
        // this.todos = JSON.parse(JSON.stringify(this.todos));
      }
    });

  }

  startEditSubtask(todoId: number, subtaskId: number): void {
    this.editId = todoId;
    this.editSubtaskId = subtaskId;
  }

  stopEditSubtask(): void {
    const todoIndex = this.findTodoIndex(this.editId);
    if (todoIndex > -1) {
      const todoSubtaskIndex = this.todos[todoIndex].subTasks.findIndex(t => t.id === this.editSubtaskId);
      if (todoSubtaskIndex > -1) {
        this.saveSubtask(this.editId, this.todos[todoIndex].subTasks[todoSubtaskIndex]);
      }
    }
  }

  saveSubtask(todoId: number, subTask: Todo) {
    this.todoService.updateSubTaskTodos(todoId, subTask)
      .subscribe((updatedTodo) => {
        const selectedTodo = this.todos.find(t => t.id === todoId);
        if (selectedTodo) {
          const updatedSubtaskIndex = selectedTodo.subTasks.findIndex(t => t.id === updatedTodo.id);
          if (updatedSubtaskIndex > -1) {
            selectedTodo.subTasks[updatedSubtaskIndex] = updatedTodo;
            selectedTodo.subTasks = [...selectedTodo.subTasks];

            this.resetEdit();
          }

        }
      });

  }

  deleteSubtask(todoId: number, subTaskTodoId: number) {
    this.todoService.deleteTodos(todoId, subTaskTodoId).subscribe((newStatus) => {
      if (newStatus) {
        const updatedTodoIndex = this.findTodoIndex(todoId);
        if (updatedTodoIndex > -1) {
          this.todos[updatedTodoIndex].subTasks = this.todos[updatedTodoIndex].subTasks.filter(t => t.id !== subTaskTodoId);
        }
      }
    });
  }

  findTodoIndex(todoId: number): number {
    return this.todos.findIndex((todo) => todo.id === todoId);
  }
  trackByTodo(index: number, el: any): number {
    return el.id;
  }


}

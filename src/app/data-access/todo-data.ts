import produce from 'immer';
import { map, timer } from 'rxjs';
import Task from '../../utilities/task';
import { Todo } from '../services/todo-service';
import todoJson from './todos.json';

let todos = todoJson.todos as Todo[];
const mockDelay = 1000;

export interface Response<T> {
  data: T;
}

function mockRequest<T>(func: () => Response<T>) {
  return timer(mockDelay).pipe(map(func));
}

function getTodos() {
  return mockRequest(() => {
    return { data: todos } as Response<Todo[]>;
  });
}

function addTodo(newTodo: Todo) {
  return mockRequest(() => {
    todos = todos.concat(newTodo);
    return { data: todos } as Response<Todo[]>;
  });
}

function removeTodo(id: string) {
  return mockRequest(() => {
    todos = todos.filter((t) => t.id !== id);
    return { data: todos } as Response<Todo[]>;
  });
}

function checkTodo(id: string) {
  return mockRequest(() => {
    todos = produce(todos, (draft) => {
      const index = draft.findIndex((t) => t.id === id);
      if (index !== -1) draft[index].done = !draft[index].done;
    });
    return { data: todos } as Response<Todo[]>;
  });
}

function resetTodos() {
  return mockRequest(() => {
    todos = todoJson.todos;
    return { data: todos } as Response<Todo[]>;
  });
}

function saveTodos(newTodos: Todo[]) {
  return mockRequest(() => {
    todos = newTodos;
    return { data: todos } as Response<Todo[]>;
  });
}

/**
 * Collection of data fetching operations each wrapped in its own Task handler.
 */
export const api = {
  getTodos: new Task(getTodos),
  addTodo: new Task(addTodo),
  removeTodo: new Task(removeTodo),
  checkTodo: new Task(checkTodo),
  resetTodos: new Task(resetTodos),
  saveTodos: new Task(saveTodos),
};

export type API = typeof api;

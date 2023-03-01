import { merge, skip } from 'rxjs';
import createID from '../../utilities/create-id';
import memoizeStream from '../../utilities/memoize-stream';
import { State } from '../../utilities/state';
import { Task, TaskfromPromise } from '../../utilities/task';
import { API, api } from '../data-layer/todo-data';

export interface Todo {
  id: string;
  task: string;
  done: boolean;
}

function Todo(task: string) {
  return { id: createID(), task, done: false };
}

interface TodoState {
  items: Todo[];
  taskInput: string;
}

function TodoService(state: State<TodoState>, api: API) {
  const tasks = {
    getTodos: TaskfromPromise(api.getTodosAsync),
    saveTodos: Task(api.saveTodos),
    resetTodos: Task(api.resetTodos),
  };

  const getLoading$ = memoizeStream(tasks.getTodos.pending$);
  const saveLoading$ = memoizeStream(tasks.saveTodos.pending$);
  const resetLoading$ = memoizeStream(tasks.resetTodos.pending$);

  const items$ = state.toStream((state) => state.items);
  const taskInput$ = state.toStream((state) => state.taskInput);

  function getTodos() {
    tasks.getTodos.run();
  }

  function saveTodos() {
    const { items } = state.get();
    tasks.saveTodos.run(items);
  }

  function resetTodos() {
    tasks.resetTodos.run();
  }

  function setTaskInput(value: string) {
    state.set((state) => {
      state.taskInput = value;
    });
  }

  function addTodo() {
    state.set((state) => {
      const newTask = state.taskInput;
      const newTodo = Todo(newTask);
      state.items.push(newTodo);
      state.taskInput = '';
    });
  }

  function removeTodo(id: string) {
    state.set((state) => {
      const index = state.items.findIndex((t) => t.id === id);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    });
  }

  function toggleDone(id: string) {
    state.set((state) => {
      const index = state.items.findIndex((t) => t.id === id);
      if (index !== -1) {
        const update = !state.items[index].done;
        state.items[index].done = update;
      }
    });
  }

  tasks.getTodos.results$.pipe(skip(1)).subscribe((result) => {
    if (!result) return;
    state.set((state) => {
      state.items = result.data;
    });
  });

  merge(
    tasks.saveTodos.results$.pipe(skip(1)),
    tasks.resetTodos.results$.pipe(skip(1)),
  ).subscribe(() => {
    tasks.getTodos.run();
  });

  return {
    items$,
    taskInput$,
    getLoading$,
    saveLoading$,
    resetLoading$,
    getTodos,
    saveTodos,
    resetTodos,
    setTaskInput,
    addTodo,
    removeTodo,
    toggleDone,
  };
}

const initialState: TodoState = {
  items: [],
  taskInput: '',
};

const todoState = State(initialState);
export const todoService = TodoService(todoState, api);

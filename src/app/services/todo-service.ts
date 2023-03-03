import { combineLatest, map, merge, skip } from 'rxjs';
import createID from '../../utilities/create-id';
import memoizeStream from '../../utilities/memoize-stream';
import State from '../../utilities/state';
import Task from '../../utilities/task';
import { API } from '../data-layer/todo-data';

export interface Todo {
  id: string;
  task: string;
  done: boolean;
}

/**
 * Creates a todo item.
 * @param task input string
 * @returns Todo item
 */
function createTodo(task: string) {
  return { id: createID(), task, done: false };
}

interface TodoState {
  items: Todo[];
  taskInput: string;
}

const initialState: TodoState = { items: [], taskInput: '' };

export class TodoService {
  private _state = new State(initialState);
  private _getTodos;
  private _saveTodos;
  private _resetTodos;

  /**
   * Manages a collection of todo items and the value of the input field used to create new ones.
   * @param _api Collection of data fetching operations
   */
  constructor(api: API) {
    this._getTodos = new Task(api.getTodos, {
      retry: { count: 5, delay: 3000 },
    });
    this._saveTodos = new Task(api.saveTodos);
    this._resetTodos = new Task(api.resetTodos);

    // Assign getTodo results to local state. Skip initial value when establishing subscription.
    this._getTodos.results$.pipe(skip(1)).subscribe((result) => {
      if (!result) return;
      this._state.set((state) => {
        state.items = result.data;
      });
    });

    // Refetch todos from server after mutations. Skip initial value when establishing subscription.
    merge(
      this._saveTodos.results$.pipe(skip(1)),
      this._resetTodos.results$.pipe(skip(1)),
    ).subscribe(() => {
      this._getTodos.run();
    });
  }

  /**
   * Observable array of todos.
   */
  get items$() {
    return this._state.toStream((state) => state.items);
  }

  /**
   * Observable input field value.
   */
  get taskInput$() {
    return this._state.toStream((state) => state.taskInput);
  }

  /**
   * Loading state of getTodos task.
   */
  get getLoading$() {
    return memoizeStream(this._getTodos.pending$);
  }

  /**
   * Loading state of saveTodos task.
   */
  get saveLoading$() {
    return memoizeStream(this._saveTodos.pending$);
  }

  /**
   * Loading state of resetTodos task.
   */
  get resetLoading$() {
    return memoizeStream(this._resetTodos.pending$);
  }

  /**
   * Combined loading state of all tasks.
   */
  get combinedLoading$() {
    return memoizeStream(
      combineLatest([
        this._getTodos.pending$,
        this._saveTodos.pending$,
        this._resetTodos.pending$,
      ]).pipe(map((states) => states.some(Boolean))),
    );
  }

  /**
   * Fetches todos from mock server.
   */
  getTodos() {
    this._getTodos.run();
  }

  /**
   * Saves current todo collection to mock server.
   */
  saveTodos() {
    const { items } = this._state.get();
    this._saveTodos.run(items);
  }

  /**
   * Reverts current todos on the mock server to a default collection.
   */
  resetTodos() {
    this._resetTodos.run();
  }

  /**
   * Setter for input field value.
   * @param value string
   */
  setTaskInput(value: string) {
    this._state.set((state) => {
      state.taskInput = value;
    });
  }

  /**
   * Adds a new todo to the local collection.
   * Uses the current taskInput value and resets it.
   */
  addTodo() {
    this._state.set((state) => {
      const newTask = state.taskInput;
      const newTodo = createTodo(newTask);
      state.items.push(newTodo);
      state.taskInput = '';
    });
  }

  /**
   * Removes a todo from the local todo collection.
   * @param id Todo identifier
   */
  removeTodo(id: string) {
    this._state.set((state) => {
      const index = state.items.findIndex((t) => t.id === id);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    });
  }

  /**
   * Toggles the done state of a todo item.
   * @param id Todo identifier
   */
  toggleDone(id: string) {
    this._state.set((draft) => {
      const index = draft.items.findIndex((t) => t.id === id);
      if (index !== -1) {
        const update = !draft.items[index].done;
        draft.items[index].done = update;
      }
    });
  }
}

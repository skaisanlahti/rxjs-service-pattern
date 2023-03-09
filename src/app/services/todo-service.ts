import { combineLatest, map, merge } from 'rxjs';
import createID from '../../utilities/create-id';
import memoizeStream from '../../utilities/memoize-stream';
import State from '../../utilities/state';
import Task from '../../utilities/task';
import { API } from '../data-access/todo-data';

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
  private _todoState = new State(initialState);
  private _getTodos;
  private _saveTodos;
  private _resetTodos;

  /**
   * Manages a collection of todo items and the value of the input field used to create new ones.
   * @param api Collection of data fetching operations
   */
  constructor(api: API) {
    this._saveTodos = new Task(api.saveTodos);
    this._resetTodos = new Task(api.resetTodos);
    this._getTodos = new Task(api.getTodos, {
      retry: { count: 5, delay: 3000 },
    });

    // Assign getTodo results to local state.
    this._getTodos.results$.subscribe((result) => {
      this._todoState.update((state) => {
        return { ...state, items: result.data };
      });
    });

    // Refetch todos from server after mutations.
    merge(this._saveTodos.results$, this._resetTodos.results$).subscribe(() => {
      this._getTodos.run();
    });
  }

  get state$() {
    return this._todoState.valueChanges$;
  }

  get items$() {
    return this._todoState.select((state) => state.items);
  }

  get taskInput$() {
    return this._todoState.select((state) => state.taskInput);
  }

  get getLoading$() {
    return this._getTodos.pending$;
  }

  get saveLoading$() {
    return this._saveTodos.pending$;
  }

  get resetLoading$() {
    return this._resetTodos.pending$;
  }

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
   * Fetches todos from mock server. Reading of results stream
   * is defined in the constructor.
   */
  getTodos() {
    this._getTodos.run();
  }

  /**
   * Saves current todo collection to mock server.
   */
  saveTodos() {
    const { items } = this._todoState.value;
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
    this._todoState.update((state) => {
      return { ...state, taskInput: value };
    });
  }

  /**
   * Adds a new todo to the local collection.
   * Uses the current taskInput value and resets it.
   */
  addTodo() {
    this._todoState.update((state) => {
      const newTodo = createTodo(state.taskInput);
      return {
        items: [...state.items, newTodo],
        taskInput: '',
      };
    });
  }

  /**
   * Removes a todo from the local todo collection.
   * @param id Todo identifier
   */
  removeTodo(id: string) {
    this._todoState.update((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      return { ...state, items: newItems };
    });
  }

  /**
   * Toggles the done state of a todo item.
   * @param id Todo identifier
   */
  toggleDone(id: string) {
    this._todoState.mutate((state) => {
      state.items = state.items.map((item) => {
        return item.id === id ? { ...item, done: !item.done } : item;
      });
    });
  }
}

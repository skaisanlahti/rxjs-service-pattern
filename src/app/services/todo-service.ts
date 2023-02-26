import { merge, skip } from 'rxjs';
import createID from '../../utilities/create-id';
import createSelector from '../../utilities/create-selector';
import StatefulService from '../../utilities/stateful-service';
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

export interface TodoState {
  items: Todo[];
  taskInput: string;
}

const initialState: TodoState = { items: [], taskInput: '' };

export class TodoService extends StatefulService<TodoState> {
  /**
   * Manages a collection of todo items and the value of the input field used to create new ones.
   * @param _api Collection of data fetching operations
   */
  constructor(private _api: API) {
    super(initialState);

    /**
     * Assign getTodo results to local state. Skip initial value when establishing subscription.
     */
    this._api.getTodos.results$.pipe(skip(1)).subscribe((result) => {
      if (!result) return;
      this.setState((state) => {
        state.items = result.data;
      });
    });

    /**
     * Refetch todos from server after mutations. Skip initial value when establishing subscription.
     */
    merge(
      this._api.saveTodos.results$.pipe(skip(1)),
      this._api.resetTodos.results$.pipe(skip(1)),
    ).subscribe(() => {
      this._api.getTodos.run();
    });
  }

  /**
   * Observable array of todos.
   */
  get items$() {
    return this.createSelector((s) => s.items);
  }

  /**
   * Observable input field value.
   */
  get taskInput$() {
    return this.createSelector((state) => state.taskInput);
  }

  /**
   * Setter for input field value.
   * @param value string
   */
  setTaskInput(value: string) {
    this.setState((state) => {
      state.taskInput = value;
    });
  }

  /**
   * Loading state of getTodos task.
   */
  get getLoading$() {
    return createSelector(this._api.getTodos.pending$);
  }

  /**
   * Fetches todos from server.
   */
  getTodos() {
    this._api.getTodos.run();
  }

  /**
   * Loading state of saveTodos task.
   */
  get saveLoading$() {
    return createSelector(this._api.saveTodos.pending$);
  }

  /**
   * Saves current todo collection to server.
   */
  saveTodos() {
    const newTodos = this.state.items;
    this._api.saveTodos.run(newTodos);
  }

  /**
   * Loading state of resetTodos task.
   */
  get resetLoading$() {
    return createSelector(this._api.resetTodos.pending$);
  }

  /**
   * Reverts current todos on the server to a default collection.
   */
  resetTodos() {
    this._api.resetTodos.run();
  }

  /**
   * Adds a new todo to the local collection.
   * Uses the current taskInput value and resets it.
   */
  addTodo() {
    this.setState((state) => {
      const newTask = this.state.taskInput;
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
    this.setState((state) => {
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
    this.setState((draft) => {
      const index = draft.items.findIndex((t) => t.id === id);
      if (index !== -1) {
        const update = !draft.items[index].done;
        draft.items[index].done = update;
      }
    });
  }
}

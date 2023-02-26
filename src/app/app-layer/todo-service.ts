import { merge } from 'rxjs';
import { API } from '../data-layer/todo-data';
import { StateService } from './state-service';
import genId, { createSelector } from './utils';

export interface Todo {
  id: string;
  task: string;
  done: boolean;
}

export interface TodoState {
  items: Todo[];
  taskField: string;
}

const initialState: TodoState = { items: [], taskField: '' };

export class TodoService extends StateService<TodoState> {
  constructor(private _api: API) {
    super(initialState);

    // set api results to local state
    this._api.getTodos.results$.subscribe((result) => {
      if (!result) return;
      this.setState((state) => {
        state.items = result.data;
      });
    });

    // refetch after saving or resetting
    merge(
      this._api.saveTodos.results$,
      this._api.resetTodos.results$,
    ).subscribe(() => {
      this._api.getTodos.run();
    });
  }

  get items$() {
    return this.createSelector((s) => s.items);
  }

  get taskField$() {
    return this.createSelector((state) => state.taskField);
  }

  setTaskField(value: string) {
    this.setState((state) => {
      state.taskField = value;
    });
  }

  get getLoading$() {
    return createSelector(this._api.getTodos.inProgress$);
  }

  getTodos() {
    this._api.getTodos.run();
  }

  get saveLoading$() {
    return createSelector(this._api.saveTodos.inProgress$);
  }

  saveTodos() {
    const newTodos = this.state.items;
    this._api.saveTodos.run(newTodos);
  }

  get resetLoading$() {
    return createSelector(this._api.resetTodos.inProgress$);
  }

  resetTodos() {
    this._api.resetTodos.run();
  }

  addTodo() {
    this.setState((state) => {
      const newTodo = { id: genId(), task: this.state.taskField, done: false };
      state.items.push(newTodo);
      state.taskField = '';
    });
  }

  removeTodo(id: string) {
    this.setState((state) => {
      const index = state.items.findIndex((t) => t.id === id);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    });
  }

  finishTodo(id: string) {
    this.setState((draft) => {
      const index = draft.items.findIndex((t) => t.id === id);
      if (index !== -1) {
        const update = !draft.items[index].done;
        draft.items[index].done = update;
      }
    });
  }
}

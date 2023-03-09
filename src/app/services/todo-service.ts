import { useObservableState } from "observable-hooks";
import { useEffect } from "react";
import { BehaviorSubject, combineLatest, merge } from "rxjs";
import createID from "../../utilities/create-id";
import { memo } from "../../utilities/stream-utils";
import Task, { defaultRetry } from "../../utilities/task";
import { API } from "../data-access/todo-data";

export type Todo = {
  id: string;
  task: string;
  done: boolean;
};

/**
 * Creates a todo item.
 * @param task input string
 * @returns Todo item
 */
function createTodo(task: string): Todo {
  return { id: createID(), task, done: false };
}

export class TodoService {
  private _todos$;
  private _task$;
  private _getTodos;
  private _saveTodos;
  private _resetTodos;

  /**
   * Manages a collection of todo items and a task input field.
   * @param api collection of api calls
   */
  constructor(api: API) {
    this._todos$ = new BehaviorSubject<Todo[]>([]);
    this._task$ = new BehaviorSubject<string>("");
    this._saveTodos = new Task(api.saveTodos);
    this._resetTodos = new Task(api.resetTodos);
    this._getTodos = new Task(api.getTodos, defaultRetry);

    // Assign getTodo results to local state.
    this._getTodos.results$.subscribe((result) => {
      this._todos$.next(result.data);
    });

    // Refetch todos from server after mutations.
    merge(this._saveTodos.results$, this._resetTodos.results$).subscribe(() => {
      this._getTodos.run();
    });
  }

  // getters

  get state$() {
    return combineLatest({ todos: this._todos$, task: this._task$ }).pipe(memo());
  }

  get todos$() {
    return this._todos$.pipe(memo());
  }

  get task$() {
    return this._task$.pipe(memo());
  }

  get getLoading$() {
    return this._getTodos.pending$.pipe(memo());
  }

  get saveLoading$() {
    return this._saveTodos.pending$.pipe(memo());
  }

  get resetLoading$() {
    return this._resetTodos.pending$.pipe(memo());
  }

  get loading$() {
    return combineLatest([this._getTodos.pending$, this._saveTodos.pending$, this._resetTodos.pending$]).pipe(
      memo((streams) => streams.some(Boolean))
    );
  }

  // react adapters

  useState() {
    return useObservableState(this.state$, { todos: this._todos$.value, task: this._task$.value });
  }

  useTodos() {
    return useObservableState(this.todos$, this._todos$.value);
  }

  useTask() {
    return useObservableState(this.task$, this._task$.value);
  }

  useGetLoading() {
    return useObservableState(this.getLoading$, false);
  }

  useSaveLoading() {
    return useObservableState(this.saveLoading$, false);
  }

  useResetLoading() {
    return useObservableState(this.resetLoading$, false);
  }

  useLoading() {
    return useObservableState(this.loading$, false);
  }

  // methods

  /**
   * Fetches todos from mock server. Reading of results stream is defined in the constructor.
   */
  getTodos() {
    this._getTodos.run();
  }

  useGetTodos() {
    return useEffect(() => {
      this.getTodos();
    }, []);
  }

  /**
   * Saves current todo collection to mock server.
   */
  saveTodos() {
    this._saveTodos.run(this._todos$.value);
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
  setTask(value: string) {
    this._task$.next(value);
  }

  /**
   * Adds a new todo to the local collection. Uses the current taskInput value and resets it.
   */
  addTodo() {
    const newTodo = createTodo(this._task$.value);
    const nextTodos = [...this._todos$.value, newTodo];
    this._todos$.next(nextTodos);
    this._task$.next("");
  }

  /**
   * Removes a todo from the local todo collection.
   * @param id Todo identifier
   */
  removeTodo(id: string) {
    const nextTodos = this._todos$.value.filter((item) => item.id !== id);
    this._todos$.next(nextTodos);
  }

  /**
   * Toggles the done state of a todo item.
   * @param id Todo identifier
   */
  toggleDone(id: string) {
    const nextTodos = this._todos$.value.map((item) => {
      return item.id === id ? { ...item, done: !item.done } : item;
    });
    this._todos$.next(nextTodos);
  }
}

import produce from "immer";
import { firstValueFrom, map, timer } from "rxjs";
import { ChecklistItem } from "../services/checklist";
import checklistJson from "./checklist.json";

let checklist = checklistJson.checklist as ChecklistItem[];
const mockDelay = 1000;

export interface Response<T> {
  data: T;
}

export function toData<T>(value: { data: T }) {
  return value.data;
}

export function toSomeTrue(bools: boolean[]) {
  return bools.some(Boolean);
}

function mockRequest<T>(func: () => Response<T>) {
  return timer(mockDelay).pipe(map(func));
}

function mockPromise<T>(func: () => Response<T>) {
  return firstValueFrom(timer(mockDelay).pipe(map(func)));
}

function getTodosAsync() {
  return mockPromise(() => {
    return { data: checklist } as Response<ChecklistItem[]>;
  });
}

function getTodos() {
  return mockRequest(() => {
    return { data: checklist } as Response<ChecklistItem[]>;
  });
}

function addTodo(newTodo: ChecklistItem) {
  return mockRequest(() => {
    checklist = checklist.concat(newTodo);
    return { data: checklist } as Response<ChecklistItem[]>;
  });
}

function removeTodo(id: string) {
  return mockRequest(() => {
    checklist = checklist.filter((t) => t.id !== id);
    return { data: checklist } as Response<ChecklistItem[]>;
  });
}

function checkTodo(id: string) {
  return mockRequest(() => {
    checklist = produce(checklist, (draft) => {
      const index = draft.findIndex((t) => t.id === id);
      if (index !== -1) draft[index].done = !draft[index].done;
    });
    return { data: checklist } as Response<ChecklistItem[]>;
  });
}

function resetTodos() {
  return mockRequest(() => {
    checklist = checklistJson.checklist;
    return { data: checklist } as Response<ChecklistItem[]>;
  });
}

function saveTodos(newTodos: ChecklistItem[]) {
  return mockRequest(() => {
    checklist = newTodos;
    return { data: checklist } as Response<ChecklistItem[]>;
  });
}

/**
 * Collection of data fetching operations each wrapped in its own Task handler.
 * Wrapping could also be done locally in services to give each service their own
 * instance of the task pipeline.
 */
export const api = {
  getTodos,
  addTodo,
  removeTodo,
  checkTodo,
  resetTodos,
  saveTodos,
  getTodosAsync,
};

export type API = typeof api;

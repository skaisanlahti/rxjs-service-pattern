import { BehaviorSubject, Subject, combineLatest, map, merge, switchMap, tap } from "rxjs";
import createID from "../../utilities/create-id";
import { emit, update, useBehaviorSubject } from "../../utilities/stream-utils";
import { Task } from "../../utilities/task";
import { api, toData, toSomeTrue } from "../data-access/checklist-data";
import { Service } from "./service";

export type ChecklistItem = {
  id: string;
  task: string;
  done: boolean;
};

function createItem(task: string): ChecklistItem {
  return { id: createID(), task, done: false };
}

function excludeId(id: string) {
  return (item: { id: string }) => item.id !== id;
}

function toggleDoneIfMatch(id: string) {
  return (item: ChecklistItem) => (item.id === id ? { ...item, done: !item.done } : item);
}

function addItem([item, items]: [ChecklistItem, ChecklistItem[]]) {
  return items.concat(item);
}

function removeItem([id, items]: [string, ChecklistItem[]]) {
  return items.filter(excludeId(id));
}

function toggleItem([id, items]: [string, ChecklistItem[]]) {
  return items.map(toggleDoneIfMatch(id));
}

class ChecklistState {
  readonly items = new BehaviorSubject<ChecklistItem[]>([]);
  readonly loading = new BehaviorSubject(false);
}

class ChecklistEvents {
  readonly itemSubmitted = new Subject<string>();
  readonly itemRemoved = new Subject<string>();
  readonly itemToggled = new Subject<string>();
  readonly checklistRequested = new Subject<void>();
  readonly checklistReset = new Subject<void>();
  readonly checklistSaved = new Subject<ChecklistItem[]>();
}

class ChecklistTasks {
  readonly getChecklist = new Task(api.getTodos);
  readonly resetChecklist = new Task(api.resetTodos);
  readonly saveChecklist = new Task(api.saveTodos);
}

class ChecklistService extends Service {
  constructor(
    public readonly state: ChecklistState,
    public readonly events: ChecklistEvents,
    public readonly tasks: ChecklistTasks
  ) {
    super();
    const handleItemSubmitted = events.itemSubmitted.pipe(map(createItem), update(state.items, addItem));
    const handleItemRemoved = events.itemRemoved.pipe(update(state.items, removeItem));
    const handleItemToggled = events.itemToggled.pipe(update(state.items, toggleItem));
    const handleGetChecklistResults = tasks.getChecklist.results.pipe(map(toData), tap(emit(state.items)));
    const handleRefetchChecklist = merge(tasks.resetChecklist.results, tasks.saveChecklist.results).pipe(
      switchMap(() => tasks.getChecklist.buildTask())
    );

    const handleLoadingState = combineLatest([
      tasks.getChecklist.pending,
      tasks.resetChecklist.pending,
      tasks.saveChecklist.pending,
    ]).pipe(map(toSomeTrue), tap(emit(state.loading)));

    this.handleEvents = merge(
      handleItemSubmitted,
      handleItemRemoved,
      handleItemToggled,
      handleGetChecklistResults,
      handleRefetchChecklist,
      handleLoadingState
    );
  }
}

class ChecklistFacade {
  constructor(public readonly service: ChecklistService) {}

  useItems() {
    return useBehaviorSubject(this.service.state.items);
  }

  useLoading() {
    return useBehaviorSubject(this.service.state.loading);
  }

  submitItem(task: string) {
    this.service.events.itemSubmitted.next(task);
  }

  removeItem(id: string) {
    this.service.events.itemRemoved.next(id);
  }

  toggleItem(id: string) {
    this.service.events.itemToggled.next(id);
  }

  getChecklist() {
    return this.service.tasks.getChecklist.buildTask().subscribe();
  }

  saveChecklist() {
    return this.service.tasks.saveChecklist.buildTask(this.service.state.items.value).subscribe();
  }

  resetChecklist() {
    return this.service.tasks.resetChecklist.buildTask().subscribe();
  }
}

export function buildChecklist() {
  const checklistService = new ChecklistService(new ChecklistState(), new ChecklistEvents(), new ChecklistTasks());
  const checklist = new ChecklistFacade(checklistService);
  return { checklist, checklistService };
}

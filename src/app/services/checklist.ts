import { combineLatest, distinctUntilChanged, map, merge, switchMap, tap } from "rxjs";
import createID from "../../utilities/create-id";
import { StateContainer } from "../../utilities/state";
import { DataService, toSomeTrue } from "../data-access/checklist-data";
import { Service } from "./service";

export type ChecklistItem = {
  id: string;
  task: string;
  done: boolean;
};

export type ChecklistState = {
  items: ChecklistItem[];
  loading: boolean;
};

export type ChecklistMethods = Omit<ChecklistService, "state">;

export class ChecklistService extends Service {
  state = new StateContainer<ChecklistState>({ items: [], loading: false });

  constructor(private dataService: DataService) {
    super();

    this.handleEvents = merge(
      dataService.getChecklist.results.pipe(tap((result) => this.state.set({ items: result.data }))),

      merge(dataService.resetChecklist.results, dataService.saveChecklist.results).pipe(
        switchMap(() => dataService.getChecklist.buildTask())
      ),

      combineLatest([
        dataService.resetChecklist.pending,
        dataService.saveChecklist.pending,
        dataService.getChecklist.pending,
      ]).pipe(
        map(toSomeTrue),
        distinctUntilChanged(),
        tap((loading) => this.state.set({ loading }))
      )
    );

    this.start();
  }

  addItem(task: string) {
    const newItem = createItem(task);
    this.state.produce((draft) => {
      draft.items = [...draft.items, newItem];
    });
  }

  removeItem(id: string) {
    this.state.produce((draft) => {
      draft.items = draft.items.filter((item) => item.id !== id);
    });
  }

  toggleItem(id: string) {
    this.state.produce((draft) => {
      const index = draft.items.findIndex((item) => item.id === id);
      draft.items[index].done = !draft.items[index].done;
    });
  }

  getChecklist() {
    this.dataService.getChecklist.buildTask().subscribe();
  }

  saveChecklist() {
    this.dataService.saveChecklist.buildTask(this.state.value.items).subscribe();
  }

  resetChecklist() {
    this.dataService.resetChecklist.buildTask().subscribe();
  }
}

function createItem(task: string): ChecklistItem {
  return { id: createID(), task, done: false };
}

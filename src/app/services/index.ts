import { useObservable, useObservableState } from "observable-hooks";
import { BehaviorSubject, combineLatest, distinctUntilChanged, map } from "rxjs";
import createTypedContext from "../../utilities/create-typed-context";
import { api, buildDataService } from "../data-access/checklist-data";
import { ChecklistMethods, ChecklistService, ChecklistState } from "./checklist";
import { CounterMethods, CounterService, CounterState } from "./counter";

type StoreState = { checklist: ChecklistState; counter: CounterState };
type StoreMethods = { checklist: ChecklistMethods; counter: CounterMethods };

class StoreAdapter {
  state = new BehaviorSubject<StoreState>({ checklist: { items: [], loading: false }, counter: { count: 0 } });
  methods: StoreMethods;

  constructor(checklistService: ChecklistService, counterService: CounterService) {
    combineLatest([checklistService.state.valueChanges, counterService.state.valueChanges])
      .pipe(
        map(([checklist, counter]) => ({
          checklist,
          counter,
        }))
      )
      .subscribe(this.state);

    this.methods = { checklist: checklistService, counter: counterService };
  }
}

const dataService = buildDataService(api);
const counterService = new CounterService();
const checklistService = new ChecklistService(dataService);

export const store = new StoreAdapter(checklistService, counterService);

export const [useStore, StoreProvider] = createTypedContext<StoreAdapter>();

export function useAdapter<Slice>(selector: (state: StoreState) => Slice) {
  const store = useStore();
  const observableSlice = useObservable(() => store.state.pipe(map(selector), distinctUntilChanged()));
  return useObservableState(observableSlice, selector(store.state.value));
}

export function useMethods() {
  const store = useStore();
  return store.methods;
}

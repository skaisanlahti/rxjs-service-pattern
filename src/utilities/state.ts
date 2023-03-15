import produce from "immer";
import { BehaviorSubject } from "rxjs";
import { memo } from "./stream-utils";

export class StateContainer<State> {
  private readonly state;

  constructor(initialState: State) {
    this.state = new BehaviorSubject<State>(initialState);
  }

  get value() {
    return this.state.value;
  }

  get valueChanges() {
    return this.state.pipe(memo());
  }

  select<Slice>(selector: (state: State) => Slice) {
    return this.state.pipe(memo(selector));
  }

  set(update: Partial<State> | ((state: State) => State)) {
    if (update instanceof Function) {
      this.state.next(update(this.state.value));
    } else {
      this.state.next({ ...this.state.value, ...update });
    }
  }

  produce(recipe: (draft: State) => void) {
    this.state.next(produce(this.state.value, recipe));
  }
}

function mergeStateUpdate<State>(target: BehaviorSubject<State>, value: Partial<State>) {
  target.next({ ...target.value, ...value });
}

function createNextState<T>(target: BehaviorSubject<T>, stateFactory: (state: T) => T) {
  target.next(stateFactory(target.value));
}

export function createObservableState<T>(init: T) {
  const state = new BehaviorSubject<T>(init);

  const container = {
    value: state.value,

    stream: state,

    valueChanges: state,

    select<R>(selector: (state: T) => R) {
      return state.pipe(memo(selector));
    },

    get() {
      return state.value;
    },

    set(update: Partial<T> | ((state: T) => T)) {
      if (update instanceof Function) {
        createNextState(state, update);
      } else {
        mergeStateUpdate(state, update);
      }
    },

    produce(recipe: (draft: T) => void) {
      state.next(produce(state.value, recipe));
    },
  };

  return container;
}

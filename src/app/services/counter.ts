import { StateContainer } from "../../utilities/state";

export type CounterState = {
  count: number;
};

export type CounterMethods = Omit<CounterService, "state">;

export class CounterService {
  state = new StateContainer<CounterState>({ count: 0 });

  increment(amount: number) {
    this.state.produce((draft) => {
      draft.count = draft.count + amount;
    });
  }

  decrement(amount: number) {
    this.state.produce((draft) => {
      draft.count = draft.count - amount;
    });
  }

  multiply(multiplier: number) {
    this.state.produce((draft) => {
      draft.count = draft.count * multiplier;
    });
  }

  reset() {
    this.state.produce((draft) => {
      draft.count = 0;
    });
  }
}

import { StateService } from './state-service';

export interface CounterState {
  count: number;
}

const initialState: CounterState = { count: 0 };

export class CounterService extends StateService<CounterState> {
  constructor() {
    super(initialState);
  }

  get count$() {
    return this.createSelector((s) => s.count);
  }

  get double$() {
    return this.createSelector((s) => s.count * 2);
  }

  increment(amount: number) {
    this.setState((draft) => {
      draft.count = draft.count + amount;
    });
  }

  decrement(amount: number) {
    this.setState((draft) => {
      draft.count = draft.count - amount;
    });
  }

  multiply(amount: number) {
    this.setState((draft) => {
      draft.count = draft.count * amount;
    });
  }

  reset() {
    this.setState((draft) => {
      draft.count = 0;
    });
  }
}

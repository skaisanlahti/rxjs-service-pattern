import StatefulService from '../../utilities/stateful-service';

export interface CounterState {
  count: number;
}

const initialState: CounterState = { count: 0 };

export class CounterService extends StatefulService<CounterState> {
  /**
   * Manages a count value.
   */
  constructor() {
    super(initialState);
  }

  /**
   * Observable count value.
   */
  get count$() {
    return this.createSelector((s) => s.count);
  }

  /**
   * Derived observable value.
   */
  get double$() {
    return this.createSelector((s) => s.count * 2);
  }

  /**
   * Increments count by an amount.
   * @param amount number
   */
  increment(amount: number) {
    this.setState((state) => {
      state.count = state.count + amount;
    });
  }

  /**
   * Decrements count by an amount.
   * @param amount number
   */
  decrement(amount: number) {
    this.setState((state) => {
      state.count = state.count - amount;
    });
  }

  /**
   * Multiplies count by an amount.
   * @param amount number
   */
  multiply(amount: number) {
    this.setState((state) => {
      state.count = state.count * amount;
    });
  }

  /**
   * Resets count value to 0.
   */
  reset() {
    this.setState((state) => {
      state.count = 0;
    });
  }
}

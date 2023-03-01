import State from '../../utilities/state';

interface CounterState {
  count: number;
}

const initialState: CounterState = { count: 0 };

export class CounterService {
  private _state = new State(initialState);

  /**
   * Manages a count value.
   */
  constructor() {}

  /**
   * Observable count value.
   */
  get count$() {
    return this._state.toStream((s) => s.count);
  }

  /**
   * Derived observable value.
   */
  get double$() {
    return this._state.toStream((s) => s.count * 2);
  }

  /**
   * Increments count by an amount.
   * @param amount number
   */
  increment(amount: number) {
    this._state.set((state) => {
      state.count = state.count + amount;
    });
  }

  /**
   * Decrements count by an amount.
   * @param amount number
   */
  decrement(amount: number) {
    this._state.set((state) => {
      state.count = state.count - amount;
    });
  }

  /**
   * Multiplies count by an amount.
   * @param amount number
   */
  multiply(amount: number) {
    this._state.set((state) => {
      state.count = state.count * amount;
    });
  }

  /**
   * Sets count to value.
   * @param value number
   */
  setCount(value: number) {
    this._state.set((state) => {
      state.count = value;
    });
  }
}

import { State } from '../../utilities/state';

interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 0,
};

function CounterService(state: State<CounterState>) {
  const count$ = state.toStream((state) => state.count);
  const double$ = state.toStream((state) => state.count * 2);

  function increment(amount: number) {
    state.set((state) => {
      state.count = state.count + amount;
    });
  }

  function decrement(amount: number) {
    state.set((state) => {
      state.count = state.count - amount;
    });
  }

  function multiply(amount: number) {
    state.set((state) => {
      state.count = state.count * amount;
    });
  }

  function setCount(value: number) {
    state.set((state) => {
      state.count = value;
    });
  }

  return {
    count$,
    double$,
    increment,
    decrement,
    multiply,
    setCount,
  };
}

export const counterService = CounterService(State(initialState));

import { useObservableState } from "observable-hooks";
import { BehaviorSubject } from "rxjs";
import { memo } from "../../utilities/stream-utils";

export class CounterService {
  private _count$;

  /**
   * Manages a count state.
   */
  constructor() {
    this._count$ = new BehaviorSubject(0);
  }

  get count$() {
    return this._count$.pipe(memo());
  }

  get double$() {
    return this._count$.pipe(memo((count) => count * 2));
  }

  useCount(mapFn?: (count: number) => number) {
    if (mapFn) return useObservableState(this._count$.pipe(memo(mapFn)), this._count$.value);
    return useObservableState(this.count$.pipe(memo()), this._count$.value);
  }

  /**
   * Increments count by an amount.
   * @param amount number
   */
  increment(amount: number) {
    this._count$.next(this._count$.value + amount);
  }

  /**
   * Decrements count by an amount.
   * @param amount number
   */
  decrement(amount: number) {
    this._count$.next(this._count$.value - amount);
  }

  /**
   * Multiplies count by an amount.
   * @param amount number
   */
  multiply(amount: number) {
    this._count$.next(this._count$.value * amount);
  }

  /**
   * Sets count to value.
   * @param value number
   */
  setCount(value: number) {
    this._count$.next(value);
  }
}

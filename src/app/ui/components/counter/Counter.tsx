import { useAdapter, useMethods } from "../../../services";
import Count from "./Count";

export default function Counter() {
  const methods = useMethods();
  const count = useAdapter((s) => s.counter.count);
  const double = count * 2;

  function plusClicked() {
    methods.counter.increment(1);
  }

  function minusClicked() {
    methods.counter.decrement(1);
  }

  function doubleClicked() {
    methods.counter.multiply(2);
  }

  function resetClicked() {
    methods.counter.reset();
  }

  return (
    <section className="counter">
      <Count value={count} />
      <Count value={double} />
      <section className="counter_controls">
        <button className="button" onClick={plusClicked}>
          +
        </button>
        <button className="button" onClick={minusClicked}>
          -
        </button>
        <button className="button" onClick={doubleClicked}>
          x 2
        </button>
        <button className="button" onClick={resetClicked}>
          Reset
        </button>
      </section>
    </section>
  );
}

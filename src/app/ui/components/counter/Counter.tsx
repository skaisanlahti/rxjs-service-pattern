import { useApp } from "../../../services";
import Count from "./Count";

export default function Counter() {
  const { counter } = useApp();
  const count = counter.useCount();
  const double = count * 2;

  return (
    <section className="counter">
      <Count value={count} />
      <Count value={double} />
      <section className="counter_controls">
        <button className="button" onClick={() => counter.add()}>
          +
        </button>
        <button className="button" onClick={() => counter.subtract()}>
          -
        </button>
        <button className="button" onClick={() => counter.double()}>
          x 2
        </button>
        <button className="button" onClick={() => counter.reset()}>
          Reset
        </button>
      </section>
    </section>
  );
}

import { useServices } from "../../../services";
import Count from "./Count";

export default function Counter() {
  const { counterService } = useServices();
  const count = counterService.useCount();
  const double = counterService.useCount((count) => count * 2);

  return (
    <section className="counter">
      <Count value={count} />
      <Count value={double} />
      <section className="counter_controls">
        <button className="button" onClick={() => counterService.increment(1)}>
          +
        </button>
        <button className="button" onClick={() => counterService.decrement(1)}>
          -
        </button>
        <button className="button" onClick={() => counterService.multiply(2)}>
          x 2
        </button>
        <button className="button" onClick={() => counterService.setCount(0)}>
          Reset
        </button>
      </section>
    </section>
  );
}

import { useServices } from '../../../services';
import Count from './Count';

export default function Counter() {
  const { increment, decrement, setCount, count$, double$ } =
    useServices().counter;

  return (
    <section className="counter">
      <Count count$={count$} />
      <Count count$={double$} />
      <section className="counter_controls">
        <button className="button" onClick={() => increment(1)}>
          +
        </button>
        <button className="button" onClick={() => decrement(1)}>
          -
        </button>
        <button className="button" onClick={() => setCount(0)}>
          Reset
        </button>
      </section>
    </section>
  );
}

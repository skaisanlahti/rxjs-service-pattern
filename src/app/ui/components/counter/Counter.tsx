import { useServices } from '../../../services';
import Count from './Count';

export default function Counter() {
  const { counter } = useServices();

  return (
    <section className="counter">
      <Count count$={counter.count$} />
      <Count count$={counter.double$} />
      <section className="counter_controls">
        <button className="button" onClick={() => counter.increment(1)}>
          +
        </button>
        <button className="button" onClick={() => counter.decrement(1)}>
          -
        </button>
        <button className="button" onClick={() => counter.setCount(0)}>
          Reset
        </button>
      </section>
    </section>
  );
}

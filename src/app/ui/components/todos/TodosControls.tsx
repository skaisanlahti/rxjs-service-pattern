import useStream from '../../../../utilities/use-stream';
import { useServices } from '../../../services';

export default function TodosControls() {
  const { todos } = useServices();
  const getLoading = useStream(todos.getLoading$, false);
  const saveLoading = useStream(todos.saveLoading$, false);
  const resetLoading = useStream(todos.resetLoading$, false);

  return (
    <section className="todos_controls">
      <button
        disabled={getLoading}
        className="button"
        onClick={() => todos.getTodos()}
      >
        Get todos
      </button>
      <button
        disabled={saveLoading}
        className="button"
        onClick={() => todos.saveTodos()}
      >
        Save todos
      </button>
      <button
        disabled={resetLoading}
        className="button"
        onClick={() => todos.resetTodos()}
      >
        Reset todos
      </button>
    </section>
  );
}

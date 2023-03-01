import useStream from '../../../../utilities/use-stream';
import { useServices } from '../../../services';

export default function TodosForm() {
  const { todos } = useServices();
  const taskInput = useStream(todos.taskInput$, '');

  return (
    <section className="todos_form">
      <input
        className="todos_input"
        placeholder="Task..."
        value={taskInput}
        onKeyDown={(e) => {
          if (e.code === 'Enter') {
            todos.addTodo();
          }
        }}
        onChange={(e) => todos.setTaskInput(e.target.value)}
      />
      <button className="button" onClick={() => todos.addTodo()}>
        Add todo
      </button>
    </section>
  );
}

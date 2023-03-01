import { useEffect } from 'react';
import useStream from '../../../../utilities/use-stream';
import { useServices } from '../../../services';

export default function TodosList() {
  const { todos } = useServices();
  const items = useStream(todos.items$, []);

  useEffect(() => {
    todos.getTodos();
  }, []);

  return (
    <ul className="todos_list">
      {items.map((todo) => (
        <li key={todo.id} className="todos_item">
          <span aria-checked={todo.done} className="todos_item-text">
            {todo.task}
          </span>
          <button className="button" onClick={() => todos.toggleDone(todo.id)}>
            Done
          </button>
          <button className="button" onClick={() => todos.removeTodo(todo.id)}>
            X
          </button>
        </li>
      ))}
    </ul>
  );
}

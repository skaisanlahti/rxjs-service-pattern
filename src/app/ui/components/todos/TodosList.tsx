import { useServices } from "../../../services";
import Loader from "../loader/Loader";

export default function TodosList() {
  const { todoService } = useServices();
  const todos = todoService.useTodos();
  const loading = todoService.useLoading();
  todoService.useGetTodos();

  return (
    <Loader loading={loading}>
      <ul className="todos_list">
        {todos.map((item) => (
          <li key={item.id} className="todos_item">
            <span aria-checked={item.done} className="todos_item-text">
              {item.task}
            </span>
            <button className="button" onClick={() => todoService.toggleDone(item.id)}>
              Done
            </button>
            <button className="button" onClick={() => todoService.removeTodo(item.id)}>
              X
            </button>
          </li>
        ))}
      </ul>
    </Loader>
  );
}

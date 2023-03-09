import { useServices } from "../../../services";

export default function TodosForm() {
  const { todoService } = useServices();
  const task = todoService.useTask();

  return (
    <section className="todos_form">
      <input
        className="todos_input"
        placeholder="Task..."
        value={task}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            todoService.addTodo();
          }
        }}
        onChange={(e) => todoService.setTask(e.target.value)}
      />
      <button className="button" onClick={() => todoService.addTodo()}>
        Add todo
      </button>
    </section>
  );
}

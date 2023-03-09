import { useServices } from "../../../services";

export default function TodosControls() {
  const { todoService } = useServices();
  const getLoading = todoService.useGetLoading();
  const saveLoading = todoService.useSaveLoading();
  const resetLoading = todoService.useResetLoading();

  return (
    <section className="todos_controls">
      <button disabled={getLoading} className="button" onClick={() => todoService.getTodos()}>
        Get todos
      </button>
      <button disabled={saveLoading} className="button" onClick={() => todoService.saveTodos()}>
        Save todos
      </button>
      <button disabled={resetLoading} className="button" onClick={() => todoService.resetTodos()}>
        Reset todos
      </button>
    </section>
  );
}

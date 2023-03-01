import TodosControls from './TodosControls';
import TodosForm from './TodosForm';
import TodosList from './TodosList';

export default function Todos() {
  return (
    <section className="todos">
      <TodosForm />
      <TodosControls />
      <TodosList />
    </section>
  );
}

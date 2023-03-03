import Counter from './components/counter/Counter';
import Todos from './components/todos/Todos';

export function Root() {
  return (
    <div className="layout">
      <header className="layout_header">
        <h1 className="layout_title">State management strategies</h1>
      </header>
      <main className="layout_content">
        <Counter />
        <Todos />
      </main>
    </div>
  );
}

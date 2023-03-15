import Checklist from "./components/checklist/Checklist";
import Counter from "./components/counter/Counter";

export function Root() {
  return (
    <div className="layout">
      <header className="layout_header">
        <h1 className="layout_title">State management strategies</h1>
      </header>
      <main className="layout_content">
        <Counter />
        <Checklist />
      </main>
    </div>
  );
}

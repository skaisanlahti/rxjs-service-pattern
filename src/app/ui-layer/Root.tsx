import { useEffect } from 'react';
import { useServices } from '../app-layer/create-services';
import { useServiceState } from '../app-layer/utils';

export function Root() {
  const { counter, todos } = useServices();

  const count = useServiceState(counter.count$, 0);
  const double = useServiceState(counter.double$, 0);

  const taskField = useServiceState(todos.taskField$, '');
  const todoItems = useServiceState(todos.items$, []);
  const getLoading = useServiceState(todos.getLoading$, false);
  const saveLoading = useServiceState(todos.saveLoading$, false);
  const resetLoading = useServiceState(todos.resetLoading$, false);

  useEffect(() => {
    todos.getTodos();
  }, []);

  return (
    <div className="main-layout">
      <header className="header">
        <h1 className="title">State management strategies</h1>
      </header>
      <main className="content">
        <p className="count">{count}</p>
        <p className="count">{double}</p>
        <section className="count-buttons">
          <button className="button" onClick={() => counter.increment(1)}>
            +
          </button>
          <button className="button" onClick={() => counter.decrement(1)}>
            -
          </button>
          <button className="button" onClick={() => counter.reset()}>
            Reset
          </button>
        </section>
        <input
          className="todo-input"
          placeholder="Task..."
          value={taskField}
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              todos.addTodo();
            }
          }}
          onChange={(e) => todos.setTaskField(e.target.value)}
        />
        <div>
          <button className="button" onClick={() => todos.addTodo()}>
            Add todo
          </button>
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
        </div>
        <ul className="todo-list">
          {todoItems.map((todo) => (
            <li key={todo.id} className="todo-item">
              <div aria-checked={todo.done} className="task-text">
                {todo.task}
              </div>
              <button
                className="button"
                onClick={() => todos.finishTodo(todo.id)}
              >
                Done
              </button>
              <button
                className="button"
                onClick={() => todos.removeTodo(todo.id)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

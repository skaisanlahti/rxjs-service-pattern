import { useEffect } from 'react';
import useStream from '../../utilities/use-service-state';
import { useServices } from '../services/create-services';

export function Root() {
  // get access to services through a hook
  const { counter, todos } = useServices();

  // observe service state by assigning its value to local component state
  const count = useStream(counter.count$, 0);
  const double = useStream(counter.double$, 0);
  const taskInput = useStream(todos.taskInput$, '');
  const todoItems = useStream(todos.items$, []);
  const getLoading = useStream(todos.getLoading$, false);
  const saveLoading = useStream(todos.saveLoading$, false);
  const resetLoading = useStream(todos.resetLoading$, false);

  useEffect(() => {
    // fetch data by running a task
    // state and canceling is handled internally by the task
    todos.getTodos();
  }, []);

  // user service methods in click handlers to handle user actions
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
          value={taskInput}
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              todos.addTodo();
            }
          }}
          onChange={(e) => todos.setTaskInput(e.target.value)}
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
                onClick={() => todos.toggleDone(todo.id)}
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

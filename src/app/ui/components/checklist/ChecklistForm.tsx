import { useState } from "react";
import { useApp } from "../../../services";

export default function ChecklistForm() {
  const { checklist } = useApp();
  const loading = checklist.useLoading();
  const [task, setTask] = useState("");

  function submit() {
    checklist.submitItem(task);
    setTask("");
  }

  return (
    <section className="checklist_form">
      <input
        className="checklist_input"
        placeholder="Task..."
        disabled={loading}
        value={task}
        onChange={getValue(setTask)}
        onKeyDown={onKey("Enter", submit)}
      />
      <button className="button" disabled={loading} onClick={submit}>
        Add todo
      </button>
    </section>
  );
}

function onKey(code: string, fn: (event?: React.KeyboardEvent<HTMLInputElement>) => void) {
  return (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code !== code) return;
    fn(event);
  };
}

function getValue(set: React.Dispatch<React.SetStateAction<string>>) {
  return (event: React.ChangeEvent<HTMLInputElement>) => set(event.target.value);
}

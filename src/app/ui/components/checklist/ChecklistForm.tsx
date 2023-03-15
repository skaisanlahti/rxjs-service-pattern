import { useState } from "react";
import { useAdapter, useMethods } from "../../../services";

export default function ChecklistForm() {
  const methods = useMethods();
  const loading = useAdapter((s) => s.checklist.loading);
  const [task, setTask] = useState("");

  function itemSubmitClicked() {
    methods.checklist.addItem(task);
    setTask("");
  }
  const itemSubmitEnterPushed = itemSubmitClicked;

  return (
    <section className="checklist_form">
      <input
        className="checklist_input"
        placeholder="Task..."
        disabled={loading}
        value={task}
        onChange={getValue(setTask)}
        onKeyDown={onKey("Enter", itemSubmitEnterPushed)}
      />
      <button className="button" disabled={loading} onClick={itemSubmitClicked}>
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

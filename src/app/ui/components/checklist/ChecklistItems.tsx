import { useEffect } from "react";
import { useAdapter, useMethods } from "../../../services";
import Loader from "../loader/Loader";

export default function ChecklistItems() {
  const methods = useMethods();
  const items = useAdapter((s) => s.checklist.items);
  const loading = useAdapter((s) => s.checklist.loading);

  useEffect(() => {
    methods.checklist.getChecklist();
  }, [methods.checklist]);

  function itemDoneClicked(id: string) {
    methods.checklist.toggleItem(id);
  }

  function removeItemClicked(id: string) {
    methods.checklist.removeItem(id);
  }

  return (
    <Loader loading={loading}>
      <ul className="checklist_list">
        {items.map((item) => (
          <li key={item.id} className="checklist_item">
            <span aria-checked={item.done} className="checklist_item-text">
              {item.task}
            </span>
            <button className="button" onClick={() => itemDoneClicked(item.id)}>
              Done
            </button>
            <button className="button" onClick={() => removeItemClicked(item.id)}>
              X
            </button>
          </li>
        ))}
      </ul>
    </Loader>
  );
}

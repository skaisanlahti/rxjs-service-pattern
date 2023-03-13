import { useEffect } from "react";
import { useBehaviorSubject } from "../../../../utilities/stream-utils";
import { useApp } from "../../../services";
import Loader from "../loader/Loader";

export default function ChecklistItems() {
  const { checklist, counter } = useApp();
  const items = checklist.useItems();
  const loading = checklist.useLoading();

  const value = useBehaviorSubject(counter.service.state.count);
  useEffect(() => {
    console.log("value", value);
  }, [value]);

  useEffect(() => {
    checklist.getChecklist();
  }, [checklist]);

  return (
    <Loader loading={loading}>
      <ul className="checklist_list">
        {items.map((item) => (
          <li key={item.id} className="checklist_item">
            <span aria-checked={item.done} className="checklist_item-text">
              {item.task}
            </span>
            <button className="button" onClick={() => checklist.toggleItem(item.id)}>
              Done
            </button>
            <button className="button" onClick={() => checklist.removeItem(item.id)}>
              X
            </button>
          </li>
        ))}
      </ul>
    </Loader>
  );
}

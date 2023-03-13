import { useApp } from "../../../services";

export default function ChecklistControls() {
  const { checklist } = useApp();
  const loading = checklist.useLoading();

  return (
    <section className="checklist_controls">
      <button disabled={loading} className="button" onClick={() => checklist.getChecklist()}>
        Get checklist
      </button>
      <button disabled={loading} className="button" onClick={() => checklist.saveChecklist()}>
        Save checklist
      </button>
      <button disabled={loading} className="button" onClick={() => checklist.resetChecklist()}>
        Reset checklist
      </button>
    </section>
  );
}

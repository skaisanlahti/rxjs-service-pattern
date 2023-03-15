import { useAdapter, useMethods } from "../../../services";

export default function ChecklistControls() {
  const methods = useMethods();
  const loading = useAdapter((s) => s.checklist.loading);

  function getChecklistClicked() {
    methods.checklist.getChecklist();
  }

  function resetChecklistClicked() {
    methods.checklist.resetChecklist();
  }

  function saveChecklistClicked() {
    methods.checklist.saveChecklist();
  }

  return (
    <section className="checklist_controls">
      <button disabled={loading} className="button" onClick={getChecklistClicked}>
        Get checklist
      </button>
      <button disabled={loading} className="button" onClick={saveChecklistClicked}>
        Save checklist
      </button>
      <button disabled={loading} className="button" onClick={resetChecklistClicked}>
        Reset checklist
      </button>
    </section>
  );
}

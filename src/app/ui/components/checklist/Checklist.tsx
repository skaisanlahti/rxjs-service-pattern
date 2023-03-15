import ChecklistControls from "./ChecklistControls";
import ChecklistForm from "./ChecklistForm";
import ChecklistItems from "./ChecklistItems";

export default function Checklist() {
  return (
    <section className="checklist">
      <ChecklistForm />
      <ChecklistControls />
      <ChecklistItems />
    </section>
  );
}

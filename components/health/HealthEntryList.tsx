import { HealthEntry } from "@/models/HealthEntry";
import HealthEntryItem from "./HealthEntryItem";

interface Props {
  entries: HealthEntry[];
  onDelete: (id: string) => void;
}

export default function HealthEntryList({ entries, onDelete }: Props) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <>
      {sorted.map((entry) => (
        <HealthEntryItem key={entry.id} entry={entry} onDelete={onDelete} />
      ))}
    </>
  );
}

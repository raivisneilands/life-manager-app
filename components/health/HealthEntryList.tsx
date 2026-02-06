import { HealthEntry } from '@/models/HealthEntry';
import styled from '@emotion/native';
import HealthEntryItem from './HealthEntryItem';

interface Props {
  entries: HealthEntry[];
  onDelete: (id: string) => void;
}

// Optional container to control spacing between entries
const Container = styled.View({
  gap: 12, // spacing between entries
});

export default function HealthEntryList({ entries, onDelete }: Props) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <Container>
      {sorted.map((entry) => (
        <HealthEntryItem key={entry.id} entry={entry} onDelete={onDelete} />
      ))}
    </Container>
  );
}

import { HealthEntry } from '@/models/HealthEntry';
import styled from '@emotion/native';
import SectionCard from './SectionCard';

const CardGrid = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: 12, // optional spacing between cards
});

interface HealthCardProps {
  entry?: HealthEntry;
}

export default function HealthCard({ entry }: HealthCardProps) {
  if (!entry) return <SectionCard label="No health entry yesterday" />;

  return (
    <CardGrid>
      {entry.weight && <SectionCard label="Weight (kg)" value={entry.weight} />}
      {entry.sleepHours && (
        <SectionCard label="Sleep (hrs)" value={entry.sleepHours} />
      )}
      {entry.waterLiters && (
        <SectionCard label="Water (L)" value={entry.waterLiters} />
      )}
      {entry.steps && <SectionCard label="Steps" value={entry.steps} />}
      {entry.calories && (
        <SectionCard label="Calories Burned" value={entry.calories} />
      )}
    </CardGrid>
  );
}

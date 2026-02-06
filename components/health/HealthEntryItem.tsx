import { HealthEntry } from '@/models/HealthEntry';
import formatDateTime from '@/utils/formatDateTime';
import styled from '@emotion/native';
import { EvilIcons } from '@expo/vector-icons';
import { useState } from 'react';

// Theme-aware card for each health entry
const EntryCard = styled.TouchableOpacity<{ expanded?: boolean }>(
  ({ theme }) => ({
    backgroundColor: theme.surface,
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  }),
);

const EntryRow = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 6,
});

const EntryLabel = styled.Text(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.textPrimary,
  marginRight: 10,
}));

const EntryValue = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  textAlign: 'right',
}));

const TrashIcon = styled(EvilIcons)<{ color?: string }>({});

interface Props {
  entry: HealthEntry;
  onDelete: (id: string) => void;
}

export default function HealthEntryItem({ entry, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <EntryCard expanded={expanded} onPress={() => setExpanded(!expanded)}>
      <EntryRow>
        <EntryLabel>Date:</EntryLabel>
        <EntryValue>{formatDateTime(entry.date)}</EntryValue>
      </EntryRow>

      {expanded && (
        <>
          {entry.weight && (
            <EntryRow>
              <EntryLabel>Weight:</EntryLabel>
              <EntryValue>{entry.weight} kg</EntryValue>
            </EntryRow>
          )}
          {entry.sleepHours && (
            <EntryRow>
              <EntryLabel>Sleep:</EntryLabel>
              <EntryValue>{entry.sleepHours} hrs</EntryValue>
            </EntryRow>
          )}
          {entry.waterLiters && (
            <EntryRow>
              <EntryLabel>Water:</EntryLabel>
              <EntryValue>{entry.waterLiters} L</EntryValue>
            </EntryRow>
          )}
          {entry.steps && (
            <EntryRow>
              <EntryLabel>Steps:</EntryLabel>
              <EntryValue>{entry.steps}</EntryValue>
            </EntryRow>
          )}
          {entry.calories && (
            <EntryRow>
              <EntryLabel>Calories:</EntryLabel>
              <EntryValue>{entry.calories}</EntryValue>
            </EntryRow>
          )}
          {entry.notes && (
            <EntryRow>
              <EntryLabel>Notes:</EntryLabel>
              <EntryValue>{entry.notes}</EntryValue>
            </EntryRow>
          )}
          <EntryRow>
            <TrashIcon
              name="trash"
              size={24}
              color="#DC2626" // optional: theme.danger
              onPress={() => onDelete(entry.id)}
            />
          </EntryRow>
        </>
      )}
    </EntryCard>
  );
}

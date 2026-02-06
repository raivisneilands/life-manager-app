import PrimaryButton from '@/components/PrimaryButton';
import { JournalEntry } from '@/models/JournalEntry';
import { useJournalStore } from '@/store/JournalStore';
import formatDateTime from '@/utils/formatDateTime';
import styled from '@emotion/native';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useState } from 'react';

// Theme-aware styled components
const Entry = styled.View(({ theme }) => ({
  backgroundColor: theme.surface,
  borderRadius: 14,
  padding: 14,
  gap: 8,
}));

const Header = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Meta = styled.Text(({ theme }) => ({
  fontSize: 12,
  color: theme.textSecondary,
}));

const EntryText = styled.Text(({ theme }) => ({
  fontSize: 15,
  lineHeight: 20,
  color: theme.textPrimary,
}));

const Actions = styled.View({
  flexDirection: 'row',
  gap: 16,
});

const EditInput = styled.TextInput(({ theme }) => ({
  minHeight: 80,
  fontSize: 15,
  color: theme.textPrimary,
  backgroundColor: theme.surface,
  borderRadius: 12,
  padding: 8,
}));

const Icon = styled(EvilIcons)<{ color?: string }>``;

interface JournalEntryItemProps {
  entry: JournalEntry;
}

export default function JournalEntryItem({ entry }: JournalEntryItemProps) {
  const update = useJournalStore((s) => s.updateEntry);
  const remove = useJournalStore((s) => s.removeEntry);

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(entry.content);

  return (
    <Entry>
      <Header>
        <Meta>{formatDateTime(entry.createdAt)}</Meta>

        {!editing && (
          <Actions>
            <Icon
              name="pencil"
              size={22}
              color="#888" // optional: could use theme.textSecondary
              onPress={() => setEditing(true)}
            />
            <Icon
              name="trash"
              size={22}
              color="#DC2626" // optional: theme.danger
              onPress={() => remove(entry.id)}
            />
          </Actions>
        )}
      </Header>

      {editing ? (
        <>
          <EditInput multiline value={text} onChangeText={setText} />

          <Actions>
            <PrimaryButton
              onPress={() => {
                update(entry.id, text);
                setEditing(false);
              }}
            >
              Save
            </PrimaryButton>

            <PrimaryButton onPress={() => setEditing(false)}>
              Cancel
            </PrimaryButton>
          </Actions>
        </>
      ) : (
        <EntryText>{entry.content}</EntryText>
      )}
    </Entry>
  );
}

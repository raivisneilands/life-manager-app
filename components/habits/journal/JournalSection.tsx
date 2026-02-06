import Title from '@/components/Title';
import { useJournalStore } from '@/store/JournalStore';
import styled from '@emotion/native';
import JournalComposer from './JournalComposer';
import JournalEntryItem from './JournalEntryItem';

// Section container for journal
const Section = styled.View({
  marginTop: 32,
  gap: 16,
});

// Container for the list of entries
const EntryList = styled.View({
  gap: 14,
});

export default function JournalSection() {
  const entries = useJournalStore((s) => s.entries);

  return (
    <Section>
      <Title>Journal</Title>

      <JournalComposer />

      <EntryList>
        {entries.map((entry) => (
          <JournalEntryItem key={entry.id} entry={entry} />
        ))}
      </EntryList>
    </Section>
  );
}

import Title from "@/components/Title";
import { useJournalStore } from "@/store/JournalStore";
import styled from "styled-components/native";
import JournalComposer from "./JournalComposer";
import JournalEntryItem from "./JournalEntryItem";

const Section = styled.View`
  margin-top: 32px;
  gap: 16px;
`;

const EntryList = styled.View`
  gap: 14px;
`;

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

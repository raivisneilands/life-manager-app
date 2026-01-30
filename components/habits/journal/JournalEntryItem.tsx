import PrimaryButton from "@/components/PrimaryButton";
import { JournalEntry } from "@/models/JournalEntry";
import { useJournalStore } from "@/store/JournalStore";
import formatDateTime from "@/utils/formatDateTime";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useState } from "react";
import styled from "styled-components/native";

const Entry = styled.View`
  background-color: #fafafa;
  border-radius: 14px;
  padding: 14px;
  gap: 8px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Meta = styled.Text`
  font-size: 12px;
  color: #888;
`;

const Text = styled.Text`
  font-size: 15px;
  line-height: 20px;
  color: #222;
`;

const Actions = styled.View`
  flex-direction: row;
  gap: 16px;
`;

const EditInput = styled.TextInput`
  min-height: 80px;
  font-size: 15px;
`;

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
            <EvilIcons
              name="pencil"
              size={22}
              color="#666"
              onPress={() => setEditing(true)}
            />
            <EvilIcons
              name="trash"
              size={22}
              color="#c00"
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
        <Text>{entry.content}</Text>
      )}
    </Entry>
  );
}

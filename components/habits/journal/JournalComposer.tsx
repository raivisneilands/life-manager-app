import PrimaryButton from "@/components/PrimaryButton";
import { useJournalStore } from "@/store/JournalStore";
import { useState } from "react";
import styled from "styled-components/native";
import { v4 as uuidv4 } from "uuid";

const Card = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #eee;
  gap: 14px;
`;

const Input = styled.TextInput`
  min-height: 90px;
  font-size: 15px;
  line-height: 20px;
  color: #222;
`;

export default function JournalComposer() {
  const addEntry = useJournalStore((s) => s.addEntry);
  const [text, setText] = useState("");

  const today = new Date().toISOString().split("T")[0];

  return (
    <Card>
      <Input
        placeholder="Write about your day…"
        multiline
        value={text}
        onChangeText={setText}
      />

      <PrimaryButton
        onPress={() => {
          if (!text.trim()) return;

          addEntry({
            id: uuidv4(),
            date: today,
            content: text,
            createdAt: new Date().toISOString(),
          });

          setText("");
        }}
      >
        Save entry
      </PrimaryButton>
    </Card>
  );
}

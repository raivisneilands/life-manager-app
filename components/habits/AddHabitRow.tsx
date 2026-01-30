import PrimaryButton from "@/components/PrimaryButton";
import { Habit } from "@/models/Habit";
import { useHabitStore } from "@/store/HabitStore";
import { useState } from "react";
import styled from "styled-components/native";
import { v4 as uuidv4 } from "uuid";

const Row = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const Input = styled.TextInput`
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px;
  font-size: 15px;
`;

export default function AddHabitRow() {
  const addHabit = useHabitStore((s) => s.addHabit);
  const [text, setText] = useState("");

  return (
    <Row>
      <Input placeholder="Add a habit…" value={text} onChangeText={setText} />

      <PrimaryButton
        onPress={() => {
          if (!text.trim()) return;

          const habit: Habit = {
            id: uuidv4(),
            title: text,
            streak: 0,
          };

          addHabit(habit);
          setText("");
        }}
      >
        Add
      </PrimaryButton>
    </Row>
  );
}

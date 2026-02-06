import PrimaryButton from '@/components/PrimaryButton';
import { Habit } from '@/models/Habit';
import { useHabitStore } from '@/store/HabitStore';
import styled from '@emotion/native';
import * as Crypto from 'expo-crypto';
import { useState } from 'react';

// Row container
const Row = styled.View({
  flexDirection: 'row',
  gap: 12,
});

// Theme-aware input
const Input = styled.TextInput(({ theme }) => ({
  flex: 1,
  borderWidth: 1,
  borderColor: theme.border, // theme-aware border
  borderRadius: 12,
  padding: 12,
  fontSize: 15,
  color: theme.textPrimary, // theme-aware text
  backgroundColor: theme.surface, // optional: input background matches card
}));

export default function AddHabitRow() {
  const addHabit = useHabitStore((s) => s.addHabit);
  const [text, setText] = useState('');

  return (
    <Row>
      <Input
        placeholder="Add a habit…"
        placeholderTextColor="#999" // optional: can theme this too
        value={text}
        onChangeText={setText}
      />

      <PrimaryButton
        onPress={() => {
          if (!text.trim()) return;

          const habit: Habit = {
            id: Crypto.randomUUID(),
            title: text,
            streak: 0,
          };

          addHabit(habit);
          setText('');
        }}
      >
        Add
      </PrimaryButton>
    </Row>
  );
}

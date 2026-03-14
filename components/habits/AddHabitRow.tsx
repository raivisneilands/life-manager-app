import PrimaryButton from '@/components/PrimaryButton';
import { Habit } from '@/models/Habit';
import { useHabitStore } from '@/store/HabitStore';
import styled from '@emotion/native';
import * as Crypto from 'expo-crypto';
import { useState } from 'react';

// Row container
const Row = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
}));

const Input = styled.TextInput(({ theme }) => ({
  flex: 1,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 8,
  padding: 10,
  marginRight: 12,
  backgroundColor: theme.surface,
  color: theme.textPrimary,
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

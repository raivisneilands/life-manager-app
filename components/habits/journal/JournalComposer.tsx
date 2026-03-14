import PrimaryButton from '@/components/PrimaryButton';
import { useJournalStore } from '@/store/JournalStore';
import styled from '@emotion/native';
import * as Crypto from 'expo-crypto';
import { useState } from 'react';

// Theme-aware Card
const Card = styled.View(({ theme }) => ({
  backgroundColor: theme.card, // theme-aware
  borderRadius: 16,
  padding: 16,
  borderWidth: 1,
  borderColor: theme.border, // theme-aware
  gap: 14,
}));

// Theme-aware TextInput
const Input = styled.TextInput(({ theme }) => ({
  minHeight: 90,
  fontSize: 15,
  lineHeight: 20,
  color: theme.textPrimary, // theme-aware
  textAlignVertical: 'top',
  paddingTop: 0,
}));

export default function JournalComposer() {
  const addEntry = useJournalStore((s) => s.addEntry);
  const [text, setText] = useState('');

  const today = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <Input
        placeholder="Write about your day…"
        placeholderTextColor="#999" // optional, can theme this too
        multiline
        value={text}
        onChangeText={setText}
      />

      <PrimaryButton
        onPress={() => {
          if (!text.trim()) return;

          addEntry({
            id: Crypto.randomUUID(),
            date: today,
            content: text,
            createdAt: new Date().toISOString(),
          });

          setText('');
        }}
      >
        Save entry
      </PrimaryButton>
    </Card>
  );
}

import { HealthEntry } from '@/models/HealthEntry';
import styled from '@emotion/native';
import * as Crypto from 'expo-crypto';
import { useState } from 'react';

// Row container
const FormRow = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
});

// Label with theme-aware color
const Label = styled.Text(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.textPrimary,
  width: 100,
}));

// Input with theme-aware background, border, and text color
const Input = styled.TextInput(({ theme }) => ({
  flex: 1,
  padding: 8,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: theme.border,
  backgroundColor: theme.surface,
  color: theme.textPrimary,
}));

// Button with theme-aware background
const AddButton = styled.TouchableOpacity(({ theme }) => ({
  backgroundColor: theme.primary,
  padding: 12,
  borderRadius: 10,
  alignItems: 'center',
  marginBottom: 20,
}));

// Button text with theme-aware color
const AddButtonText = styled.Text({
  color: '#ffffff', // optional: inverted text for buttons
  fontWeight: 'bold',
});

interface HealthFormProps {
  onAdd: (entry: HealthEntry) => void;
}

export default function HealthForm({ onAdd }: HealthFormProps) {
  const [weight, setWeight] = useState('');
  const [sleep, setSleep] = useState('');
  const [water, setWater] = useState('');
  const [steps, setSteps] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    const newEntry: HealthEntry = {
      id: Crypto.randomUUID(),
      date: new Date().toISOString(),
      weight: weight ? parseFloat(weight) : undefined,
      sleepHours: sleep ? parseFloat(sleep) : undefined,
      waterLiters: water ? parseFloat(water) : undefined,
      steps: steps ? parseInt(steps) : undefined,
      calories: calories ? parseInt(calories) : undefined,
      notes: notes || undefined,
    };

    onAdd(newEntry);

    // reset form
    setWeight('');
    setSleep('');
    setWater('');
    setSteps('');
    setCalories('');
    setNotes('');
  };

  return (
    <>
      <FormRow>
        <Label>Weight (kg):</Label>
        <Input
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          placeholderTextColor="#999"
          placeholder="e.g. 70"
        />
      </FormRow>
      <FormRow>
        <Label>Sleep (hrs):</Label>
        <Input
          keyboardType="numeric"
          value={sleep}
          onChangeText={setSleep}
          placeholderTextColor="#999"
          placeholder="e.g. 7.5"
        />
      </FormRow>
      <FormRow>
        <Label>Water (L):</Label>
        <Input
          keyboardType="numeric"
          value={water}
          onChangeText={setWater}
          placeholderTextColor="#999"
          placeholder="e.g. 2"
        />
      </FormRow>
      <FormRow>
        <Label>Steps:</Label>
        <Input
          keyboardType="numeric"
          value={steps}
          onChangeText={setSteps}
          placeholderTextColor="#999"
          placeholder="e.g. 10000"
        />
      </FormRow>
      <FormRow>
        <Label>Calories:</Label>
        <Input
          keyboardType="numeric"
          value={calories}
          onChangeText={setCalories}
          placeholderTextColor="#999"
          placeholder="e.g. 2200"
        />
      </FormRow>
      <FormRow>
        <Label>Notes:</Label>
        <Input
          value={notes}
          onChangeText={setNotes}
          placeholderTextColor="#999"
          placeholder="Optional notes"
        />
      </FormRow>

      <AddButton onPress={handleAdd}>
        <AddButtonText>Add Entry</AddButtonText>
      </AddButton>
    </>
  );
}

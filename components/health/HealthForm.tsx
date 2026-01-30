import { HealthEntry } from "@/models/HealthEntry";
import { useState } from "react";
import styled from "styled-components/native";
import { v4 as uuidv4 } from "uuid";

const FormRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Label = styled.Text`
  font-weight: bold;
  color: #333;
  width: 100px;
`;

const Input = styled.TextInput`
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const AddButton = styled.TouchableOpacity`
  background-color: #005cbeff;
  padding: 12px;
  border-radius: 10px;
  align-items: center;
  margin-bottom: 20px;
`;

const AddButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

interface HealthFormProps {
  onAdd: (entry: HealthEntry) => void;
}

export default function HealthForm({ onAdd }: HealthFormProps) {
  const [weight, setWeight] = useState("");
  const [sleep, setSleep] = useState("");
  const [water, setWater] = useState("");
  const [steps, setSteps] = useState("");
  const [calories, setCalories] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    const newEntry: HealthEntry = {
      id: uuidv4(),
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
    setWeight("");
    setSleep("");
    setWater("");
    setSteps("");
    setCalories("");
    setNotes("");
  };

  return (
    <>
      <FormRow>
        <Label>Weight (kg):</Label>
        <Input
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          placeholder="e.g. 70"
        />
      </FormRow>
      <FormRow>
        <Label>Sleep (hrs):</Label>
        <Input
          keyboardType="numeric"
          value={sleep}
          onChangeText={setSleep}
          placeholder="e.g. 7.5"
        />
      </FormRow>
      <FormRow>
        <Label>Water (L):</Label>
        <Input
          keyboardType="numeric"
          value={water}
          onChangeText={setWater}
          placeholder="e.g. 2"
        />
      </FormRow>
      <FormRow>
        <Label>Steps:</Label>
        <Input
          keyboardType="numeric"
          value={steps}
          onChangeText={setSteps}
          placeholder="e.g. 10000"
        />
      </FormRow>
      <FormRow>
        <Label>Calories:</Label>
        <Input
          keyboardType="numeric"
          value={calories}
          onChangeText={setCalories}
          placeholder="e.g. 2200"
        />
      </FormRow>
      <FormRow>
        <Label>Notes:</Label>
        <Input
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional notes"
        />
      </FormRow>

      <AddButton onPress={handleAdd}>
        <AddButtonText>Add Entry</AddButtonText>
      </AddButton>
    </>
  );
}

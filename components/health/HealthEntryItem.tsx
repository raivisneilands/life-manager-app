import { HealthEntry } from "@/models/HealthEntry";
import formatDateTime from "@/utils/formatDateTime";
import { EvilIcons } from "@expo/vector-icons";
import { useState } from "react";
import styled from "styled-components/native";

const EntryCard = styled.TouchableOpacity<{ expanded?: boolean }>`
  background-color: #f0f4ff;
  padding: 15px;
  margin-bottom: 12px;
  border-radius: 12px;
  border: 1px solid #cfd8ff;
`;

const EntryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const EntryLabel = styled.Text`
  font-weight: bold;
  color: #333;
  margin-right: 10px;
`;

const EntryValue = styled.Text`
  color: #555;
  text-align: right;
`;

interface Props {
  entry: HealthEntry;
  onDelete: (id: string) => void;
}

export default function HealthEntryItem({ entry, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <EntryCard expanded={expanded} onPress={() => setExpanded(!expanded)}>
      <EntryRow>
        <EntryLabel>Date:</EntryLabel>
        <EntryValue>{formatDateTime(entry.date)}</EntryValue>
      </EntryRow>

      {expanded && (
        <>
          {entry.weight && (
            <EntryRow>
              <EntryLabel>Weight:</EntryLabel>
              <EntryValue>{entry.weight} kg</EntryValue>
            </EntryRow>
          )}
          {entry.sleepHours && (
            <EntryRow>
              <EntryLabel>Sleep:</EntryLabel>
              <EntryValue>{entry.sleepHours} hrs</EntryValue>
            </EntryRow>
          )}
          {entry.waterLiters && (
            <EntryRow>
              <EntryLabel>Water:</EntryLabel>
              <EntryValue>{entry.waterLiters} L</EntryValue>
            </EntryRow>
          )}
          {entry.steps && (
            <EntryRow>
              <EntryLabel>Steps:</EntryLabel>
              <EntryValue>{entry.steps}</EntryValue>
            </EntryRow>
          )}
          {entry.calories && (
            <EntryRow>
              <EntryLabel>Calories:</EntryLabel>
              <EntryValue>{entry.calories}</EntryValue>
            </EntryRow>
          )}
          {entry.notes && (
            <EntryRow>
              <EntryLabel>Notes:</EntryLabel>
              <EntryValue>{entry.notes}</EntryValue>
            </EntryRow>
          )}
          <EntryRow>
            <EvilIcons
              name="trash"
              size={24}
              color="red"
              onPress={() => onDelete(entry.id)}
            />
          </EntryRow>
        </>
      )}
    </EntryCard>
  );
}

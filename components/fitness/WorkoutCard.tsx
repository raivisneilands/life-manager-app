import {
  ActionButton,
  Badge,
  BadgeText,
  Card,
  CardRow,
  CardSubtitle,
  CardTitle,
  ExerciseDetail,
  ExerciseDivider,
  ExerciseInfo,
  ExerciseName,
  ExerciseRow,
  Stat,
  StatLabel,
  StatRow,
  StatValue,
} from '@/components/fitness/styles';
import { FitnessEntry } from '@/models/FitnessEntry';
import styled from '@emotion/native';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';

const CardActions = styled.View(() => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginTop: 12,
  gap: 16,
}));

type Props = {
  entry: FitnessEntry;
  onEdit: (entry: FitnessEntry) => void;
  onDelete: (id: string) => void;
};

export default function WorkoutCard({ entry, onEdit, onDelete }: Props) {
  return (
    <Card>
      <CardRow>
        <CardTitle>{entry.date}</CardTitle>
        <Badge>
          <BadgeText>{entry.type}</BadgeText>
        </Badge>
      </CardRow>

      <StatRow>
        <Stat>
          <StatValue>{entry.durationMinutes}m</StatValue>
          <StatLabel>Duration</StatLabel>
        </Stat>
        {entry.caloriesBurned && (
          <Stat>
            <StatValue>{entry.caloriesBurned}</StatValue>
            <StatLabel>Calories</StatLabel>
          </Stat>
        )}
      </StatRow>

      {entry.notes && <CardSubtitle>{entry.notes}</CardSubtitle>}

      {entry.exercises && entry.exercises.length > 0 && (
        <>
          {entry.exercises.map((exercise, index) => (
            <React.Fragment key={exercise.name + index}>
              {index === 0 && <ExerciseDivider style={{ marginTop: 12 }} />}
              <ExerciseRow>
                <MaterialIcons name="fitness-center" size={16} color="#888" />
                <ExerciseInfo>
                  <ExerciseName>{exercise.name}</ExerciseName>
                  <ExerciseDetail>
                    {[
                      exercise.sets && exercise.reps && `${exercise.sets}×${exercise.reps}`,
                      exercise.weightKg && `${exercise.weightKg}kg`,
                      exercise.distanceKm && `${exercise.distanceKm}km`,
                      exercise.durationMinutes && `${exercise.durationMinutes}min`,
                    ].filter(Boolean).join(' · ')}
                  </ExerciseDetail>
                </ExerciseInfo>
              </ExerciseRow>
            </React.Fragment>
          ))}
        </>
      )}

      <CardActions>
        <ActionButton onPress={() => onEdit(entry)} activeOpacity={0.7}>
          <MaterialIcons name="edit" size={18} color="#888" />
        </ActionButton>
        <ActionButton onPress={() => onDelete(entry.id)} activeOpacity={0.7}>
          <MaterialIcons name="delete-outline" size={18} color="#EF4444" />
        </ActionButton>
      </CardActions>
    </Card>
  );
}
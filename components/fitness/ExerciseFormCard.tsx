import { ActionButton } from '@/components/fitness/styles';
import styled from '@emotion/native';
import { MaterialIcons } from '@expo/vector-icons';

const ExerciseCard = styled.View(({ theme }) => ({
  backgroundColor: theme.surface,
  borderRadius: 10,
  padding: 12,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: theme.border,
}));

const ExerciseCardHeader = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 8,
}));

const ExerciseCardTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 14,
  fontWeight: '600',
}));

const ExerciseFieldRow = styled.View(() => ({
  flexDirection: 'row',
  gap: 8,
}));

const ExerciseFieldWrap = styled.View(() => ({
  flex: 1,
}));

const ExerciseLabel = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 11,
  fontWeight: '600',
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  marginBottom: 4,
}));

const SmallInput = styled.TextInput(({ theme }) => ({
  backgroundColor: theme.background,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 8,
  color: theme.textPrimary,
  fontSize: 14,
}));

export type ExerciseForm = {
  name: string;
  sets: string;
  reps: string;
  weightKg: string;
  durationMinutes: string;
  distanceKm: string;
  notes: string;
};

type Props = {
  exercise: ExerciseForm;
  index: number;
  onChange: (index: number, updated: ExerciseForm) => void;
  onRemove: (index: number) => void;
};

export default function ExerciseFormCard({ exercise, index, onChange, onRemove }: Props) {
  function update(field: keyof ExerciseForm, val: string) {
    onChange(index, { ...exercise, [field]: val });
  }

  return (
    <ExerciseCard>
      <ExerciseCardHeader>
        <ExerciseCardTitle>Exercise {index + 1}</ExerciseCardTitle>
        <ActionButton onPress={() => onRemove(index)} activeOpacity={0.7}>
          <MaterialIcons name="close" size={18} color="#EF4444" />
        </ActionButton>
      </ExerciseCardHeader>

      <ExerciseLabel>Name</ExerciseLabel>
      <SmallInput
        placeholder="e.g. Bench Press"
        placeholderTextColor="#888"
        value={exercise.name}
        onChangeText={(val) => update('name', val)}
      />

      <ExerciseFieldRow style={{ marginTop: 8 }}>
        <ExerciseFieldWrap>
          <ExerciseLabel>Sets</ExerciseLabel>
          <SmallInput
            placeholder="4"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={exercise.sets}
            onChangeText={(val) => update('sets', val)}
          />
        </ExerciseFieldWrap>
        <ExerciseFieldWrap>
          <ExerciseLabel>Reps</ExerciseLabel>
          <SmallInput
            placeholder="10"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={exercise.reps}
            onChangeText={(val) => update('reps', val)}
          />
        </ExerciseFieldWrap>
        <ExerciseFieldWrap>
          <ExerciseLabel>Weight (kg)</ExerciseLabel>
          <SmallInput
            placeholder="80"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={exercise.weightKg}
            onChangeText={(val) => update('weightKg', val)}
          />
        </ExerciseFieldWrap>
      </ExerciseFieldRow>

      <ExerciseFieldRow style={{ marginTop: 8 }}>
        <ExerciseFieldWrap>
          <ExerciseLabel>Duration (min)</ExerciseLabel>
          <SmallInput
            placeholder="30"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={exercise.durationMinutes}
            onChangeText={(val) => update('durationMinutes', val)}
          />
        </ExerciseFieldWrap>
        <ExerciseFieldWrap>
          <ExerciseLabel>Distance (km)</ExerciseLabel>
          <SmallInput
            placeholder="5"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={exercise.distanceKm}
            onChangeText={(val) => update('distanceKm', val)}
          />
        </ExerciseFieldWrap>
      </ExerciseFieldRow>

      <ExerciseLabel style={{ marginTop: 8 }}>Notes</ExerciseLabel>
      <SmallInput
        placeholder="Optional note"
        placeholderTextColor="#888"
        value={exercise.notes}
        onChangeText={(val) => update('notes', val)}
      />
    </ExerciseCard>
  );
}
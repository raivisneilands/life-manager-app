import ExerciseFormCard, { ExerciseForm } from '@/components/fitness/ExerciseFormCard';
import {
  Backdrop,
  ButtonRow,
  CancelButton,
  CancelButtonText,
  CardSubtitle,
  Handle,
  Input,
  Label,
  SaveButton,
  SaveButtonText,
  Sheet,
  SheetTitle,
  TypeChip,
  TypeChipText,
  TypeRow,
} from '@/components/fitness/styles';
import { FitnessEntry, WorkoutType } from '@/models/FitnessEntry';
import styled from '@emotion/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Dimensions, KeyboardAvoidingView, Modal, Platform, ScrollView } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

const AddExerciseButton = styled.TouchableOpacity(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.surface,
  borderRadius: 10,
  padding: 12,
  borderWidth: 1,
  borderColor: theme.border,
  gap: 8,
  marginTop: 4,
}));

const AddExerciseButtonText = styled.Text(({ theme }) => ({
  color: theme.primary,
  fontSize: 14,
  fontWeight: '600',
}));

const WORKOUT_TYPES: { label: string; value: WorkoutType }[] = [
  { label: 'Strength', value: 'strength' },
  { label: 'Cardio', value: 'cardio' },
  { label: 'Flexibility', value: 'flexibility' },
  { label: 'Sports', value: 'sports' },
  { label: 'Other', value: 'other' },
];

export const EMPTY_EXERCISE: ExerciseForm = {
  name: '',
  sets: '',
  reps: '',
  weightKg: '',
  durationMinutes: '',
  distanceKm: '',
  notes: '',
};

export type FormState = {
  date: string;
  type: WorkoutType | '';
  durationMinutes: string;
  caloriesBurned: string;
  notes: string;
  exercises: ExerciseForm[];
};

export const EMPTY_FORM: FormState = {
  date: new Date().toISOString().split('T')[0],
  type: '',
  durationMinutes: '',
  caloriesBurned: '',
  notes: '',
  exercises: [],
};

type Props = {
  visible: boolean;
  editingEntry: FitnessEntry | null;
  form: FormState;
  slideAnim: any;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (form: FormState) => void;
};

export default function WorkoutSheet({
  visible,
  editingEntry,
  form,
  slideAnim,
  onClose,
  onSave,
  onFormChange,
}: Props) {
  const hasExerciseDurations = form.exercises.some((e) => Number(e.durationMinutes) > 0);

  useEffect(() => {
    if (!visible) return;
    const total = form.exercises.reduce((sum, e) => sum + (Number(e.durationMinutes) || 0), 0);
    if (total > 0) {
      onFormChange({ ...form, durationMinutes: String(total) });
    }
  }, [form.exercises]);

  function updateExercise(index: number, updated: ExerciseForm) {
    const exercises = [...form.exercises];
    exercises[index] = updated;
    onFormChange({ ...form, exercises });
  }

  function removeExercise(index: number) {
    onFormChange({ ...form, exercises: form.exercises.filter((_, i) => i !== index) });
  }

  function addExercise() {
    onFormChange({ ...form, exercises: [...form.exercises, { ...EMPTY_EXERCISE }] });
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Backdrop onPress={onClose} activeOpacity={1} />
      <Sheet style={{ height: SHEET_HEIGHT, transform: [{ translateY: slideAnim }] }}>
        <Handle />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <SheetTitle>{editingEntry ? 'Edit Workout' : 'New Workout'}</SheetTitle>

            <Label>Date</Label>
            <Input
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#888"
              value={form.date}
              onChangeText={(val) => onFormChange({ ...form, date: val })}
            />

            <Label>Workout Type *</Label>
            <TypeRow>
              {WORKOUT_TYPES.map((t) => (
                <TypeChip
                  key={t.value}
                  selected={form.type === t.value}
                  onPress={() => onFormChange({ ...form, type: t.value })}
                  activeOpacity={0.7}
                >
                  <TypeChipText selected={form.type === t.value}>{t.label}</TypeChipText>
                </TypeChip>
              ))}
            </TypeRow>

            <Label>Duration (minutes) *</Label>
            <Input
              placeholder="45"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={form.durationMinutes}
              onChangeText={(val) => onFormChange({ ...form, durationMinutes: val })}
              editable={!hasExerciseDurations}
              style={{ opacity: hasExerciseDurations ? 0.5 : 1 }}
            />
            {hasExerciseDurations && (
              <CardSubtitle>Auto-calculated from exercises</CardSubtitle>
            )}

            <Label>Calories Burned</Label>
            <Input
              placeholder="320"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={form.caloriesBurned}
              onChangeText={(val) => onFormChange({ ...form, caloriesBurned: val })}
            />

            <Label>Notes</Label>
            <Input
              placeholder="How did it go?"
              placeholderTextColor="#888"
              multiline
              numberOfLines={3}
              value={form.notes}
              onChangeText={(val) => onFormChange({ ...form, notes: val })}
              style={{ textAlignVertical: 'top', minHeight: 80 }}
            />

            <Label>Exercises</Label>
            {form.exercises.map((exercise, index) => (
              <ExerciseFormCard
                key={index}
                exercise={exercise}
                index={index}
                onChange={updateExercise}
                onRemove={removeExercise}
              />
            ))}

            <AddExerciseButton onPress={addExercise} activeOpacity={0.7}>
              <MaterialIcons name="add" size={16} color="#6366F1" />
              <AddExerciseButtonText>Add Exercise</AddExerciseButtonText>
            </AddExerciseButton>

            <ButtonRow>
              <CancelButton onPress={onClose} activeOpacity={0.7}>
                <CancelButtonText>Cancel</CancelButtonText>
              </CancelButton>
              <SaveButton onPress={onSave} activeOpacity={0.7}>
                <SaveButtonText>Save</SaveButtonText>
              </SaveButton>
            </ButtonRow>
          </ScrollView>
        </KeyboardAvoidingView>
      </Sheet>
    </Modal>
  );
}
import { FitnessEntry, WorkoutType } from '@/models/FitnessEntry';
import { useFitnessStore } from '@/store/FitnessStore';
import styled from '@emotion/native';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, KeyboardAvoidingView, Modal, Platform, ScrollView } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

const WORKOUT_TYPES: { label: string; value: WorkoutType }[] = [
  { label: 'Strength', value: 'strength' },
  { label: 'Cardio', value: 'cardio' },
  { label: 'Flexibility', value: 'flexibility' },
  { label: 'Sports', value: 'sports' },
  { label: 'Other', value: 'other' },
];

// ─── Styled Components ───────────────────────────────────────────────────────

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.background,
}));

const Header = styled.View(({ theme }) => ({
  paddingHorizontal: 20,
  paddingVertical: 24,
  borderBottomWidth: 1,
  borderBottomColor: theme.border,
  justifyContent: 'space-between',
}));

const HeaderText = styled.View(() => ({}));

const Title = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 28,
  fontWeight: '700',
}));

const Subtitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
  marginTop: 4,
}));

const AddButton = styled.TouchableOpacity(({ theme }) => ({
  backgroundColor: theme.primary,
  borderRadius: 10,
  paddingVertical: 8,
  paddingHorizontal: 14,
  marginTop: 16,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
}));

const AddButtonText = styled.Text(() => ({
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
}));

const Section = styled.View(() => ({
  paddingHorizontal: 20,
  paddingTop: 24,
}));

const SectionTitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: '600',
  letterSpacing: 1,
  textTransform: 'uppercase',
  marginBottom: 12,
}));

const Card = styled.View(({ theme }) => ({
  backgroundColor: theme.card,
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: theme.border,
}));

const CardRow = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const CardTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 16,
  fontWeight: '600',
  flex: 1,
}));

const CardSubtitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 13,
  marginTop: 4,
}));

const Badge = styled.View(({ theme }) => ({
  backgroundColor: theme.surface,
  borderRadius: 8,
  paddingVertical: 4,
  paddingHorizontal: 10,
  marginLeft: 8,
}));

const BadgeText = styled.Text(({ theme }) => ({
  color: theme.primary,
  fontSize: 12,
  fontWeight: '600',
}));

const StatRow = styled.View(() => ({
  flexDirection: 'row',
  marginTop: 12,
  gap: 12,
}));

const Stat = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.surface,
  borderRadius: 8,
  padding: 10,
  alignItems: 'center',
}));

const StatValue = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 16,
  fontWeight: '700',
}));

const StatLabel = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 11,
  marginTop: 2,
}));

const CardActions = styled.View(() => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginTop: 12,
  gap: 16,
}));

const ActionButton = styled.TouchableOpacity(() => ({
  padding: 4,
}));

const EmptyText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
  textAlign: 'center',
  paddingVertical: 32,
}));

// ─── Sheet Styled Components ─────────────────────────────────────────────────

const Backdrop = styled.TouchableOpacity(() => ({
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
}));

const Sheet = styled(Animated.View)(({ theme }) => ({
  position: 'absolute',
  bottom: 0, left: 0, right: 0,
  height: SHEET_HEIGHT,
  backgroundColor: theme.background,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingHorizontal: 24,
  paddingBottom: 32,
}));

const Handle = styled.View(({ theme }) => ({
  width: 40,
  height: 4,
  backgroundColor: theme.border,
  borderRadius: 99,
  alignSelf: 'center',
  marginTop: 12,
  marginBottom: 20,
}));

const SheetTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 20,
  fontWeight: '700',
  marginBottom: 20,
}));

const Label = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: '600',
  letterSpacing: 0.8,
  textTransform: 'uppercase',
  marginBottom: 6,
  marginTop: 14,
}));

const Input = styled.TextInput(({ theme }) => ({
  backgroundColor: theme.surface,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 12,
  color: theme.textPrimary,
  fontSize: 15,
}));

const TypeRow = styled.View(() => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 2,
}));

const TypeChip = styled.TouchableOpacity(({ theme, selected }: { theme?: any; selected: boolean }) => ({
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 99,
  borderWidth: 1,
  borderColor: selected ? theme.primary : theme.border,
  backgroundColor: selected ? theme.primary + '22' : theme.surface,
}));

const TypeChipText = styled.Text(({ theme, selected }: { theme?: any; selected: boolean }) => ({
  color: selected ? theme.primary : theme.textSecondary,
  fontSize: 14,
  fontWeight: selected ? '600' : '400',
}));

const ButtonRow = styled.View(() => ({
  flexDirection: 'row',
  gap: 12,
  marginTop: 24,
  marginBottom: 16,
}));

const CancelButton = styled.TouchableOpacity(({ theme }) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: theme.border,
  alignItems: 'center',
}));

const CancelButtonText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 15,
  fontWeight: '600',
}));

const SaveButton = styled.TouchableOpacity(({ theme }) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  backgroundColor: theme.primary,
  alignItems: 'center',
}));

const SaveButtonText = styled.Text(() => ({
  color: '#fff',
  fontSize: 15,
  fontWeight: '600',
}));

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

const ExerciseRow = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  gap: 12,
}));

const ExerciseDivider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.border,
}));

const ExerciseInfo = styled.View(() => ({
  flex: 1,
}));

const ExerciseName = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 15,
  fontWeight: '500',
}));

const ExerciseDetail = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 13,
  marginTop: 2,
}));

// ─── Confirm modal ────────────────────────────────────────────────────────────

const ConfirmBackdrop = styled.TouchableOpacity(() => ({
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
}));

const ConfirmBox = styled.View(({ theme }) => ({
  position: 'absolute',
  top: '40%',
  left: 24,
  right: 24,
  backgroundColor: theme.card,
  borderRadius: 16,
  padding: 24,
  borderWidth: 1,
  borderColor: theme.border,
}));

const ConfirmTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 8,
}));

const ConfirmMessage = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
  lineHeight: 20,
  marginBottom: 24,
}));

const ConfirmButtonRow = styled.View(() => ({
  flexDirection: 'row',
  gap: 12,
}));

const ConfirmDeleteButton = styled.TouchableOpacity(({ theme }) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  backgroundColor: theme.danger,
  alignItems: 'center',
}));

const ConfirmDeleteButtonText = styled.Text(() => ({
  color: '#fff',
  fontSize: 15,
  fontWeight: '600',
}));

// ─── Types ────────────────────────────────────────────────────────────────────
type ExerciseForm = {
  name: string;
  sets: string;
  reps: string;
  weightKg: string;
  durationMinutes: string;
  distanceKm: string;
  notes: string;
};

const EMPTY_EXERCISE: ExerciseForm = {
  name: '',
  sets: '',
  reps: '',
  weightKg: '',
  durationMinutes: '',
  distanceKm: '',
  notes: '',
};

type FormState = {
  date: string;
  type: WorkoutType | '';
  durationMinutes: string;
  caloriesBurned: string;
  notes: string;
  exercises: ExerciseForm[];
};

const EMPTY_FORM: FormState = {
  date: new Date().toISOString().split('T')[0],
  type: '',
  durationMinutes: '',
  caloriesBurned: '',
  notes: '',
  exercises: [],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function FitnessScreen() {
  const entries = useFitnessStore((s) => s.fitnessEntries);
  const addEntry = useFitnessStore((s) => s.addFitnessEntry);
  const updateEntry = useFitnessStore((s) => s.updateFitnessEntry);
  const removeEntry = useFitnessStore((s) => s.removeFitnessEntry);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FitnessEntry | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  const hasExerciseDurations = form.exercises.some((e) => Number(e.durationMinutes) > 0);

  // ─── Weekly stats ───────────────────────────────────────────────────────────
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const weekEntries = entries.filter((e) => new Date(e.date) >= startOfWeek);
  const totalMinutes = weekEntries.reduce((sum, e) => sum + e.durationMinutes, 0);
  const totalCalories = weekEntries.reduce((sum, e) => sum + (e.caloriesBurned ?? 0), 0);

  const weeklyStats = [
    { label: 'Workouts', value: String(weekEntries.length) },
    { label: 'Total Time', value: totalMinutes >= 60 ? `${(totalMinutes / 60).toFixed(1)}h` : `${totalMinutes}m` },
    { label: 'Calories', value: totalCalories > 0 ? totalCalories.toLocaleString() : '—' },
  ];

  // ─── Sheet ──────────────────────────────────────────────────────────────────
  function openSheet(entry?: FitnessEntry) {
    if (entry) {
      setEditingEntry(entry);
      setForm({
        date: entry.date,
        type: entry.type,
        durationMinutes: String(entry.durationMinutes),
        caloriesBurned: entry.caloriesBurned ? String(entry.caloriesBurned) : '',
        notes: entry.notes ?? '',
              exercises: (entry.exercises ?? []).map((e) => ({
        name: e.name,
        sets: e.sets ? String(e.sets) : '',
        reps: e.reps ? String(e.reps) : '',
        weightKg: e.weightKg ? String(e.weightKg) : '',
        durationMinutes: e.durationMinutes ? String(e.durationMinutes) : '',
        distanceKm: e.distanceKm ? String(e.distanceKm) : '',
        notes: e.notes ?? '',
      })),
      });
    } else {
      setEditingEntry(null);
      setForm(EMPTY_FORM);
    }
    setSheetVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }

  function closeSheet() {
    Animated.timing(slideAnim, {
      toValue: SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setSheetVisible(false);
      setEditingEntry(null);
      setForm(EMPTY_FORM);
    });
  }

  function handleSave() {
    if (!form.type || !form.durationMinutes) return;

    const exercises = form.exercises
      .filter((e) => e.name.trim())
      .map((e) => ({
        name: e.name,
        sets: e.sets ? Number(e.sets) : undefined,
        reps: e.reps ? Number(e.reps) : undefined,
        weightKg: e.weightKg ? Number(e.weightKg) : undefined,
        durationMinutes: e.durationMinutes ? Number(e.durationMinutes) : undefined,
        distanceKm: e.distanceKm ? Number(e.distanceKm) : undefined,
        notes: e.notes || undefined,
      }));

    const payload = {
      date: form.date,
      type: form.type as WorkoutType,
      durationMinutes: Number(form.durationMinutes),
      caloriesBurned: form.caloriesBurned ? Number(form.caloriesBurned) : undefined,
      notes: form.notes || undefined,
      exercises: exercises.length > 0 ? exercises : undefined,
    };

    if (editingEntry) {
      updateEntry({
        ...editingEntry,
        ...payload
      });
    } else {
      addEntry({
        id: 'fitness-' + Math.random().toString(36).substr(2, 9),
        ...payload
      });
    }
    closeSheet();
  }

  function handleDelete() {
    if (confirmId) {
      removeEntry(confirmId);
      setConfirmId(null);
    }
  }

  useEffect(() => {
    if (!sheetVisible) return;
    const total = form.exercises.reduce((sum, e) => sum + (Number(e.durationMinutes) || 0), 0);
    if (total > 0) {
      setForm((f) => ({ ...f, durationMinutes: String(total) }));
    }
  }, [form.exercises]);

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <HeaderText>
            <Title>Fitness & Workouts</Title>
            <Subtitle>Track your training and stay consistent</Subtitle>
          </HeaderText>
          <AddButton onPress={() => openSheet()} activeOpacity={0.7}>
            <MaterialIcons name="add" size={16} color="#fff" />
            <AddButtonText>Add</AddButtonText>
          </AddButton>
        </Header>

        <Section>
          <SectionTitle>This Week</SectionTitle>
          <Card>
            <StatRow>
              {weeklyStats.map((stat) => (
                <Stat key={stat.label}>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                </Stat>
              ))}
            </StatRow>
          </Card>
        </Section>

        <Section>
          <SectionTitle>Recent Workouts</SectionTitle>
          {entries.length === 0 && (
            <EmptyText>No workouts logged yet. Tap Add to get started.</EmptyText>
          )}
          {[...entries].reverse().map((entry) => (
            <Card key={entry.id}>
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
                <ActionButton onPress={() => openSheet(entry)} activeOpacity={0.7}>
                  <MaterialIcons name="edit" size={18} color="#888" />
                </ActionButton>
                <ActionButton onPress={() => setConfirmId(entry.id)} activeOpacity={0.7}>
                  <MaterialIcons name="delete-outline" size={18} color="#EF4444" />
                </ActionButton>
              </CardActions>
            </Card>
          ))}
        </Section>
      </ScrollView>

      {/* Add / Edit sheet */}
      <Modal visible={sheetVisible} transparent animationType="none" onRequestClose={closeSheet}>
        <Backdrop onPress={closeSheet} activeOpacity={1} />
        <Sheet style={{ transform: [{ translateY: slideAnim }] }}>
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
                onChangeText={(val) => setForm((f) => ({ ...f, date: val }))}
              />

              <Label>Workout Type *</Label>
              <TypeRow>
                {WORKOUT_TYPES.map((t) => (
                  <TypeChip
                    key={t.value}
                    selected={form.type === t.value}
                    onPress={() => setForm((f) => ({ ...f, type: t.value }))}
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
                onChangeText={(val) => setForm((f) => ({ ...f, durationMinutes: val }))}
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
                onChangeText={(val) => setForm((f) => ({ ...f, caloriesBurned: val }))}
              />

              <Label>Notes</Label>
              <Input
                placeholder="How did it go?"
                placeholderTextColor="#888"
                multiline
                numberOfLines={3}
                value={form.notes}
                onChangeText={(val) => setForm((f) => ({ ...f, notes: val }))}
                style={{ textAlignVertical: 'top', minHeight: 80 }}
              />

              <Label>Exercises</Label>
              {form.exercises.map((exercise, index) => (
                <ExerciseCard key={index}>
                  <ExerciseCardHeader>
                    <ExerciseCardTitle>Exercise {index + 1}</ExerciseCardTitle>
                    <ActionButton
                      onPress={() => setForm((f) => ({
                        ...f,
                        exercises: f.exercises.filter((_, i) => i !== index),
                      }))}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="close" size={18} color="#EF4444" />
                    </ActionButton>
                  </ExerciseCardHeader>

                  <ExerciseLabel>Name</ExerciseLabel>
                  <SmallInput
                    placeholder="e.g. Bench Press"
                    placeholderTextColor="#888"
                    value={exercise.name}
                    onChangeText={(val) => setForm((f) => {
                      const exercises = [...f.exercises];
                      exercises[index] = { ...exercises[index], name: val };
                      return { ...f, exercises };
                    })}
                  />

                  {/* Strength fields */}
                  <ExerciseFieldRow style={{ marginTop: 8 }}>
                    <ExerciseFieldWrap>
                      <ExerciseLabel>Sets</ExerciseLabel>
                      <SmallInput
                        placeholder="4"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={exercise.sets}
                        onChangeText={(val) => setForm((f) => {
                          const exercises = [...f.exercises];
                          exercises[index] = { ...exercises[index], sets: val };
                          return { ...f, exercises };
                        })}
                      />
                    </ExerciseFieldWrap>
                    <ExerciseFieldWrap>
                      <ExerciseLabel>Reps</ExerciseLabel>
                      <SmallInput
                        placeholder="10"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={exercise.reps}
                        onChangeText={(val) => setForm((f) => {
                          const exercises = [...f.exercises];
                          exercises[index] = { ...exercises[index], reps: val };
                          return { ...f, exercises };
                        })}
                      />
                    </ExerciseFieldWrap>
                    <ExerciseFieldWrap>
                      <ExerciseLabel>Weight (kg)</ExerciseLabel>
                      <SmallInput
                        placeholder="80"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={exercise.weightKg}
                        onChangeText={(val) => setForm((f) => {
                          const exercises = [...f.exercises];
                          exercises[index] = { ...exercises[index], weightKg: val };
                          return { ...f, exercises };
                        })}
                      />
                    </ExerciseFieldWrap>
                  </ExerciseFieldRow>

                  {/* Cardio fields */}
                  <ExerciseFieldRow style={{ marginTop: 8 }}>
                    <ExerciseFieldWrap>
                      <ExerciseLabel>Duration (min)</ExerciseLabel>
                      <SmallInput
                        placeholder="30"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={exercise.durationMinutes}
                        onChangeText={(val) => setForm((f) => {
                          const exercises = [...f.exercises];
                          exercises[index] = { ...exercises[index], durationMinutes: val };
                          return { ...f, exercises };
                        })}
                      />
                    </ExerciseFieldWrap>
                    <ExerciseFieldWrap>
                      <ExerciseLabel>Distance (km)</ExerciseLabel>
                      <SmallInput
                        placeholder="5"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={exercise.distanceKm}
                        onChangeText={(val) => setForm((f) => {
                          const exercises = [...f.exercises];
                          exercises[index] = { ...exercises[index], distanceKm: val };
                          return { ...f, exercises };
                        })}
                      />
                    </ExerciseFieldWrap>
                  </ExerciseFieldRow>

                  <ExerciseLabel style={{ marginTop: 8 }}>Notes</ExerciseLabel>
                  <SmallInput
                    placeholder="Optional note"
                    placeholderTextColor="#888"
                    value={exercise.notes}
                    onChangeText={(val) => setForm((f) => {
                      const exercises = [...f.exercises];
                      exercises[index] = { ...exercises[index], notes: val };
                      return { ...f, exercises };
                    })}
                  />
                </ExerciseCard>
              ))}

              <AddExerciseButton
                onPress={() => setForm((f) => ({ ...f, exercises: [...f.exercises, { ...EMPTY_EXERCISE }] }))}
                activeOpacity={0.7}
              >
                <MaterialIcons name="add" size={16} color="#6366F1" />
                <AddExerciseButtonText>Add Exercise</AddExerciseButtonText>
              </AddExerciseButton>

              <ButtonRow>
                <CancelButton onPress={closeSheet} activeOpacity={0.7}>
                  <CancelButtonText>Cancel</CancelButtonText>
                </CancelButton>
                <SaveButton onPress={handleSave} activeOpacity={0.7}>
                  <SaveButtonText>Save</SaveButtonText>
                </SaveButton>
              </ButtonRow>
            </ScrollView>
          </KeyboardAvoidingView>
        </Sheet>
      </Modal>

      {/* Confirm delete modal */}
      <Modal visible={!!confirmId} transparent animationType="fade" onRequestClose={() => setConfirmId(null)}>
        <ConfirmBackdrop onPress={() => setConfirmId(null)} activeOpacity={1} />
        <ConfirmBox>
          <ConfirmTitle>Delete Workout</ConfirmTitle>
          <ConfirmMessage>Are you sure you want to delete this workout? This cannot be undone.</ConfirmMessage>
          <ConfirmButtonRow>
            <CancelButton onPress={() => setConfirmId(null)} activeOpacity={0.7}>
              <CancelButtonText>Cancel</CancelButtonText>
            </CancelButton>
            <ConfirmDeleteButton onPress={handleDelete} activeOpacity={0.7}>
              <ConfirmDeleteButtonText>Delete</ConfirmDeleteButtonText>
            </ConfirmDeleteButton>
          </ConfirmButtonRow>
        </ConfirmBox>
      </Modal>
    </Container>
  );
}
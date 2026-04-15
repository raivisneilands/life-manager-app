import { Goal } from '@/models/Goal';
import { useGoalStore } from '@/store/GoalStore';
import styled from '@emotion/native';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  View,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

// ─── Styled Components ────────────────────────────────────────────────────────
// (UNCHANGED — keeping your UI exactly as-is)

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
  paddingBottom: 32,
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
  marginBottom: 12,
}));

const CardActions = styled.View(() => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: 12,
}));

const ActionButton = styled.TouchableOpacity(() => ({
  padding: 4,
}));

const ProgressRow = styled.View(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 4,
}));

const ProgressLabel = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
}));

const ProgressBarTrack = styled.View(({ theme }) => ({
  height: 6,
  backgroundColor: theme.surface,
  borderRadius: 99,
  marginTop: 4,
  marginBottom: 12,
}));

const ProgressBarFill = styled.View(({ theme, progress }: { theme?: any; progress: number }) => ({
  height: 6,
  backgroundColor: theme.primary,
  borderRadius: 99,
  width: `${Math.min(progress, 100)}%`,
}));

const Divider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.border,
  marginVertical: 12,
}));

const PlanTitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: '600',
  letterSpacing: 0.8,
  textTransform: 'uppercase',
  marginBottom: 8,
}));

const PlanStepRow = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 8,
  gap: 12,
}));

const PlanStepDivider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.border,
}));

const PlanStepName = styled.Text(({ theme, completed }: { theme?: any; completed: boolean }) => ({
  color: completed ? theme.textSecondary : theme.textPrimary,
  fontSize: 15,
  fontWeight: '500',
  flex: 1,
  textDecorationLine: completed ? 'line-through' : 'none',
}));

const AddStepRow = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginTop: 8,
}));

const AddStepInput = styled.TextInput(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.surface,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 8,
  color: theme.textPrimary,
  fontSize: 14,
}));

const AddStepButton = styled.TouchableOpacity(({ theme }) => ({
  backgroundColor: theme.primary,
  borderRadius: 8,
  padding: 8,
}));

const EmptyText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
  textAlign: 'center',
  paddingVertical: 32,
}));

// ─── Sheet ────────────────────────────────────────────────────────────────────

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

const InputRow = styled.View(() => ({
  flexDirection: 'row',
  gap: 10,
}));

const InputWrap = styled.View(() => ({
  flex: 1,
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

const ConfirmBackdrop = styled.TouchableOpacity(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
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

const GoalTypeButton = styled.TouchableOpacity(({ theme }) => ({
  backgroundColor: theme.surface,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 10,
  padding: 12,
}));

const GoalTypeText = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
}));

const GoalTypeOption = styled.TouchableOpacity<{ selected: boolean }>(
  ({ theme, selected }) => ({
    backgroundColor: selected
      ? theme.primary + '33' // ~20% opacity
      : theme.surface,
    borderWidth: 1,
    borderColor: selected ? theme.primary : theme.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 8,
  })
);

const GoalTypeOptionText = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 14,
}));

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = {
  title: string;
  deadline: string;
  goalType: "min" | "max";
  currentValue: string;
  targetValue: string;
  unit: string;
};

const EMPTY_FORM: FormState = {
  title: '',
  deadline: '',
  goalType: 'max',
  currentValue: '0',
  targetValue: '',
  unit: '',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function GoalsScreen() {
  const goals = useGoalStore((s) => s.goals);
  const getGoals = useGoalStore((s) => s.getGoals);
  const addGoal = useGoalStore((s) => s.addGoal);
  const updateGoal = useGoalStore((s) => s.updateGoal);
  const removeGoal = useGoalStore((s) => s.removeGoal);
  const addPlanStep = useGoalStore((s) => s.addPlanStep);
  const removePlanStep = useGoalStore((s) => s.removePlanStep);
  const togglePlanStep = useGoalStore((s) => s.togglePlanStep);
  const [showGoalTypePicker, setShowGoalTypePicker] = useState(false);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [newStepText, setNewStepText] = useState<Record<string, string>>({});
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  useEffect(() => {
    getGoals();
  }, []);

  function getProgress({ current, target, goalType }: any) {
    const c = Number(current);
    const t = Number(target);

    if (!c || !t) return 0;

    if (goalType === "min") {
      return Math.min(100, (t / c) * 100);
    }

    return Math.min(100, (c / t) * 100);
  }

  function openSheet(goal?: Goal) {
    if (goal) {
      setEditingGoal(goal);
      setForm({
        title: goal.title,
        deadline: goal.deadline,
        goalType: (goal.goalType as "min" | "max") ?? "max",
        currentValue: String(goal.currentValue),
        targetValue: String(goal.targetValue),
        unit: goal.unit,
      });
    } else {
      setEditingGoal(null);
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
      setEditingGoal(null);
      setForm(EMPTY_FORM);
    });
  }

  function handleSave() {
    if (!form.title.trim() || !form.targetValue) return;

    const payload = {
      title: form.title,
      deadline: form.deadline,
      goalType: form.goalType,
      currentValue: Number(form.currentValue) || 0,
      targetValue: Number(form.targetValue),
      unit: form.unit,
    };

    if (editingGoal) {
      updateGoal({ ...editingGoal, ...payload });
    } else {
      addGoal({
        id: 'goal-' + Math.random().toString(36).substr(2, 9),
        planSteps: [],
        ...payload,
      });
    }

    closeSheet();
  }

  function handleAddStep(goalId: string) {
    const text = newStepText[goalId]?.trim();
    if (!text) return;

    addPlanStep(goalId, {
      id: 'step-' + Math.random().toString(36).substr(2, 9),
      title: text,
      completed: false,
    });

    setNewStepText((prev) => ({ ...prev, [goalId]: '' }));
  }

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <HeaderText>
            <Title>Goals</Title>
            <Subtitle>Define what you want and build a plan to get there</Subtitle>
          </HeaderText>

          <AddButton onPress={() => openSheet()} activeOpacity={0.7}>
            <MaterialIcons name="add" size={16} color="#fff" />
            <AddButtonText>New Goal</AddButtonText>
          </AddButton>
        </Header>

        <Section>
          <SectionTitle>Active Goals</SectionTitle>

          {goals.length === 0 && (
            <EmptyText>No goals yet. Tap New Goal to get started.</EmptyText>
          )}

          {goals.map((goal) => {
            const progress = getProgress({
              current: goal.currentValue,
              target: goal.targetValue,
              goalType: goal.goalType ?? "max",
            });

            return (
              <Card key={goal.id}>
                <CardRow>
                  <CardTitle>{goal.title}</CardTitle>

                  <CardActions>
                    <ActionButton onPress={() => openSheet(goal)}>
                      <MaterialIcons name="edit" size={18} color="#888" />
                    </ActionButton>
                    <ActionButton onPress={() => setConfirmId(goal.id)}>
                      <MaterialIcons name="delete-outline" size={18} color="#EF4444" />
                    </ActionButton>
                  </CardActions>
                </CardRow>

                {goal.deadline && (
                  <CardSubtitle>Target: {goal.deadline}</CardSubtitle>
                )}

                <ProgressRow>
                  <ProgressLabel>
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                  </ProgressLabel>
                  <ProgressLabel>{progress.toFixed(0)}%</ProgressLabel>
                </ProgressRow>

                <ProgressBarTrack>
                  <ProgressBarFill progress={progress} />
                </ProgressBarTrack>

                <Divider />

                <PlanTitle>Plan</PlanTitle>

                {goal.planSteps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    {index > 0 && <PlanStepDivider />}
                    <PlanStepRow>
                      <ActionButton onPress={() => togglePlanStep(goal.id, step.id)}>
                        <MaterialIcons
                          name={step.completed ? 'check-circle' : 'check-circle-outline'}
                          size={20}
                          color={step.completed ? '#22C55E' : '#888'}
                        />
                      </ActionButton>

                      <PlanStepName completed={step.completed}>
                        {step.title}
                      </PlanStepName>

                      <ActionButton onPress={() => removePlanStep(goal.id, step.id)}>
                        <MaterialIcons name="close" size={16} color="#888" />
                      </ActionButton>
                    </PlanStepRow>
                  </React.Fragment>
                ))}

                <AddStepRow>
                  <AddStepInput
                    placeholder="Add a plan step…"
                    value={newStepText[goal.id] ?? ''}
                    onChangeText={(val) =>
                      setNewStepText((prev) => ({ ...prev, [goal.id]: val }))
                    }
                    onSubmitEditing={() => handleAddStep(goal.id)}
                  />
                  <AddStepButton onPress={() => handleAddStep(goal.id)}>
                    <MaterialIcons name="add" size={20} color="#fff" />
                  </AddStepButton>
                </AddStepRow>
              </Card>
            );
          })}
        </Section>
      </ScrollView>

      {/* Sheet UI remains unchanged visually */}
      <Modal visible={sheetVisible} transparent animationType="none" onRequestClose={closeSheet}>
        <Backdrop onPress={closeSheet} />
        <Sheet style={{ transform: [{ translateY: slideAnim }] }}>
          <Handle />
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <SheetTitle>{editingGoal ? 'Edit Goal' : 'New Goal'}</SheetTitle>

              <Label>Title *</Label>
              <Input value={form.title} onChangeText={(v) => setForm(f => ({ ...f, title: v }))} />

              <Label>Deadline</Label>
              <Input value={form.deadline} onChangeText={(v) => setForm(f => ({ ...f, deadline: v }))} />

              <Label>Goal type</Label>

              <GoalTypeButton onPress={() => setShowGoalTypePicker(v => !v)}>
                <GoalTypeText>
                  {form.goalType === 'min'
                    ? 'Minimize (lower is better)'
                    : 'Maximize (higher is better)'}
                </GoalTypeText>
              </GoalTypeButton>

              {showGoalTypePicker && (
                <View style={{ marginTop: 8 }}>
                  {form.goalType !== 'max' && (
                    <GoalTypeOption
                      selected={false}
                      onPress={() => {
                        setForm(f => ({ ...f, goalType: 'max' }));
                        setShowGoalTypePicker(false);
                      }}
                    >
                      <GoalTypeOptionText>Maximize (higher is better)</GoalTypeOptionText>
                    </GoalTypeOption>
                  )}

                  {form.goalType !== 'min' && (
                    <GoalTypeOption
                      selected={false}
                      onPress={() => {
                        setForm(f => ({ ...f, goalType: 'min' }));
                        setShowGoalTypePicker(false);
                      }}
                    >
                      <GoalTypeOptionText>Minimize (lower is better)</GoalTypeOptionText>
                    </GoalTypeOption>
                  )}
                </View>
              )}

              <Label>Progress</Label>
              <InputRow>
                <InputWrap>
                  <Label>Current</Label>
                  <Input value={form.currentValue} onChangeText={(v) => setForm(f => ({ ...f, currentValue: v }))} />
                </InputWrap>

                <InputWrap>
                  <Label>Target</Label>
                  <Input value={form.targetValue} onChangeText={(v) => setForm(f => ({ ...f, targetValue: v }))} />
                </InputWrap>

                <InputWrap>
                  <Label>Unit</Label>
                  <Input value={form.unit} onChangeText={(v) => setForm(f => ({ ...f, unit: v }))} />
                </InputWrap>
              </InputRow>

              <ButtonRow>
                <CancelButton onPress={closeSheet}>
                  <CancelButtonText>Cancel</CancelButtonText>
                </CancelButton>

                <SaveButton onPress={handleSave}>
                  <SaveButtonText>Save</SaveButtonText>
                </SaveButton>
              </ButtonRow>
            </ScrollView>
          </KeyboardAvoidingView>
        </Sheet>
      </Modal>

      {/* Confirm delete */} 
      <Modal visible={!!confirmId} transparent animationType="fade" onRequestClose={() => setConfirmId(null)}>
        <ConfirmBackdrop onPress={() => setConfirmId(null)} activeOpacity={1} />
        <ConfirmBox>
          <ConfirmTitle>Delete Goal</ConfirmTitle>
          <ConfirmMessage> Are you sure you want to delete this goal and all its plan steps? This cannot be undone. </ConfirmMessage>
          <ConfirmButtonRow> 
            <CancelButton onPress={() => setConfirmId(null)} activeOpacity={0.7}>
              <CancelButtonText>Cancel</CancelButtonText>
            </CancelButton>
            <ConfirmDeleteButton onPress={() => { if (confirmId) removeGoal(confirmId); setConfirmId(null); }} activeOpacity={0.7} >
              <ConfirmDeleteButtonText>Delete</ConfirmDeleteButtonText> 
            </ConfirmDeleteButton> 
          </ConfirmButtonRow> 
        </ConfirmBox> 
      </Modal>

      {/* Confirm delete stays same (omitted for brevity) */}
    </Container>
  );
}
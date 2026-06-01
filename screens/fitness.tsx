import Container from "@/components/Container";
import { InsightCard } from "@/components/InsightCard";
import ConfirmDeleteModal from "@/components/fitness/ConfirmDeleteModal";
import FitnessHeader from "@/components/fitness/FitnessHeader";
import WorkoutCard from "@/components/fitness/WorkoutCard";
import WorkoutSheet, {
  EMPTY_FORM,
  FormState,
} from "@/components/fitness/WorkoutSheet";
import {
  Stat,
  StatLabel,
  StatRow,
  StatValue,
} from "@/components/fitness/styles";
import { FitnessEntry, WorkoutType } from "@/models/FitnessEntry";
import { useFitnessStore } from "@/store/FitnessStore";
import styled from "@emotion/native";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, ScrollView } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

const Section = styled.View(() => ({
  paddingHorizontal: 20,
  paddingTop: 24,
}));

const SectionTitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: "600",
  letterSpacing: 1,
  textTransform: "uppercase",
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

const EmptyText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
  textAlign: "center",
  paddingVertical: 32,
}));

export default function FitnessScreen() {
  const entries = useFitnessStore((s) => s.fitnessEntries);
  const getEntries = useFitnessStore((s) => s.getFitnessEntries);
  const addEntry = useFitnessStore((s) => s.addFitnessEntry);
  const updateEntry = useFitnessStore((s) => s.updateFitnessEntry);
  const removeEntry = useFitnessStore((s) => s.removeFitnessEntry);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FitnessEntry | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  useEffect(() => {
    getEntries();
  }, []);

  // ─── Weekly stats ───────────────────────────────────────────────────────────
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const weekEntries = entries.filter((e) => new Date(e.date) >= startOfWeek);
  const totalMinutes = weekEntries.reduce(
    (sum, e) => sum + e.durationMinutes,
    0,
  );
  const totalCalories = weekEntries.reduce(
    (sum, e) => sum + (e.caloriesBurned ?? 0),
    0,
  );
  const weeklyStats = [
    { label: "Workouts", value: String(weekEntries.length) },
    {
      label: "Total Time",
      value:
        totalMinutes >= 60
          ? `${(totalMinutes / 60).toFixed(1)}h`
          : `${totalMinutes}m`,
    },
    {
      label: "Calories",
      value: totalCalories > 0 ? totalCalories.toLocaleString() : "—",
    },
  ];

  // ─── Sheet ──────────────────────────────────────────────────────────────────
  function openSheet(entry?: FitnessEntry) {
    if (entry) {
      setEditingEntry(entry);
      setForm({
        date: entry.date,
        type: entry.type,
        durationMinutes: String(entry.durationMinutes),
        caloriesBurned: entry.caloriesBurned
          ? String(entry.caloriesBurned)
          : "",
        notes: entry.notes ?? "",
        exercises: (entry.exercises ?? []).map((e) => ({
          name: e.name,
          sets: e.sets ? String(e.sets) : "",
          reps: e.reps ? String(e.reps) : "",
          weightKg: e.weightKg ? String(e.weightKg) : "",
          durationMinutes: e.durationMinutes ? String(e.durationMinutes) : "",
          distanceKm: e.distanceKm ? String(e.distanceKm) : "",
          notes: e.notes ?? "",
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
      .filter((e: any) => e.name.trim())
      .map((e: any) => ({
        name: e.name,
        sets: e.sets ? Number(e.sets) : undefined,
        reps: e.reps ? Number(e.reps) : undefined,
        weightKg: e.weightKg ? Number(e.weightKg) : undefined,
        durationMinutes: e.durationMinutes
          ? Number(e.durationMinutes)
          : undefined,
        distanceKm: e.distanceKm ? Number(e.distanceKm) : undefined,
        notes: e.notes || undefined,
      }));
    const payload = {
      date: form.date,
      type: form.type as WorkoutType,
      durationMinutes: Number(form.durationMinutes),
      caloriesBurned: form.caloriesBurned
        ? Number(form.caloriesBurned)
        : undefined,
      notes: form.notes || undefined,
      exercises: exercises.length > 0 ? exercises : undefined,
    };
    if (editingEntry) {
      updateEntry({ ...editingEntry, ...payload });
    } else {
      addEntry({
        id: "fitness-" + Math.random().toString(36).substr(2, 9),
        ...payload,
      });
    }
    closeSheet();
  }

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FitnessHeader onAdd={() => openSheet()} />

        <InsightCard screen="fitness" />

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
            <EmptyText>
              No workouts logged yet. Tap Add to get started.
            </EmptyText>
          )}
          {[...entries].reverse().map((entry) => (
            <WorkoutCard
              key={entry.id}
              entry={entry}
              onEdit={openSheet}
              onDelete={setConfirmId}
            />
          ))}
        </Section>
      </ScrollView>

      <WorkoutSheet
        visible={sheetVisible}
        editingEntry={editingEntry}
        form={form}
        slideAnim={slideAnim}
        onClose={closeSheet}
        onSave={handleSave}
        onFormChange={setForm}
      />

      <ConfirmDeleteModal
        visible={!!confirmId}
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) removeEntry(confirmId);
          setConfirmId(null);
        }}
      />
    </Container>
  );
}

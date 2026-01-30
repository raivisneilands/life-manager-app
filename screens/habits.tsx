import Container from "@/components/Container";
import AddHabitRow from "@/components/habits/AddHabitRow";
import JournalSection from "@/components/habits/journal/JournalSection";
import HabitsSection from "@/components/today/HabitsSection";
import { useHabitStore } from "@/store/HabitStore";
import { useJournalStore } from "@/store/JournalStore";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { v4 as uuidv4 } from "uuid";

/* =========================
   STYLED COMPONENTS
========================= */

const Section = styled.View`
  margin-top: 24px;
  gap: 16px;
`;

/* ---------- Habit styles ---------- */

const AddRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const Input = styled.TextInput`
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px;
  font-size: 15px;
`;

const HabitList = styled.View`
  gap: 12px;
`;

const HabitRow = styled.View<{ completed?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 14px;
  border-radius: 14px;
  background-color: ${({ completed }) => (completed ? "#f1f1f1" : "#ffffff")};
  border: 1px solid ${({ completed }) => (completed ? "#e0e0e0" : "#eee")};
`;

const Checkbox = styled.View<{ checked?: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  margin-right: 14px;
  border: 2px solid ${({ checked }) => (checked ? "#005cbe" : "#bbb")};
  background-color: ${({ checked }) => (checked ? "#005cbe" : "transparent")};
`;

const HabitTitle = styled.Text<{ completed?: boolean }>`
  flex: 1;
  font-size: 16px;
  color: ${({ completed }) => (completed ? "#777" : "#222")};
  text-decoration: ${({ completed }) => (completed ? "line-through" : "none")};
`;

const HabitActions = styled.View`
  margin-left: 10px;
`;

/* ---------- Journal styles ---------- */

const Card = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #eee;
  gap: 14px;
`;

const JournalInput = styled.TextInput`
  min-height: 90px;
  font-size: 15px;
  line-height: 20px;
  color: #222;
`;

const EntryList = styled.View`
  gap: 14px;
`;

const Entry = styled.View`
  background-color: #fafafa;
  border-radius: 14px;
  padding: 14px;
  gap: 8px;
`;

const EntryHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const EntryMeta = styled.Text`
  font-size: 12px;
  color: #888;
`;

const EntryText = styled.Text`
  font-size: 15px;
  line-height: 20px;
  color: #222;
`;

const EntryActions = styled.View`
  flex-direction: row;
  gap: 16px;
`;

/* =========================
   COMPONENT
========================= */

export default function HabitsPage() {
  const today = new Date().toISOString().split("T")[0];

  // stores
  const habits = useHabitStore((s) => s.habits);
  const addHabit = useHabitStore((s) => s.addHabit);
  const removeHabit = useHabitStore((s) => s.removeHabit);
  const toggleHabit = useHabitStore((s) => s.toggleHabitCompletion);
  const getHabits = useHabitStore((s) => s.getHabits);

  const journalEntries = useJournalStore((s) => s.entries);
  const addJournalEntry = useJournalStore((s) => s.addEntry);
  const updateJournalEntry = useJournalStore((s) => s.updateEntry);
  const removeJournalEntry = useJournalStore((s) => s.removeEntry);
  const getJournalEntries = useJournalStore((s) => s.getEntries);

  // state
  const [newHabit, setNewHabit] = useState("");
  const [journalText, setJournalText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    getHabits();
    getJournalEntries();
  }, []);

  const addJournal = async () => {
    if (!journalText.trim()) return;

    await addJournalEntry({
      id: uuidv4(),
      date: today,
      content: journalText,
      createdAt: new Date().toISOString(),
    });

    setJournalText("");
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== HABITS ===== */}
        <Section>
          <AddHabitRow />
          <HabitsSection />
        </Section>
        {/* ===== JOURNAL ===== */}
        <Section>
          <JournalSection />
        </Section>
      </ScrollView>
    </Container>
  );
}

import Container from "@/components/Container";
import AddHabitRow from "@/components/habits/AddHabitRow";
import JournalSection from "@/components/habits/journal/JournalSection";
import { InsightCard } from "@/components/InsightCard";
import HabitsSection from "@/components/today/HabitsSection";
import { ScrollView } from "react-native";

export default function HabitsPage() {
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== HABITS ===== */}
        <InsightCard screen="habits" />

        <AddHabitRow />
        <HabitsSection allowRemove={true} />

        {/* ===== JOURNAL ===== */}

        <JournalSection />
      </ScrollView>
    </Container>
  );
}

import Container from '@/components/Container';
import AddHabitRow from '@/components/habits/AddHabitRow';
import JournalSection from '@/components/habits/journal/JournalSection';
import HabitsSection from '@/components/today/HabitsSection';
import { ScrollView } from 'react-native';

export default function HabitsPage() {
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== HABITS ===== */}

        <AddHabitRow />
        <HabitsSection allowRemove={true} />

        {/* ===== JOURNAL ===== */}

        <JournalSection />
      </ScrollView>
    </Container>
  );
}

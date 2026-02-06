import Container from '@/components/Container';
import AddHabitRow from '@/components/habits/AddHabitRow';
import JournalSection from '@/components/habits/journal/JournalSection';
import HabitsSection from '@/components/today/HabitsSection';
import styled from '@emotion/native';
import { ScrollView } from 'react-native';

/* =========================
   STYLED COMPONENTS
========================= */

const Section = styled.View`
  margin-top: 24px;
  gap: 16px;
`;

/* =========================
   COMPONENT
========================= */

export default function HabitsPage() {
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== HABITS ===== */}
        <Section>
          <AddHabitRow />
          <HabitsSection allowRemove />
        </Section>

        {/* ===== JOURNAL ===== */}
        <Section>
          <JournalSection />
        </Section>
      </ScrollView>
    </Container>
  );
}

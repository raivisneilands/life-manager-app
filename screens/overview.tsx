import Container from '@/components/Container';
import FinanceSummary from '@/components/overview/FinanceSummary';
import HealthCard from '@/components/overview/HealthCard';
import SectionCard from '@/components/overview/SectionCard';
import StreakCard from '@/components/overview/StreakCard';
import Title from '@/components/Title';
import { useFinanceStore } from '@/store/FinanceStore';
import { useHabitStore } from '@/store/HabitStore';
import { useHealthStore } from '@/store/HealthStore';
import { useTaskStore } from '@/store/TaskStore';
import styled from '@emotion/native';
import { ScrollView } from 'react-native';

/* =========================
   STYLED COMPONENTS
========================= */

const Section = styled.View`
  margin-top: 20px;
`;

const SectionTitle = styled.Text(({ theme }) => ({
  fontSize: 18,
  fontWeight: 'bold',
  color: theme.textPrimary,
  marginBottom: 10,
}));

const CardGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const StreakScroll = styled.ScrollView`
  margin-top: 10px;
`;

const StyledText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
}));

/* =========================
   COMPONENT
========================= */

export default function OverviewPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const habits = useHabitStore((s) => s.habits);
  const healthEntries = useHealthStore((s) => s.entries);
  const financeEntries = useFinanceStore((s) => s.entries);

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const todayTasks = tasks.filter((t) => t.date.split('T')[0] === today);
  const todayCompletedTasks = todayTasks.filter((t) => t.completed);

  const completedHabits = habits.filter((h) => h.lastCompletedDate === today);

  const yesterdayHealth = healthEntries
    .filter((h) => h.date.split('T')[0] === yesterday)
    .pop();

  const yesterdayFinance = financeEntries.filter(
    (f) => f.date.split('T')[0] === yesterday,
  );
  const totalIncome = yesterdayFinance
    .filter((f) => f.type === 'income')
    .reduce((acc, f) => acc + f.amount, 0);
  const totalExpense = yesterdayFinance
    .filter((f) => f.type === 'expense')
    .reduce((acc, f) => acc + f.amount, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Title>Overview</Title>

        {/* Tasks Section */}
        <Section>
          <SectionTitle>Today's Tasks</SectionTitle>
          <CardGrid>
            <SectionCard
              label="Completed"
              value={`${todayCompletedTasks.length} / ${todayTasks.length}`}
            />
            {todayCompletedTasks.length > 0 && (
              <SectionCard label="Tasks Done">
                {todayCompletedTasks.map((t) => (
                  <StyledText key={t.id}>- {t.title}</StyledText>
                ))}
              </SectionCard>
            )}
          </CardGrid>
        </Section>

        {/* Habits Section */}
        <Section>
          <SectionTitle>Habits</SectionTitle>
          <CardGrid>
            <SectionCard
              label="Completed Today"
              value={`${completedHabits.length} / ${habits.length}`}
            />
          </CardGrid>

          <StreakScroll horizontal contentContainerStyle={{ paddingRight: 10 }}>
            {habits.map((h) => (
              <StreakCard key={h.id} streak={h.streak} title={h.title} />
            ))}
          </StreakScroll>
        </Section>

        {/* Health Section */}
        <Section>
          <SectionTitle>Health (Yesterday)</SectionTitle>
          <HealthCard entry={yesterdayHealth} />
        </Section>

        {/* Finance Section */}
        <Section>
          <SectionTitle>Finance (Yesterday)</SectionTitle>
          <FinanceSummary
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            netBalance={netBalance}
          />
        </Section>
      </ScrollView>
    </Container>
  );
}

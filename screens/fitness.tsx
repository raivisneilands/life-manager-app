import styled from '@emotion/native';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView } from 'react-native';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.background,
}));

const Header = styled.View(({ theme }) => ({
  paddingHorizontal: 20,
  paddingVertical: 24,
  borderBottomWidth: 1,
  borderBottomColor: theme.border,
}));

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

const WORKOUTS = [
  {
    id: '1',
    name: 'Push Day',
    type: 'Strength',
    duration: '45 min',
    calories: '320 kcal',
    sets: '18 sets',
    exercises: [
      { name: 'Bench Press', detail: '4 sets × 8 reps — 80 kg' },
      { name: 'Shoulder Press', detail: '3 sets × 10 reps — 50 kg' },
      { name: 'Tricep Dips', detail: '3 sets × 12 reps' },
      { name: 'Lateral Raises', detail: '4 sets × 15 reps — 12 kg' },
    ],
  },
  {
    id: '2',
    name: 'Pull Day',
    type: 'Strength',
    duration: '50 min',
    calories: '340 kcal',
    sets: '20 sets',
    exercises: [
      { name: 'Deadlift', detail: '4 sets × 5 reps — 120 kg' },
      { name: 'Pull-ups', detail: '4 sets × 8 reps' },
      { name: 'Barbell Row', detail: '3 sets × 10 reps — 70 kg' },
      { name: 'Bicep Curls', detail: '3 sets × 12 reps — 20 kg' },
    ],
  },
  {
    id: '3',
    name: 'Morning Run',
    type: 'Cardio',
    duration: '35 min',
    calories: '280 kcal',
    sets: '5 km',
    exercises: [
      { name: 'Warm-up Walk', detail: '5 min' },
      { name: 'Steady Run', detail: '25 min — 5.2 min/km' },
      { name: 'Cool-down Walk', detail: '5 min' },
    ],
  },
];

const WEEKLY_STATS = [
  { label: 'Workouts', value: '4' },
  { label: 'Total Time', value: '3.2h' },
  { label: 'Calories', value: '1,240' },
  { label: 'Streak', value: '6 days' },
];

export default function FitnessScreen() {
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <Title>Fitness & Workouts</Title>
          <Subtitle>Track your training and stay consistent</Subtitle>
        </Header>

        <Section>
          <SectionTitle>This Week</SectionTitle>
          <Card>
            <StatRow>
              {WEEKLY_STATS.map((stat) => (
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
          {WORKOUTS.map((workout) => (
            <Card key={workout.id}>
              <CardRow>
                <CardTitle>{workout.name}</CardTitle>
                <Badge>
                  <BadgeText>{workout.type}</BadgeText>
                </Badge>
              </CardRow>
              <StatRow>
                <Stat>
                  <StatValue>{workout.duration}</StatValue>
                  <StatLabel>Duration</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{workout.calories}</StatValue>
                  <StatLabel>Calories</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{workout.sets}</StatValue>
                  <StatLabel>{workout.type === 'Cardio' ? 'Distance' : 'Sets'}</StatLabel>
                </Stat>
              </StatRow>
              {workout.exercises.map((exercise, index) => (
                <React.Fragment key={exercise.name}>
                  {index > 0 && <ExerciseDivider />}
                  <ExerciseRow>
                    <MaterialIcons name="fitness-center" size={16} color="#888" />
                    <ExerciseInfo>
                      <ExerciseName>{exercise.name}</ExerciseName>
                      <ExerciseDetail>{exercise.detail}</ExerciseDetail>
                    </ExerciseInfo>
                  </ExerciseRow>
                </React.Fragment>
              ))}
            </Card>
          ))}
        </Section>
      </ScrollView>
    </Container>
  );
}
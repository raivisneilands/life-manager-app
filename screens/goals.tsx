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
  flex: 1,
}));

const CardSubtitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 13,
  marginTop: 4,
  marginBottom: 12,
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

const ProgressBarTrack = styled.View(({ theme }) => ({
  height: 6,
  backgroundColor: theme.surface,
  borderRadius: 99,
  marginTop: 4,
  marginBottom: 8,
}));

const ProgressBarFill = styled.View(({ theme, progress }: { theme?: any; progress: number }) => ({
  height: 6,
  backgroundColor: theme.primary,
  borderRadius: 99,
  width: `${progress}%`,
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
  alignItems: 'flex-start',
  paddingVertical: 8,
  gap: 12,
}));

const PlanStepDivider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.border,
}));

const PlanStepInfo = styled.View(() => ({
  flex: 1,
}));

const PlanStepName = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 15,
  fontWeight: '500',
}));

const PlanStepDetail = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 13,
  marginTop: 2,
}));

const AddButton = styled.TouchableOpacity(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.surface,
  borderRadius: 10,
  padding: 12,
  marginTop: 8,
  gap: 8,
  borderWidth: 1,
  borderColor: theme.border,
}));

const AddButtonText = styled.Text(({ theme }) => ({
  color: theme.primary,
  fontSize: 14,
  fontWeight: '600',
}));

const GOALS = [
  {
    id: '1',
    title: 'Run a Half Marathon',
    category: 'Fitness',
    deadline: 'Jun 2025',
    progress: 45,
    progressLabel: '10.5 km of 21 km',
    plan: [
      { step: 'Build base mileage', detail: 'Run 3x per week, increase by 10% weekly' },
      { step: 'Long run on weekends', detail: 'Target 15 km by end of month' },
      { step: 'Strength training', detail: '2x per week to prevent injury' },
      { step: 'Race day preparation', detail: 'Taper 2 weeks before the event' },
    ],
  },
  {
    id: '2',
    title: 'Save €10,000',
    category: 'Finance',
    deadline: 'Dec 2025',
    progress: 62,
    progressLabel: '€6,200 of €10,000',
    plan: [
      { step: 'Automate monthly savings', detail: '€800 transferred on payday' },
      { step: 'Cut subscriptions', detail: 'Review and cancel unused services' },
      { step: 'Side income', detail: 'Freelance 5 hours per week' },
      { step: 'Track expenses', detail: 'Weekly finance review every Sunday' },
    ],
  },
  {
    id: '3',
    title: 'Read 24 Books',
    category: 'Personal',
    deadline: 'Dec 2025',
    progress: 29,
    progressLabel: '7 of 24 books',
    plan: [
      { step: 'Read 30 minutes daily', detail: 'Before bed, no phone' },
      { step: 'One book per topic', detail: 'Alternate fiction and non-fiction' },
      { step: 'Monthly review', detail: 'Write a short summary of each book' },
    ],
  },
];

export default function GoalsPage() {
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <Title>Goals</Title>
          <Subtitle>Define what you want and build a plan to get there</Subtitle>
        </Header>

        <Section>
          <SectionTitle>Active Goals</SectionTitle>
          {GOALS.map((goal) => (
            <Card key={goal.id}>
              <CardRow>
                <CardTitle>{goal.title}</CardTitle>
                <Badge>
                  <BadgeText>{goal.category}</BadgeText>
                </Badge>
              </CardRow>
              <CardSubtitle>Target: {goal.deadline}</CardSubtitle>

              <ProgressRow>
                <ProgressLabel>{goal.progressLabel}</ProgressLabel>
                <ProgressLabel>{goal.progress}%</ProgressLabel>
              </ProgressRow>
              <ProgressBarTrack>
                <ProgressBarFill progress={goal.progress} />
              </ProgressBarTrack>

              <Divider />

              <PlanTitle>Plan</PlanTitle>
              {goal.plan.map((step, index) => (
                <React.Fragment key={step.step}>
                  {index > 0 && <PlanStepDivider />}
                  <PlanStepRow>
                    <MaterialIcons name="check-circle-outline" size={18} color="#888" />
                    <PlanStepInfo>
                      <PlanStepName>{step.step}</PlanStepName>
                      <PlanStepDetail>{step.detail}</PlanStepDetail>
                    </PlanStepInfo>
                  </PlanStepRow>
                </React.Fragment>
              ))}

              <AddButton
                activeOpacity={0.7}
                onPress={() => console.log(`Add plan step to: ${goal.title}`)}
              >
                <MaterialIcons name="add" size={16} color="#6366F1" />
                <AddButtonText>Add Plan Step</AddButtonText>
              </AddButton>
            </Card>
          ))}
        </Section>

        <Section>
          <AddButton
            activeOpacity={0.7}
            onPress={() => console.log('Create new goal')}
            style={{ marginBottom: 32 }}
          >
            <MaterialIcons name="add" size={16} color="#6366F1" />
            <AddButtonText>New Goal</AddButtonText>
          </AddButton>
        </Section>
      </ScrollView>
    </Container>
  );
}
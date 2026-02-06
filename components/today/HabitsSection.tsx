import Title from '@/components/Title';
import { useHabitStore } from '@/store/HabitStore';
import styled from '@emotion/native';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Alert, ScrollView } from 'react-native';

// ---------- styled ----------
const HabitCard = styled.TouchableOpacity<{ done?: boolean }>(
  ({ theme, done }) => ({
    width: 110,
    height: 120,
    borderRadius: 14,
    backgroundColor: done ? theme.surface : theme.primary,
    marginRight: 12,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  }),
);

const HabitTitle = styled.Text<{ done?: boolean }>(({ theme, done }) => ({
  fontSize: 13,
  fontWeight: '600',
  textAlign: 'center',
  color: done ? theme.textSecondary : theme.textPrimary,
}));

const IconWrapper = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const CheckIcon = styled(EvilIcons)<{ done?: boolean }>(({ theme, done }) => ({
  color: done ? theme.success : theme.textPrimary,
}));

const StreakBadge = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 6,
  right: 6,
  backgroundColor: theme.success,
  borderRadius: 8,
  paddingVertical: 2,
  paddingHorizontal: 6,
}));

const StreakText = styled.Text(({ theme }) => ({
  fontSize: 11,
  color: theme.textPrimary,
  fontWeight: 'bold',
}));

type HabitsSectionProps = {
  allowRemove?: boolean;
};

// ---------- component ----------
export default function HabitsSection({ allowRemove }: HabitsSectionProps) {
  const habits = useHabitStore((s) => s.habits);
  const toggle = useHabitStore((s) => s.toggleHabitCompletion);
  const remove = useHabitStore((s) => s.removeHabit);

  const today = new Date().toISOString().split('T')[0];

  if (!habits.length) return null;

  const confirmRemove = (id: string, title: string) => {
    Alert.alert(
      'Delete habit?',
      `Are you sure you want to delete "${title}"?\nThis cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => remove(id),
        },
      ],
    );
  };

  return (
    <>
      <Title>Today's Habits</Title>

      <ScrollView horizontal contentContainerStyle={{ paddingVertical: 8 }}>
        {habits.map((h) => {
          const done = h.lastCompletedDate === today;

          return (
            <HabitCard
              key={h.id}
              done={done}
              onPress={() => toggle(h.id)}
              onLongPress={
                allowRemove ? () => confirmRemove(h.id, h.title) : undefined
              }
            >
              {h.streak > 0 && (
                <StreakBadge>
                  <StreakText>{h.streak}</StreakText>
                </StreakBadge>
              )}

              <IconWrapper>
                <CheckIcon name="check" size={36} done={done} />
              </IconWrapper>

              <HabitTitle done={done}>{h.title}</HabitTitle>
            </HabitCard>
          );
        })}
      </ScrollView>
    </>
  );
}

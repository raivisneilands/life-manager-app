import Title from '@/components/Title';
import { useHabitStore } from '@/store/HabitStore';
import styled from '@emotion/native';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useRef, useState } from 'react';
import { Modal, ScrollView, Vibration } from 'react-native';

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
  color: done ? theme.textSecondary : 'white',
}));

const IconWrapper = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const CheckIcon = styled(EvilIcons)<{ done?: boolean }>(({ theme, done }) => ({
  color: done ? theme.success : 'white',
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

const HintText = styled.Text(({ theme }) => ({
  fontSize: 12,
  color: theme.textSecondary,
  marginBottom: 10,
}));

const ModalOverlay = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.4)',
});

const ModalCard = styled.View(({ theme }) => ({
  width: '85%',
  borderRadius: 16,
  padding: 20,
  backgroundColor: theme.surface,
}));

const ModalTitle = styled.Text(({ theme }) => ({
  fontSize: 18,
  fontWeight: '700',
  color: theme.textPrimary,
  marginBottom: 10,
}));

const ModalText = styled.Text(({ theme }) => ({
  fontSize: 14,
  color: theme.textSecondary,
  marginBottom: 20,
}));

const ModalActions = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: 12,
});

const Button = styled.TouchableOpacity<{ variant?: 'danger' }>(
  ({ theme, variant }) => ({
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: variant === 'danger' ? theme.danger : theme.surface,
  }),
);

const ButtonText = styled.Text<{ variant?: 'danger' }>(
  ({ theme, variant }) => ({
    color: variant === 'danger' ? 'white' : theme.textPrimary,
    fontWeight: '600',
  }),
);

type HabitsSectionProps = {
  allowRemove?: boolean;
};

// ---------- component ----------
export default function HabitsSection({ allowRemove }: HabitsSectionProps) {
  const habits = useHabitStore((s) => s.habits);
  const toggle = useHabitStore((s) => s.toggleHabitCompletion);
  const remove = useHabitStore((s) => s.removeHabit);
  const longPressTriggered = useRef(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const today = new Date().toISOString().split('T')[0];

  if (!habits.length) return null;

  const confirmRemove = (id: string, title: string) => {
    setHabitToDelete({ id, title });
    setModalVisible(true);
  };

  return (
    <>
      <Title>Habits</Title>

      {allowRemove && <HintText>Hold on habit to remove</HintText>}

      <ScrollView
        horizontal
        contentContainerStyle={{ paddingVertical: 4 }}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {habits.map((h) => {
          const done = h.lastCompletedDate === today;

          return (
            <HabitCard
              key={h.id}
              done={done}
              onPress={() => {
                if (longPressTriggered.current) {
                  longPressTriggered.current = false;
                  return;
                }
                toggle(h.id);
              }}
              onLongPress={() => {
                if (!allowRemove) return;

                Vibration.vibrate(50);

                longPressTriggered.current = true;
                confirmRemove(h.id, h.title);
              }}
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
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalOverlay>
          <ModalCard>
            <ModalTitle>Delete habit?</ModalTitle>

            <ModalText>
              Are you sure you want to delete "{habitToDelete?.title}"? This
              cannot be undone.
            </ModalText>

            <ModalActions>
              <Button onPress={() => setModalVisible(false)}>
                <ButtonText>Cancel</ButtonText>
              </Button>

              <Button
                variant="danger"
                onPress={() => {
                  if (habitToDelete) remove(habitToDelete.id);
                  setModalVisible(false);
                }}
              >
                <ButtonText variant="danger">Delete</ButtonText>
              </Button>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      </Modal>
    </>
  );
}

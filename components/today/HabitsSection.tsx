import Title from "@/components/Title";
import { useHabitStore } from "@/store/HabitStore";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { ScrollView } from "react-native";
import styled from "styled-components/native";

// ---------- styled ----------
const HabitCard = styled.TouchableOpacity<{ done?: boolean }>`
  width: 110px;
  height: 120px;
  border-radius: 14px;
  background-color: ${({ done }) => (done ? "#dbe7ff" : "#005cbeff")};
  margin-right: 12px;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
`;

const HabitTitle = styled.Text<{ done?: boolean }>`
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  color: ${({ done }) => (done ? "#555" : "#fff")};
`;

const IconWrapper = styled.View`
  flex: 1;
  justify-content: center;
`;

const CheckIcon = styled(EvilIcons)<{ done?: boolean }>`
  color: ${({ done }) => (done ? "#4caf50" : "#fff")};
`;

const StreakBadge = styled.View`
  position: absolute;
  top: 6px;
  right: 6px;
  background-color: #ffb300;
  border-radius: 8px;
  padding: 2px 6px;
`;

const StreakText = styled.Text`
  font-size: 11px;
  color: #fff;
  font-weight: bold;
`;

// ---------- component ----------
export default function HabitsSection() {
  const habits = useHabitStore((s) => s.habits);
  const toggle = useHabitStore((s) => s.toggleHabitCompletion);

  const today = new Date().toISOString().split("T")[0];

  if (!habits.length) return null;

  return (
    <>
      <Title>Today's Habits</Title>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
      >
        {habits.map((h) => {
          const done = h.lastCompletedDate === today;

          return (
            <HabitCard key={h.id} done={done} onPress={() => toggle(h.id)}>
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

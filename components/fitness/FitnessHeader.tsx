import styled from "@emotion/native";
import { MaterialIcons } from "@expo/vector-icons";

const HeaderContainer = styled.View(({ theme }) => ({
  paddingBottom: 20,
  borderBottomWidth: 1,
  borderBottomColor: theme.border,
  justifyContent: "space-between",
}));

const HeaderText = styled.View(() => ({}));

const Title = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 28,
  fontWeight: "700",
}));

const Subtitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
  marginTop: 4,
}));

const AddButton = styled.TouchableOpacity(({ theme }) => ({
  backgroundColor: theme.primary,
  borderRadius: 10,
  paddingVertical: 8,
  paddingHorizontal: 14,
  marginTop: 16,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
}));

const AddButtonText = styled.Text(() => ({
  color: "#fff",
  fontSize: 14,
  fontWeight: "600",
}));

type Props = {
  onAdd: () => void;
};

export default function FitnessHeader({ onAdd }: Props) {
  return (
    <HeaderContainer>
      <HeaderText>
        <Title>Fitness & Workouts</Title>
        <Subtitle>Track your training and stay consistent</Subtitle>
      </HeaderText>
      <AddButton onPress={onAdd} activeOpacity={0.7}>
        <MaterialIcons name="add" size={16} color="#fff" />
        <AddButtonText>Add</AddButtonText>
      </AddButton>
    </HeaderContainer>
  );
}

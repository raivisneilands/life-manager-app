import styled from "@emotion/native";
import { MaterialIcons } from "@expo/vector-icons";

const Button = styled.TouchableOpacity(
  ({ theme, danger }: { theme?: any; danger?: boolean }) => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: danger ? theme.danger : theme.border,
    gap: 8,
    marginBottom: 12,
  }),
);

const ButtonText = styled.Text(
  ({ theme, danger }: { theme?: any; danger?: boolean }) => ({
    color: danger ? theme.danger : theme.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  }),
);

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  danger?: boolean;
  onPress: () => void;
};

export default function AccountActionButton({
  icon,
  label,
  danger,
  onPress,
}: Props) {
  return (
    <Button onPress={onPress} activeOpacity={0.7} danger={danger}>
      <MaterialIcons
        name={icon}
        size={18}
        color={danger ? "#EF4444" : "#888"}
      />
      <ButtonText danger={danger}>{label}</ButtonText>
    </Button>
  );
}

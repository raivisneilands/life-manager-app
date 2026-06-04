import styled from "@emotion/native";
import { TextInputProps } from "react-native";

const Label = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: "600",
  letterSpacing: 0.8,
  textTransform: "uppercase",
  marginBottom: 6,
  marginTop: 14,
}));

const Input = styled.TextInput(({ theme }) => ({
  backgroundColor: theme.surface,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 12,
  color: theme.textPrimary,
}));

type Props = {
  label: string;
  onChangeText: (text: string) => void;
} & TextInputProps;

export default function FormInput({ label, onChangeText, ...props }: Props) {
  return (
    <>
      <Label>{label}</Label>
      <Input
        placeholderTextColor="#888"
        onChangeText={onChangeText}
        {...props}
      />
    </>
  );
}

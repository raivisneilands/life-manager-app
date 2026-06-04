import styled from "@emotion/native";

const Wrapper = styled.TouchableOpacity(({ theme }) => ({
  width: 32,
  height: 32,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 8,
  backgroundColor: theme.primary + "12",
  borderWidth: 1,
  borderColor: theme.primary + "33",
  marginRight: 12,
}));

const Arrow = styled.Text(({ theme }) => ({
  fontSize: 18,
  color: theme.primary,
  includeFontPadding: false,
  lineHeight: 18,
  textAlign: "center",
  marginTop: -2,
}));

interface BackButtonProps {
  onPress: () => void;
  label?: string;
}

export function BackButton({ onPress }: BackButtonProps) {
  return (
    <Wrapper onPress={onPress} activeOpacity={0.7}>
      <Arrow>←</Arrow>
    </Wrapper>
  );
}

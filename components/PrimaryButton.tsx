import styled from '@emotion/native';
import { ReactNode } from 'react';

type PrimaryButtonProps = {
  children: ReactNode;
  onPress: () => void;
};

// ---------- styled ----------
const StyledButton = styled.TouchableOpacity(({ theme }) => ({
  backgroundColor: theme.primary,
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledButtonText = styled.Text(({ theme }) => ({
  color: '#ffffff', // or theme.surface if you prefer contrast
  fontSize: 14,
  fontWeight: 'bold',
}));

// ---------- component ----------
export default function PrimaryButton({
  children,
  onPress,
}: PrimaryButtonProps) {
  return (
    <StyledButton onPress={onPress}>
      <StyledButtonText>{children}</StyledButtonText>
    </StyledButton>
  );
}

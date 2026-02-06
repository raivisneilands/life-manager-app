import styled from '@emotion/native';
import { ReactNode } from 'react';

type TitleProps = {
  children: ReactNode;
};

const StyledTitle = styled.Text(({ theme }) => ({
  fontSize: 24,
  fontWeight: 'bold',
  color: theme.textPrimary,
  marginBottom: 16,
}));

export default function Title({ children }: TitleProps) {
  return <StyledTitle>{children}</StyledTitle>;
}

import styled from "@emotion/native";

const StyledHeader = styled.View(({ theme }) => ({
  paddingBottom: 8,
  borderBottomWidth: 1,
  borderBottomColor: theme.border,
  marginBottom: 32,
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

export default function Header() {
  return (
    <StyledHeader>
      <Title>Relationships</Title>
      <Subtitle>Stay connected with the people that matter</Subtitle>
    </StyledHeader>
  )
}
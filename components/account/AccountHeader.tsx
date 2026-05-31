import styled from "@emotion/native";

const HeaderContainer = styled.View(({ theme }) => ({
  paddingBottom: 20,
  borderBottomWidth: 1,
  borderBottomColor: theme.border,
  justifyContent: "space-between",
}));

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

type Props = {
  name: string;
  email: string;
};

export default function AccountHeader({ name, email }: Props) {
  return (
    <HeaderContainer>
      <Title>{name}</Title>
      <Subtitle>{email}</Subtitle>
    </HeaderContainer>
  );
}

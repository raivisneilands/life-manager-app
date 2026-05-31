import Container from "@/components/Container";
import { useAuth } from "@/contexts/AuthContext";
import AccountScreen from "@/screens/account";
import AuthScreen from "@/screens/auth";
import styled from "@emotion/native";

const LoadingContainer = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.background,
  alignItems: "center",
  justifyContent: "center",
}));

const LoadingText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
}));

export default function AccountTab() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

  return <Container>{session ? <AccountScreen /> : <AuthScreen />}</Container>;
}

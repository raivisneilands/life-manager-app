import { useAuth } from "@/contexts/AuthContext";
import styled from "@emotion/native";
import { useState } from "react";
import { Paywall } from "./Paywall";

const Container = styled.View(() => ({
  alignItems: "center",
  paddingVertical: 12,
}));

const IconContainer = styled.View(({ theme }) => ({
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: theme.background,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 10,
}));

const LockEmoji = styled.Text(() => ({
  fontSize: 19,
}));

const Title = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 15,
  fontWeight: "700",
  marginBottom: 5,
  textAlign: "center",
}));

const Description = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 13,
  lineHeight: 19,
  textAlign: "center",
  maxWidth: 320,
  marginBottom: 12,
}));

const Button = styled.TouchableOpacity(({ theme }) => ({
  backgroundColor: theme.textPrimary,
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 16,
  alignItems: "center",
}));

const ButtonText = styled.Text(({ theme }) => ({
  color: theme.background,
  fontSize: 13,
  fontWeight: "700",
}));

type Props = {
  title?: string;
  description?: string;
};

export default function ProFeatureLock({
  title = "Pro feature",
  description = "Upgrade to Pro to unlock this feature.",
}: Props) {
  const { isPro } = useAuth();
  const [paywallVisible, setPaywallVisible] = useState(false);

  // if (isPro) {
  //   return null;
  // }

  const handleUpgrade = () => {
    setPaywallVisible(true);
  };

  return (
    <>
      <Container>
        <IconContainer>
          <LockEmoji>🔒</LockEmoji>
        </IconContainer>

        <Title>{title}</Title>

        <Description>{description}</Description>

        <Button onPress={handleUpgrade} activeOpacity={0.8}>
          <ButtonText>Unlock with Pro</ButtonText>
        </Button>
      </Container>

      <Paywall
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
      />
    </>
  );
}

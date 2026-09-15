import styled from "@emotion/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, SafeAreaView } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import {
  getLifetimePackage,
  purchasePro,
  restorePurchases,
} from "@/utils/billing";

// ─── Props ─────────────────────────────────────────────────────────────────────

interface PaywallProps {
  visible: boolean;
  onClose: () => void;
}

// ─── Styled components ─────────────────────────────────────────────────────────

const Overlay = styled.View(() => ({
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.55)",
  justifyContent: "flex-end",
}));

const Container = styled.View(({ theme }) => ({
  backgroundColor: theme.background,
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  paddingHorizontal: 24,
  paddingTop: 12,
  paddingBottom: 32,
  maxHeight: "90%",
}));

const CloseButton = styled.Pressable(() => ({
  alignSelf: "flex-end",
  width: 36,
  height: 36,
  borderRadius: 18,
  alignItems: "center",
  justifyContent: "center",
}));

const CloseText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 24,
  lineHeight: 28,
}));

const IconContainer = styled.View(() => ({
  width: 64,
  height: 64,
  borderRadius: 32,
  backgroundColor: "#6366F1",
  alignSelf: "center",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 4,
  marginBottom: 18,
}));

const Icon = styled.Text(() => ({
  fontSize: 30,
}));

const Title = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 28,
  fontWeight: "700",
  textAlign: "center",
  marginBottom: 8,
}));

const Subtitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 15,
  lineHeight: 22,
  textAlign: "center",
  marginBottom: 24,
}));

const Features = styled.View(() => ({
  gap: 12,
  marginBottom: 26,
}));

const FeatureRow = styled.View(() => ({
  flexDirection: "row",
  alignItems: "center",
}));

const Check = styled.View(() => ({
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: "#6366F120",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
}));

const CheckText = styled.Text(() => ({
  color: "#6366F1",
  fontSize: 16,
  fontWeight: "700",
}));

const FeatureText = styled.Text(({ theme }) => ({
  flex: 1,
  color: theme.textPrimary,
  fontSize: 15,
}));

const PurchaseButton = styled.Pressable<{ disabled: boolean }>(
  ({ disabled }) => ({
    height: 54,
    borderRadius: 16,
    backgroundColor: disabled ? "#A5A5A5" : "#6366F1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    opacity: disabled ? 0.7 : 1,
  }),
);

const PurchaseButtonText = styled.Text(() => ({
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "700",
}));

const PriceText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  textAlign: "center",
  marginBottom: 14,
}));

const RestoreButton = styled.Pressable(() => ({
  alignItems: "center",
  paddingVertical: 8,
}));

const RestoreText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
  fontWeight: "500",
}));

const TermsText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  opacity: 0.65,
  fontSize: 11,
  lineHeight: 16,
  textAlign: "center",
  marginTop: 12,
}));

const LoginNotice = styled.View(({ theme }) => ({
  backgroundColor: theme.surface,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 10,
  padding: 12,
  marginBottom: 20,
}));

const LoginNoticeText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 13,
  lineHeight: 18,
  textAlign: "center",
}));

// ─── Component ─────────────────────────────────────────────────────────────────

export function Paywall({ visible, onClose }: PaywallProps) {
  const { session, syncProStatus } = useAuth();

  const [price, setPrice] = useState<string | null>(null);
  const [loadingPackage, setLoadingPackage] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const isAuthenticated = !!session?.user?.id;

  // ───────────────────────────────────────────────────────────────────────────
  // Load lifetime package
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (!session?.user?.id) {
      console.warn("Paywall opened without authenticated session.");
      return;
    }

    let mounted = true;

    const loadPackage = async () => {
      setLoadingPackage(true);

      try {
        const lifetimePackage = await getLifetimePackage();

        if (mounted && lifetimePackage) {
          setPrice(lifetimePackage.product.priceString);
        }
      } catch (error) {
        console.error("Failed to load Pro package:", error);
      } finally {
        if (mounted) {
          setLoadingPackage(false);
        }
      }
    };

    loadPackage();

    return () => {
      mounted = false;
    };
  }, [visible, session?.user?.id]);

  // ───────────────────────────────────────────────────────────────────────────
  // Purchase
  // ───────────────────────────────────────────────────────────────────────────

  const handlePurchase = async () => {
    if (purchasing || restoring) {
      return;
    }

    if (!session?.user?.id) {
      Alert.alert(
        "Sign in required",
        "Please sign in before purchasing Life Manager Pro.",
      );
      return;
    }

    setPurchasing(true);

    try {
      console.log("Starting Pro purchase...");

      await purchasePro();

      const synced = await syncProStatus();

      if (!synced) {
        throw new Error(
          "Your purchase was completed, but Pro access could not be synchronized yet. Please try Restore Purchases.",
        );
      }

      Alert.alert("You're now Pro!", "Thank you for upgrading.");
    } catch (error) {
      /*
       * RevenueCat cancellation is intentionally silent.
       */
      if (error instanceof Error && error.message === "PURCHASE_CANCELLED") {
        return;
      }

      console.error("Purchase failed:", error);

      Alert.alert(
        "Purchase failed",
        "We couldn't complete your purchase. Please try again.",
      );
    } finally {
      setPurchasing(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Restore
  // ───────────────────────────────────────────────────────────────────────────

  const handleRestore = async () => {
    if (purchasing || restoring) {
      return;
    }

    if (!session?.user?.id) {
      Alert.alert(
        "Sign in required",
        "Please sign in before restoring a purchase.",
      );
      return;
    }

    setRestoring(true);

    try {
      console.log("Restoring RevenueCat purchases...");

      await restorePurchases();

      const synced = await syncProStatus();

      if (synced) {
        Alert.alert("Purchase restored!", "Your Pro access has been restored.");
      } else {
        Alert.alert(
          "We couldn't find an active Pro purchase for this account.",
        );
      }
    } catch (error) {
      console.error("Restore failed:", error);

      Alert.alert(
        "Restore failed",
        "We couldn't restore your purchase. Please try again.",
      );
    } finally {
      setRestoring(false);
    }
  };

  const busy = purchasing || restoring || loadingPackage;

  // ───────────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={busy ? undefined : onClose}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Overlay>
          <Container>
            <CloseButton
              onPress={onClose}
              disabled={busy}
              accessibilityLabel="Close"
            >
              <CloseText>×</CloseText>
            </CloseButton>

            <IconContainer>
              <Icon>✨</Icon>
            </IconContainer>

            <Title>Unlock The Intelligence Behind Your Data</Title>

            <Subtitle>
              Get personalized AI insights across your life and turn your goals
              into actionable plans.
            </Subtitle>

            {!session?.user?.id && (
              <LoginNotice>
                <LoginNoticeText>
                  Please sign in to purchase or restore Life Manager Pro.
                </LoginNoticeText>
              </LoginNotice>
            )}

            <Features>
              <FeatureRow>
                <Check>
                  <CheckText>✓</CheckText>
                </Check>

                <FeatureText>Personalized AI insights</FeatureText>
              </FeatureRow>

              <FeatureRow>
                <Check>
                  <CheckText>✓</CheckText>
                </Check>

                <FeatureText>AI-generated goal plans</FeatureText>
              </FeatureRow>

              <FeatureRow>
                <Check>
                  <CheckText>✓</CheckText>
                </Check>

                <FeatureText>Lifetime Pro access</FeatureText>
              </FeatureRow>
            </Features>

            <PurchaseButton
              onPress={handlePurchase}
              disabled={busy || !isAuthenticated}
            >
              {purchasing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <PurchaseButtonText>
                  {price ? `Unlock Pro · ${price}` : "Unlock Pro"}
                </PurchaseButtonText>
              )}
            </PurchaseButton>

            <PriceText>One-time purchase · Lifetime access</PriceText>

            <RestoreButton
              onPress={handleRestore}
              disabled={busy || !isAuthenticated}
            >
              {restoring ? (
                <ActivityIndicator />
              ) : (
                <RestoreText>Restore Purchase</RestoreText>
              )}
            </RestoreButton>

            <TermsText>
              Life Manager Pro provides organizational and tracking features.
              AI-generated content is for informational purposes only and is not
              professional medical, financial, legal, or other professional
              advice.
            </TermsText>
          </Container>
        </Overlay>
      </SafeAreaView>
    </Modal>
  );
}

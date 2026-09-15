import { supabase } from "@/utils/supabase";
import styled from "@emotion/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.background,
}));

const Inner = styled.View(() => ({
  flex: 1,
  paddingHorizontal: 24,
  paddingTop: 48,
  paddingBottom: 32,
}));

const LogoArea = styled.View(() => ({
  alignItems: "center",
  marginBottom: 40,
}));

const LogoCircle = styled.View(({ theme }) => ({
  width: 72,
  height: 72,
  borderRadius: 20,
  backgroundColor: theme.primary,
  alignItems: "center",
  justifyContent: "center",
}));

const AppName = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 32,
  fontWeight: "800",
  letterSpacing: -0.5,
  marginTop: 12,
}));

const AppTagline = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
  marginTop: 4,
}));

const ToggleRow = styled.View(({ theme }) => ({
  flexDirection: "row",
  backgroundColor: theme.surface,
  borderRadius: 12,
  padding: 4,
  marginBottom: 32,
  borderWidth: 1,
  borderColor: theme.border,
}));

const ToggleButton = styled.TouchableOpacity(
  ({ theme, active }: { theme?: any; active: boolean }) => ({
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: active ? theme.card : "transparent",
    shadowColor: active ? "#000" : "transparent",
    shadowOpacity: active ? 0.08 : 0,
    shadowRadius: active ? 4 : 0,
    elevation: active ? 2 : 0,
  }),
);

const ToggleText = styled.Text(
  ({ theme, active }: { theme?: any; active: boolean }) => ({
    color: active ? theme.textPrimary : theme.textSecondary,
    fontSize: 15,
    fontWeight: active ? "700" : "500",
  }),
);

const Label = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: "600",
  letterSpacing: 0.8,
  textTransform: "uppercase",
  marginBottom: 6,
  marginTop: 14,
}));

const InputRow = styled.View(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: theme.surface,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 10,
  paddingHorizontal: 14,
}));

const Input = styled.TextInput(({ theme }) => ({
  flex: 1,
  paddingVertical: 12,
  color: theme.textPrimary,
  fontSize: 15,
}));

const SubmitButton = styled.TouchableOpacity(
  ({ theme, disabled }: { theme?: any; disabled?: boolean }) => ({
    backgroundColor: disabled ? theme.surface : theme.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 28,
  }),
);

const SubmitButtonText = styled.Text(
  ({ disabled }: { disabled?: boolean }) => ({
    color: disabled ? "#888" : "#fff",
    fontSize: 16,
    fontWeight: "700",
  }),
);

const StatusBanner = styled.View(
  ({ theme, type }: { theme?: any; type: "info" | "error" | "success" }) => ({
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor:
      type === "error"
        ? theme.danger + "22"
        : type === "success"
          ? "#22C55E22"
          : theme.primary + "22",
    borderWidth: 1,
    borderColor:
      type === "error"
        ? theme.danger
        : type === "success"
          ? "#22C55E"
          : theme.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  }),
);

const StatusText = styled.Text(
  ({ theme, type }: { theme?: any; type: "info" | "error" | "success" }) => ({
    color:
      type === "error"
        ? theme.danger
        : type === "success"
          ? "#22C55E"
          : theme.primary,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  }),
);

const ConfirmationActions = styled.View(() => ({
  marginTop: 12,
  gap: 10,
}));

const ConfirmationText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 13,
  lineHeight: 19,
  marginTop: 4,
}));

const ConfirmationEmail = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontWeight: "700",
}));

const SecondaryButton = styled.TouchableOpacity(
  ({ theme, disabled }: { theme?: any; disabled?: boolean }) => ({
    borderWidth: 1,
    borderColor: disabled ? theme.border : theme.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  }),
);

const SecondaryButtonText = styled.Text(
  ({ theme, disabled }: { theme?: any; disabled?: boolean }) => ({
    color: disabled ? theme.textSecondary : theme.primary,
    fontSize: 14,
    fontWeight: "700",
  }),
);

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "login" | "signup";

type StatusMessage = {
  type: "info" | "error" | "success";
  text: string;
} | null;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resendingConfirmation, setResendingConfirmation] = useState(false);

  const [status, setStatus] = useState<StatusMessage>(null);

  const [confirmationSent, setConfirmationSent] = useState(false);

  const redirectTo = "https://auth-callback-web.vercel.app/";

  // ─── Sign In ───────────────────────────────────────────────────────────────

  async function signInWithEmail() {
    setLoading(true);
    setStatus(null);

    const trimmedEmail = email.trim();

    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setStatus({
          type: "info",
          text: `Please confirm your email address first. Check your inbox or spam folder at ${trimmedEmail}.`,
        });
      } else {
        setStatus({
          type: "error",
          text: error.message,
        });
      }
    }

    setLoading(false);
  }

  // ─── Sign Up ───────────────────────────────────────────────────────────────

  async function signUpWithEmail() {
    setLoading(true);
    setStatus(null);
    setConfirmationSent(false);

    const trimmedEmail = email.trim();

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setStatus({
        type: "error",
        text: error.message,
      });
    } else if (data.session === null) {
      setPassword("");
      setConfirmationSent(true);
    } else {
      setStatus({
        type: "success",
        text: "Account created successfully!",
      });
    }

    setLoading(false);
  }

  // ─── Resend Confirmation ──────────────────────────────────────────────────

  async function resendConfirmationEmail() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    setResendingConfirmation(true);
    setStatus(null);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: trimmedEmail,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setStatus({
        type: "error",
        text: error.message,
      });
    } else {
      setStatus({
        type: "success",
        text: "If a confirmation email is available, we've sent another one. Please check your inbox and spam folder.",
      });
    }

    setResendingConfirmation(false);
  }

  // ─── Switch to Login ───────────────────────────────────────────────────────

  function switchToLogin() {
    setMode("login");
    setConfirmationSent(false);
    setStatus(null);
  }

  // ─── Submit ────────────────────────────────────────────────────────────────

  function handleSubmit() {
    if (mode === "login") {
      signInWithEmail();
    } else {
      signUpWithEmail();
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Inner>
            <LogoArea>
              <LogoCircle>
                <MaterialIcons name="self-improvement" size={36} color="#fff" />
              </LogoCircle>

              <AppName>Life Manager</AppName>

              <AppTagline>Your life, organised.</AppTagline>
            </LogoArea>

            <ToggleRow>
              <ToggleButton
                active={mode === "login"}
                onPress={() => {
                  setMode("login");
                  setStatus(null);
                  setConfirmationSent(false);
                }}
                activeOpacity={0.8}
              >
                <ToggleText active={mode === "login"}>Log In</ToggleText>
              </ToggleButton>

              <ToggleButton
                active={mode === "signup"}
                onPress={() => {
                  setMode("signup");
                  setStatus(null);
                  setConfirmationSent(false);
                }}
                activeOpacity={0.8}
              >
                <ToggleText active={mode === "signup"}>Sign Up</ToggleText>
              </ToggleButton>
            </ToggleRow>

            {status && (
              <StatusBanner type={status.type}>
                <MaterialIcons
                  name={
                    status.type === "error"
                      ? "error-outline"
                      : status.type === "success"
                        ? "check-circle-outline"
                        : "mail-outline"
                  }
                  size={18}
                  color={
                    status.type === "error"
                      ? "#EF4444"
                      : status.type === "success"
                        ? "#22C55E"
                        : "#6366F1"
                  }
                />

                <StatusText type={status.type}>{status.text}</StatusText>
              </StatusBanner>
            )}

            {confirmationSent && mode === "signup" && (
              <ConfirmationActions>
                <ConfirmationText>
                  If a confirmation email can be sent for this address, you'll
                  receive one shortly. Please check your inbox and spam or junk
                  folder.
                </ConfirmationText>

                <ConfirmationText>
                  Confirmation email for{" "}
                  <ConfirmationEmail>{email.trim()}</ConfirmationEmail>
                </ConfirmationText>

                <SecondaryButton
                  onPress={resendConfirmationEmail}
                  disabled={resendingConfirmation}
                  activeOpacity={0.8}
                >
                  <SecondaryButtonText disabled={resendingConfirmation}>
                    {resendingConfirmation
                      ? "Sending..."
                      : "Resend confirmation email"}
                  </SecondaryButtonText>
                </SecondaryButton>

                <SecondaryButton
                  onPress={switchToLogin}
                  disabled={resendingConfirmation}
                  activeOpacity={0.8}
                >
                  <SecondaryButtonText disabled={resendingConfirmation}>
                    Log In instead
                  </SecondaryButtonText>
                </SecondaryButton>
              </ConfirmationActions>
            )}

            <Label>Email</Label>

            <InputRow>
              <Input
                placeholder="email@address.com"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </InputRow>

            <Label>Password</Label>

            <InputRow>
              <Input
                placeholder="••••••••"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />

              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </InputRow>

            {!confirmationSent && (
              <SubmitButton
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={loading}
              >
                <SubmitButtonText disabled={loading}>
                  {loading
                    ? "Loading..."
                    : mode === "login"
                      ? "Sign In"
                      : "Sign Up"}
                </SubmitButtonText>
              </SubmitButton>
            )}
          </Inner>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

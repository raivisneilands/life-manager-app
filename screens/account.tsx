import AccountActionButton from "@/components/account/AccountActionButton";
import AccountAvatar from "@/components/account/AccountAvatar";
import AccountInfoCard, { InfoRow } from "@/components/account/AccountInfoCard";
import Container from "@/components/Container";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import styled from "@emotion/native";
import { useEffect, useState } from "react";
import { Alert, Modal, ScrollView } from "react-native";

const SectionTitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: "600",
  letterSpacing: 1,
  textTransform: "uppercase",
  marginBottom: 12,
  marginTop: 24,
}));

const EditModal = styled.View(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
}));

const EditBox = styled.View(({ theme }) => ({
  backgroundColor: theme.card,
  borderRadius: 16,
  padding: 24,
  width: "85%",
  borderWidth: 1,
  borderColor: theme.border,
}));

const EditTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 16,
}));

const Label = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: "600",
  letterSpacing: 0.8,
  textTransform: "uppercase",
  marginBottom: 6,
}));

const Input = styled.TextInput(({ theme }) => ({
  backgroundColor: theme.surface,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 12,
  color: theme.textPrimary,
  fontSize: 15,
  marginBottom: 16,
}));

const ButtonRow = styled.View(() => ({
  flexDirection: "row",
  gap: 12,
}));

const CancelButtonText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 15,
  fontWeight: "600",
}));

const SaveButton = styled.TouchableOpacity(({ theme }) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  backgroundColor: theme.primary,
  alignItems: "center",
}));

const SaveButtonText = styled.Text(() => ({
  color: "#fff",
  fontSize: 15,
  fontWeight: "600",
}));

const ConfirmBackdrop = styled.TouchableOpacity(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
}));

const ConfirmBox = styled.View(({ theme }) => ({
  position: "absolute",
  top: "40%",
  left: 24,
  right: 24,
  backgroundColor: theme.card,
  borderRadius: 16,
  padding: 24,
  borderWidth: 1,
  borderColor: theme.border,
}));

const ConfirmTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 8,
}));

const ConfirmMessage = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
  lineHeight: 20,
  marginBottom: 24,
}));

const ConfirmButtonRow = styled.View(() => ({
  flexDirection: "row",
  gap: 12,
}));

const BottomSpacer = styled.View(() => ({
  height: 32,
}));

const Backdrop = styled.Pressable(() => ({
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
  padding: 24,
}));

const ModalCard = styled.View(({ theme }) => ({
  borderRadius: 16,
  padding: 24,
  width: "100%",
  backgroundColor: theme.card,
  borderWidth: 1,
  borderColor: theme.border,
}));

const ModalTitle = styled.Text(({ theme }) => ({
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 8,
  color: theme.textPrimary,
}));

const ModalBody = styled.Text(({ theme }) => ({
  fontSize: 14,
  lineHeight: 20,
  marginBottom: 20,
  color: theme.textSecondary,
}));

const ModalErrorText = styled.Text(({ theme }) => ({
  color: theme.danger,
  marginBottom: 12,
  fontSize: 13,
}));

const CancelButton = styled.TouchableOpacity(({ theme }) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: theme.border,
  alignItems: "center",
}));

const CancelText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 15,
  fontWeight: "600",
}));

const DangerButton = styled.TouchableOpacity(({ theme }) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  backgroundColor: theme.danger,
  alignItems: "center",
}));

const DangerButtonText = styled.Text(() => ({
  color: "#fff",
  fontSize: 15,
  fontWeight: "600",
}));

type Profile = {
  username: string;
  website: string;
};

type EditField = "username" | "website" | null;

type ConfirmAction = {
  title: string;
  message: string;
  onConfirm: () => void;
};

export default function AccountScreen() {
  const { session, signOut, deleteAccount } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>({
    username: "",
    website: "",
  });
  const [editField, setEditField] = useState<EditField>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null,
  );

  const userId = session?.user?.id;
  const email = session?.user?.email;

  useEffect(() => {
    if (userId) getProfile();
  }, [userId]);

  async function getProfile() {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("profiles")
        .select("username, website")
        .eq("id", userId)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setProfile({
          username: data.username || "",
          website: data.website || "",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error loading profile", error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(field: "username" | "website", value: string) {
    try {
      setLoading(true);
      const updates = {
        id: userId,
        [field]: value,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;

      setProfile((prev) => ({ ...prev, [field]: value }));
      setEditField(null);
    } catch (error: any) {
      Alert.alert("Error updating profile", error.message);
    } finally {
      setLoading(false);
    }
  }

  function openEdit(field: "username" | "website") {
    setEditField(field);
    setEditValue(profile[field]);
  }

  const displayName = profile.username || email?.split("@")[0] || "User";
  const memberSince = session?.user?.created_at
    ? new Date(session.user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  const profileRows: InfoRow[] = [
    {
      icon: "person",
      iconBg: "#6366F1",
      label: "Username",
      value: profile.username || "Not set",
      onPress: () => openEdit("username"),
    },
    {
      icon: "email",
      iconBg: "#3B82F6",
      label: "Email Address",
      value: email || "",
    },
    {
      icon: "language",
      iconBg: "#10B981",
      label: "Website",
      value: profile.website || "Not set",
      onPress: () => openEdit("website"),
    },
  ];

  const accountRows: InfoRow[] = [
    {
      icon: "calendar-today",
      iconBg: "#8B5CF6",
      label: "Member Since",
      value: memberSince,
    },
  ];

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AccountAvatar name={displayName} email={email || ""} />

        <SectionTitle>Profile</SectionTitle>
        <AccountInfoCard rows={profileRows} />

        <SectionTitle>Account</SectionTitle>
        <AccountInfoCard rows={accountRows} />

        <SectionTitle>Actions</SectionTitle>
        <AccountActionButton
          icon="logout"
          label="Sign Out"
          onPress={() =>
            setConfirmAction({
              title: "Sign Out",
              message: "Are you sure you want to sign out?",
              onConfirm: async () => {
                await signOut();
                setConfirmAction(null);
              },
            })
          }
        />
        <AccountActionButton
          icon="delete-forever"
          label="Delete Account"
          danger
          onPress={() =>
            setConfirmAction({
              title: "Delete Account",
              message:
                "This will permanently delete your account and all associated data. This action cannot be undone.",
              onConfirm: async () => {
                const { error } = await deleteAccount();

                if (error) {
                  Alert.alert("Delete Failed", error);
                }

                setConfirmAction(null);
              },
            })
          }
        />

        <BottomSpacer />
      </ScrollView>

      {/* Edit field modal */}
      <Modal
        visible={!!editField}
        transparent
        animationType="fade"
        onRequestClose={() => setEditField(null)}
      >
        <EditModal>
          <EditBox>
            <EditTitle>Edit {editField}</EditTitle>
            <Label>{editField}</Label>
            <Input
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter ${editField}`}
              placeholderTextColor="#888"
              autoFocus
            />
            <ButtonRow>
              <CancelButton
                onPress={() => setEditField(null)}
                activeOpacity={0.7}
              >
                <CancelButtonText>Cancel</CancelButtonText>
              </CancelButton>
              <SaveButton
                onPress={() => editField && updateProfile(editField, editValue)}
                activeOpacity={0.7}
                disabled={loading}
              >
                <SaveButtonText>
                  {loading ? "Saving..." : "Save"}
                </SaveButtonText>
              </SaveButton>
            </ButtonRow>
          </EditBox>
        </EditModal>
      </Modal>

      {/* Confirm action modal */}
      <Modal
        visible={!!confirmAction}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmAction(null)}
      >
        <ConfirmBackdrop
          onPress={() => setConfirmAction(null)}
          activeOpacity={1}
        />
        <ConfirmBox>
          <ConfirmTitle>{confirmAction?.title}</ConfirmTitle>
          <ConfirmMessage>{confirmAction?.message}</ConfirmMessage>
          <ConfirmButtonRow>
            <CancelButton
              onPress={() => setConfirmAction(null)}
              activeOpacity={0.7}
            >
              <CancelButtonText>Cancel</CancelButtonText>
            </CancelButton>
            <DangerButton
              onPress={confirmAction?.onConfirm}
              activeOpacity={0.7}
            >
              <DangerButtonText>Confirm</DangerButtonText>
            </DangerButton>
          </ConfirmButtonRow>
        </ConfirmBox>
      </Modal>
    </Container>
  );
}

import { ThemeContext, ThemeMode } from "@/app/_layout";
import Container from "@/components/Container";
import { useAuth } from "@/contexts/AuthContext";
import { useFinanceStore } from "@/store/FinanceStore";
import { useFitnessStore } from "@/store/FitnessStore";
import { useGoalStore } from "@/store/GoalStore";
import { useHabitStore } from "@/store/HabitStore";
import { useHealthStore } from "@/store/HealthStore";
import { useJournalStore } from "@/store/JournalStore";
import { useRelationshipStore } from "@/store/RelationshipStore";
import { useSyncStore } from "@/store/syncStore";
import { useTaskStore } from "@/store/TaskStore";
import {
  downloadSupabaseToLocal,
  uploadLocalToSupabase,
} from "@/utils/migrateToSupabase";
import { supabase } from "@/utils/supabase";
import styled from "@emotion/native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  ScrollView,
  Switch
} from "react-native";

const isSyncing = () => useSyncStore.getState().syncEnabled;

const Header = styled.View(({ theme }) => ({
  paddingBottom: 20,
  borderBottomWidth: 1,
  borderBottomColor: theme.border,
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

const Section = styled.View(() => ({
  paddingTop: 24,
}));

const SectionTitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: "600",
  letterSpacing: 1,
  textTransform: "uppercase",
  marginBottom: 12,
}));

const Card = styled.View(({ theme }) => ({
  backgroundColor: theme.card,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.border,
  overflow: "hidden",
  marginBottom: 12,
}));

const SettingRow = styled.TouchableOpacity(() => ({
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 14,
  paddingHorizontal: 16,
  gap: 14,
}));

const RowDivider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.border,
  marginLeft: 46,
}));

const IconWrapper = styled.View(({ color }: { color: string }) => ({
  width: 30,
  height: 30,
  borderRadius: 8,
  backgroundColor: color,
  alignItems: "center",
  justifyContent: "center",
}));

const SettingInfo = styled.View(() => ({
  flex: 1,
}));

const SettingLabel = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 15,
  fontWeight: "500",
}));

const SettingSubtitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 13,
  marginTop: 2,
}));

const SettingValue = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
}));

const DangerLabel = styled.Text(({ theme }) => ({
  color: theme.danger,
  fontSize: 15,
  fontWeight: "500",
}));

const VersionText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  textAlign: "center",
  paddingVertical: 24,
}));

// ─── Confirm modal ────────────────────────────────────────────────────────────

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

const CancelButton = styled.TouchableOpacity(({ theme }) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: theme.border,
  alignItems: "center",
}));

const CancelButtonText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 15,
  fontWeight: "600",
}));

const ConfirmDeleteButton = styled.TouchableOpacity(({ theme }) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  backgroundColor: theme.danger,
  alignItems: "center",
}));

const ConfirmDeleteButtonText = styled.Text(() => ({
  color: "#fff",
  fontSize: 15,
  fontWeight: "600",
}));

// ─── Row components ───────────────────────────────────────────────────────────

type LinkSettingProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  label: string;
  subtitle?: string;
  value?: string;
  danger?: boolean;
  showDivider?: boolean;
  onPress: () => void;
};

function LinkSetting({
  icon,
  iconBg,
  label,
  subtitle,
  value,
  danger,
  showDivider,
  onPress,
}: LinkSettingProps) {
  return (
    <>
      <SettingRow activeOpacity={0.6} onPress={onPress}>
        <IconWrapper color={iconBg}>
          <MaterialIcons name={icon} size={16} color="#fff" />
        </IconWrapper>
        <SettingInfo>
          {danger ? (
            <DangerLabel>{label}</DangerLabel>
          ) : (
            <SettingLabel>{label}</SettingLabel>
          )}
          {subtitle && <SettingSubtitle>{subtitle}</SettingSubtitle>}
        </SettingInfo>
        {value && <SettingValue>{value}</SettingValue>}
        {!danger && (
          <MaterialIcons name="chevron-right" size={20} color="#888" />
        )}
      </SettingRow>
      {showDivider && <RowDivider />}
    </>
  );
}

function SwitchSetting({
  icon,
  iconBg,
  label,
  subtitle,
  value,
  onValueChange,
  showDivider,
}: SwitchSettingProps) {
  return (
    <>
      <SettingRow activeOpacity={1}>
        <IconWrapper color={iconBg}>
          <MaterialIcons name={icon} size={16} color="#fff" />
        </IconWrapper>
        <SettingInfo>
          <SettingLabel>{label}</SettingLabel>
          {subtitle && <SettingSubtitle>{subtitle}</SettingSubtitle>}
        </SettingInfo>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#6B7280", true: "#8B5CF6" }}
          thumbColor="#fff"
        />
      </SettingRow>
      {showDivider && <RowDivider />}
    </>
  );
}

interface SwitchSettingProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  showDivider?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

type ConfirmAction = {
  title: string;
  message: string;
  onConfirm: () => void;
};

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

export default function SettingsScreen() {
  const { themeMode, setThemeMode } = useContext(ThemeContext);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null,
  );
  const { syncEnabled, setSyncEnabled } = useSyncStore();
  const [showModal, setShowModal] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const { session } = useAuth(); // your existing AuthContext

  const clearTasks = useTaskStore((s) => s.clearTasks);
  const clearHabits = useHabitStore((s) => s.clearHabits);
  const clearHealth = useHealthStore((s) => s.clearEntries);
  const clearFinance = useFinanceStore((s) => s.clearEntries);
  const clearRelationships = useRelationshipStore((s) => s.clearRelationships);
  const clearFitness = useFitnessStore((s) => s.clearFitnessEntries);
  const clearGoals = useGoalStore((s) => s.clearGoals);
  const clearJournal = useJournalStore((s) => s.clearEntries);

  const handleSyncToggle = async (val: boolean) => {
    if (val && !session) {
      router.push("/account"); // or wherever your auth screen lives
      return;
    }
    if (val) {
      setShowModal(true); // ask user what to do with local data
    } else {
      await setSyncEnabled(false);
    }
  };

  const handleUpload = async () => {
    setMigrating(true);
    await uploadLocalToSupabase();
    await setSyncEnabled(true);
    setMigrating(false);
    setShowModal(false);
  };

  const handleDownload = async () => {
    setMigrating(true);
    await downloadSupabaseToLocal();
    await setSyncEnabled(true);
    setMigrating(false);
    setShowModal(false);
    // Re-init all stores so they pick up the new local data
    await useRelationshipStore.getState().getRelationships();
    await useGoalStore.getState().getGoals();
    await useFitnessStore.getState().getFitnessEntries();
    await useHabitStore.getState().getHabits();
    await useTaskStore.getState().getTasks();
    await useHealthStore.getState().getEntries();
    await useFinanceStore.getState().getEntries();
    await useJournalStore.getState().getEntries();
  };

  async function handleClearAllData() {
    await Promise.all([
      clearTasks(),
      clearHabits(),
      clearHealth(),
      clearFinance(),
      clearRelationships(),
      clearFitness(),
      clearGoals(),
      clearJournal(),
    ]);

    if (isSyncing()) {
      const { data } = await supabase.auth.getSession();
      const user_id = data.session?.user.id;
      if (user_id) {
        await Promise.all([
          supabase.from("tasks").delete().eq("user_id", user_id),
          supabase.from("habits").delete().eq("user_id", user_id),
          supabase.from("health_entries").delete().eq("user_id", user_id),
          supabase.from("finance_entries").delete().eq("user_id", user_id),
          supabase.from("relationships").delete().eq("user_id", user_id),
          supabase.from("fitness_entries").delete().eq("user_id", user_id),
          supabase.from("goals").delete().eq("user_id", user_id),
          supabase.from("journal_entries").delete().eq("user_id", user_id),
        ]);
      }
    }
    setConfirmAction(null);
  }

  function handleRateApp() {
    const packageName = "com.lifemanager.lifemanagerproapp";
    Linking.openURL(`market://details?id=${packageName}`).catch(() => {
      Linking.openURL(
        `https://play.google.com/store/apps/details?id=${packageName}`,
      );
    });
  }

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <Title>Settings</Title>
          <Subtitle>Manage your preferences</Subtitle>
        </Header>

        <Section>
          <SectionTitle>Appearance</SectionTitle>
          <Card>
            {THEME_OPTIONS.map((option, index) => (
              <LinkSetting
                key={option.value}
                icon={
                  option.value === "light"
                    ? "light-mode"
                    : option.value === "dark"
                      ? "dark-mode"
                      : "brightness-auto"
                }
                iconBg={themeMode === option.value ? "#8B5CF6" : "#6B7280"}
                label={option.label}
                value={themeMode === option.value ? "✓" : ""}
                showDivider={index < THEME_OPTIONS.length - 1}
                onPress={() => setThemeMode(option.value)}
              />
            ))}
          </Card>
        </Section>

        <Section>
          <SectionTitle>Data & Sync</SectionTitle>
          <Card>
            <SwitchSetting
              icon="backup"
              iconBg={syncEnabled ? "#8B5CF6" : "#6B7280"}
              label="Sync to cloud"
              subtitle="Requires an account"
              value={syncEnabled}
              onValueChange={handleSyncToggle}
            />
          </Card>
        </Section>

        <Section>
          <SectionTitle>About</SectionTitle>
          <Card>
            <LinkSetting
              icon="info"
              iconBg="#6366F1"
              label="App Version"
              value="1.0.0"
              showDivider
              onPress={() => {}}
            />
            <LinkSetting
              icon="description"
              iconBg="#8B5CF6"
              label="Privacy Policy"
              showDivider
              onPress={() => router.push("/settings/privacy")}
            />
            <LinkSetting
              icon="gavel"
              iconBg="#6B7280"
              label="Terms of Service"
              onPress={() => router.push("/settings/terms")}
              showDivider
            />
            <LinkSetting
              icon="star-rate"
              iconBg="#F59E0B"
              label="Rate This App"
              onPress={handleRateApp}
            />
          </Card>
        </Section>

        <Section>
          <SectionTitle>Data</SectionTitle>
          <Card>
            <LinkSetting
              icon="delete-sweep"
              iconBg="#EF4444"
              label="Clear All Data"
              subtitle="Permanently deletes everything"
              danger
              onPress={() =>
                setConfirmAction({
                  title: "Clear All Data",
                  message:
                    "This will permanently delete all your tasks, habits, health entries, finance entries, relationships, fitness logs, and goals. This cannot be undone.",
                  onConfirm: handleClearAllData,
                })
              }
            />
          </Card>
        </Section>

        <VersionText>Life Manager v1.0.0 — Mindset Boost</VersionText>
      </ScrollView>

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
            <ConfirmDeleteButton
              onPress={confirmAction?.onConfirm}
              activeOpacity={0.7}
            >
              <ConfirmDeleteButtonText>Delete</ConfirmDeleteButtonText>
            </ConfirmDeleteButton>
          </ConfirmButtonRow>
        </ConfirmBox>
      </Modal>
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => !migrating && setShowModal(false)}
      >
        <ConfirmBackdrop
          onPress={() => !migrating && setShowModal(false)}
          activeOpacity={1}
        />
        <ConfirmBox>
          <ConfirmTitle>You have existing local data</ConfirmTitle>
          <ConfirmMessage>What would you like to do with it?</ConfirmMessage>

          {migrating ? (
            <ActivityIndicator style={{ marginVertical: 16 }} />
          ) : (
            <ConfirmButtonRow>
              <CancelButton onPress={handleDownload} activeOpacity={0.7}>
                <CancelButtonText>Use cloud data</CancelButtonText>
              </CancelButton>
              <ConfirmDeleteButton onPress={handleUpload} activeOpacity={0.7}>
                <ConfirmDeleteButtonText>Upload local</ConfirmDeleteButtonText>
              </ConfirmDeleteButton>
            </ConfirmButtonRow>
          )}
        </ConfirmBox>
      </Modal>
    </Container>
  );
}

import styled from '@emotion/native';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Switch } from 'react-native';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.background,
}));

const Header = styled.View(({ theme }) => ({
  paddingHorizontal: 20,
  paddingVertical: 24,
  borderBottomWidth: 1,
  borderBottomColor: theme.border,
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

const Section = styled.View(() => ({
  paddingHorizontal: 20,
  paddingTop: 24,
}));

const SectionTitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: '600',
  letterSpacing: 1,
  textTransform: 'uppercase',
  marginBottom: 12,
}));

const Card = styled.View(({ theme }) => ({
  backgroundColor: theme.card,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.border,
  overflow: 'hidden',
  marginBottom: 12,
}));

const SettingRow = styled.TouchableOpacity(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
  paddingHorizontal: 16,
  gap: 14,
}));

const SettingRowStatic = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
  paddingHorizontal: 16,
  gap: 14,
}));

const RowDivider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.border,
  marginLeft: 46,
}));

const IconWrapper = styled.View(({ theme, color }: { theme?: any; color: string }) => ({
  width: 30,
  height: 30,
  borderRadius: 8,
  backgroundColor: color,
  alignItems: 'center',
  justifyContent: 'center',
}));

const SettingInfo = styled.View(() => ({
  flex: 1,
}));

const SettingLabel = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 15,
  fontWeight: '500',
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

const ProfileCard = styled.View(({ theme }) => ({
  backgroundColor: theme.card,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.border,
  padding: 16,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 14,
  marginBottom: 12,
}));

const Avatar = styled.View(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: theme.primary,
  alignItems: 'center',
  justifyContent: 'center',
}));

const AvatarText = styled.Text(() => ({
  color: '#fff',
  fontSize: 20,
  fontWeight: '700',
}));

const ProfileInfo = styled.View(() => ({
  flex: 1,
}));

const ProfileName = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 17,
  fontWeight: '700',
}));

const ProfileEmail = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 13,
  marginTop: 2,
}));

const DangerText = styled.Text(({ theme }) => ({
  color: theme.danger,
  fontSize: 15,
  fontWeight: '500',
}));

const VersionText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  textAlign: 'center',
  paddingVertical: 24,
}));

type ToggleSettingProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  showDivider?: boolean;
};

function ToggleSetting({ icon, iconBg, label, subtitle, value, onValueChange, showDivider }: ToggleSettingProps) {
  return (
    <>
      <SettingRowStatic>
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
          trackColor={{ false: '#555', true: '#6366F1' }}
          thumbColor="#fff"
        />
      </SettingRowStatic>
      {showDivider && <RowDivider />}
    </>
  );
}

type LinkSettingProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  label: string;
  value?: string;
  subtitle?: string;
  showDivider?: boolean;
  danger?: boolean;
  onPress?: () => void;
};

function LinkSetting({ icon, iconBg, label, value, subtitle, showDivider, danger, onPress }: LinkSettingProps) {
  return (
    <>
      <SettingRow activeOpacity={0.6} onPress={onPress ?? (() => console.log(`Tapped: ${label}`))}>
        <IconWrapper color={iconBg}>
          <MaterialIcons name={icon} size={16} color="#fff" />
        </IconWrapper>
        <SettingInfo>
          {danger ? <DangerText>{label}</DangerText> : <SettingLabel>{label}</SettingLabel>}
          {subtitle && <SettingSubtitle>{subtitle}</SettingSubtitle>}
        </SettingInfo>
        {value && <SettingValue>{value}</SettingValue>}
        {!danger && <MaterialIcons name="chevron-right" size={20} color="#888" />}
      </SettingRow>
      {showDivider && <RowDivider />}
    </>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = React.useState(true);
  const [dailyReminder, setDailyReminder] = React.useState(true);
  const [biometrics, setBiometrics] = React.useState(false);
  const [icloudSync, setIcloudSync] = React.useState(true);

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <Title>Settings</Title>
          <Subtitle>Manage your preferences and account</Subtitle>
        </Header>

        <Section>
          <SectionTitle>Profile</SectionTitle>
          <ProfileCard>
            <Avatar>
              <AvatarText>JD</AvatarText>
            </Avatar>
            <ProfileInfo>
              <ProfileName>John Doe</ProfileName>
              <ProfileEmail>john.doe@email.com</ProfileEmail>
            </ProfileInfo>
            <MaterialIcons name="chevron-right" size={20} color="#888" />
          </ProfileCard>
        </Section>

        <Section>
          <SectionTitle>Notifications</SectionTitle>
          <Card>
            <ToggleSetting
              icon="notifications"
              iconBg="#6366F1"
              label="Push Notifications"
              subtitle="Reminders and updates"
              value={notifications}
              onValueChange={setNotifications}
              showDivider
            />
            <ToggleSetting
              icon="alarm"
              iconBg="#F59E0B"
              label="Daily Reminder"
              subtitle="Get nudged to log your day"
              value={dailyReminder}
              onValueChange={setDailyReminder}
            />
          </Card>
        </Section>

        <Section>
          <SectionTitle>Appearance</SectionTitle>
          <Card>
            <LinkSetting
              icon="brightness-6"
              iconBg="#8B5CF6"
              label="Theme"
              value="System"
              showDivider
            />
            <LinkSetting
              icon="text-fields"
              iconBg="#3B82F6"
              label="Font Size"
              value="Medium"
            />
          </Card>
        </Section>

        <Section>
          <SectionTitle>Security</SectionTitle>
          <Card>
            <ToggleSetting
              icon="fingerprint"
              iconBg="#10B981"
              label="Biometric Lock"
              subtitle="Use Face ID or fingerprint"
              value={biometrics}
              onValueChange={setBiometrics}
              showDivider
            />
            <LinkSetting
              icon="lock"
              iconBg="#6B7280"
              label="Change PIN"
            />
          </Card>
        </Section>

        <Section>
          <SectionTitle>Data & Sync</SectionTitle>
          <Card>
            <ToggleSetting
              icon="cloud"
              iconBg="#0EA5E9"
              label="iCloud Sync"
              subtitle="Keep your data backed up"
              value={icloudSync}
              onValueChange={setIcloudSync}
              showDivider
            />
            <LinkSetting
              icon="download"
              iconBg="#14B8A6"
              label="Export Data"
              subtitle="Download all your data as CSV"
              showDivider
            />
            <LinkSetting
              icon="delete-sweep"
              iconBg="#6B7280"
              label="Clear Cache"
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
            />
            <LinkSetting
              icon="description"
              iconBg="#8B5CF6"
              label="Privacy Policy"
              showDivider
            />
            <LinkSetting
              icon="gavel"
              iconBg="#6B7280"
              label="Terms of Service"
            />
          </Card>
        </Section>

        <Section>
          <SectionTitle>Account</SectionTitle>
          <Card>
            <LinkSetting
              icon="logout"
              iconBg="#F59E0B"
              label="Sign Out"
              showDivider
            />
            <LinkSetting
              icon="delete-forever"
              iconBg="#EF4444"
              label="Delete Account"
              danger
            />
          </Card>
        </Section>

        <VersionText>MyApp v1.0.0 — Made with ♥</VersionText>
      </ScrollView>
    </Container>
  );
}
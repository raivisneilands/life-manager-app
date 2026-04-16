import styled from '@emotion/native';
import { Linking, ScrollView } from 'react-native';

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
  fontSize: 26,
  fontWeight: '700',
}));

const Subtitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 13,
  marginTop: 4,
}));

const Content = styled.View(() => ({
  paddingHorizontal: 20,
  paddingVertical: 24,
  gap: 20,
}));

const Section = styled.View(() => ({
  gap: 6,
}));

const SectionTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 16,
  fontWeight: '600',
}));

const Paragraph = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
  lineHeight: 20,
}));

export default function PrivacyPolicyScreen() {
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <Title>Privacy Policy</Title>
          <Subtitle>Life Manager • Effective date: 05.04.2026</Subtitle>
        </Header>

        <Content>
          <Paragraph>
            Life Manager respects your privacy. This app is designed to help you
            manage your life without collecting or sharing your personal data.
          </Paragraph>

          <Section>
            <SectionTitle>1. Information You Provide</SectionTitle>
            <Paragraph>
              You may enter personal data such as tasks, habits, health
              information (e.g. weight, sleep, water intake), financial records
              (income and expenses), and journal entries.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>2. How Your Data Is Used</SectionTitle>
            <Paragraph>
              Your data is used only within the app to provide core features like
              tracking, organization, and progress insights.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>3. Data Storage</SectionTitle>
            <Paragraph>
              All data is stored locally on your device. We do not use cloud
              storage or external servers.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>4. Data Sharing</SectionTitle>
            <Paragraph>
              We do not collect, sell, or share your data with third parties.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>5. Security</SectionTitle>
            <Paragraph>
              Your data security depends on your device’s built-in protections.
              We do not transmit your data.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>6. Your Control</SectionTitle>
            <Paragraph>
              You can edit or delete your data at any time within the app, or
              remove all data by uninstalling it.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>7. Children’s Privacy</SectionTitle>
            <Paragraph>
              This app is not intended for children under 13.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>8. Changes</SectionTitle>
            <Paragraph>
              This policy may be updated in the future. Any changes will be
              reflected on this page.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>9. Contact</SectionTitle>
            <Paragraph onPress={() => Linking.openURL('mailto:lifemanager.tracker@gmail.com')}>
              Email: lifemanager.tracker@gmail.com
            </Paragraph>
          </Section>
        </Content>
      </ScrollView>
    </Container>
  );
}
import styled from '@emotion/native';
import { ScrollView } from 'react-native';

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
  paddingTop: 24,
  paddingBottom: 40,
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

export default function TermsOfServiceScreen() {
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <Title>Terms of Service</Title>
          <Subtitle>Life Manager • Effective date: 05.04.2026</Subtitle>
        </Header>

        <Content>
          <Paragraph>
            These Terms of Service govern your use of the Life Manager app. By
            using the app, you agree to these terms.
          </Paragraph>

          <Section>
            <SectionTitle>1. Use of the App</SectionTitle>
            <Paragraph>
              Life Manager is provided as a personal productivity tool to help
              you track and manage various aspects of your life. You agree to use
              the app responsibly and only for lawful purposes.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>2. No Professional Advice</SectionTitle>
            <Paragraph>
              Life Manager may include features related to health, fitness, and
              finances. The app does not provide medical, financial, or legal
              advice. You should consult a qualified professional before making
              decisions based on information recorded in the app.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>3. Data and Storage</SectionTitle>
            <Paragraph>
              All data is stored locally on your device. You are solely
              responsible for maintaining access to your device and your data.
              We are not responsible for any data loss.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>4. Data Deletion</SectionTitle>
            <Paragraph>
              The app allows you to permanently delete your data. This action
              cannot be undone. You are responsible for confirming such actions.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>5. Availability</SectionTitle>
            <Paragraph>
              We strive to keep the app functioning properly, but we do not
              guarantee that the app will always be available, error-free, or
              uninterrupted.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>6. Limitation of Liability</SectionTitle>
            <Paragraph>
              To the maximum extent permitted by law, Life Manager shall not be
              liable for any indirect, incidental, or consequential damages,
              including loss of data, loss of profits, or personal outcomes
              resulting from the use of the app.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>7. Changes to the App</SectionTitle>
            <Paragraph>
              We may update or modify the app at any time without prior notice,
              including adding or removing features.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>8. Changes to Terms</SectionTitle>
            <Paragraph>
              These Terms may be updated in the future. Continued use of the app
              after changes means you accept the updated Terms.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>9. Contact</SectionTitle>
            <Paragraph>
              Email: lifemanager.tracker@gmail.com
            </Paragraph>
          </Section>
        </Content>
      </ScrollView>
    </Container>
  );
}
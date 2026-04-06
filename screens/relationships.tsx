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
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: theme.border,
}));

const CardTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 16,
  fontWeight: '600',
}));

const CardSubtitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 13,
  marginTop: 4,
}));

const PLACEHOLDER_RELATIONSHIPS = [
  { id: '1', name: 'John Doe', note: 'Last contacted 3 days ago' },
  { id: '2', name: 'Jane Smith', note: 'Birthday coming up' },
  { id: '3', name: 'Bob Johnson', note: 'Last contacted 2 weeks ago' },
];

export default function RelationshipsPage() {
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <Title>Relationships</Title>
          <Subtitle>Stay connected with the people that matter</Subtitle>
        </Header>

        <Section>
          <SectionTitle>People</SectionTitle>
          {PLACEHOLDER_RELATIONSHIPS.map((person) => (
            <Card key={person.id}>
              <CardTitle>{person.name}</CardTitle>
              <CardSubtitle>{person.note}</CardSubtitle>
            </Card>
          ))}
        </Section>
      </ScrollView>
    </Container>
  );
}
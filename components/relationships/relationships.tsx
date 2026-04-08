import { useRelationshipStore } from "@/store/RelationshipStore";
import styled from "@emotion/native";
import { router } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native";

const Section = styled.View(() => ({
  marginVertical: 24,
  paddingBottom: 32,
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

const CardRow = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const TypeBadge = styled.View(({ theme }) => ({
  backgroundColor: theme.surface,
  borderRadius: 8,
  paddingVertical: 4,
  paddingHorizontal: 10,
}));

const TypeBadgeText = styled.Text(({ theme }) => ({
  color: theme.primary,
  fontSize: 12,
  fontWeight: '600',
}));

export default function Relationships() {
  const relationships = useRelationshipStore((s) => s.relationships);
  
  return (
    <Section>
      <SectionTitle>People</SectionTitle>
      <ScrollView showsVerticalScrollIndicator={false}>
        {relationships.map((person) => (
          <TouchableOpacity
            key={person.id}
            activeOpacity={0.7}
            onPress={() => router.push(`/relationships/${person.id}`)}
          >
            <Card>
              <CardRow>
                <CardTitle>{person.name}</CardTitle>
                {person.type && (
                  <TypeBadge>
                    <TypeBadgeText>{person.type}</TypeBadgeText>
                  </TypeBadge>
                )}
              </CardRow>
              {person.birthday && <CardSubtitle>🎂 {person.birthday}</CardSubtitle>}
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Section>
  )
}
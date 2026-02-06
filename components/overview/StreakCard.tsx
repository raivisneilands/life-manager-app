import styled from '@emotion/native';

const Card = styled.View(({ theme }) => ({
  width: 90,
  backgroundColor: theme.card,
  padding: 10,
  borderRadius: 10,
  marginRight: 10,
  marginBottom: 10,
  alignItems: 'center',
}));

const StreakValue = styled.Text(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: 16,
  color: theme.primary,
}));

const StreakLabel = styled.Text(({ theme }) => ({
  fontSize: 12,
  color: theme.textSecondary,
  textAlign: 'center',
}));

interface StreakCardProps {
  streak: number;
  title: string;
}

export default function StreakCard({ streak, title }: StreakCardProps) {
  return (
    <Card>
      <StreakValue>{streak} 🔥</StreakValue>
      <StreakLabel>{title}</StreakLabel>
    </Card>
  );
}

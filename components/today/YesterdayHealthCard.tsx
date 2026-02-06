import { useHealthStore } from '@/store/HealthStore';
import formatDateTime from '@/utils/formatDateTime';
import styled from '@emotion/native';

// ---------- styled ----------
const Card = styled.View(({ theme }) => ({
  backgroundColor: theme.surface,
  borderRadius: 12,
  padding: 16,
  marginTop: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
}));

const Header = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 12,
});

const TitleText = styled.Text(({ theme }) => ({
  fontSize: 16,
  fontWeight: 'bold',
  color: theme.primary,
}));

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 6,
});

const Label = styled.Text(({ theme }) => ({
  fontSize: 14,
  color: theme.textSecondary,
}));

const Value = styled.Text(({ theme }) => ({
  fontSize: 14,
  fontWeight: 'bold',
  color: theme.textPrimary,
}));

// ---------- component ----------
export default function YesterdayHealthCard() {
  const entries = useHealthStore((s) => s.entries);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yDate = yesterday.toISOString().split('T')[0];

  const entry = entries
    .filter((e) => e.date.split('T')[0] === yDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (!entry) return null;

  return (
    <Card>
      <Header>
        <TitleText>Yesterday's Health</TitleText>
        <TitleText>{formatDateTime(entry.date)}</TitleText>
      </Header>

      {entry.weight && (
        <Row>
          <Label>Weight</Label>
          <Value>{entry.weight} kg</Value>
        </Row>
      )}
      {entry.sleepHours && (
        <Row>
          <Label>Sleep</Label>
          <Value>{entry.sleepHours} hrs</Value>
        </Row>
      )}
      {entry.waterLiters && (
        <Row>
          <Label>Water</Label>
          <Value>{entry.waterLiters} L</Value>
        </Row>
      )}
      {entry.steps && (
        <Row>
          <Label>Steps</Label>
          <Value>{entry.steps}</Value>
        </Row>
      )}
      {entry.calories && (
        <Row>
          <Label>Calories</Label>
          <Value>{entry.calories}</Value>
        </Row>
      )}
    </Card>
  );
}

import { useHealthStore } from "@/store/HealthStore";
import formatDateTime from "@/utils/formatDateTime";
import styled from "styled-components/native";

const Card = styled.View`
  background-color: #f0f8ff;
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #005cbeff;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const Label = styled.Text`
  font-size: 14px;
  color: #555;
`;

const Value = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;

export default function YesterdayHealthCard() {
  const entries = useHealthStore((s) => s.entries);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yDate = yesterday.toISOString().split("T")[0];

  const entry = entries
    .filter((e) => e.date.split("T")[0] === yDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (!entry) return null;

  return (
    <Card>
      <Header>
        <Title>Yesterday's Health</Title>
        <Title>{formatDateTime(entry.date)}</Title>
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

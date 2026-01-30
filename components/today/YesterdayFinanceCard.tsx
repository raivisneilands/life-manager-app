import { useFinanceStore } from "@/store/FinanceStore";
import styled from "styled-components/native";

const Card = styled.View`
  background-color: #f0f8ff;
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #005cbeff;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 4px;
`;

const Amount = styled.Text<{ type: "income" | "expense" }>`
  font-weight: bold;
  color: ${({ type }) => (type === "income" ? "#00b894" : "#d63031")};
`;

const Category = styled.Text`
  font-size: 12px;
  color: #555;
`;

export default function YesterdayFinanceCard() {
  const entries = useFinanceStore((s) => s.entries);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yDate = yesterday.toISOString().split("T")[0];

  const yesterdayEntries = entries.filter(
    (e) => e.date.split("T")[0] === yDate,
  );

  if (!yesterdayEntries.length) return null;

  const totals = yesterdayEntries.reduce(
    (acc, e) => {
      if (e.type === "income") acc.income += e.amount;
      if (e.type === "expense") acc.expense += e.amount;
      return acc;
    },
    { income: 0, expense: 0 },
  );

  return (
    <Card>
      <Header>
        <Title>Yesterday's Finance</Title>
        <Title>Net: {(totals.income - totals.expense).toFixed(2)}$</Title>
      </Header>

      <Row>
        <Amount type="income">Income: {totals.income.toFixed(2)}$</Amount>
        <Amount type="expense">Expense: {totals.expense.toFixed(2)}$</Amount>
      </Row>

      {yesterdayEntries.map((e) => (
        <Row key={e.id}>
          <Category>{e.category}</Category>
          <Amount type={e.type}>{e.amount.toFixed(2)}$</Amount>
        </Row>
      ))}
    </Card>
  );
}

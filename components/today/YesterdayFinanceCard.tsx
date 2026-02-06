import { useFinanceStore } from '@/store/FinanceStore';
import styled from '@emotion/native';

// ---------- styled ----------
const Card = styled.View(({ theme }) => ({
  backgroundColor: theme.surface,
  borderRadius: 12,
  padding: 16,
  marginTop: 20,
  marginBottom: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
}));

const Header = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 10,
});

const TitleText = styled.Text(({ theme }) => ({
  fontSize: 16,
  fontWeight: 'bold',
  color: theme.primary,
}));

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 4,
});

const Amount = styled.Text<{ type: 'income' | 'expense' }>(
  ({ theme, type }) => ({
    fontWeight: 'bold',
    color: type === 'income' ? theme.success : theme.danger,
  }),
);

const Category = styled.Text(({ theme }) => ({
  fontSize: 12,
  color: theme.textSecondary,
}));

// ---------- component ----------
export default function YesterdayFinanceCard() {
  const entries = useFinanceStore((s) => s.entries);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yDate = yesterday.toISOString().split('T')[0];

  const yesterdayEntries = entries.filter(
    (e) => e.date.split('T')[0] === yDate,
  );

  if (!yesterdayEntries.length) return null;

  const totals = yesterdayEntries.reduce(
    (acc, e) => {
      if (e.type === 'income') acc.income += e.amount;
      if (e.type === 'expense') acc.expense += e.amount;
      return acc;
    },
    { income: 0, expense: 0 },
  );

  return (
    <Card>
      <Header>
        <TitleText>Yesterday's Finance</TitleText>
        <TitleText>
          Net: {(totals.income - totals.expense).toFixed(2)}$
        </TitleText>
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

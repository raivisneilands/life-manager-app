import styled from '@emotion/native';
import SectionCard from './SectionCard';

const CardGrid = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: 12, // optional: spacing between cards
});

interface FinanceSummaryProps {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export default function FinanceSummary({
  totalIncome,
  totalExpense,
  netBalance,
}: FinanceSummaryProps) {
  return (
    <CardGrid>
      <SectionCard label="Total Income" value={`${totalIncome} €`} />
      <SectionCard label="Total Expenses" value={`${totalExpense} €`} />
      <SectionCard label="Net Balance" value={`${netBalance} €`} />
    </CardGrid>
  );
}

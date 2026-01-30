import React from "react";
import styled from "styled-components/native";
import SectionCard from "./SectionCard";

const CardGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

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
      <SectionCard label="Total Income" value={totalIncome + " €"} />
      <SectionCard label="Total Expenses" value={totalExpense + " €"} />
      <SectionCard label="Net Balance" value={netBalance + " €"} />
    </CardGrid>
  );
}

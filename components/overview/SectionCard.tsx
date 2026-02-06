import styled from '@emotion/native';
import React from 'react';

const Card = styled.View(({ theme }) => ({
  width: '48%',
  backgroundColor: theme.card,
  padding: 15,
  borderRadius: 12,
  marginBottom: 12,
  elevation: 2,
}));

const CardLabel = styled.Text(({ theme }) => ({
  fontSize: 14,
  color: theme.textSecondary,
  marginBottom: 5,
}));

const CardValue = styled.Text(({ theme }) => ({
  fontSize: 20,
  fontWeight: 'bold',
  color: theme.primary,
}));

interface SectionCardProps {
  label: string;
  value?: string | number | React.ReactNode;
  children?: React.ReactNode;
}

export default function SectionCard({
  label,
  value,
  children,
}: SectionCardProps) {
  return (
    <Card>
      <CardLabel>{label}</CardLabel>
      {value !== undefined ? <CardValue>{value}</CardValue> : children}
    </Card>
  );
}

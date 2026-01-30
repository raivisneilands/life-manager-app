import React from "react";
import styled from "styled-components/native";

const Card = styled.View`
  width: 48%;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 12px;
  elevation: 2;
`;

const CardLabel = styled.Text`
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
`;

const CardValue = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #005cbeff;
`;

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

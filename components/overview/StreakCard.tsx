import React from "react";
import styled from "styled-components/native";

const Card = styled.View`
  width: 90px;
  background-color: #cce0ff;
  padding: 10px;
  border-radius: 10px;
  margin-right: 10px;
  align-items: center;
`;

const StreakValue = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: #005cbeff;
`;

const StreakLabel = styled.Text`
  font-size: 12px;
  color: #333;
  text-align: center;
`;

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

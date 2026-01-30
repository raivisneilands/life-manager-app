import { HealthEntry } from "@/models/HealthEntry";
import React from "react";
import styled from "styled-components/native";
import SectionCard from "./SectionCard";

const CardGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

interface HealthCardProps {
  entry?: HealthEntry;
}

export default function HealthCard({ entry }: HealthCardProps) {
  if (!entry) return <SectionCard label="No health entry yesterday" />;

  return (
    <CardGrid>
      {entry.weight && <SectionCard label="Weight (kg)" value={entry.weight} />}
      {entry.sleepHours && (
        <SectionCard label="Sleep (hrs)" value={entry.sleepHours} />
      )}
      {entry.waterLiters && (
        <SectionCard label="Water (L)" value={entry.waterLiters} />
      )}
      {entry.steps && <SectionCard label="Steps" value={entry.steps} />}
      {entry.calories && (
        <SectionCard label="Calories Burned" value={entry.calories} />
      )}
    </CardGrid>
  );
}

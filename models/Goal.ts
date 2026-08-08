export interface PlanStep {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  deadline: string;
  goalType: "min" | "max" | "binary";
  currentValue: number;
  targetValue: number;
  unit: string;
  planSteps: PlanStep[];
}
import Title from "@/components/Title";
import { useTaskStore } from "@/store/TaskStore";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import styled from "styled-components/native";

const Section = styled.View`
  background-color: #e6f0ff;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const TaskItem = styled.View<{ completed?: boolean }>`
  flex-direction: row;
  justify-content: space-between;
  padding: 14px;
  margin-bottom: 8px;
  border-radius: 10px;
  background-color: ${({ completed }) => (completed ? "#f0f0f0" : "#e6f0ff")};
`;

const TaskText = styled.Text<{ completed?: boolean }>`
  text-decoration-line: ${({ completed }) =>
    completed ? "line-through" : "none"};
`;

export default function EarlierTasksSection() {
  const tasks = useTaskStore((s) => s.tasks);
  const toggle = useTaskStore((s) => s.toggleTaskCompletion);
  const remove = useTaskStore((s) => s.removeTask);

  const today = new Date().toISOString().split("T")[0];
  const earlierTasks = tasks.filter((t) => t.date < today);

  if (!earlierTasks.length) return null;

  return (
    <Section>
      <Title>Today's Tasks</Title>

      {earlierTasks.map((task) => (
        <TaskItem key={task.id} completed={task.completed}>
          <TaskText completed={task.completed}>{task.title}</TaskText>
          <EvilIcons name="check" size={24} onPress={() => toggle(task.id)} />
          <EvilIcons name="trash" size={24} onPress={() => remove(task.id)} />
        </TaskItem>
      ))}
    </Section>
  );
}

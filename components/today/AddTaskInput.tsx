import PrimaryButton from "@/components/PrimaryButton";
import { useTaskStore } from "@/store/TaskStore";
import { useState } from "react";
import styled from "styled-components/native";

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const TaskInput = styled.TextInput`
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-right: 12px;
`;

export default function AddTaskInput() {
  const [task, setTask] = useState("");
  const addTask = useTaskStore((s) => s.addTask);

  const today = new Date().toISOString().split("T")[0];

  return (
    <InputRow>
      <TaskInput
        placeholder="Task to do..."
        value={task}
        onChangeText={setTask}
      />
      <PrimaryButton
        onPress={() => {
          if (!task.trim()) return;
          addTask({
            id: "task-" + Math.random().toString(36).substr(2, 9),
            title: task,
            completed: false,
            date: today,
          });
          setTask("");
        }}
      >
        Add
      </PrimaryButton>
    </InputRow>
  );
}

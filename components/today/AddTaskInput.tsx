import PrimaryButton from '@/components/PrimaryButton';
import { useTaskStore } from '@/store/TaskStore';
import styled from '@emotion/native';
import { useState } from 'react';

const InputRow = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
}));

const TaskInput = styled.TextInput(({ theme }) => ({
  flex: 1,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 8,
  padding: 10,
  marginRight: 12,
  backgroundColor: theme.surface,
  color: theme.textPrimary,
}));

export default function AddTaskInput() {
  const [task, setTask] = useState('');
  const addTask = useTaskStore((s) => s.addTask);

  const today = new Date().toISOString().split('T')[0];

  return (
    <InputRow>
      <TaskInput
        placeholder="Task to do..."
        placeholderTextColor="#888" // optional: placeholder color
        value={task}
        onChangeText={setTask}
      />
      <PrimaryButton
        onPress={() => {
          if (!task.trim()) return;
          addTask({
            id: 'task-' + Math.random().toString(36).substr(2, 9),
            title: task,
            completed: false,
            date: today,
          });
          setTask('');
        }}
      >
        Add
      </PrimaryButton>
    </InputRow>
  );
}

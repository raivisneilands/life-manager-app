import Title from '@/components/Title';
import { useTaskStore } from '@/store/TaskStore';
import styled from '@emotion/native';
import EvilIcons from '@expo/vector-icons/EvilIcons';

const TaskItem = styled.View<{ completed?: boolean }>(
  ({ theme, completed }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: completed ? theme.background : theme.primary + '20', // light primary overlay
    alignItems: 'center',
  }),
);

const TaskText = styled.Text<{ completed?: boolean }>(
  ({ theme, completed }) => ({
    textDecorationLine: completed ? 'line-through' : 'none',
    color: completed ? theme.textSecondary : theme.textPrimary,
    flex: 1,
  }),
);

const Actions = styled.View({
  flexDirection: 'row',
  gap: 15,
});

export default function EarlierTasksSection() {
  const tasks = useTaskStore((s) => s.tasks);
  const toggle = useTaskStore((s) => s.toggleTaskCompletion);
  const remove = useTaskStore((s) => s.removeTask);

  const today = new Date().toISOString().split('T')[0];
  const earlierTasks = tasks.filter((t) => t.date < today);

  if (!earlierTasks.length) return null;

  return (
    <>
      <Title>Earlier Tasks</Title>

      {earlierTasks.map((task) => (
        <TaskItem key={task.id} completed={task.completed}>
          <TaskText completed={task.completed}>{task.title}</TaskText>
          <Actions>
            <EvilIcons
              name="check"
              size={24}
              color="#16A34A"
              onPress={() => toggle(task.id)}
            />
            <EvilIcons
              name="trash"
              size={24}
              color="#DC2626"
              onPress={() => remove(task.id)}
            />
          </Actions>
        </TaskItem>
      ))}
    </>
  );
}

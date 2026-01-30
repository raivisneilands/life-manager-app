import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { Task } from "../models/Task";

const taskStorage = createAsyncStorage("life-manager-tasks");

type TaskStore = {
  tasks: Task[];
  getTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  saveTasksToStorage: (tasks: Task[]) => Promise<void>;
};

const today = new Date().toISOString().split("T")[0];

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  getTasks: async () => {
    const storedTasks = await taskStorage.getItem("tasks");
    if (storedTasks) {
      set({ tasks: JSON.parse(storedTasks) });
    }
  },
  addTask: async (task: Task) => {
    set((state: any) => {
      const updatedTasks = [...state.tasks, task];
      taskStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return { tasks: updatedTasks };
    });
  },
  removeTask: async (taskId: string) => {
    set((state: any) => {
      const updatedTasks = state.tasks.filter(
        (task: Task) => task.id !== taskId
      );
      taskStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return { tasks: updatedTasks };
    });
  },
  toggleTaskCompletion: async (taskId: string) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task: Task) => {
        if (task.id === taskId) {
          const isCompleted = !task.completed;
          return {
            ...task,
            completed: isCompleted,
            completedAt: isCompleted ? today : undefined,
          };
        }
        return task;
      });
      taskStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return { tasks: updatedTasks };
    });
  },
  saveTasksToStorage: async (tasks: Task[]) => {
    await taskStorage.setItem("tasks", JSON.stringify(tasks));
  },
}));

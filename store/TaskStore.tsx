import { useSyncStore } from "@/store/syncStore";
import { syncDelete, syncFetch, syncUpsert } from "@/utils/supabaseSync";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { Task } from "../models/Task";

const STORAGE_KEY = "life-manager-tasks";
const TABLE = "tasks";
const isSyncing = () => useSyncStore.getState().syncEnabled;

type TaskStore = {
  tasks: Task[];
  getTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  saveTasksToStorage: (tasks: Task[]) => Promise<void>;
  clearTasks: () => Promise<void>;
};

const today = new Date().toISOString().split("T")[0];

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

  getTasks: async () => {
    if (isSyncing()) {
      const data = await syncFetch<Task>(TABLE);
      set({ tasks: data });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) set({ tasks: JSON.parse(storedTasks) });
    }
  },

  addTask: async (task: Task) => {
    console.log("addTask called, isSyncing:", isSyncing());
    const updated = [...get().tasks, task];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ tasks: updated });
    if (isSyncing()) await syncUpsert(TABLE, [task]);
  },

  removeTask: async (taskId: string) => {
    const updated = get().tasks.filter((task: Task) => task.id !== taskId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ tasks: updated });
    if (isSyncing()) await syncDelete(TABLE, taskId);
  },

  toggleTaskCompletion: async (taskId: string) => {
    const updated = get().tasks.map((task: Task) => {
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
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ tasks: updated });
    if (isSyncing()) {
      const task = updated.find((t) => t.id === taskId);
      console.log("syncing task:", JSON.stringify(task));
      if (task) await syncUpsert(TABLE, [task]);
    }
  },

  saveTasksToStorage: async (tasks: Task[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  clearTasks: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ tasks: [] });
  },
}));

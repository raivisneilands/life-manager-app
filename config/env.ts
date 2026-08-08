import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra;

export const ENV = {
  supabaseUrl: extra?.supabaseUrl ?? "",
  supabaseAnonKey: extra?.supabaseAnonKey ?? "",
};
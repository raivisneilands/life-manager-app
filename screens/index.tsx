import Container from "@/components/Container";
import AddTaskInput from "@/components/today/AddTaskInput";
import EarlierTasksSection from "@/components/today/EarlierTasksSection";
import HabitsSection from "@/components/today/HabitsSection";
import TodayTasksSection from "@/components/today/TodayTasksSection";
import YesterdayFinanceCard from "@/components/today/YesterdayFinanceCard";
import YesterdayHealthCard from "@/components/today/YesterdayHealthCard";
import { ScrollView } from "react-native";

export default function TodayScreen() {
  return (
    <Container>
      <AddTaskInput />

      <ScrollView showsVerticalScrollIndicator={false}>
        <TodayTasksSection />
        <EarlierTasksSection />
        <HabitsSection />
        <YesterdayHealthCard />
        <YesterdayFinanceCard />
      </ScrollView>
    </Container>
  );
}

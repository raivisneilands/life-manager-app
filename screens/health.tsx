import Container from "@/components/Container";
import HealthEntryList from "@/components/health/HealthEntryList";
import HealthForm from "@/components/health/HealthForm";
import Title from "@/components/Title";
import { useHealthStore } from "@/store/HealthStore";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export default function HealthPage() {
  const entries = useHealthStore((s) => s.entries);
  const addEntry = useHealthStore((s) => s.addEntry);
  const removeEntry = useHealthStore((s) => s.removeEntry);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <Container>
        <Title>Health Journal</Title>
        <ScrollView showsVerticalScrollIndicator={false}>
          <HealthForm onAdd={addEntry} />
          <HealthEntryList entries={entries} onDelete={removeEntry} />
        </ScrollView>
      </Container>
    </KeyboardAvoidingView>
  );
}

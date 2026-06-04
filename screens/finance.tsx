import Container from "@/components/Container";
import { InsightCard } from "@/components/InsightCard";
import Title from "@/components/Title";
import { FinanceEntry } from "@/models/FinanceEntry";
import { useFinanceStore } from "@/store/FinanceStore";
import styled from "@emotion/native";
import { EvilIcons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
} from "react-native";

// ---------- styled ----------
const Card = styled.View(({ theme }) => ({
  backgroundColor: theme.card,
  padding: 16,
  borderRadius: 14,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: theme.border,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
}));

const Row = styled.View({
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 6,
});

const Label = styled.Text(({ theme }) => ({
  fontWeight: "bold",
  color: theme.textPrimary,
}));

const Value = styled.Text<{ positive?: boolean }>(({ positive, theme }) => ({
  color: positive ? theme.success : theme.danger,
  fontWeight: "bold",
}));

const FormRow = styled.View({ marginBottom: 12 });

const Input = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 10,
  padding: 10,
  color: theme.textPrimary,
  backgroundColor: theme.surface,
}));

const TypeSwitch = styled.View({ flexDirection: "row", marginBottom: 12 });

const TypeButton = styled.TouchableOpacity<{ active?: boolean }>(
  ({ active, theme }) => ({
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: active ? theme.primary : theme.border,
    marginRight: 8,
  }),
);

const TypeText = styled.Text<{ active?: boolean }>(({ active, theme }) => ({
  textAlign: "center",
  fontWeight: "bold",
  color: active ? "#ffffff" : theme.textSecondary,
}));

const AddButton = styled.TouchableOpacity(({ theme }) => ({
  backgroundColor: theme.primary,
  padding: 14,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 10,
}));

const AddButtonText = styled.Text(({ theme }) => ({
  color: "#ffffff",
  fontWeight: "bold",
}));

const EntryCard = styled.TouchableOpacity(({ theme }) => ({
  backgroundColor: theme.card,
  borderRadius: 14,
  padding: 14,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: theme.border,
}));

const EntryTitle = styled.Text(({ theme }) => ({
  fontWeight: "bold",
  color: theme.textPrimary,
}));

const EntryMeta = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
}));

const ModalContainer = styled.View({
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
});

const ModalContent = styled.View(({ theme }) => ({
  width: "90%",
  backgroundColor: theme.card,
  borderRadius: 16,
  padding: 20,
}));

const CloseButton = styled.TouchableOpacity({
  alignSelf: "flex-end",
  marginBottom: 10,
});

const MonthButton = styled.TouchableOpacity(({ theme }) => ({
  padding: 10,
  backgroundColor: theme.primary,
  borderRadius: 10,
  marginBottom: 12,
  alignItems: "center",
}));

const MonthButtonText = styled.Text({
  color: "#ffffff",
  fontWeight: "bold",
});

const MonthNav = styled.View({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
});

const MonthNavButton = styled.TouchableOpacity(({ theme }) => ({
  padding: 6,
  backgroundColor: theme.primary,
  borderRadius: 8,
}));

const MonthNavText = styled.Text(({ theme }) => ({
  color: "#ffffff",
  fontWeight: "bold",
  fontSize: 14,
}));

const StyledText = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontWeight: "bold",
  fontSize: 14,
}));

// ---------- component ----------
export default function FinancePage() {
  const entries = useFinanceStore((s) => s.entries);
  const getEntries = useFinanceStore((s) => s.getEntries);
  const addEntry = useFinanceStore((s) => s.addEntry);
  const removeEntry = useFinanceStore((s) => s.removeEntry);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    getEntries();
  }, []);

  const totalIncome = entries
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = entries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpense;

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const handleAdd = () => {
    if (!amount || !category) return;

    const entry: FinanceEntry = {
      id: Crypto.randomUUID(),
      amount: parseFloat(amount),
      type,
      category,
      description: description || undefined,
      date: new Date().toISOString().split("T")[0],
    };

    addEntry(entry);
    setAmount("");
    setCategory("");
    setDescription("");
  };

  const monthEntries = entries.filter((e) => {
    const d = new Date(e.date);
    return (
      d.getMonth() === selectedMonth.getMonth() &&
      d.getFullYear() === selectedMonth.getFullYear()
    );
  });

  const monthIncome = monthEntries
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const monthExpense = monthEntries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  const monthBalance = monthIncome - monthExpense;

  const formatMonth = (date: Date) =>
    date.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <Container>
        <InsightCard screen="finance" />

        <Title>Finance</Title>
        {/* Summary */}
        <Card>
          <Row>
            <Label>Income</Label>
            <Value positive>+€{totalIncome.toFixed(2)}</Value>
          </Row>
          <Row>
            <Label>Expenses</Label>
            <Value>-€{totalExpense.toFixed(2)}</Value>
          </Row>
          <Row>
            <Label>Balance</Label>
            <Value positive={balance >= 0}>€{balance.toFixed(2)}</Value>
          </Row>
        </Card>

        {/* Monthly Overview Button */}
        <MonthButton onPress={() => setModalVisible(true)}>
          <MonthButtonText>
            Monthly Overview ({formatMonth(selectedMonth)})
          </MonthButtonText>
        </MonthButton>

        <ScrollView>
          {/* Add Entry */}
          <Card>
            <TypeSwitch>
              <TypeButton
                active={type === "expense"}
                onPress={() => setType("expense")}
              >
                <TypeText active={type === "expense"}>Expense</TypeText>
              </TypeButton>
              <TypeButton
                active={type === "income"}
                onPress={() => setType("income")}
              >
                <TypeText active={type === "income"}>Income</TypeText>
              </TypeButton>
            </TypeSwitch>

            <FormRow>
              <Input
                placeholderTextColor="#999"
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </FormRow>

            <FormRow>
              <Input
                placeholderTextColor="#999"
                placeholder="Category"
                value={category}
                onChangeText={setCategory}
              />
            </FormRow>

            <FormRow>
              <Input
                placeholderTextColor="#999"
                placeholder="Description (optional)"
                value={description}
                onChangeText={setDescription}
              />
            </FormRow>

            <AddButton onPress={handleAdd}>
              <AddButtonText>Add Entry</AddButtonText>
            </AddButton>
          </Card>

          {/* Entries */}
          {sortedEntries.map((entry) => {
            const expanded = expandedId === entry.id;
            return (
              <EntryCard
                key={entry.id}
                onPress={() => setExpandedId(expanded ? null : entry.id)}
              >
                <Row>
                  <EntryTitle>{entry.category}</EntryTitle>
                  <Value positive={entry.type === "income"}>
                    {entry.type === "income" ? "+" : "-"}€{entry.amount}
                  </Value>
                </Row>
                <EntryMeta>{entry.date}</EntryMeta>

                {expanded && (
                  <>
                    {entry.description && (
                      <EntryMeta>{entry.description}</EntryMeta>
                    )}
                    <EvilIcons
                      name="trash"
                      size={26}
                      color="red"
                      onPress={() => removeEntry(entry.id)}
                    />
                  </>
                )}
              </EntryCard>
            );
          })}
        </ScrollView>

        {/* Monthly Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <ModalContainer>
            <ModalContent>
              <CloseButton onPress={() => setModalVisible(false)}>
                <StyledText style={{ fontWeight: "bold", fontSize: 16 }}>
                  Close
                </StyledText>
              </CloseButton>

              <MonthNav>
                <MonthNavButton
                  onPress={() =>
                    setSelectedMonth(
                      new Date(
                        selectedMonth.getFullYear(),
                        selectedMonth.getMonth() - 1,
                        1,
                      ),
                    )
                  }
                >
                  <MonthNavText>◀ Prev</MonthNavText>
                </MonthNavButton>

                <StyledText
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {formatMonth(selectedMonth)}
                </StyledText>

                <MonthNavButton
                  onPress={() =>
                    setSelectedMonth(
                      new Date(
                        selectedMonth.getFullYear(),
                        selectedMonth.getMonth() + 1,
                        1,
                      ),
                    )
                  }
                >
                  <MonthNavText>Next ▶</MonthNavText>
                </MonthNavButton>
              </MonthNav>

              <Row>
                <Label>Income</Label>
                <Value positive>+€{monthIncome.toFixed(2)}</Value>
              </Row>
              <Row>
                <Label>Expenses</Label>
                <Value>-€{monthExpense.toFixed(2)}</Value>
              </Row>
              <Row>
                <Label>Balance</Label>
                <Value positive={monthBalance >= 0}>
                  €{monthBalance.toFixed(2)}
                </Value>
              </Row>

              <ScrollView style={{ marginTop: 12, maxHeight: 300 }}>
                {monthEntries.map((entry) => (
                  <EntryCard key={entry.id}>
                    <Row>
                      <EntryTitle>{entry.category}</EntryTitle>
                      <Value positive={entry.type === "income"}>
                        {entry.type === "income" ? "+" : "-"}€{entry.amount}
                      </Value>
                    </Row>
                    <EntryMeta>{entry.date}</EntryMeta>
                    {entry.description && (
                      <EntryMeta>{entry.description}</EntryMeta>
                    )}
                  </EntryCard>
                ))}
              </ScrollView>
            </ModalContent>
          </ModalContainer>
        </Modal>
      </Container>
    </KeyboardAvoidingView>
  );
}

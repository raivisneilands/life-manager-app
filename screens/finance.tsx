import Container from "@/components/Container";
import Title from "@/components/Title";
import { FinanceEntry } from "@/models/FinanceEntry";
import { useFinanceStore } from "@/store/FinanceStore";
import { EvilIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
} from "react-native";
import styled from "styled-components/native";
import { v4 as uuidv4 } from "uuid";

// ---------- styled ----------
const Card = styled.View`
  background-color: #f5f7ff;
  padding: 16px;
  border-radius: 14px;
  margin-bottom: 20px;
  border: 1px solid #dbe2ff;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const Label = styled.Text`
  font-weight: bold;
  color: #333;
`;

const Value = styled.Text<{ positive?: boolean }>`
  color: ${({ positive }) => (positive ? "#2e7d32" : "#c62828")};
  font-weight: bold;
`;

const FormRow = styled.View`
  margin-bottom: 12px;
`;

const Input = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
`;

const TypeSwitch = styled.View`
  flex-direction: row;
  margin-bottom: 12px;
`;

const TypeButton = styled.TouchableOpacity<{ active?: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  background-color: ${({ active }) => (active ? "#005cbeff" : "#eee")};
  margin-right: 8px;
`;

const TypeText = styled.Text<{ active?: boolean }>`
  text-align: center;
  font-weight: bold;
  color: ${({ active }) => (active ? "#fff" : "#555")};
`;

const AddButton = styled.TouchableOpacity`
  background-color: #005cbeff;
  padding: 14px;
  border-radius: 12px;
  align-items: center;
  margin-top: 10px;
`;

const AddButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

const EntryCard = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 12px;
  border: 1px solid #eee;
`;

const EntryTitle = styled.Text`
  font-weight: bold;
  color: #333;
`;

const EntryMeta = styled.Text`
  color: #777;
  font-size: 12px;
`;

const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  width: 90%;
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
`;

const CloseButton = styled.TouchableOpacity`
  align-self: flex-end;
  margin-bottom: 10px;
`;

const MonthButton = styled.TouchableOpacity`
  padding: 10px 16px;
  background-color: #005cbeff;
  border-radius: 10px;
  margin-bottom: 12px;
  align-items: center;
`;

const MonthButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

// ---------- Month Navigation Header ----------
const MonthNav = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const MonthNavButton = styled.TouchableOpacity`
  padding: 6px 12px;
  background-color: #005cbeff;
  border-radius: 8px;
`;

const MonthNavText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 14px;
`;

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

  // Monthly modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    getEntries();
  }, []);

  // Summary totals
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
      id: uuidv4(),
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

  // Monthly entries
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
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </FormRow>

            <FormRow>
              <Input
                placeholder="Category"
                value={category}
                onChangeText={setCategory}
              />
            </FormRow>

            <FormRow>
              <Input
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
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>Close</Text>
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

                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {formatMonth(selectedMonth)}
                </Text>

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

import Container from "@/components/Container";
import { InsightCard } from "@/components/InsightCard";
import PrimaryButton from "@/components/PrimaryButton";
import AddRelationshipSheet from "@/components/relationships/AddRelationshipSheet";
import Header from "@/components/relationships/header";
import Relationships from "@/components/relationships/relationships";
import { useState } from "react";
import { ScrollView } from "react-native";

export default function RelationshipsPage() {
  const [visible, setVisible] = useState(false);

  return (
    <Container>
      <InsightCard screen="relationships" />
      <Header />

      <PrimaryButton onPress={() => setVisible(true)}>
        Add new relationship
      </PrimaryButton>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Relationships />
      </ScrollView>
      <AddRelationshipSheet
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </Container>
  );
}

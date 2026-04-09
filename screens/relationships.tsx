import Container from '@/components/Container';
import PrimaryButton from '@/components/PrimaryButton';
import AddRelationshipSheet from '@/components/relationships/AddRelationshipSheet';
import Header from '@/components/relationships/header';
import Relationships from '@/components/relationships/relationships';
import { useState } from 'react';

export default function RelationshipsPage() {
  const [visible, setVisible] = useState(false);

  return (
    <Container>
      <Header />

      <PrimaryButton onPress={() => setVisible(true)}>
        Add new relationship
      </PrimaryButton>

      <Relationships />

      <AddRelationshipSheet
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </Container>
  );
}
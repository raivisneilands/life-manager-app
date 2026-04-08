import Container from '@/components/Container';
import PrimaryButton from '@/components/PrimaryButton';
import Header from '@/components/relationships/header';
import Relationships from '@/components/relationships/relationships';
import { useRelationshipStore } from '@/store/RelationshipStore';
import styled from '@emotion/native';
import { useRef, useState } from 'react';
import { Animated, Dimensions, KeyboardAvoidingView, Modal, Platform, ScrollView } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

const Backdrop = styled.TouchableOpacity(() => ({
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
}));

const Sheet = styled(Animated.View)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: SHEET_HEIGHT,
  backgroundColor: theme.background,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingHorizontal: 24,
  paddingBottom: 32,
}));

const Handle = styled.View(({ theme }) => ({
  width: 40,
  height: 4,
  backgroundColor: theme.border,
  borderRadius: 99,
  alignSelf: 'center',
  marginTop: 12,
  marginBottom: 20,
}));

const SheetTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 20,
  fontWeight: '700',
  marginBottom: 20,
}));

const Label = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: '600',
  letterSpacing: 0.8,
  textTransform: 'uppercase',
  marginBottom: 6,
  marginTop: 14,
}));

const Input = styled.TextInput(({ theme }) => ({
  backgroundColor: theme.surface,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 12,
  color: theme.textPrimary,
  fontSize: 15,
}));

const TypeRow = styled.View(() => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 2,
}));

const TypeChip = styled.TouchableOpacity(({ theme, selected }: { theme?: any; selected: boolean }) => ({
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 99,
  borderWidth: 1,
  borderColor: selected ? theme.primary : theme.border,
  backgroundColor: selected ? theme.primary + '22' : theme.surface,
}));

const TypeChipText = styled.Text(({ theme, selected }: { theme?: any; selected: boolean }) => ({
  color: selected ? theme.primary : theme.textSecondary,
  fontSize: 14,
  fontWeight: selected ? '600' : '400',
}));

const ButtonRow = styled.View(() => ({
  flexDirection: 'row',
  gap: 12,
  marginTop: 24,
}));

const CancelButton = styled.TouchableOpacity(({ theme }) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: theme.border,
  alignItems: 'center',
}));

const CancelButtonText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 15,
  fontWeight: '600',
}));

const SubmitButton = styled.TouchableOpacity(({ theme }) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  backgroundColor: theme.primary,
  alignItems: 'center',
}));

const SubmitButtonText = styled.Text(() => ({
  color: '#fff',
  fontSize: 15,
  fontWeight: '600',
}));

const RELATIONSHIP_TYPES = ['Friend', 'Family', 'Colleague', 'Mentor', 'Partner', 'Acquaintance'];

type FormState = {
  name: string;
  phone: string;
  email: string;
  birthday: string;
  howWeMet: string;
  type: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  phone: '',
  email: '',
  birthday: '',
  howWeMet: '',
  type: '',
};

export default function RelationshipsPage() {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const addRelationship = useRelationshipStore((s) => s.addRelationship)

  function openSheet() {
    setVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }

  function closeSheet() {
    Animated.timing(slideAnim, {
      toValue: SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      setForm(EMPTY_FORM);
    });
  }

  function handleSubmit() {
    if (!form.name.trim()) return;
    console.log('New relationship:', form);
    addRelationship({
      id: 'task-' + Math.random().toString(36).substr(2, 9),
      name: form.name,
      birthday: form.birthday,
      email: form.email,
      howWeMet: form.howWeMet,
      phone: form.phone,
      type: form.type,
    })
    closeSheet();
  }

  return (
    <Container>
      <Header />
      <PrimaryButton onPress={openSheet}>
        Add new relationship
      </PrimaryButton>
      <Relationships />

      <Modal visible={visible} transparent animationType="none" onRequestClose={closeSheet}>
        <Backdrop onPress={closeSheet} activeOpacity={1} />

        <Sheet style={{ transform: [{ translateY: slideAnim }] }}>
          <Handle />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <SheetTitle>New Relationship</SheetTitle>

              <Label>Name *</Label>
              <Input
                placeholder="Full name"
                placeholderTextColor="#888"
                value={form.name}
                onChangeText={(val) => setForm((f) => ({ ...f, name: val }))}
              />

              <Label>Relationship Type</Label>
              <TypeRow>
                {RELATIONSHIP_TYPES.map((type) => (
                  <TypeChip
                    key={type}
                    selected={form.type === type}
                    onPress={() => setForm((f) => ({ ...f, type: f.type === type ? '' : type }))}
                    activeOpacity={0.7}
                  >
                    <TypeChipText selected={form.type === type}>{type}</TypeChipText>
                  </TypeChip>
                ))}
              </TypeRow>

              <Label>Phone Number</Label>
              <Input
                placeholder="+1 234 567 8900"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(val) => setForm((f) => ({ ...f, phone: val }))}
              />

              <Label>Email</Label>
              <Input
                placeholder="email@example.com"
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(val) => setForm((f) => ({ ...f, email: val }))}
              />

              <Label>Birthday</Label>
              <Input
                placeholder="DD / MM / YYYY"
                placeholderTextColor="#888"
                value={form.birthday}
                onChangeText={(val) => setForm((f) => ({ ...f, birthday: val }))}
              />

              <Label>How You Met</Label>
              <Input
                placeholder="At work, through a friend…"
                placeholderTextColor="#888"
                value={form.howWeMet}
                onChangeText={(val) => setForm((f) => ({ ...f, howWeMet: val }))}
              />

              <ButtonRow>
                <CancelButton onPress={closeSheet} activeOpacity={0.7}>
                  <CancelButtonText>Cancel</CancelButtonText>
                </CancelButton>
                <SubmitButton onPress={handleSubmit} activeOpacity={0.7}>
                  <SubmitButtonText>Save</SubmitButtonText>
                </SubmitButton>
              </ButtonRow>
            </ScrollView>
          </KeyboardAvoidingView>
        </Sheet>
      </Modal>
    </Container>
  );
}
import { useRelationshipStore } from '@/store/RelationshipStore';
import styled from '@emotion/native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Dimensions, KeyboardAvoidingView, Modal, Platform, ScrollView } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.background,
}));

const Header = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: theme.border,
  gap: 12,
}));

const BackButton = styled.TouchableOpacity(() => ({
  padding: 4,
}));

const HeaderTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 18,
  fontWeight: '700',
  flex: 1,
}));

const EditButton = styled.TouchableOpacity(() => ({
  padding: 4,
}));

const AvatarSection = styled.View(({ theme }) => ({
  alignItems: 'center',
  paddingVertical: 32,
  borderBottomWidth: 1,
  borderBottomColor: theme.border,
}));

const Avatar = styled.View(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: theme.primary,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,
}));

const AvatarText = styled.Text(() => ({
  color: '#fff',
  fontSize: 28,
  fontWeight: '700',
}));

const AvatarName = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 22,
  fontWeight: '700',
}));

const TypeBadge = styled.View(({ theme }) => ({
  backgroundColor: theme.surface,
  borderRadius: 8,
  paddingVertical: 4,
  paddingHorizontal: 12,
  marginTop: 8,
  borderWidth: 1,
  borderColor: theme.border,
}));

const TypeBadgeText = styled.Text(({ theme }) => ({
  color: theme.primary,
  fontSize: 13,
  fontWeight: '600',
}));

const Section = styled.View(() => ({
  paddingHorizontal: 20,
  paddingTop: 24,
}));

const SectionTitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: '600',
  letterSpacing: 1,
  textTransform: 'uppercase',
  marginBottom: 12,
}));

const Card = styled.View(({ theme }) => ({
  backgroundColor: theme.card,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.border,
  overflow: 'hidden',
  marginBottom: 12,
}));

const DetailRow = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
  paddingHorizontal: 16,
  gap: 14,
}));

const RowDivider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.border,
  marginLeft: 46,
}));

const DetailInfo = styled.View(() => ({
  flex: 1,
}));

const DetailLabel = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  marginBottom: 2,
}));

const DetailValue = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 15,
  fontWeight: '500',
}));

const EmptyValue = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 15,
  fontStyle: 'italic',
}));

const DeleteButton = styled.TouchableOpacity(({ theme }) => ({
  marginHorizontal: 20,
  marginTop: 8,
  marginBottom: 32,
  paddingVertical: 14,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: theme.danger,
  alignItems: 'center',
}));

const DeleteButtonText = styled.Text(({ theme }) => ({
  color: theme.danger,
  fontSize: 15,
  fontWeight: '600',
}));

// Confirm modal
const ConfirmBackdrop = styled.TouchableOpacity(() => ({
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
}));

const ConfirmBox = styled.View(({ theme }) => ({
  position: 'absolute',
  top: '40%',
  left: 24,
  right: 24,
  backgroundColor: theme.card,
  borderRadius: 16,
  padding: 24,
  borderWidth: 1,
  borderColor: theme.border,
}));

const ConfirmTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 8,
}));

const ConfirmMessage = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
  lineHeight: 20,
  marginBottom: 24,
}));

const ConfirmButtonRow = styled.View(() => ({
  flexDirection: 'row',
  gap: 12,
}));

const ConfirmDeleteButton = styled.TouchableOpacity(({ theme }) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  backgroundColor: theme.danger,
  alignItems: 'center',
}));

const ConfirmDeleteButtonText = styled.Text(() => ({
  color: '#fff',
  fontSize: 15,
  fontWeight: '600',
}));

// Edit sheet
const Backdrop = styled.TouchableOpacity(() => ({
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
}));

const Sheet = styled(Animated.View)(({ theme }) => ({
  position: 'absolute',
  bottom: 0, left: 0, right: 0,
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

const SaveButton = styled.TouchableOpacity(({ theme }) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  backgroundColor: theme.primary,
  alignItems: 'center',
}));

const SaveButtonText = styled.Text(() => ({
  color: '#fff',
  fontSize: 15,
  fontWeight: '600',
}));

const RELATIONSHIP_TYPES = ['Friend', 'Family', 'Colleague', 'Mentor', 'Partner', 'Acquaintance'];

type DetailItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value?: string;
};

export default function RelationshipDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const relationships = useRelationshipStore((s) => s.relationships);
  const removeRelationship = useRelationshipStore((s) => s.removeRelationship);
  const updateRelationship = useRelationshipStore((s) => s.updateRelationship);

  const person = relationships.find((r) => r.id === id);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [form, setForm] = useState({
    name: person?.name ?? '',
    phone: person?.phone ?? '',
    email: person?.email ?? '',
    birthday: person?.birthday ?? '',
    howWeMet: person?.howWeMet ?? '',
    type: person?.type ?? '',
  });
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  if (!person) {
    return (
      <Container>
        <Header>
          <BackButton onPress={() => router.push('/relationships')}>
            <MaterialIcons name="arrow-back" size={24} color="#888" />
          </BackButton>
          <HeaderTitle>Not Found</HeaderTitle>
        </Header>
      </Container>
    );
  }

  const initials = person.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const details: DetailItem[] = [
    { icon: 'phone', label: 'Phone', value: person.phone },
    { icon: 'email', label: 'Email', value: person.email },
    { icon: 'cake', label: 'Birthday', value: person.birthday },
    { icon: 'place', label: 'How You Met', value: person.howWeMet },
  ];

  function openEdit() {
    setForm({
      name: person!.name,
      phone: person!.phone ?? '',
      email: person!.email ?? '',
      birthday: person!.birthday ?? '',
      howWeMet: person!.howWeMet ?? '',
      type: person!.type ?? '',
    });
    setEditVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }

  function closeEdit() {
    Animated.timing(slideAnim, {
      toValue: SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setEditVisible(false));
  }

  function handleSave() {
    if (!form.name.trim()) return;
    updateRelationship({ ...person!, ...form });
    closeEdit();
  }

  function handleDelete() {
    removeRelationship(person!.id);
    setConfirmVisible(false);
    router.push('/relationships');
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => router.push('/relationships')} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color="#888" />
        </BackButton>
        <HeaderTitle>{person.name}</HeaderTitle>
        <EditButton onPress={openEdit} activeOpacity={0.7}>
          <MaterialIcons name="edit" size={22} color="#888" />
        </EditButton>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <AvatarSection>
          <Avatar>
            <AvatarText>{initials}</AvatarText>
          </Avatar>
          <AvatarName>{person.name}</AvatarName>
          {person.type && (
            <TypeBadge>
              <TypeBadgeText>{person.type}</TypeBadgeText>
            </TypeBadge>
          )}
        </AvatarSection>

        <Section>
          <SectionTitle>Details</SectionTitle>
          <Card>
            {details.map((item, index) => (
              <>
                {index > 0 && <RowDivider key={`divider-${index}`} />}
                <DetailRow key={item.label}>
                  <MaterialIcons name={item.icon} size={18} color="#888" />
                  <DetailInfo>
                    <DetailLabel>{item.label}</DetailLabel>
                    {item.value
                      ? <DetailValue>{item.value}</DetailValue>
                      : <EmptyValue>Not set</EmptyValue>
                    }
                  </DetailInfo>
                </DetailRow>
              </>
            ))}
          </Card>
        </Section>

        <DeleteButton onPress={() => setConfirmVisible(true)} activeOpacity={0.7}>
          <DeleteButtonText>Remove Relationship</DeleteButtonText>
        </DeleteButton>
      </ScrollView>

      {/* Confirm delete modal */}
      <Modal visible={confirmVisible} transparent animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
        <ConfirmBackdrop onPress={() => setConfirmVisible(false)} activeOpacity={1} />
        <ConfirmBox>
          <ConfirmTitle>Remove Relationship</ConfirmTitle>
          <ConfirmMessage>
            Are you sure you want to remove {person.name}? This cannot be undone.
          </ConfirmMessage>
          <ConfirmButtonRow>
            <CancelButton onPress={() => setConfirmVisible(false)} activeOpacity={0.7}>
              <CancelButtonText>Cancel</CancelButtonText>
            </CancelButton>
            <ConfirmDeleteButton onPress={handleDelete} activeOpacity={0.7}>
              <ConfirmDeleteButtonText>Remove</ConfirmDeleteButtonText>
            </ConfirmDeleteButton>
          </ConfirmButtonRow>
        </ConfirmBox>
      </Modal>

      {/* Edit sheet modal */}
      <Modal visible={editVisible} transparent animationType="none" onRequestClose={closeEdit}>
        <Backdrop onPress={closeEdit} activeOpacity={1} />
        <Sheet style={{ transform: [{ translateY: slideAnim }] }}>
          <Handle />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <SheetTitle>Edit Relationship</SheetTitle>

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
                <CancelButton onPress={closeEdit} activeOpacity={0.7}>
                  <CancelButtonText>Cancel</CancelButtonText>
                </CancelButton>
                <SaveButton onPress={handleSave} activeOpacity={0.7}>
                  <SaveButtonText>Save</SaveButtonText>
                </SaveButton>
              </ButtonRow>
            </ScrollView>
          </KeyboardAvoidingView>
        </Sheet>
      </Modal>
    </Container>
  );
}
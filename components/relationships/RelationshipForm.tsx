import FormInput from '@/components/relationships/FormInput';
import RelationshipTypeSelector from '@/components/relationships/RelationshipTypeSelector';
import styled from '@emotion/native';
import { Dispatch, SetStateAction } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

const SheetTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 20,
  fontWeight: '700',
  marginBottom: 20,
}));

const ButtonRow = styled.View({
  flexDirection: 'row',
  gap: 12,
  marginTop: 24,
});

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
  fontWeight: '600',
}));

const SubmitButton = styled.TouchableOpacity(({ theme }) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  backgroundColor: theme.primary,
  alignItems: 'center',
}));

const SubmitButtonText = styled.Text({
  color: '#fff',
  fontWeight: '600',
});

type FormState = {
  name: string;
  phone: string;
  email: string;
  birthday: string;
  howWeMet: string;
  type: string;
}

type Props = {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function RelationshipForm({
  form,
  setForm,
  onCancel,
  onSubmit,
}: Props) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <SheetTitle>New Relationship</SheetTitle>

        <FormInput
          label="Name *"
          value={form.name}
          onChangeText={(val) => setForm((f) => ({ ...f, name: val }))}
          placeholder="Full name"
        />

        <RelationshipTypeSelector
          value={form.type}
          onChange={(type: string) =>
            setForm((f) => ({
              ...f,
              type: f.type === type ? '' : type,
            }))
          }
        />

        <FormInput
          label="Phone Number"
          value={form.phone}
          onChangeText={(val) => setForm((f) => ({ ...f, phone: val }))}
          placeholder="+1 234 567 8900"
        />

        <FormInput
          label="Email"
          value={form.email}
          onChangeText={(val) => setForm((f) => ({ ...f, email: val }))}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <FormInput
          label="Birthday"
          value={form.birthday}
          onChangeText={(val) => setForm((f) => ({ ...f, birthday: val }))}
          placeholder="DD / MM / YYYY"
        />

        <FormInput
          label="How You Met"
          value={form.howWeMet}
          onChangeText={(val) => setForm((f) => ({ ...f, howWeMet: val }))}
          placeholder="At work, through a friend…"
        />

        <ButtonRow>
          <CancelButton onPress={onCancel}>
            <CancelButtonText>Cancel</CancelButtonText>
          </CancelButton>

          <SubmitButton onPress={onSubmit}>
            <SubmitButtonText>Save</SubmitButtonText>
          </SubmitButton>
        </ButtonRow>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
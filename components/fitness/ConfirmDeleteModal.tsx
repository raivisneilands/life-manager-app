import { CancelButton, CancelButtonText } from '@/components/fitness/styles';
import styled from '@emotion/native';
import { Modal } from 'react-native';

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

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({ visible, onCancel, onConfirm }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <ConfirmBackdrop onPress={onCancel} activeOpacity={1} />
      <ConfirmBox>
        <ConfirmTitle>Delete Workout</ConfirmTitle>
        <ConfirmMessage>
          Are you sure you want to delete this workout? This cannot be undone.
        </ConfirmMessage>
        <ConfirmButtonRow>
          <CancelButton onPress={onCancel} activeOpacity={0.7}>
            <CancelButtonText>Cancel</CancelButtonText>
          </CancelButton>
          <ConfirmDeleteButton onPress={onConfirm} activeOpacity={0.7}>
            <ConfirmDeleteButtonText>Delete</ConfirmDeleteButtonText>
          </ConfirmDeleteButton>
        </ConfirmButtonRow>
      </ConfirmBox>
    </Modal>
  );
}
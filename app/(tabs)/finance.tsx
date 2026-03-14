import FinancePage from '@/screens/finance';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function FinanceScreen() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FinancePage />
    </KeyboardAvoidingView>
  );
}

import FitnessPage from '@/screens/fitness';
import { useTheme } from '@emotion/react';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function fitness() {
  const theme = useTheme();
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        paddingVertical: 10,
        backgroundColor: theme.background,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FitnessPage />
    </KeyboardAvoidingView>
  );
}

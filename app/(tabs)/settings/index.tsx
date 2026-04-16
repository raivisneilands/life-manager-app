import SettingsPage from '@/screens/settings';
import { useTheme } from '@emotion/react';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function settings() {
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
      <SettingsPage />
    </KeyboardAvoidingView>
  );
}

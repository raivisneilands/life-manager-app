import TodayScreen from '@/screens/index';
import { useTheme } from '@emotion/react';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function habits() {
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
      <TodayScreen />
    </KeyboardAvoidingView>
  );
}

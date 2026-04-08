import RelationshipsPage from '@/screens/relationships';
import { useTheme } from '@emotion/react';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function relationships() {
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
      <RelationshipsPage />
    </KeyboardAvoidingView>
  );
}

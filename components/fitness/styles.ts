import styled from '@emotion/native';
import { Animated } from 'react-native';

export const Card = styled.View(({ theme }) => ({
  backgroundColor: theme.card,
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: theme.border,
}));

export const CardRow = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const CardTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 16,
  fontWeight: '600',
  flex: 1,
}));

export const CardSubtitle = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 13,
  marginTop: 4,
}));

export const Badge = styled.View(({ theme }) => ({
  backgroundColor: theme.surface,
  borderRadius: 8,
  paddingVertical: 4,
  paddingHorizontal: 10,
  marginLeft: 8,
}));

export const BadgeText = styled.Text(({ theme }) => ({
  color: theme.primary,
  fontSize: 12,
  fontWeight: '600',
}));

export const StatRow = styled.View(() => ({
  flexDirection: 'row',
  marginTop: 12,
  gap: 12,
}));

export const Stat = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.surface,
  borderRadius: 8,
  padding: 10,
  alignItems: 'center',
}));

export const StatValue = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 16,
  fontWeight: '700',
}));

export const StatLabel = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 11,
  marginTop: 2,
}));

export const ActionButton = styled.TouchableOpacity(() => ({
  padding: 4,
}));

export const Label = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: '600',
  letterSpacing: 0.8,
  textTransform: 'uppercase',
  marginBottom: 6,
  marginTop: 14,
}));

export const Input = styled.TextInput(({ theme }) => ({
  backgroundColor: theme.surface,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 12,
  color: theme.textPrimary,
  fontSize: 15,
}));

export const TypeRow = styled.View(() => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 2,
}));

export const TypeChip = styled.TouchableOpacity(({ theme, selected }: { theme?: any; selected: boolean }) => ({
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 99,
  borderWidth: 1,
  borderColor: selected ? theme.primary : theme.border,
  backgroundColor: selected ? theme.primary + '22' : theme.surface,
}));

export const TypeChipText = styled.Text(({ theme, selected }: { theme?: any; selected: boolean }) => ({
  color: selected ? theme.primary : theme.textSecondary,
  fontSize: 14,
  fontWeight: selected ? '600' : '400',
}));

export const ButtonRow = styled.View(() => ({
  flexDirection: 'row',
  gap: 12,
  marginTop: 24,
  marginBottom: 16,
}));

export const CancelButton = styled.TouchableOpacity(({ theme }) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: theme.border,
  alignItems: 'center',
}));

export const CancelButtonText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 15,
  fontWeight: '600',
}));

export const SaveButton = styled.TouchableOpacity(({ theme }) => ({
  flex: 1,
  paddingVertical: 14,
  borderRadius: 10,
  backgroundColor: theme.primary,
  alignItems: 'center',
}));

export const SaveButtonText = styled.Text(() => ({
  color: '#fff',
  fontSize: 15,
  fontWeight: '600',
}));

export const ExerciseRow = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  gap: 12,
}));

export const ExerciseDivider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.border,
}));

export const ExerciseInfo = styled.View(() => ({
  flex: 1,
}));

export const ExerciseName = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 15,
  fontWeight: '500',
}));

export const ExerciseDetail = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 13,
  marginTop: 2,
}));

export const Backdrop = styled.TouchableOpacity(() => ({
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
}));

export const Sheet = styled(Animated.View)(({ theme }) => ({
  position: 'absolute',
  bottom: 0, left: 0, right: 0,
  backgroundColor: theme.background,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingHorizontal: 24,
  paddingBottom: 32,
}));

export const Handle = styled.View(({ theme }) => ({
  width: 40,
  height: 4,
  backgroundColor: theme.border,
  borderRadius: 99,
  alignSelf: 'center',
  marginTop: 12,
  marginBottom: 20,
}));

export const SheetTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 20,
  fontWeight: '700',
  marginBottom: 20,
}));
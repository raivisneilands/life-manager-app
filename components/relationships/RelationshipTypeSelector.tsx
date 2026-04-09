import styled from '@emotion/native';

const RELATIONSHIP_TYPES = [
  'Friend',
  'Family',
  'Colleague',
  'Mentor',
  'Partner',
  'Acquaintance',
];

const Label = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: '600',
  marginTop: 14,
}));

const TypeRow = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 6,
});

interface TypeChipProps {
  selected: boolean;
  theme?: any;
}

const TypeChip = styled.TouchableOpacity<TypeChipProps>(({ theme, selected }) => ({
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 99,
  borderWidth: 1,
  borderColor: selected ? theme.primary : theme.border,
  backgroundColor: selected ? theme.primary + '22' : theme.surface,
}));

interface TypeChipTextProps {
  selected: boolean;
  theme?: any;
}

const TypeChipText = styled.Text<TypeChipTextProps>(({ theme, selected }) => ({
  color: selected ? theme.primary : theme.textSecondary,
  fontSize: 14,
  fontWeight: selected ? '600' : '400',
}));

type RelationshipTypeSelectorProps = {
  value: string;
  onChange: (val: string) => void;
};

export default function RelationshipTypeSelector({ value, onChange }: RelationshipTypeSelectorProps) {
  return (
    <>
      <Label>Relationship Type</Label>

      <TypeRow>
        {RELATIONSHIP_TYPES.map((type) => (
          <TypeChip
            key={type}
            selected={value === type}
            onPress={() => onChange(type)}
          >
            <TypeChipText selected={value === type}>
              {type}
            </TypeChipText>
          </TypeChip>
        ))}
      </TypeRow>
    </>
  );
}
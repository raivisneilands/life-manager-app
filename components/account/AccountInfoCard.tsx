import styled from "@emotion/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Fragment } from "react/jsx-runtime";

const Card = styled.View(({ theme }) => ({
  backgroundColor: theme.card,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.border,
  overflow: "hidden",
  marginBottom: 12,
}));

const Row = styled.TouchableOpacity(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 14,
  paddingHorizontal: 16,
  gap: 14,
}));

const RowDivider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.border,
  marginLeft: 46,
}));

const IconWrapper = styled.View(({ color }: { color: string }) => ({
  width: 30,
  height: 30,
  borderRadius: 8,
  backgroundColor: color,
  alignItems: "center",
  justifyContent: "center",
}));

const RowInfo = styled.View(() => ({
  flex: 1,
}));

const RowLabel = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 12,
  marginBottom: 2,
}));

const RowValue = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 15,
  fontWeight: "500",
}));

export type InfoRow = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  label: string;
  value: string;
  onPress?: () => void;
};

type Props = {
  rows: InfoRow[];
};

export default function AccountInfoCard({ rows }: Props) {
  return (
    <Card>
      {rows.map((row, index) => (
        <Fragment key={row.label}>
          {index > 0 && <RowDivider key={`divider-${index}`} />}
          <Row
            key={row.label}
            activeOpacity={row.onPress ? 0.6 : 1}
            onPress={row.onPress ?? (() => {})}
          >
            <IconWrapper color={row.iconBg}>
              <MaterialIcons name={row.icon} size={16} color="#fff" />
            </IconWrapper>
            <RowInfo>
              <RowLabel>{row.label}</RowLabel>
              <RowValue>{row.value}</RowValue>
            </RowInfo>
            {row.onPress && (
              <MaterialIcons name="chevron-right" size={20} color="#888" />
            )}
          </Row>
        </Fragment>
      ))}
    </Card>
  );
}

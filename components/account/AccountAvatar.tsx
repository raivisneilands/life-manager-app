import styled from "@emotion/native";

const AvatarWrapper = styled.View(() => ({
  alignItems: "center",
  paddingVertical: 28,
}));

const Circle = styled.View(({ theme }) => ({
  width: 88,
  height: 88,
  borderRadius: 44,
  backgroundColor: theme.primary,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 14,
}));

const Initials = styled.Text(() => ({
  color: "#fff",
  fontSize: 32,
  fontWeight: "700",
}));

const Name = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 20,
  fontWeight: "700",
}));

const Email = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
  marginTop: 4,
}));

type Props = {
  name: string;
  email: string;
};

export default function AccountAvatar({ name, email }: Props) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <AvatarWrapper>
      <Circle>
        <Initials>{initials}</Initials>
      </Circle>
      <Name>{name}</Name>
      <Email>{email}</Email>
    </AvatarWrapper>
  );
}

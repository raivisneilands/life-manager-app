import styled from "@emotion/native";
import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

const AppContainer = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.background,
  paddingHorizontal: 15,
}));

export default function Container({ children }: ContainerProps) {
  return <AppContainer>{children}</AppContainer>;
}

import styled from "styled-components/native";

const AppContainer = styled.View`
  display: flex;
  padding: 40px 20px;
  flex: 1;
`;

export default function Container({ children }) {
  return <AppContainer>{children}</AppContainer>;
}

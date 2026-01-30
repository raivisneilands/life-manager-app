import styled from "styled-components";

const StyledTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  color: #005cbeff;
`;

export default function Title({ children }) {
  return <StyledTitle>{children}</StyledTitle>;
}

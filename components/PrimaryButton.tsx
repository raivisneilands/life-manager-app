import styled from "styled-components/native";

const StyledButton = styled.TouchableOpacity`
  background-color: #005cbeff;
  padding: 10px 15px;
  border-radius: 5px;
`;

const StyledButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;

export default function PrimaryButton({ children, onPress }) {
  return (
    <StyledButton onPress={onPress}>
      <StyledButtonText>{children}</StyledButtonText>
    </StyledButton>
  );
}

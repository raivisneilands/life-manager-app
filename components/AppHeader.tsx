import styled from "@emotion/native";
import { useRef, useState } from "react";
import { Animated, Dimensions, TouchableOpacity } from "react-native";
import Menu from "./Menu";

const DRAWER_WIDTH = Dimensions.get("window").width * 0.55;

const Row = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  height: 56px;
`;

const Title = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 20,
  fontWeight: "700",
  marginLeft: 18,
  marginTop: 6,
  letterSpacing: 0.4,
}));

export default function AppHeader() {
  const [visible, setVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  function open() {
    setVisible(true);

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }),
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function close() {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: -DRAWER_WIDTH,
        useNativeDriver: true,
        bounciness: 0,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  }

  return (
    <Row activeOpacity={0.9} onPress={open}>
      <Menu
        visible={visible}
        open={open}
        close={close}
        slideAnim={slideAnim}
        backdropAnim={backdropAnim}
      />

      <Title>Life Manager</Title>
    </Row>
  );
}
import styled from "@emotion/native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";
import { BackButton } from "./BackButton";
import Menu from "./Menu";

const DRAWER_WIDTH = Dimensions.get("window").width * 0.55;

const Row = styled.View(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  height: 56,
  backgroundColor: theme.background,
}));

const Left = styled.View`
  flex-direction: row;
  align-items: center;
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
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(router.canGoBack());
  }, []);

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
    <Row>
      <Left>
        <Menu
          visible={visible}
          open={open}
          close={close}
          slideAnim={slideAnim}
          backdropAnim={backdropAnim}
        />
        <Title>Life Manager</Title>
      </Left>
      {canGoBack && <BackButton onPress={() => router.back()} />}
    </Row>
  );
}

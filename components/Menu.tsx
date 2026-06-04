import styled from "@emotion/native";
import { Link } from "expo-router";
import { Animated, Dimensions, Modal } from "react-native";

const DRAWER_WIDTH = Dimensions.get("window").width * 0.55;

const HamburgerButton = styled.TouchableOpacity`
  padding-left: 16px;
  padding-top: 5px;
`;

const HamburgerText = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 22,
}));

const Backdrop = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Drawer = styled(Animated.View)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  width: DRAWER_WIDTH,
  backgroundColor: theme.background,
  paddingTop: 60,
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 10,
}));

const DrawerTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 22,
  fontWeight: 700,
  padding: 24,
  borderBottomWidth: 1,
  borderBottomColor: theme.border ?? "#333",
}));

const MenuLink = styled.TouchableOpacity(({ theme }) => ({
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderBottomWidth: 1,
  borderBottomColor: theme.border ?? "#333",
}));

const MenuLinkText = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 16,
}));

const LINKS = [
  { label: "Home", key: "" },
  { label: "Relationships", key: "relationships" },
  { label: "Fitness & Workouts", key: "fitness" },
  { label: "Goals", key: "goals" },
  { label: "Settings", key: "settings" },
  { label: "Account", key: "account" },
];

type Props = {
  visible: boolean;
  open: () => void;
  close: () => void;
  slideAnim: Animated.Value;
  backdropAnim: Animated.Value;
  canGoBack?: boolean;
};

export default function Menu({
  visible,
  open,
  close,
  slideAnim,
  backdropAnim,
}: Props) {
  return (
    <>
      {/* Hamburger still inside Menu */}
      <HamburgerButton onPress={open} activeOpacity={0.7}>
        <HamburgerText>☰</HamburgerText>
      </HamburgerButton>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={close}
      >
        <Animated.View
          style={{
            flex: 1,
            opacity: backdropAnim,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Backdrop onPress={close} activeOpacity={1} />
        </Animated.View>

        <Drawer style={{ transform: [{ translateX: slideAnim }] }}>
          <DrawerTitle>Menu</DrawerTitle>

          {LINKS.map((link) => (
            <MenuLink key={link.key} activeOpacity={0.6}>
              <Link href={`/${link.key}` as any} onPress={close}>
                <MenuLinkText>{link.label}</MenuLinkText>
              </Link>
            </MenuLink>
          ))}
        </Drawer>
      </Modal>
    </>
  );
}

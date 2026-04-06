import styled from '@emotion/native';
import { useRef, useState } from 'react';
import { Animated, Dimensions, Modal } from 'react-native';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.55;

const HamburgerButton = styled.TouchableOpacity`
  padding: 12px 16px;
`;

const HamburgerText = styled.Text(({theme}) => ({
  color: theme.textPrimary,
  fontSize: 22,
}));

const Backdrop = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Drawer = styled(Animated.View)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  width: DRAWER_WIDTH,
  backgroundColor: theme.background,
  paddingTop: 60,
  shadowColor: '#000',
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 10,
}));

const DrawerTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 22,
  fontWeight: 700,
  paddingTop: 0,
  paddingRight: 24,
  paddingBottom: 24,
  paddingLeft: 24,
  borderBottomWidth: 1,
  borderBottomColor: theme.border ?? '#333',
}));

const MenuLink = styled.TouchableOpacity(({theme}) => ({
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderBottomWidth: 1,
  borderBottomColor: theme.border ?? '#333',
}));

const MenuLinkText = styled.Text(({theme}) => ({
  color: theme.textPrimary,
  fontSize: 16,
}));

const LINKS = [
  { label: 'Relationships', key: 'relationships' },
  { label: 'Fitness & Workouts', key: 'fitness' },
  { label: 'Goals', key: 'goals' },
  { label: 'Settings', key: 'settings' },
];

export default function Menu() {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  function openDrawer() {
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

  function closeDrawer() {
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
    <>
      <HamburgerButton onPress={openDrawer} activeOpacity={0.7}>
        <HamburgerText>☰</HamburgerText>
      </HamburgerButton>

    <Modal visible={visible} transparent animationType="none" onRequestClose={closeDrawer}>
    <Animated.View style={{ flex: 1, opacity: backdropAnim, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Backdrop onPress={closeDrawer} activeOpacity={1} />
    </Animated.View>

    <Drawer style={{ transform: [{ translateX: slideAnim }] }}>
        <DrawerTitle>Menu</DrawerTitle>
        {LINKS.map((link) => (
        <MenuLink
            key={link.key}
            activeOpacity={0.6}
            onPress={() => {
            closeDrawer();
            console.log(`Navigate to: ${link.key}`);
            }}
        >
            <MenuLinkText>{link.label}</MenuLinkText>
        </MenuLink>
        ))}
    </Drawer>
    </Modal>
    </>
  );
}
import { useRelationshipStore } from '@/store/RelationshipStore';
import styled from '@emotion/native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal } from 'react-native';
import RelationshipForm from './RelationshipForm';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

const Backdrop = styled.TouchableOpacity({
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
});

const Sheet = styled(Animated.View)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: SHEET_HEIGHT,
  backgroundColor: theme.background,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingHorizontal: 24,
  paddingBottom: 32,
}));

const Handle = styled.View(({ theme }) => ({
  width: 40,
  height: 4,
  backgroundColor: theme.border,
  borderRadius: 99,
  alignSelf: 'center',
  marginTop: 12,
  marginBottom: 20,
}));

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  birthday: '',
  howWeMet: '',
  type: '',
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AddRelationshipSheet( {visible, onClose}: Props ) {
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const addRelationship = useRelationshipStore((s) => s.addRelationship);

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    } else {
      slideAnim.setValue(SHEET_HEIGHT);
    }
  }, [visible]);

  function handleClose() {
    Animated.timing(slideAnim, {
      toValue: SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setForm(EMPTY_FORM);
      onClose();
    });
  }

  function handleSubmit() {
    if (!form.name.trim()) return;

    addRelationship({
      id: 'task-' + Math.random().toString(36).substr(2, 9),
      ...form,
    });

    handleClose();
  }

  return (
    <Modal visible={visible} transparent animationType="none">
      <Backdrop onPress={handleClose} activeOpacity={1} />

      <Sheet style={{ transform: [{ translateY: slideAnim }] }}>
        <Handle />

        <RelationshipForm
          form={form}
          setForm={setForm}
          onCancel={handleClose}
          onSubmit={handleSubmit}
        />
      </Sheet>
    </Modal>
  );
}
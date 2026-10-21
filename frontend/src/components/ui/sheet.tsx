import { ReactNode } from "react";
import { Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "./text";

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Sheet({
  visible,
  title,
  message,
  onClose,
  children,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end">
        <Pressable
          className="absolute inset-0 bg-primary-darker/40"
          onPress={onClose}
          accessibilityLabel="Cerrar"
          accessibilityRole="button"
        />
        <View
          className="rounded-t-[28px] bg-primary-light px-7 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
        >
          <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-primary-light-active" />
          <Text variant="subtitle2" className="mb-1">
            {title}
          </Text>
          {message && (
            <Text variant="body3" className="mb-5 text-primary-dark-hover">
              {message}
            </Text>
          )}
          {children}
        </View>
      </View>
    </Modal>
  );
}

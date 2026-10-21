import { View } from "react-native";
import Button from "./button";
import Sheet from "./sheet";

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancelar",
  destructive,
  loading,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Sheet visible={visible} title={title} message={message} onClose={onClose}>
      <View className="gap-3">
        <Button
          color={destructive ? "error" : "primary"}
          loading={loading}
          onPress={onConfirm}
        >
          {confirmLabel}
        </Button>
        <Button variant="outlined" onPress={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
      </View>
    </Sheet>
  );
}

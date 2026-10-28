import { useEffect, useState } from "react";
import { View } from "react-native";
import LivingMoodFace from "../../../components/avatar/livingMoodFace";
import Button from "../../../components/ui/button";
import Sheet from "../../../components/ui/sheet";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { MOODS, MoodId } from "../../../constants/emotions";

interface Props {
  // Ánimo tocado que falta confirmar; `null` cierra la hoja.
  mood: MoodId | null;
  onConfirm: (mood: MoodId) => void;
  onCancel: () => void;
}

// Confirma el ánimo antes de guardarlo: los registros no se pueden borrar, así que un toque
// por error no debería quedar en el historial.
export default function MoodConfirmSheet({ mood, onConfirm, onCancel }: Props) {
  // Conserva el último ánimo mientras la hoja se cierra, para que no se vacíe durante la animación.
  const [shown, setShown] = useState<MoodId | null>(mood);
  useEffect(() => {
    if (mood) setShown(mood);
  }, [mood]);

  const label = MOODS.find((m) => m.id === shown)?.label.toLowerCase() ?? "";

  return (
    <Sheet visible={!!mood} title="¿Así te sientes?" onClose={onCancel}>
      {shown && (
        <View className="gap-4">
          <View
            className="flex-row items-center gap-4 rounded-card p-4"
            style={{ backgroundColor: `${colors.mood[shown]}33` }}
          >
            <LivingMoodFace mood={shown} size={64} />
            <View className="flex-1">
              <Text variant="subtitle2">{`Me siento ${label}`}</Text>
              <Text variant="caption1" className="text-primary-dark-hover">
                Quedará guardado en tu día. Si tu ánimo cambia, puedes actualizarlo después.
              </Text>
            </View>
          </View>
          <View className="gap-3">
            <Button color="secondary" icon="checkmark" onPress={() => onConfirm(shown)}>
              Sí, guardar
            </Button>
            <Button variant="outlined" onPress={onCancel}>
              Elegir otra
            </Button>
          </View>
        </View>
      )}
    </Sheet>
  );
}

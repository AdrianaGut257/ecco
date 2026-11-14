import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Button from "../../../components/ui/button";
import Card from "../../../components/ui/card";
import Text from "../../../components/ui/text";
import { GOOD_THING_MAX, goodThings } from "../../../store/goodThings";
import { useColors } from "../../../theme";

// "Algo bueno de hoy": una línea de gratitud, privada y opcional. Notar lo bueno del día se asocia
// con más bienestar (Emmons y McCullough, 2003). Se guarda solo en el teléfono.
export default function GoodThing() {
  const c = useColors();
  const [saved, setSaved] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    goodThings.get().then((text) => {
      setSaved(text);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  const save = async () => {
    await goodThings.set(draft);
    setSaved(draft.trim() || null);
    setEditing(false);
  };

  const writing = editing || !saved;

  return (
    <Card tone="white" className="gap-3">
      <View className="flex-row items-center gap-2.5">
        <Ionicons name="sunny-outline" size={22} color={c.primary["dark-hover"]} />
        <Text variant="subtitle2" className="flex-1">
          Algo bueno de hoy
        </Text>
      </View>

      {writing ? (
        <Animated.View entering={FadeIn.duration(250)} className="gap-3">
          <Text variant="caption1" className="text-primary-dark-hover">
            Aunque sea pequeño: un mensaje, un café, un rato de sol. Solo tú lo ves.
          </Text>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Hoy algo bueno fue…"
            placeholderTextColor={c.primary["dark-hover"]}
            maxLength={GOOD_THING_MAX}
            multiline
            accessibilityLabel="Algo bueno de hoy"
            className="min-h-[48px] rounded-field border border-primary-light-active bg-surface px-4 py-3 font-body text-body3 text-primary-dark-active"
            style={{ outlineStyle: "none" } as object}
          />
          <View className="flex-row justify-end gap-2">
            {saved && (
              <Button
                variant="outlined"
                size="small"
                fullWidth={false}
                onPress={() => setEditing(false)}
              >
                Cancelar
              </Button>
            )}
            <Button
              color="secondary"
              size="small"
              fullWidth={false}
              icon="checkmark"
              disabled={!draft.trim()}
              onPress={save}
            >
              Guardar
            </Button>
          </View>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeIn.duration(250)} className="flex-row items-start gap-3">
          <Text variant="body3" className="flex-1 text-primary-dark-active">
            {`“${saved}”`}
          </Text>
          <Pressable
            onPress={() => {
              setDraft(saved ?? "");
              setEditing(true);
            }}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Editar algo bueno de hoy"
            className="min-h-[40px] justify-center"
          >
            <Ionicons name="create-outline" size={20} color={c.primary["dark-hover"]} />
          </Pressable>
        </Animated.View>
      )}
    </Card>
  );
}

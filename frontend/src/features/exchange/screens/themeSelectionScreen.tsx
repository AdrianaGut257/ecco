import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";
import AppHeader from "../../../components/layout/appHeader";
import Container from "../../../components/layout/container";
import Button from "../../../components/ui/button";
import Card from "../../../components/ui/card";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";

type Hobby = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const HOBBIES: Hobby[] = [
  { id: "Viajes", label: "Viajes", icon: "airplane-outline" },
  { id: "Música", label: "Música", icon: "musical-notes-outline" },
  { id: "Juegos", label: "Juegos", icon: "game-controller-outline" },
  { id: "Comida", label: "Comida", icon: "restaurant-outline" },
  { id: "Naturaleza", label: "Naturaleza", icon: "leaf-outline" },
  { id: "Películas", label: "Películas", icon: "film-outline" },
];

export const MAX_HOBBIES = 3;

interface Props {
  onBack: () => void;
  onSelect: (hobbies: string[]) => void;
}

export default function ThemeSelectionScreen({ onBack, onSelect }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const full = selected.length >= MAX_HOBBIES;

  const toggle = (id: string) =>
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      return prev.length >= MAX_HOBBIES ? prev : [...prev, id];
    });

  return (
    <Container
      flush
      padded={false}
      footer={
        <View className="px-7">
          <Button
            disabled={selected.length === 0}
            onPress={() => onSelect(selected)}
          >
            Continuar
          </Button>
        </View>
      }
    >
      <AppHeader showBack onBack={onBack} />
      <View className="flex-1 px-7 pt-6">
        <Text variant="h3" className="mb-6">
          ¿De qué quieres hablar?
        </Text>

        <Card className="p-5">
          <Text variant="subtitle2" className="text-primary-normal-active">
            Aficiones
          </Text>
          <Text variant="caption1" className="mb-4 text-primary-dark-hover">
            {`Elige hasta ${MAX_HOBBIES} para esta semana (${selected.length}/${MAX_HOBBIES})`}
          </Text>
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {HOBBIES.map((hobby) => {
              const active = selected.includes(hobby.id);
              const blocked = full && !active;
              return (
                <Pressable
                  key={hobby.id}
                  onPress={() => toggle(hobby.id)}
                  disabled={blocked}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active, disabled: blocked }}
                  className={`h-28 w-[48%] justify-between rounded-card p-3 ${
                    active
                      ? "border-2 border-secondary-dark bg-secondary-light-active"
                      : "border border-secondary-light-active bg-secondary-light"
                  } ${blocked ? "opacity-50" : ""}`}
                >
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-white/70">
                    <Ionicons
                      name={hobby.icon}
                      size={18}
                      color={colors.secondary.dark}
                    />
                  </View>
                  <Text variant="body3" className="text-secondary-dark-active">
                    {hobby.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      </View>
    </Container>
  );
}

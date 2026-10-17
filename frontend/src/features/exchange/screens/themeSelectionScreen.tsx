import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import AppHeader from "../../../components/layout/appHeader";
import Container from "../../../components/layout/container";
import Button from "../../../components/ui/button";
import Card from "../../../components/ui/card";
import Chip from "../../../components/ui/chip";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { INTEREST_CATEGORIES } from "../../../constants/interests";
import { sessionStore } from "../../../store/session";

export const MAX_HOBBIES = 3;

interface Props {
  onBack: () => void;
  onSelect: (hobbies: string[]) => void;
}

export default function ThemeSelectionScreen({ onBack, onSelect }: Props) {
  const router = useRouter();
  const { user } = sessionStore.use();
  const [selected, setSelected] = useState<string[]>([]);
  const full = selected.length >= MAX_HOBBIES;

  const mine = new Set(user?.interests ?? []);
  const groups = INTEREST_CATEGORIES.map((category) => ({
    ...category,
    items: category.items.filter((item) => mine.has(item)),
  })).filter((category) => category.items.length > 0);

  const toggle = (item: string) =>
    setSelected((prev) => {
      if (prev.includes(item)) return prev.filter((i) => i !== item);
      return prev.length >= MAX_HOBBIES ? prev : [...prev, item];
    });

  return (
    <Container
      flush
      scroll
      padded={false}
      footer={
        <View className="px-7">
          <Button
            disabled={selected.length === 0}
            onPress={() => onSelect(selected)}
          >
            Buscar a alguien
          </Button>
        </View>
      }
    >
      <AppHeader showBack onBack={onBack} />
      <View className="px-7 pb-6 pt-6">
        <Text variant="h3" className="mb-1">
          ¿De qué te gustaría hablar?
        </Text>
        <Text variant="body3" className="mb-6 text-primary-dark-hover">
          Elige entre tus intereses. Buscaremos a alguien que también quiera
          hablar de esto.
        </Text>

        <Card className="p-5">
          <Text
            variant="body2"
            className="font-heading-semibold text-primary-dark-active"
          >
            Temas de esta semana
          </Text>
          <Text variant="caption1" className="mb-4 text-primary-dark-hover">
            {`Elige hasta ${MAX_HOBBIES} (${selected.length}/${MAX_HOBBIES})`}
          </Text>

          <View className="gap-4">
            {groups.map((group) => (
              <View key={group.title}>
                <View className="mb-2 flex-row items-center gap-2">
                  <Ionicons
                    name={group.icon}
                    size={16}
                    color={colors.primary["dark-hover"]}
                  />
                  <Text variant="caption1" className="text-primary-dark-hover">
                    {group.title}
                  </Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {group.items.map((item) => {
                    const active = selected.includes(item);
                    return (
                      <Chip
                        key={item}
                        label={item}
                        tone="secondary"
                        selected={active}
                        disabled={full && !active}
                        onPress={() => toggle(item)}
                      />
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </Card>

        <Pressable
          onPress={() => router.push("/editInterests")}
          accessibilityRole="button"
          hitSlop={8}
          className="mt-4 min-h-[44px] flex-row items-center justify-center gap-1.5"
        >
          <Ionicons
            name="create-outline"
            size={16}
            color={colors.primary["dark-hover"]}
          />
          <Text variant="caption1" className="text-primary-dark-hover underline">
            ¿Quieres otros temas? Edita tus intereses
          </Text>
        </Pressable>
      </View>
    </Container>
  );
}

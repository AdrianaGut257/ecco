import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Container from "../../../components/layout/container";
import Button from "../../../components/ui/button";
import Dots from "../../../components/ui/dots";
import Text from "../../../components/ui/text";
import Wordmark from "../../../components/ui/wordmark";
import { colors } from "../../../constants/colors";

type Slide = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  background: "primary" | "secondary" | "tertiary";
};

const SLIDES: Slide[] = [
  {
    icon: "person-outline",
    title: "Conoce a una persona",
    message: "Cada semana te presentamos a alguien con quien compartes algo.",
    background: "primary",
  },
  {
    icon: "flower-outline",
    title: "Hagan crecer la conversación",
    message: "Siete días para conocerse. Tu planta crece con cada intercambio.",
    background: "secondary",
  },
  {
    icon: "sparkles-outline",
    title: "Al final, ambos deciden",
    message:
      "Si los dos quieren seguir, se abre la conexión. Si no, nadie se entera.",
    background: "tertiary",
  },
];

interface Props {
  loading?: boolean;
  error?: string | null;
  onComplete: () => void;
}

export default function OnboardingSlidesScreen({
  loading,
  error,
  onComplete,
}: Props) {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  const next = () => (isLast ? onComplete() : setIndex((i) => i + 1));

  return (
    <Container
      background={slide.background}
      footer={
        <View className="items-center">
          <Dots total={SLIDES.length} index={index} />
          {error && (
            <Text variant="caption1" className="mt-3 text-center text-white">
              {error}
            </Text>
          )}
          <View className="mt-6 w-full">
            <Button color="white" loading={loading} onPress={next}>
              {isLast ? "Comenzar" : "Continuar"}
            </Button>
          </View>
        </View>
      }
    >
      <View className="items-end">
        {!isLast && (
          <Pressable
            onPress={onComplete}
            hitSlop={10}
            accessibilityRole="button"
          >
            <Text variant="body3" className="text-white">
              Saltar
            </Text>
          </Pressable>
        )}
      </View>
      <View className="items-center pt-2">
        <Wordmark className="text-white" size="sm" />
      </View>
      <View className="flex-1 items-center justify-center">
        <View className="mb-8 h-28 w-28 items-center justify-center rounded-full bg-white/25">
          <Ionicons name={slide.icon} size={52} color={colors.white} />
        </View>
        <Text variant="h3" className="mb-3 text-center text-white">
          {slide.title}
        </Text>
        <Text variant="body3" className="max-w-[280px] text-center text-white">
          {slide.message}
        </Text>
      </View>
    </Container>
  );
}

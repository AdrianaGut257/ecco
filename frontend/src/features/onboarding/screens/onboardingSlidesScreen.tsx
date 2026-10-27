import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Avatar from "../../../components/avatar/avatar";
import Plant from "../../../components/garden/plant";
import Container from "../../../components/layout/container";
import Button from "../../../components/ui/button";
import Dots from "../../../components/ui/dots";
import Text from "../../../components/ui/text";
import Wordmark from "../../../components/ui/wordmark";
import { colors } from "../../../constants/colors";
import { MESSAGES_PER_DAY } from "../../../constants/plant";
import type { AvatarConfig } from "../../../types";

type Slide = {
  art: "avatar" | "plant" | "bloom";
  title: string;
  message: string;
  background: "primary" | "secondary" | "tertiary";
};

const SLIDES: Slide[] = [
  {
    art: "avatar",
    title: "Una persona, algo en común",
    message:
      "Te presentamos a alguien con tus gustos. Una conversación a la vez, sin seguidores ni likes.",
    background: "primary",
  },
  {
    art: "plant",
    title: "Pocos mensajes, mucho sentido",
    message: `Cada día tienen ${MESSAGES_PER_DAY} mensajes. Su planta crece los días en que ambos se escriben.`,
    background: "secondary",
  },
  {
    art: "bloom",
    title: "Al final, ambos deciden",
    message:
      "Si los dos quieren seguir, la planta florece. Si no, nadie se entera.",
    background: "tertiary",
  },
];

interface Props {
  avatar: AvatarConfig;
  loading?: boolean;
  error?: string | null;
  onComplete: () => void;
}

export default function OnboardingSlidesScreen({
  avatar,
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
            <View className="mt-3 flex-row items-center gap-2 rounded-field bg-white px-3 py-2">
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={colors.error["dark-active"]}
              />
              <Text variant="caption1" className="flex-1 text-error-dark-active">
                {error}
              </Text>
            </View>
          )}
          <View className="mt-6 w-full">
            <Button color="white" loading={loading} onPress={next}>
              {isLast ? "Comenzar" : "Continuar"}
            </Button>
          </View>
        </View>
      }
    >
      <View className="min-h-[24px] items-end">
        {!isLast && (
          <Pressable
            onPress={() => setIndex(SLIDES.length - 1)}
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
      <Animated.View
        key={index}
        entering={FadeIn.duration(350)}
        className="flex-1 items-center justify-center"
      >
        <View className="mb-8 h-40 w-40 items-center justify-center rounded-full bg-white/25">
          {slide.art === "avatar" && <Avatar config={avatar} mood="feliz" size={128} />}
          {slide.art === "plant" && <Plant stage={3} size={130} growIn />}
          {slide.art === "bloom" && <Plant stage={6} size={130} growIn />}
        </View>
        <Text variant="h3" className="mb-3 text-center text-white">
          {slide.title}
        </Text>
        <Text variant="body2" className="max-w-[290px] text-center text-white">
          {slide.message}
        </Text>
      </Animated.View>
    </Container>
  );
}

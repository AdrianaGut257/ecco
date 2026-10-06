import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type Slide = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  bg: string;
};

const SLIDES: Slide[] = [
  {
    icon: "person-outline",
    title: "Conoce a una persona",
    message: "Cada semana te presentamos a alguien con quien compartes algo.",
    bg: "#E8A77B", // primaryNormal
  },
  {
    icon: "leaf-outline",
    title: "Hagan crecer la conversación",
    message:
      "Siete días para conocerse. La conversación crece con cada intercambio.",
    bg: "#9CAF88", // secondaryNormal
  },
  {
    icon: "sparkles-outline",
    title: "Al final, ambos deciden",
    message:
      "Si los dos quieren seguir, se abre la conexión. Si no, nadie se entera.",
    bg: "#8E664B", // primaryNormalActive
  },
];

export default function OnboardingSlidesScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [index, setIndex] = useState<number>(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  const next = () => {
    if (isLast) {
      onComplete();
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <Pressable
      onPress={next}
      className="flex-1 items-center justify-between pb-12 pt-20 px-8"
      style={{ backgroundColor: slide.bg }}
    >
      {!isLast && (
        <Pressable onPress={onComplete} className="self-end">
          <Text className="font-body-medium text-sm text-white/80">Saltar</Text>
        </Pressable>
      )}
      {isLast && <View />}

      <View className="items-center flex-1 justify-center">
        <View className="w-24 h-24 rounded-full bg-white/20 items-center justify-center mb-8">
          <Ionicons name={slide.icon} size={48} color="#FFFFFF" />
        </View>
        <Text className="font-heading-bold text-h2 text-white text-center mb-3">
          {slide.title}
        </Text>
        <Text className="font-body text-sm text-white/90 text-center leading-6 max-w-[280px]">
          {slide.message}
        </Text>
      </View>

      <View className="items-center w-full">
        <View className="flex-row gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full ${
                i === index ? "w-6 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </View>

        <Pressable
          onPress={next}
          className="w-full bg-white rounded-chip py-3.5 items-center"
        >
          <Text
            className="font-heading-semibold text-base"
            style={{ color: slide.bg }}
          >
            {isLast ? "Comenzar" : "Siguiente"}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../../../components/ui/Button";

const CATEGORIES: { title: string; items: string[] }[] = [
  {
    title: "Cultura y entretenimiento",
    items: [
      "Películas",
      "Videojuegos",
      "Series",
      "Teatro",
      "Lectura",
      "Arte y pintura",
      "Música",
    ],
  },
  {
    title: "Comida y bebida",
    items: ["Cocina", "Vinos", "Repostería", "Café", "Té"],
  },
  {
    title: "Naturaleza y aire libre",
    items: [
      "Senderismo",
      "Jardinería",
      "Camping",
      "Playa",
      "Montañismo",
      "Astronomía",
      "Ciclismo",
    ],
  },
  {
    title: "Bienestar y estilo de vida",
    items: ["Yoga", "Gimnasio", "Meditación", "Viajes"],
  },
];

export default function InterestsScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  return (
    <View className="flex-1 bg-primaryClear">
      <ScrollView
        className="flex-1 px-6 pt-16"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Text className="font-heading-bold text-h1 text-primaryNormalActive mb-1">
          ¿Qué te gusta?
        </Text>
        <Text className="font-body text-sm text-primaryNormalHover mb-6">
          Elige los temas que quieres compartir.
        </Text>

        {CATEGORIES.map((category) => (
          <View key={category.title} className="mb-6">
            <Text className="font-heading-semibold text-h6 text-primaryNormalActive mb-3">
              {category.title}
            </Text>
            <View className="bg-white rounded-card border border-primaryLight p-4 flex-row flex-wrap gap-2.5">
              {category.items.map((item) => {
                const active = selected.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => toggle(item)}
                    activeOpacity={0.8}
                    className={`px-4 py-2.5 rounded-chip border ${
                      active
                        ? "bg-primaryNormal border-primaryNormal"
                        : "bg-primaryClear border-primaryLightActive"
                    }`}
                  >
                    <Text
                      className={`font-body-medium text-sm ${
                        active ? "text-white" : "text-primaryNormalHover"
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="px-6 pb-8 pt-3 bg-primaryClear">
        <Text className="font-body text-xs text-primaryNormalHover text-center mb-3">
          {selected.length === 0
            ? "Elige al menos un interés para continuar."
            : `${selected.length} interés${selected.length > 1 ? "es" : ""} seleccionado${selected.length > 1 ? "s" : ""}`}
        </Text>
        <Button
          variant="primary"
          onPress={onComplete}
          disabled={selected.length === 0}
        >
          Siguiente
        </Button>
      </View>
    </View>
  );
}

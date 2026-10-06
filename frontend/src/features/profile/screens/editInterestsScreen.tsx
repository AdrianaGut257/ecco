import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../../components/ui/Button";

const CATEGORIES: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  items: string[];
}[] = [
  {
    title: "Cultura y entretenimiento",
    icon: "film-outline",
    items: [
      "Películas",
      "Series",
      "Música",
      "Lectura",
      "Teatro",
      "Videojuegos",
      "Arte y pintura",
    ],
  },
  {
    title: "Comida y bebida",
    icon: "restaurant-outline",
    items: ["Cocina", "Repostería", "Café", "Vinos", "Té"],
  },
  {
    title: "Naturaleza y aire libre",
    icon: "leaf-outline",
    items: [
      "Senderismo",
      "Camping",
      "Jardinería",
      "Playa",
      "Montañismo",
      "Ciclismo",
    ],
  },
  {
    title: "Bienestar y estilo de vida",
    icon: "heart-outline",
    items: ["Yoga", "Meditación", "Gimnasio", "Running", "Danza", "Viajes"],
  },
  {
    title: "Creatividad",
    icon: "brush-outline",
    items: ["Fotografía", "Escritura", "Dibujo", "Manualidades", "Diseño"],
  },
  {
    title: "Social y aprendizaje",
    icon: "people-outline",
    items: [
      "Voluntariado",
      "Idiomas",
      "Historia",
      "Ciencia",
      "Emprendimiento",
      "Mascotas",
    ],
  },
];

// TODO: reemplazar con los intereses reales guardados del usuario
const MOCK_SAVED_INTERESTS = [
  "Senderismo",
  "Cine de autor",
  "Cocina",
  "Fotografía",
];

export default function EditInterestsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(MOCK_SAVED_INTERESTS);

  const toggle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handleSave = () => {
    // TODO: guardar `selected` en el backend/estado global
    router.back();
  };

  return (
    <View className="flex-1 bg-primaryClear">
      <ScrollView
        className="flex-1 px-6 pt-16"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center gap-1.5 mb-6"
        >
          <Ionicons name="arrow-back" size={18} color="#8E664B" />
          <Text className="font-body-medium text-sm text-primaryNormalHover">
            Volver
          </Text>
        </Pressable>

        <Text className="font-heading-bold text-h1 text-primaryNormalActive mb-1">
          Editar intereses
        </Text>
        <Text className="font-body text-sm text-primaryNormalHover mb-6">
          Actualiza los temas que quieres compartir.
        </Text>

        {CATEGORIES.map((category) => (
          <View key={category.title} className="mb-6">
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons name={category.icon} size={18} color="#E8A77B" />
              <Text className="font-heading-semibold text-h6 text-primaryNormalActive">
                {category.title}
              </Text>
            </View>
            <View className="bg-white rounded-card border border-primaryLight p-4 flex-row flex-wrap gap-2.5">
              {category.items.map((item) => {
                const active = selected.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => toggle(item)}
                    activeOpacity={0.8}
                    className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-chip border ${
                      active
                        ? "bg-primaryNormal border-primaryNormal"
                        : "bg-primaryClear border-primaryLightActive"
                    }`}
                  >
                    {active && (
                      <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                    )}
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
          {selected.length} interés{selected.length !== 1 ? "es" : ""}{" "}
          seleccionado
          {selected.length !== 1 ? "s" : ""}
        </Text>
        <Button
          variant="primary"
          onPress={handleSave}
          disabled={selected.length === 0}
        >
          Guardar cambios
        </Button>
      </View>
    </View>
  );
}

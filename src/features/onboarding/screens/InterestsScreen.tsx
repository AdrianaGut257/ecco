import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../../../components/ui/Button";

export const CATEGORIES: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  items: string[];
}[] = [
  {
    title: "Entretenimiento",
    icon: "film-outline",
    items: [
      "Películas",
      "Series",
      "Cómics",
      "Anime",
      "Videojuegos",
      "Podcasts",
      "Streaming",
    ],
  },
  {
    title: "Música",
    icon: "musical-notes-outline",
    items: [
      "Pop",
      "Rock",
      "Reguetón",
      "Música clásica",
      "Electrónica",
      "K-pop",
      "Hip hop",
      "Jazz",
      "Música latina",
      "Otro",
    ],
  },
  {
    title: "Cultura",
    icon: "book-outline",
    items: [
      "Historia",
      "Literatura",
      "Idiomas",
      "Tradiciones",
      "Electrónica",
      "Museos",
      "Teatro",
    ],
  },
  {
    title: "Cocina y gastronomía",
    icon: "restaurant-outline",
    items: [
      "Comida vegana",
      "Gastronomía internacional",
      "Comida tradicional",
      "Comida rápida",
      "Postres",
      "Degustación de alimentos",
    ],
  },

  {
    title: "Bebidas",
    icon: "cafe-outline",
    items: ["Café", "Té", "Vinos", "Cócteles", "Bebidas naturales", "Batidos"],
  },
  {
    title: "Deportes",
    icon: "trophy-outline",
    items: [
      "Fútbol",
      "Básquetbol",
      "Voleibol",
      "Natación",
      "Tenis",
      "Golf",
      "Boxeo",
      "Artes marciales",
      "Atletismo",
      "Ciclismo",
    ],
  },

  {
    title: "Actividades al aire libre",
    icon: "walk-outline",
    items: [
      "Senderismo",
      "Montañismo",
      "Escalada",
      "Camping",
      "Trekking",
      "Surf",
      "Paseos en bicicleta",
    ],
  },

  {
    title: "Estilo de vida",
    icon: "heart-outline",
    items: [
      "Moda",
      "Belleza",
      "Cocina",
      "Repostería",
      "Decoración",
      "Jardinería",
      "Viajes",
    ],
  },

  {
    title: "Bienestar",
    icon: "leaf-outline",
    items: [
      "Ejercicio",
      "Yoga",
      "Salud",
      "Meditación",
      "Relajación",
      "Desarrollo personal",
      "Cuidado personal",
    ],
  },

  {
    title: "Creatividad",
    icon: "bulb-outline",
    items: ["Fotografía", "Escritura", "Dibujo", "Manualidades", "Diseño"],
  },

  {
    title: "Social y comunidad",
    icon: "people-outline",
    items: [
      "Familia",
      "Amistad",
      "Voluntariado",
      "Eventos sociales",
      "Emprendimiento",
      "Mascotas",
    ],
  },
];

export default function InterestsScreen({
  onComplete,
}: {
  onComplete: (selected: string[]) => void;
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
          {selected.length < 3
            ? "Elige al menos tres intereses para continuar."
            : `${selected.length} interés${selected.length > 1 ? "es" : ""} seleccionado${selected.length > 1 ? "s" : ""}`}
        </Text>
        <Button
          variant="primary"
          onPress={() => onComplete(selected)}
          disabled={selected.length < 3}
        >
          Siguiente
        </Button>
      </View>
    </View>
  );
}

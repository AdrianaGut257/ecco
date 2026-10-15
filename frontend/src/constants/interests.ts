import { Ionicons } from "@expo/vector-icons";

export type InterestCategory = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  items: string[];
};

export const INTEREST_CATEGORIES: InterestCategory[] = [
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

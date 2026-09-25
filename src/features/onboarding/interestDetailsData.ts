export type InterestDetail = {
  subtopics: string[];
  placeholder: string;
};

export const INTEREST_DETAILS: Record<string, InterestDetail> = {
  Películas: {
    subtopics: [
      "Acción",
      "Comedia",
      "Drama",
      "Terror",
      "Ciencia ficción",
      "Animación",
      "Documental",
      "Romance",
    ],
    placeholder: "Ej: Interstellar, Parásitos, La La Land…",
  },
  Series: {
    subtopics: [
      "Comedia",
      "Drama",
      "Crimen",
      "Ciencia ficción",
      "Fantasía",
      "Documental",
    ],
    placeholder: "Ej: Breaking Bad, Fleabag, Dark…",
  },
  Música: {
    subtopics: [
      "Pop",
      "Rock",
      "Reggaetón",
      "Jazz",
      "Clásica",
      "Electrónica",
      "Indie",
      "Hip-hop",
    ],
    placeholder: "Ej: Bad Bunny, Radiohead, Silvana Estrada…",
  },
  Videojuegos: {
    subtopics: [
      "Acción",
      "Aventura",
      "RPG",
      "Estrategia",
      "Deportes",
      "Terror",
      "Multijugador",
    ],
    placeholder: "Ej: Zelda, The Last of Us, Stardew Valley…",
  },
  Lectura: {
    subtopics: [
      "Novela",
      "Ciencia ficción",
      "Fantasía",
      "Misterio",
      "Historia",
      "Autoayuda",
      "Poesía",
      "Cómic",
    ],
    placeholder: "Ej: Cien años de soledad, Dune…",
  },
  Cocina: {
    subtopics: [
      "Boliviana",
      "Italiana",
      "Japonesa",
      "Mexicana",
      "Vegetariana",
      "Repostería",
      "Parrilla",
    ],
    placeholder: "Ej: Salteñas, ramen, pasta casera…",
  },
  "Arte y pintura": {
    subtopics: [
      "Pintura",
      "Escultura",
      "Arte digital",
      "Fotografía artística",
      "Street art",
    ],
    placeholder: "Ej: Frida Kahlo, impresionismo…",
  },
  Viajes: {
    subtopics: ["Playa", "Montaña", "Ciudades", "Mochilero", "Naturaleza"],
    placeholder: "Ej: Perú, Japón, la Patagonia…",
  },
};

export const DEFAULT_PLACEHOLDER = "Cuéntanos un poco más…";

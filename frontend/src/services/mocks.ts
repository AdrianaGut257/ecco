import type { ChatMessage, Match, User } from "../types";

export const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS !== "false";

export const wait = (ms = 700) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const MOCK_USER: User = {
  id: "u-1",
  username: "Sam09",
  email: "sam09@ejemplo.com",
  avatarId: "a1",
  interests: ["Películas", "Series", "Pop", "Viajes"],
};

export const MOCK_MATCH: Match = {
  id: "m-1",
  partner: { username: "Ana09", avatarId: "a3" },
  commonInterests: [
    { category: "Entretenimiento", items: ["Películas", "Series"] },
    { category: "Música", items: ["Pop"] },
  ],
  startedAt: new Date().toISOString(),
  day: 1,
};

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "c-1",
    matchId: "m-1",
    text: "¡Hola! Vi que te gusta la música pop.",
    fromMe: false,
    day: 1,
    createdAt: new Date().toISOString(),
    status: "sent",
  },
  {
    id: "c-2",
    matchId: "m-1",
    text: "¡Sí! Estoy escuchando mucho últimamente. ¿Y tú?",
    fromMe: true,
    day: 1,
    createdAt: new Date().toISOString(),
    status: "sent",
  },
];

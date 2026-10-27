import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Recuerda, por conversación, el último día en que se vio la pantalla de la planta y en qué etapa estaba.
interface Seen {
  date: string;
  stage: number;
}

const web = Platform.OS === "web";
const keyFor = (matchId: string) => `ecco.growth.${matchId}`;

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export const dailyGrowth = {
  async get(matchId: string): Promise<Seen | null> {
    try {
      const raw = web
        ? globalThis.localStorage?.getItem(keyFor(matchId))
        : await SecureStore.getItemAsync(keyFor(matchId));
      return raw ? (JSON.parse(raw) as Seen) : null;
    } catch {
      return null;
    }
  },
  async set(matchId: string, stage: number) {
    const raw = JSON.stringify({ date: today(), stage });
    try {
      if (web) globalThis.localStorage?.setItem(keyFor(matchId), raw);
      else await SecureStore.setItemAsync(keyFor(matchId), raw);
    } catch {}
  },
};

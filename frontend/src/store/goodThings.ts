import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// "Algo bueno de hoy": una línea por día que se guarda solo en el teléfono (nunca en el servidor).
const web = Platform.OS === "web";
export const GOOD_THING_MAX = 140;

const keyOf = (date: Date) => `echoom.good.${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

async function read(key: string) {
  try {
    return (web ? globalThis.localStorage?.getItem(key) : await SecureStore.getItemAsync(key)) ?? null;
  } catch {
    return null;
  }
}

export const goodThings = {
  get: (date = new Date()) => read(keyOf(date)),
  async set(text: string, date = new Date()) {
    const key = keyOf(date);
    const value = text.trim().slice(0, GOOD_THING_MAX);
    try {
      if (!value) {
        if (web) globalThis.localStorage?.removeItem(key);
        else await SecureStore.deleteItemAsync(key);
      } else if (web) globalThis.localStorage?.setItem(key, value);
      else await SecureStore.setItemAsync(key, value);
    } catch {}
  },
  // Las de los últimos días (sin hoy), de la más reciente a la más antigua.
  async recent(days = 14) {
    const out: { date: Date; text: string }[] = [];
    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const text = await read(keyOf(date));
      if (text) out.push({ date, text });
    }
    return out;
  },
};

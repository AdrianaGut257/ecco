import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { today } from "./dailyGrowth";

// Si la persona eligió "Ahora no", la pantalla de ánimo no vuelve a aparecer ese día.
const KEY = "echoom.checkInSkipped";
const web = Platform.OS === "web";

export const moodCheckIn = {
  async skippedToday() {
    try {
      const raw = web
        ? globalThis.localStorage?.getItem(KEY)
        : await SecureStore.getItemAsync(KEY);
      return raw === today();
    } catch {
      return false;
    }
  },
  async skip() {
    try {
      if (web) globalThis.localStorage?.setItem(KEY, today());
      else await SecureStore.setItemAsync(KEY, today());
    } catch {}
  },
};

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { createStore } from "./createStore";

// Preferencia local: la app empieza en modo claro y la persona puede activar el modo oscuro en Ajustes.
const KEY = "echoom.theme";
const web = Platform.OS === "web";
const store = createStore<{ dark: boolean; loaded: boolean }>({ dark: false, loaded: false });

const read = async () => {
  try {
    const raw = web
      ? globalThis.localStorage?.getItem(KEY)
      : await SecureStore.getItemAsync(KEY);
    store.set({ dark: raw === "dark", loaded: true });
  } catch {
    store.set({ loaded: true });
  }
};
read();

export const themeSettings = {
  use: store.use,
  isDark: () => store.get().dark,
  async set(dark: boolean) {
    store.set({ dark });
    const raw = dark ? "dark" : "light";
    try {
      if (web) globalThis.localStorage?.setItem(KEY, raw);
      else await SecureStore.setItemAsync(KEY, raw);
    } catch {}
  },
};

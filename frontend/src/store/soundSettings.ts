import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { createStore } from "./createStore";

// Preferencia local: los sonidos están activos salvo que la persona los apague en Ajustes.
const KEY = "echoom.sounds";
const web = Platform.OS === "web";
const store = createStore<{ enabled: boolean }>({ enabled: true });

const read = async () => {
  try {
    const raw = web
      ? globalThis.localStorage?.getItem(KEY)
      : await SecureStore.getItemAsync(KEY);
    if (raw === "off") store.set({ enabled: false });
  } catch {}
};
read();

export const soundSettings = {
  use: store.use,
  enabled: () => store.get().enabled,
  async set(enabled: boolean) {
    store.set({ enabled });
    const raw = enabled ? "on" : "off";
    try {
      if (web) globalThis.localStorage?.setItem(KEY, raw);
      else await SecureStore.setItemAsync(KEY, raw);
    } catch {}
  },
};

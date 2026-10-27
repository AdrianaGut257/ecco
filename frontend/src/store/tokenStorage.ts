import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEY = "echoom.accessToken";
const web = Platform.OS === "web";

export const tokenStorage = {
  async get(): Promise<string | null> {
    try {
      if (web) return globalThis.localStorage?.getItem(KEY) ?? null;
      return await SecureStore.getItemAsync(KEY);
    } catch {
      return null;
    }
  },
  async set(token: string) {
    try {
      if (web) globalThis.localStorage?.setItem(KEY, token);
      else await SecureStore.setItemAsync(KEY, token);
    } catch {}
  },
  async remove() {
    try {
      if (web) globalThis.localStorage?.removeItem(KEY);
      else await SecureStore.deleteItemAsync(KEY);
    } catch {}
  },
};

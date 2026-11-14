import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

// Vibración breve en los momentos con significado (no en cada toque). En la web no hace nada.
const run = (fn: () => Promise<void>) => {
  if (Platform.OS === "web") return;
  fn().catch(() => undefined);
};

export const haptics = {
  tap: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
};

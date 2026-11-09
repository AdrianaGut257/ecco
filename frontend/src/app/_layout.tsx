import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";
import { useFonts } from "expo-font";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { authService } from "../services/authService";
import { sessionStore } from "../store/session";
import { themeSettings } from "../store/themeSettings";
import { ThemeRoot, useColors } from "../theme";
import "../global.css";
import "../lib/nativewindInterop";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { ready } = sessionStore.use();
  const { loaded: themeLoaded } = themeSettings.use();
  const c = useColors();
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  useEffect(() => {
    authService.restoreSession();
  }, []);

  const loaded = (fontsLoaded || !!fontError) && ready && themeLoaded;

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeRoot>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: c.primary.light },
        }}
      />
    </ThemeRoot>
  );
}

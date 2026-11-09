import { StatusBar } from "expo-status-bar";
import { vars } from "nativewind";
import { ReactNode, useLayoutEffect, useMemo } from "react";
import { Platform, View } from "react-native";
import palette from "../constants/palette";
import { themeSettings } from "../store/themeSettings";

export type Palette = typeof palette.light;

type Vars = Record<`--${string}`, string>;
const VARS = {
  light: palette.themeVars(palette.light) as Vars,
  dark: palette.themeVars(palette.dark) as Vars,
};

export const useIsDark = () => themeSettings.use().dark;

// "#RRGGBB" con transparencia, para fondos sobre las ilustraciones.
export const withAlpha = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

// Colores del modo activo, para íconos, SVG y estilos en línea. Las clases de Tailwind cambian solas.
export const useColors = (): Palette => (useIsDark() ? palette.dark : palette.light);

// Aplica la paleta del modo activo. En Android y iOS las variables pasan por el árbol de React;
// en la web se ponen en <html>, así también alcanzan a las hojas que se abren fuera del árbol.
export function ThemeRoot({ children }: { children: ReactNode }) {
  const dark = useIsDark();
  const style = useMemo(() => [{ flex: 1 }, vars(dark ? VARS.dark : VARS.light)], [dark]);

  useLayoutEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    const root = document.documentElement;
    for (const [name, value] of Object.entries(dark ? VARS.dark : VARS.light)) root.style.setProperty(name, value);
    root.style.colorScheme = dark ? "dark" : "light";
    document.body.style.backgroundColor = (dark ? palette.dark : palette.light).primary.light;
  }, [dark]);

  return (
    <View style={style}>
      <StatusBar style={dark ? "light" : "dark"} />
      {children}
    </View>
  );
}

import palette from "./palette";

// Paleta del modo claro, para valores que no dependen del modo (por ejemplo, los colores de ánimo).
// En componentes, usa useColors() de src/theme para seguir el modo activo.
export const colors = palette.light;
export type ColorScale = keyof typeof palette.light.primary;

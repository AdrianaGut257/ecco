export const typography = {
  h1: "font-ecco-bold text-h1",
  h2: "font-ecco-bold text-h2",
  h3: "font-ecco-bold text-h3",
  h4: "font-ecco-semibold text-h4",
  subtitle1: "font-ecco-semibold text-subtitle1",
  subtitle2: "font-ecco-semibold text-subtitle2",
  body1: "font-ecco text-body1",
  body2: "font-ecco text-body2",
  body3: "font-ecco-medium text-body3",
  caption1: "font-ecco-semibold text-caption1",
  caption2: "font-ecco text-caption2",
  button1: "font-ecco-semibold text-button1",
  button2: "font-ecco-semibold text-button2",
} as const;

export type TypographyVariant = keyof typeof typography;

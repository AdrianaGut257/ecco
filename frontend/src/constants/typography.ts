export const typography = {
  h1: "font-heading-bold text-h1",
  h2: "font-heading-bold text-h2",
  h3: "font-heading-bold text-h3",
  h4: "font-heading-semibold text-h4",
  subtitle1: "font-heading-bold text-subtitle1",
  subtitle2: "font-heading-bold text-subtitle2",
  body1: "font-body text-body1",
  body2: "font-body text-body2",
  body3: "font-body-medium text-body3",
  caption1: "font-body-semibold text-caption1",
  caption2: "font-body-bold text-caption2",
  caption3: "font-body text-caption3",
  button1: "font-heading-semibold text-button1",
  button2: "font-heading-semibold text-button2",
} as const;

export type TypographyVariant = keyof typeof typography;

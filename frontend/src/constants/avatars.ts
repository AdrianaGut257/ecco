import { colors } from "./colors";

export interface AvatarOption {
  id: string;
  face: string;
  mouth: "smile" | "open";
}

export const AVATARS: AvatarOption[] = [
  { id: "a1", face: colors.mood.bien, mouth: "smile" },
  { id: "a2", face: colors.primary.normal, mouth: "open" },
  { id: "a3", face: colors.mood.feliz, mouth: "open" },
  { id: "a4", face: colors.tertiary.normal, mouth: "smile" },
  { id: "a5", face: colors.secondary.normal, mouth: "smile" },
  { id: "a6", face: colors.mood.fatal, mouth: "open" },
];

export const findAvatar = (id: string) =>
  AVATARS.find((a) => a.id === id) ?? AVATARS[0];

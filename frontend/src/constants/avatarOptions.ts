export interface AvatarConfig {
  size?: number;
  bgColor?: string;
  skinColor?: string;
  hairColor?: string;
  hairStyle?: "short" | "long";
  glassesStyle?: "none" | "round";
  outfitStyle?: "sweater" | "hoodie";
  shirtColor?: string;
}

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  size: 200,
  bgColor: "#A8D08D",
  skinColor: "#F2C1A2",
  hairColor: "#7A3E28",
  hairStyle: "short",
  glassesStyle: "round",
  outfitStyle: "sweater",
  shirtColor: "#FFFFFF",
};

import React from "react";
import Svg, { SvgProps, Circle, ClipPath, Defs, G } from "react-native-svg";
import { Face } from "./parts/face";
import { HairShort } from "./parts/hair/hairShort";
import { HairLong } from "./parts/hair/hairLong";
import { Sweater } from "./parts/outfits/sweater";
import {
  AvatarConfig,
  DEFAULT_AVATAR_CONFIG,
} from "../../constants/avatarOptions";

interface AvatarRendererProps extends SvgProps {
  config?: AvatarConfig;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  config = {},
  ...props
}) => {
  const mergedConfig = { ...DEFAULT_AVATAR_CONFIG, ...config };
  const {
    size = 200,
    bgColor = "#A8D08D",
    skinColor = "#F2C1A2",
    hairColor = "#7A3E28",
    hairStyle = "short",
    glassesStyle = "round",
    shirtColor = "#FFFFFF",
  } = mergedConfig;

  return (
    <Svg width={size} height={size} viewBox="0 0 400 400" {...props}>
      <Defs>
        <ClipPath id="avatar-clip">
          <Circle cx="200" cy="200" r="180" />
        </ClipPath>
      </Defs>

      {/* Fondo Circular */}
      <Circle cx="200" cy="200" r="180" fill={bgColor} />

      {/* Contenido Recortado al Círculo */}
      <G clipPath="url(#avatar-clip)">
        <Sweater color={shirtColor} skinColor={skinColor} />
        <Face skinColor={skinColor} hasGlasses={glassesStyle === "round"} />
        {hairStyle === "short" ? (
          <HairShort color={hairColor} />
        ) : (
          <HairLong color={hairColor} />
        )}
      </G>
    </Svg>
  );
};

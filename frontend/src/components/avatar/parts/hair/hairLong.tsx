import React from "react";
import { Path, G } from "react-native-svg";

interface HairProps {
  color?: string;
}

export const HairLong = ({ color = "#7A3E28" }: HairProps) => {
  return (
    <G id="hair-long">
      <Path
        d="M 125 210 C 115 150, 160 110, 200 110 C 255 110, 280 150, 275 210 C 275 270, 260 330, 255 350 C 250 320, 255 240, 245 200 C 220 170, 180 175, 160 190 C 145 230, 150 320, 145 350 C 140 330, 125 270, 125 210 Z"
        fill={color}
      />
    </G>
  );
};

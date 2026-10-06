import React from "react";
import { G, Circle, Path } from "react-native-svg";

interface FaceProps {
  skinColor?: string;
  hasGlasses?: boolean;
}

export const Face = ({
  skinColor = "#F2C1A2",
  hasGlasses = true,
}: FaceProps) => {
  return (
    <G id="face">
      {/* Orejas */}
      <Circle cx="120" cy="270" r="16" fill={skinColor} />
      <Circle cx="280" cy="270" r="16" fill={skinColor} />

      {/* Sombra de la oreja interna */}
      <Path
        d="M 120 262 C 117 266 117 274 122 278"
        stroke="#D99B7A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 280 262 C 283 266 283 274 278 278"
        stroke="#D99B7A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Cabeza */}
      <Path
        d="M 135 210 C 135 150, 265 150, 265 210 C 265 290, 250 330, 200 330 C 150 330, 135 290, 135 210 Z"
        fill={skinColor}
      />

      {/* Cejas */}
      <Path
        d="M 152 222 Q 170 212 188 222"
        stroke="#4A2511"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 212 222 Q 230 212 248 222"
        stroke="#4A2511"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Ojos */}
      <Circle cx="170" cy="238" r="7" fill="#2C1810" />
      <Circle cx="230" cy="238" r="7" fill="#2C1810" />
      {/* Brillo en ojos */}
      <Circle cx="168" cy="236" r="2" fill="#FFFFFF" />
      <Circle cx="228" cy="236" r="2" fill="#FFFFFF" />

      {/* Nariz */}
      <Path d="M 200 240 L 194 275 L 206 275" fill="#D99B7A" opacity={0.7} />

      {/* Sonrisa */}
      <Path
        d="M 180 290 Q 200 302 220 290"
        stroke="#B86C50"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Lentes */}
      {hasGlasses && (
        <G id="glasses">
          {/* Montura Izquierda */}
          <Circle
            cx="170"
            cy="238"
            r="24"
            stroke="#1A1A1A"
            strokeWidth="4"
            fill="none"
          />
          {/* Montura Derecha */}
          <Circle
            cx="230"
            cy="238"
            r="24"
            stroke="#1A1A1A"
            strokeWidth="4"
            fill="none"
          />
          {/* Puente */}
          <Path
            d="M 194 238 L 206 238"
            stroke="#1A1A1A"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Patillas */}
          <Path
            d="M 124 238 L 146 238"
            stroke="#1A1A1A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <Path
            d="M 254 238 L 276 238"
            stroke="#1A1A1A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </G>
      )}
    </G>
  );
};

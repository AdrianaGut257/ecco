import React from "react";
import { G, Path, Polygon } from "react-native-svg";

interface SweaterProps {
  color?: string;
  skinColor?: string;
}

export const Sweater = ({
  color = "#F5F5F5",
  skinColor = "#F2C1A2",
}: SweaterProps) => {
  return (
    <G id="outfit">
      {/* Cuello del cuerpo */}
      <Path d="M 175 310 L 225 310 L 230 360 L 170 360 Z" fill={skinColor} />

      {/* Sombra bajo el cuello */}
      <Path
        d="M 175 310 L 225 310 L 225 325 L 175 325 Z"
        fill="#D99B7A"
        opacity={0.5}
      />

      {/* Camisa blanca interna */}
      <Polygon points="170,330 200,360 230,330 200,380" fill="#FFFFFF" />

      {/* Corbata Naranja */}
      <Polygon
        points="194,355 206,355 208,375 200,385 192,375"
        fill="#E65100"
      />

      {/* Cuello del Suéter (Gris) */}
      <Path
        d="M 150 335 Q 200 375 250 335 L 260 360 Q 200 400 140 360 Z"
        fill="#D6D6D6"
      />

      {/* Suéter/Polera */}
      <Path
        d="M 140 355 Q 200 395 260 355 L 300 440 L 100 440 Z"
        fill={color}
      />

      {/* Pliegues de la ropa */}
      <Path
        d="M 130 400 L 140 440"
        stroke="#E0E0E0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M 270 400 L 260 440"
        stroke="#E0E0E0"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </G>
  );
};

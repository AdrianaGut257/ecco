import { Ellipse, Path } from "react-native-svg";

export default function Skin({ color = "#F2CCB2" }: { color?: string }) {
  return (
    <>
      <Path
        d="M25,145 Q25,95 60,90 L100,90 Q135,95 135,145 L135,160 L25,160 Z"
        fill={color}
      />
      <Path d="M70,80 L70,100 L90,100 L90,80 Z" fill={color} />
      <Ellipse cx="80" cy="55" rx="34" ry="38" fill={color} />
    </>
  );
}

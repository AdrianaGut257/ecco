import { Path } from "react-native-svg";

export default function Hoodie({ color = "#9CAF88" }: { color?: string }) {
  return (
    <>
      <Path
        d="M25,145 Q25,95 58,90 L60,92 Q65,108 80,108 Q95,108 100,92 L102,90 Q135,95 135,145 L135,160 L25,160 Z"
        fill={color}
      />
      <Path
        d="M58,90 Q80,102 102,90 Q102,82 96,80 Q80,90 64,80 Q58,82 58,90 Z"
        fill={color}
        opacity={0.7}
      />
    </>
  );
}

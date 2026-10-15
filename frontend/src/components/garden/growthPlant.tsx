import { View } from "react-native";
import Plant from "./plant";

interface Props {
  stage: number;
  size?: number;
}

export default function GrowthPlant({ stage, size = 170 }: Props) {
  return (
    <View
      accessible
      accessibilityLabel={`Tu planta, etapa ${stage + 1} de 6`}
      style={{ width: size, height: size }}
      className="items-center justify-center rounded-full bg-primary-light-active"
    >
      <Plant stage={stage} size={size * 0.78} />
    </View>
  );
}

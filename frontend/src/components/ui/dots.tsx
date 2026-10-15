import { View } from "react-native";

interface Props {
  total: number;
  index: number;
}

export default function Dots({ total, index }: Props) {
  return (
    <View className="flex-row gap-2">
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          className={`h-2 rounded-full ${
            i === index ? "w-6 bg-white" : "w-2 bg-white/50"
          }`}
        />
      ))}
    </View>
  );
}

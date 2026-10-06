import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Button from "../../../components/ui/Button";

const TIPS = [
  {
    icon: "heart-outline" as const,
    text: "Sé curiosa y haz preguntas abiertas.",
  },
  {
    icon: "time-outline" as const,
    text: "No hay prisa, tienen 7 días para conocerse.",
  },
  {
    icon: "shield-checkmark-outline" as const,
    text: "Evita compartir datos sensibles al inicio.",
  },
];

export default function EmpathyScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  return (
    <View className="flex-1 bg-primaryClear px-8 pt-16 justify-between pb-8">
      <View>
        <View className="w-16 h-16 rounded-full bg-secondaryClear items-center justify-center mb-6">
          <Ionicons name="sparkles" size={30} color="#9CAF88" />
        </View>

        <Text className="font-heading-bold text-h2 text-primaryNormalActive mb-2">
          Antes de empezar
        </Text>
        <Text className="font-body text-sm text-primaryNormalHover mb-8">
          Unos consejos para una buena primera conversación.
        </Text>

        <View className="gap-4">
          {TIPS.map((tip) => (
            <View
              key={tip.text}
              className="flex-row items-start gap-3 bg-white rounded-card border border-primaryLight p-4"
            >
              <Ionicons name={tip.icon} size={20} color="#E8A77B" />
              <Text className="font-body text-sm text-primaryNormalActive flex-1">
                {tip.text}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Button variant="primary" onPress={onComplete}>
        Empezar a conversar
      </Button>
    </View>
  );
}

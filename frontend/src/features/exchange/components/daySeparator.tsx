import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { CHAT_DAYS } from "../../../constants/plant";
import type { Discovery } from "../discoveries";

interface Props {
  day: number;
  discovery: Discovery | null;
  today?: boolean;
}

// Separador de cada día del chat; si hay una coincidencia para ese día, se revela debajo.
export default function DaySeparator({ day, discovery, today = false }: Props) {
  const lead = today ? "Hoy descubrieron" : "Descubrieron";
  return (
    <View className="my-2 items-center gap-2">
      <Text
        variant="caption2"
        className="rounded-chip bg-primary-light-active px-3 py-1 text-primary-dark-hover"
      >
        {day > CHAT_DAYS ? "Seguimos conversando" : `Día ${day}`}
      </Text>
      {discovery && day <= CHAT_DAYS && (
        <Animated.View
          entering={FadeInDown.duration(400)}
          accessible
          accessibilityLabel={`${lead}: ${discovery.title}, en ${discovery.detail}`}
          className="max-w-[300px] flex-row items-center gap-3 rounded-card border border-secondary-light-active bg-secondary-light px-4 py-3"
        >
          <View className="h-9 w-9 items-center justify-center rounded-full bg-secondary-light-active">
            <Ionicons name="sparkles" size={18} color={colors.secondary["dark-active"]} />
          </View>
          <View className="flex-1">
            <Text variant="caption2" className="text-secondary-dark-active">
              {lead}
            </Text>
            <Text variant="button2" className="text-secondary-darker">
              {discovery.title}
            </Text>
            <Text variant="caption2" className="text-secondary-dark-active">
              {discovery.detail}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

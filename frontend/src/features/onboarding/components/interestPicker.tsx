import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import Card from "../../../components/ui/card";
import Chip from "../../../components/ui/chip";
import Text from "../../../components/ui/text";
import { useColors } from "../../../theme";
import { INTEREST_CATEGORIES } from "../../../constants/interests";

interface Props {
  selected: string[];
  onToggle: (item: string) => void;
}

export default function InterestPicker({ selected, onToggle }: Props) {
  const c = useColors();
  return (
    <View className="gap-5">
      {INTEREST_CATEGORIES.map((category) => (
        <View key={category.title}>
          <View className="mb-2 flex-row items-center gap-2">
            <Ionicons
              name={category.icon}
              size={18}
              color={c.primary["dark-hover"]}
            />
            <Text variant="caption1" className="text-primary-dark-hover">
              {category.title}
            </Text>
          </View>
          <Card className="flex-row flex-wrap gap-2">
            {category.items.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={selected.includes(item)}
                onPress={() => onToggle(item)}
              />
            ))}
          </Card>
        </View>
      ))}
    </View>
  );
}

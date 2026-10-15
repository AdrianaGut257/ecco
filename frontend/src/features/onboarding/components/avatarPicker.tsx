import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import Avatar from "../../../components/avatar/avatar";
import Text from "../../../components/ui/text";
import { AVATARS } from "../../../constants/avatars";
import { colors } from "../../../constants/colors";

interface Props {
  value: string | null;
  onChange: (id: string) => void;
}

export default function AvatarPicker({ value, onChange }: Props) {
  return (
    <View>
      <View className="mb-6 items-center">
        <View className="h-36 w-36 items-center justify-center rounded-full bg-primary-light-active">
          {value ? (
            <Avatar id={value} size={120} />
          ) : (
            <Ionicons
              name="person-outline"
              size={56}
              color={colors.primary.normal}
            />
          )}
        </View>
      </View>

      <Text variant="caption1" className="mb-3 ml-1 text-primary-dark-hover">
        Elige uno que te represente
      </Text>
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {AVATARS.map((avatar) => {
          const active = value === avatar.id;
          return (
            <Pressable
              key={avatar.id}
              onPress={() => onChange(avatar.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Avatar ${avatar.id.slice(1)}`}
              className={`w-[31%] aspect-square items-center justify-center rounded-field ${
                active
                  ? "border-2 border-primary-normal bg-primary-light-active"
                  : "border border-primary-light-active bg-white"
              }`}
            >
              <Avatar id={avatar.id} size={56} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

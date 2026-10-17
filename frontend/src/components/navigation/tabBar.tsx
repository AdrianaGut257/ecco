import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import Text from "../ui/text";

type IconName = keyof typeof Ionicons.glyphMap;

const ITEMS: Record<
  string,
  { label: string; icon: IconName; active: IconName }
> = {
  home: { label: "Inicio", icon: "home-outline", active: "home" },
  garden: { label: "Jardín", icon: "flower-outline", active: "flower" },
  profile: { label: "Perfil", icon: "person-outline", active: "person" },
  settings: { label: "Ajustes", icon: "settings-outline", active: "settings" },
};

const CENTER = "exchange";
const LEFT = ["home", "garden"];
const RIGHT = ["profile", "settings"];

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const currentName = state.routes[state.index]?.name;

  const go = (name: string) => {
    const route = state.routes.find((r) => r.name === name);
    if (!route) return;
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (currentName !== name && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const renderItem = (name: string) => {
    const item = ITEMS[name];
    const focused = currentName === name;
    return (
      <Pressable
        key={name}
        onPress={() => go(name)}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={item.label}
        className="flex-1 items-center gap-0.5 py-2"
      >
        <Ionicons
          name={focused ? item.active : item.icon}
          size={22}
          color={
            focused ? colors.primary["dark-active"] : colors.primary["dark-hover"]
          }
        />
        <Text
          variant="caption2"
          className={
            focused ? "text-primary-dark-active" : "text-primary-dark-hover"
          }
        >
          {item.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
      className="flex-row items-end border-t border-primary-light-active bg-primary-light px-2 pt-1"
    >
      {LEFT.map(renderItem)}
      <View className="flex-1 items-center">
        <Pressable
          onPress={() => go(CENTER)}
          accessibilityRole="tab"
          accessibilityLabel="Conversar"
          accessibilityState={{ selected: currentName === CENTER }}
          className={`-mt-7 h-16 w-16 items-center justify-center rounded-full border-4 border-primary-light ${
            currentName === CENTER
              ? "bg-secondary-normal-active"
              : "bg-secondary-normal active:bg-secondary-normal-active"
          }`}
        >
          <Ionicons
            name="chatbubble-ellipses"
            size={28}
            color={colors.secondary.darker}
          />
        </Pressable>
      </View>
      {RIGHT.map(renderItem)}
    </View>
  );
}

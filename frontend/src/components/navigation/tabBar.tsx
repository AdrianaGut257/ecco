import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
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

const BAR_HEIGHT = 62;
const RADIUS = 24;
const BUTTON = 58;
const NOTCH = BUTTON / 2 + 7;
const SHOULDER = 12;
const FILL = colors.primary.light;
const EDGE = colors.primary["light-active"];

// Borde superior de la barra, con la muesca en el centro donde se apoya el botón de Conversar.
function topEdge(width: number) {
  const cx = width / 2;
  const d = 9;
  const dx = Math.sqrt(NOTCH * NOTCH - d * d);
  return [
    `M0 ${RADIUS}`,
    `Q0 0 ${RADIUS} 0`,
    `L${cx - NOTCH - SHOULDER} 0`,
    `Q${cx - NOTCH + 1} 0 ${cx - dx} ${d}`,
    `A${NOTCH} ${NOTCH} 0 0 0 ${cx + dx} ${d}`,
    `Q${cx + NOTCH - 1} 0 ${cx + NOTCH + SHOULDER} 0`,
    `L${width - RADIUS} 0`,
    `Q${width} 0 ${width} ${RADIUS}`,
  ].join(" ");
}

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const currentName = state.routes[state.index]?.name;
  const bottom = Math.max(insets.bottom, 8);
  const height = BAR_HEIGHT + bottom;

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
        className="flex-1 items-center justify-center gap-0.5"
        style={{ height: BAR_HEIGHT }}
      >
        <Ionicons
          name={focused ? item.active : item.icon}
          size={22}
          color={
            focused
              ? colors.primary["dark-active"]
              : colors.primary["dark-hover"]
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

  const centerFocused = currentName === CENTER;

  return (
    <View
      style={{ height }}
      className="bg-primary-light"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <Svg
          width={width}
          height={height}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <Path
            d={`${topEdge(width)} L${width} ${height} L0 ${height}Z`}
            fill={FILL}
          />
          <Path
            d={topEdge(width)}
            stroke={EDGE}
            strokeWidth={1.5}
            fill="none"
          />
        </Svg>
      )}
      <View className="flex-row px-2" style={{ height: BAR_HEIGHT }}>
        {LEFT.map(renderItem)}
        <View style={{ width: NOTCH * 2 + SHOULDER }} />
        {RIGHT.map(renderItem)}
      </View>
      <Pressable
        onPress={() => go(CENTER)}
        accessibilityRole="tab"
        accessibilityLabel="Conversar"
        accessibilityState={{ selected: centerFocused }}
        style={{
          position: "absolute",
          top: -BUTTON / 2,
          left: width / 2 - BUTTON / 2,
          width: BUTTON,
          height: BUTTON,
        }}
        className={`items-center justify-center rounded-full ${
          centerFocused
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
  );
}

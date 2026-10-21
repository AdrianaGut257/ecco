import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { colors } from "../../constants/colors";
import { tabBarBackdrop } from "../../store/tabBarBackdrop";
import PressableScale from "../ui/pressableScale";
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
const BUTTON = 56;
// El botón se hunde DIP px dentro de la barra; lo que sobresale (PROTRUDE) se reserva en el diseño
// para que no tape el contenido de ninguna pantalla.
const DIP = 10;
const PROTRUDE = BUTTON / 2 - DIP;
const NOTCH = BUTTON / 2 + 6;
const SHOULDER = 12;
const FILL = colors.primary.light;
const EDGE = colors.primary["light-active"];

// Borde superior de la barra, con la muesca en el centro donde se apoya el botón de Conversar.
function topEdge(width: number) {
  const cx = width / 2;
  const top = PROTRUDE;
  const d = 5;
  const ox = Math.sqrt(NOTCH * NOTCH - (d - DIP) * (d - DIP));
  return [
    `M0 ${top + RADIUS}`,
    `Q0 ${top} ${RADIUS} ${top}`,
    `L${cx - ox - SHOULDER} ${top}`,
    `Q${cx - ox - 2} ${top} ${cx - ox} ${top + d}`,
    `A${NOTCH} ${NOTCH} 0 1 0 ${cx + ox} ${top + d}`,
    `Q${cx + ox + 2} ${top} ${cx + ox + SHOULDER} ${top}`,
    `L${width - RADIUS} ${top}`,
    `Q${width} ${top} ${width} ${top + RADIUS}`,
  ].join(" ");
}

// El ícono da un saltito al quedar activo.
function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  const reduced = useReducedMotion();
  const pop = useSharedValue(1);
  useEffect(() => {
    if (!focused || reduced) return;
    pop.value = withSequence(
      withSpring(1.22, { damping: 8, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 220 }),
    );
  }, [focused, reduced, pop]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  return (
    <Animated.View style={style}>
      <Ionicons
        name={name}
        size={22}
        color={
          focused ? colors.primary["dark-active"] : colors.primary["dark-hover"]
        }
      />
    </Animated.View>
  );
}

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { color: backdrop } = tabBarBackdrop.use();
  const [width, setWidth] = useState(0);
  const currentName = state.routes[state.index]?.name;
  const bottom = Math.max(insets.bottom, 8);
  const height = PROTRUDE + BAR_HEIGHT + bottom;

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
      <PressableScale
        scaleTo={0.9}
        key={name}
        onPress={() => go(name)}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={item.label}
        className="flex-1 items-center justify-center gap-0.5"
        style={{ height: BAR_HEIGHT }}
      >
        <TabIcon name={focused ? item.active : item.icon} focused={focused} />
        <Text
          variant="caption2"
          className={
            focused ? "text-primary-dark-active" : "text-primary-dark-hover"
          }
        >
          {item.label}
        </Text>
      </PressableScale>
    );
  };

  const centerFocused = currentName === CENTER;

  return (
    <View
      style={{ height, backgroundColor: backdrop }}
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
      <View
        className="flex-row px-2"
        style={{ height: BAR_HEIGHT, marginTop: PROTRUDE }}
      >
        {LEFT.map(renderItem)}
        <View style={{ width: NOTCH * 2 + SHOULDER }} />
        {RIGHT.map(renderItem)}
      </View>
      <PressableScale
        scaleTo={0.88}
        onPress={() => go(CENTER)}
        accessibilityRole="tab"
        accessibilityLabel="Conversar"
        accessibilityState={{ selected: centerFocused }}
        style={{
          position: "absolute",
          top: 0,
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
      </PressableScale>
    </View>
  );
}

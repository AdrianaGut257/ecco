import { cssInterop } from "nativewind";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
cssInterop(AnimatedPressable, { className: "style" });

interface Props extends Omit<PressableProps, "style"> {
  style?: StyleProp<ViewStyle>;
  className?: string;
  scaleTo?: number;
}

// Se hunde un poco al presionar y vuelve con un rebote suave: confirma el toque sin depender del color.
export default function PressableScale({
  scaleTo = 0.96,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        if (!reduced) scale.value = withSpring(scaleTo, { damping: 15, stiffness: 420 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 9, stiffness: 260 });
        onPressOut?.(e);
      }}
      style={[style, animated]}
    />
  );
}

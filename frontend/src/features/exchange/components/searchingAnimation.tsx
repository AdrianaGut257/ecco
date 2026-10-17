import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Avatar from "../../../components/avatar/avatar";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import type { AvatarConfig, Partner } from "../../../types";

interface Props {
  me: { username: string; avatar?: AvatarConfig };
  partner: Partner | null;
}

const SIZE = 104;

function TravelingDot({ delay }: { delay: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        -1,
      ),
    );
  }, [delay, progress]);

  const style = useAnimatedStyle(() => ({
    opacity:
      progress.value < 0.5 ? progress.value * 2 : (1 - progress.value) * 2,
    transform: [{ scale: 0.6 + progress.value * 0.6 }],
  }));

  return (
    <Animated.View
      style={style}
      className="h-2.5 w-2.5 rounded-full bg-primary-dark-hover"
    />
  );
}

export default function SearchingAnimation({ me, partner }: Props) {
  const bob = useSharedValue(0);
  const pulse = useSharedValue(0);
  const reveal = useSharedValue(0);

  useEffect(() => {
    bob.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
    pulse.value = withRepeat(withTiming(1, { duration: 1100 }), -1, true);
  }, [bob, pulse]);

  useEffect(() => {
    reveal.value = partner ? withSpring(1, { damping: 9, stiffness: 120 }) : 0;
  }, [partner, reveal]);

  const meStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value }],
  }));

  const blobStyle = useAnimatedStyle(() => ({
    opacity: (1 - reveal.value) * (0.55 + pulse.value * 0.35),
    transform: [{ scale: 0.92 + pulse.value * 0.1 }],
  }));

  const partnerStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ scale: 0.4 + reveal.value * 0.6 }],
  }));

  return (
    <View
      accessible
      accessibilityLabel={
        partner
          ? `Encontramos a ${partner.username}`
          : "Buscando a alguien para ti"
      }
      className="items-center"
    >
      <View className="flex-row items-center justify-center gap-3">
        <View className="items-center">
          <Animated.View style={meStyle}>
            <Avatar config={me.avatar} size={SIZE} />
          </Animated.View>
          <Text variant="body3" className="mt-2 text-primary-dark-active">
            {me.username}
          </Text>
        </View>

        <View className="w-12 flex-row items-center justify-center gap-1">
          {partner ? (
            <Ionicons name="heart" size={26} color={colors.error.normal} />
          ) : (
            [0, 250, 500].map((delay) => (
              <TravelingDot key={delay} delay={delay} />
            ))
          )}
        </View>

        <View className="items-center">
          <View
            style={{ width: SIZE, height: SIZE }}
            className="items-center justify-center"
          >
            <Animated.View
              style={[blobStyle, { width: SIZE * 0.9, height: SIZE * 0.9 }]}
              className="absolute items-center justify-center rounded-full bg-primary-normal"
            >
              <Text variant="h2" className="text-primary-darker">
                ?
              </Text>
            </Animated.View>
            {partner && (
              <Animated.View style={partnerStyle} className="absolute">
                <Avatar config={partner.avatar} mood={partner.mood} size={SIZE} />
              </Animated.View>
            )}
          </View>
          <Text variant="body3" className="mt-2 text-primary-dark-active">
            {partner ? partner.username : "Alguien"}
          </Text>
        </View>
      </View>
    </View>
  );
}

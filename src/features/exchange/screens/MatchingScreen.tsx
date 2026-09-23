import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";

export default function MatchingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const pulse = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.6,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    // Simula la búsqueda; reemplaza con tu llamada real al backend.
    const timeout = setTimeout(onComplete, 2500);

    return () => {
      loop.stop();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <View
      className="flex-1 items-center justify-center px-8"
      style={{ backgroundColor: "#FDF6F2" }}
    >
      <View
        className="absolute inset-0"
        style={{
          backgroundColor: "#E8C468",
          opacity: 0.35,
        }}
      />

      <View
        className="flex-row items-center justify-center mb-10"
        style={{ width: 220, height: 110 }}
      >
        <View className="w-20 h-20 rounded-full items-center justify-center bg-primaryLightActive">
          <Ionicons name="person" size={40} color="#FFFFFF" />
        </View>

        <Animated.View
          style={{
            opacity: pulse,
            transform: [{ scale: pulse }],
            marginHorizontal: -6,
          }}
        >
          <Ionicons name="sparkles" size={30} color="#E8C468" />
        </Animated.View>

        <View className="w-20 h-20 rounded-full items-center justify-center bg-secondaryLightActive">
          <Ionicons name="person" size={40} color="#FFFFFF" />
        </View>
      </View>

      <Text className="font-heading-semibold text-h4 text-primaryNormalActive text-center mb-2">
        Buscando tu conexión
      </Text>
      <Text className="font-body text-sm text-primaryNormalHover text-center">
        Esto solo toma un momento…
      </Text>
    </View>
  );
}

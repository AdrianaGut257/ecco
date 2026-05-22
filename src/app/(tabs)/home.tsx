import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  const goToEmotionSelect = () => {
    router.push("../../flow/emotion-select");
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-purple-400 to-pink-400">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-32 h-32 rounded-full bg-white/20 items-center justify-center mb-8">
          <Text className="text-6xl">💖</Text>
        </View>

        <Text className="text-5xl text-white text-center mb-4 font-chewy">
          ELOP
        </Text>

        <Text className="text-xl text-white text-center mb-12 font-chewy">
          Conecta con tus emociones
        </Text>

        <TouchableOpacity
          onPress={goToEmotionSelect}
          className="bg-white px-8 py-4 rounded-full shadow-lg"
          activeOpacity={0.8}
        >
          <Text className="text-purple-600 text-xl font-chewy">
            Comenzar viaje emocional
          </Text>
        </TouchableOpacity>

        <Text className="text-white/80 text-center mt-12 text-sm">
          Encuentra personas que sienten como tú
        </Text>
      </View>
    </View>
  );
}

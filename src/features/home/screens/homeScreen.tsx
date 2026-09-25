import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Button from "../../../components/ui/Button";

const MOCK_HAS_CONNECTION = true;
const MOCK_CONNECTION_NAME = "Alguien";

export default function HomeScreen() {
  const router = useRouter();
  const [hasConnection] = useState(MOCK_HAS_CONNECTION);

  return (
    <View className="flex-1 bg-primaryClear px-6 pt-6">
      <View className="flex-1 justify-center">
        {hasConnection ? (
          <View className="bg-white rounded-card border-2 border-primaryNormal p-7 items-center">
            <View className="w-20 h-20 rounded-full bg-primaryLight items-center justify-center mb-4">
              <Ionicons name="person" size={40} color="#E8A77B" />
            </View>
            <Text className="font-heading-semibold text-h4 text-primaryNormalActive mb-1">
              Tu conexión activa
            </Text>
            <Text className="font-body text-sm text-primaryNormalHover text-center mb-6">
              {MOCK_CONNECTION_NAME} está esperando tu mensaje.
            </Text>
            <Button
              variant="primary"
              icon="chatbubble-outline"
              onPress={() => router.push("/(tabs)/exchange")}
            >
              Abrir chat
            </Button>
          </View>
        ) : (
          <View className="items-center px-4">
            <View className="w-20 h-20 rounded-full bg-secondaryClear items-center justify-center mb-5">
              <Ionicons name="search-outline" size={36} color="#9CAF88" />
            </View>
            <Text className="font-heading-semibold text-h4 text-primaryNormalActive text-center mb-1">
              Aún no tienes una conexión
            </Text>
            <Text className="font-body text-sm text-primaryNormalHover text-center mb-6 max-w-[260px]">
              Cuando estés lista, busca a alguien con quien conversar esta
              semana.
            </Text>
            <Button
              variant="primary"
              icon="search-outline"
              onPress={() => router.push("/(tabs)/exchange")}
            >
              Buscar mi conexión
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}

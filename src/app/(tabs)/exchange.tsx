import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function IntercambioScreen() {
  const conversations = [
    {
      id: 1,
      name: "Ana",
      lastMessage: "Gracias por tu mensaje 💖",
      time: "10:30",
      unread: 2,
    },
    {
      id: 2,
      name: "Carlos",
      lastMessage: "Me ayudó mucho lo que dijiste",
      time: "ayer",
      unread: 0,
    },
    {
      id: 3,
      name: "María",
      lastMessage: "¿Cómo estás hoy?",
      time: "ayer",
      unread: 1,
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="pt-14 pb-4 px-6 bg-white border-b border-gray-200">
        <Text className="text-3xl font-chewy text-gray-800">Intercambios</Text>
        <Text className="text-gray-500 mt-1">
          Tus conversaciones emocionales
        </Text>
      </View>

      <ScrollView className="flex-1">
        {conversations.map((conv) => (
          <TouchableOpacity
            key={conv.id}
            className="flex-row items-center px-6 py-4 bg-white border-b border-gray-100"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center mr-4">
              <Text className="text-2xl">👤</Text>
            </View>

            <View className="flex-1">
              <View className="flex-row justify-between items-end">
                <Text className="text-lg font-chewy text-gray-800">
                  {conv.name}
                </Text>
                <Text className="text-xs text-gray-400">{conv.time}</Text>
              </View>
              <Text className="text-gray-500 text-sm mt-1">
                {conv.lastMessage}
              </Text>
            </View>

            {conv.unread > 0 && (
              <View className="w-5 h-5 rounded-full bg-purple-500 items-center justify-center ml-2">
                <Text className="text-white text-xs font-bold">
                  {conv.unread}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

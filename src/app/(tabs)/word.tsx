import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function MundoScreen() {
  const emotions = [
    { name: "Feliz", count: 234, color: "#FFD93D", icon: "😊" },
    { name: "Triste", count: 156, color: "#4A90E2", icon: "😢" },
    { name: "Ansioso", count: 89, color: "#C484FF", icon: "😰" },
    { name: "Emocionado", count: 67, color: "#FF9F4A", icon: "🤩" },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="pt-14 pb-4 px-6 bg-white border-b border-gray-200">
        <Text className="text-3xl font-chewy text-gray-800">Comunidad</Text>
        <Text className="text-gray-500 mt-1">
          ¿Cómo se siente el mundo hoy?
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-lg font-chewy text-gray-700 mb-4">
          Emociones del día
        </Text>

        {emotions.map((emotion) => (
          <View key={emotion.name} className="mb-4">
            <View className="flex-row justify-between mb-2">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-2">{emotion.icon}</Text>
                <Text className="text-gray-700 font-chewy">{emotion.name}</Text>
              </View>
              <Text className="text-gray-500">{emotion.count} personas</Text>
            </View>
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${(emotion.count / 234) * 100}%`,
                  backgroundColor: emotion.color,
                }}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity className="mt-8 bg-purple-500 py-4 rounded-full">
          <Text className="text-white text-center font-chewy text-lg">
            Unirse a una conversación grupal
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

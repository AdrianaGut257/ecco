import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

type Message = { id: string; text: string; fromMe: boolean };

const MOCK_MESSAGES: Message[] = [
  { id: "1", text: "¡Hola! Vi que te gusta la naturaleza.", fromMe: false },
  {
    id: "2",
    text: "¡Sí! El fin de semana pasado hice una caminata.",
    fromMe: true,
  },
];

export default function ComposeScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: text.trim(), fromMe: true },
    ]);
    setText("");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primaryClear"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="items-center py-3 border-b border-primaryLight">
        <View className="bg-lavender/30 px-3 py-1 rounded-chip">
          <Text className="font-body-medium text-xs text-primaryNormalActive">
            Semana 1 · Día 1
          </Text>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        renderItem={({ item }) => (
          <View
            className={`max-w-[80%] px-3 py-2 rounded-2xl ${
              item.fromMe
                ? "self-end bg-primaryNormal rounded-br-md"
                : "self-start bg-white border border-primaryLight rounded-bl-md"
            }`}
          >
            <Text
              className={`font-body text-sm ${
                item.fromMe ? "text-white" : "text-primaryNormalActive"
              }`}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      <View className="flex-row items-center gap-2 px-4 py-3 border-t border-primaryLight bg-white">
        <Pressable className="w-8 h-8 rounded-full bg-secondaryClear items-center justify-center">
          <Ionicons name="add" size={20} color="#9CAF88" />
        </Pressable>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Escribe algo…"
          placeholderTextColor="#A27556"
          className="flex-1 font-body text-sm text-primaryNormalActive border border-primaryLightActive rounded-chip px-4 py-2"
          style={{ outlineStyle: "none" } as any}
        />
        <Pressable
          onPress={send}
          className="w-9 h-9 rounded-full bg-primaryNormal items-center justify-center"
        >
          <Ionicons name="send" size={16} color="#FFFFFF" />
        </Pressable>
      </View>

      <Pressable onPress={onComplete} className="items-center py-3">
        <Text className="font-body-medium text-xs text-primaryNormalHover">
          Volver al inicio
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

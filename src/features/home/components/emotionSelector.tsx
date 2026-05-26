import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const emotions = [
  { id: "feliz", emoji: "😊", label: "Feliz" },
  { id: "enojado", emoji: "😠", label: "Enojado" },
  { id: "triste", emoji: "😢", label: "Triste" },
  { id: "emocionada", emoji: "🥰", label: "Emocionada" },
  { id: "cansada", emoji: "😴", label: "Cansada" },
  { id: "ansiosa", emoji: "😰", label: "Ansiosa" },
];

export default function EmotionSelector({
  onSelect,
}: {
  onSelect: (id: string, emoji: string) => void;
}) {
  const [selectedId, setSelectedId] = useState("");

  const handlePress = (id: string, emoji: string) => {
    setSelectedId(id);
    onSelect(id, emoji);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={emotions}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.emotionBtn,
              selectedId === item.id && styles.emotionBtnSelected,
            ]}
            onPress={() => handlePress(item.id, item.emoji)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  emotionBtn: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 12,
    margin: 8,
    alignItems: "center",
    width: 100,
  },
  emotionBtnSelected: {
    backgroundColor: "#2DC5A2",
  },
  emoji: { fontSize: 32 },
  label: { fontSize: 12, marginTop: 4, color: "#333" },
});

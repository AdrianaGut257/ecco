import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import EmotionSelector from "../components/emotionSelector";

export default function HomeScreen() {
  const [emoji, setEmoji] = useState("🙂");
  const [label, setLabel] = useState("Neutral");

  const handleSelect = (id: string, selectedEmoji: string) => {
    setEmoji(selectedEmoji);
    setLabel(id ? id.charAt(0).toUpperCase() + id.slice(1) : "Neutral");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.username}>Naty09</Text>
        <Text style={styles.bigEmoji}>{emoji}</Text>
        <Text style={styles.currentLabel}>{label}</Text>
      </View>
      <Text style={styles.question}>¿Cómo te sientes?</Text>
      <EmotionSelector onSelect={handleSelect} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingTop: 20, paddingBottom: 40 },
  card: {
    backgroundColor: "#FFF9E6",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    width: "88%",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#FFE49A",
  },
  username: { fontSize: 14, fontWeight: "600", color: "#888", marginBottom: 4 },
  bigEmoji: { fontSize: 80, lineHeight: 96 },
  currentLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 4,
  },
  question: {
    fontSize: 15,
    fontWeight: "700",
    color: "#555",
    marginBottom: 14,
  },
});

import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const EMOTIONS = [
  { id: "feliz", label: "Feliz", emoji: "😊", color: "#FFD93D", bg: "#FFF8DC" },
  {
    id: "enojado",
    label: "Enojado",
    emoji: "😠",
    color: "#FF6B6B",
    bg: "#FFE8E8",
  },
  {
    id: "triste",
    label: "Triste",
    emoji: "😢",
    color: "#6B9FFF",
    bg: "#E8F0FF",
  },
  {
    id: "nervioso",
    label: "Nervioso",
    emoji: "😰",
    color: "#98D897",
    bg: "#E8F8E8",
  },
  {
    id: "cansado",
    label: "Cansado",
    emoji: "😴",
    color: "#C9C9C9",
    bg: "#F0F0F0",
  },
  {
    id: "asustado",
    label: "Asustado",
    emoji: "😨",
    color: "#FFB347",
    bg: "#FFF3E0",
  },
];

export default function EmotionSelector({
  onSelect,
}: {
  onSelect: (id: string, emoji: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handlePress = (id: string, emoji: string) => {
    const next = selected === id ? null : id;
    setSelected(next);
    onSelect(next ?? "", next ? emoji : "🙂");
  };

  return (
    <View style={styles.grid}>
      {EMOTIONS.map((e) => (
        <TouchableOpacity
          key={e.id}
          onPress={() => handlePress(e.id, e.emoji)}
          style={[
            styles.btn,
            {
              backgroundColor: selected === e.id ? e.bg : "#FAFAFA",
              borderColor: selected === e.id ? e.color : "#EEE",
              borderWidth: selected === e.id ? 2.5 : 2,
            },
          ]}
        >
          <Text style={styles.emojiSmall}>{e.emoji}</Text>
          <Text style={styles.label}>{e.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
  btn: {
    width: "30%",
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: "center",
    gap: 4,
  },
  emojiSmall: { fontSize: 28 },
  label: { fontSize: 11, fontWeight: "700", color: "#666" },
});

import { StyleSheet, Text, View } from "react-native";

const EMOTIONS = [
  { emoji: "😊", label: "Feliz", top: 10, left: 90 },
  { emoji: "😢", label: "Triste", top: 50, left: 20 },
  { emoji: "😊", label: "Feliz", top: 80, left: 120 },
  { emoji: "😢", label: "Triste", top: 45, left: 165 },
  { emoji: "😌", label: "Bien", top: 120, left: 10 },
  { emoji: "😌", label: "Bien", top: 130, left: 90 },
  { emoji: "😌", label: "Bien", top: 125, left: 155 },
  { emoji: "😴", label: "Cansado", top: 185, left: 35 },
  { emoji: "😴", label: "Cansado", top: 190, left: 140 },
];

export default function WorldMap() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mundo de{"\n"}Conexiones</Text>
      <View style={styles.circle}>
        {EMOTIONS.map((e, i) => (
          <View
            key={i}
            style={[styles.emotionItem, { top: e.top, left: e.left }]}
          >
            <Text style={styles.emoji}>{e.emoji}</Text>
            <Text style={styles.label}>{e.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>2k</Text>
          <Text style={styles.statLabel}>Conexiones</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>96%</Text>
          <Text style={styles.statLabel}>Se sintieron mejor</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    color: "#222",
    marginBottom: 20,
  },
  circle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1.5,
    borderColor: "#CCC",
    position: "relative",
    marginBottom: 28,
  },
  emotionItem: { position: "absolute", alignItems: "center" },
  emoji: { fontSize: 22 },
  label: { fontSize: 10, color: "#555", fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    width: "100%",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  statNumber: { fontSize: 20, fontWeight: "900", color: "#222" },
  statLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    textAlign: "center",
  },
});

import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MatchingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [searching, setSearching] = useState(true);

  setTimeout(() => setSearching(false), 3000);

  if (searching) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2DC5A2" />
        <Text style={styles.searchText}>Buscando conexión...</Text>
        <Text style={styles.searchSub}>
          Estamos encontrando a alguien que te entienda
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Conexión</Text>
      <Text style={styles.name}>Dani58</Text>
      <View style={styles.avatarBox}>
        <Text style={styles.avatarEmoji}>😢</Text>
      </View>
      <Text style={styles.emotion}>Triste</Text>
      <TouchableOpacity style={styles.btn} onPress={onComplete}>
        <Text style={styles.btnText}>Iniciar Empatía 🤝</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: "white",
  },
  searchText: { fontSize: 20, fontWeight: "800", color: "#222" },
  searchSub: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#EEF3FF",
    paddingTop: 32,
  },
  label: { fontSize: 14, color: "#888", fontWeight: "600" },
  name: { fontSize: 24, fontWeight: "900", color: "#222", marginBottom: 16 },
  avatarBox: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#7B9FFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarEmoji: { fontSize: 80 },
  emotion: { fontSize: 16, fontWeight: "700", color: "#555", marginBottom: 24 },
  btn: {
    backgroundColor: "#2DC5A2",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  btnText: { color: "white", fontWeight: "800", fontSize: 16 },
});

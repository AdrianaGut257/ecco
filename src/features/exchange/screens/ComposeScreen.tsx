import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ComposeScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [msg, setMsg] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escribe tu mensaje</Text>
      <Text style={styles.sub}>Dani58 lo recibirá de forma anónima</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Escribe algo con empatía..."
        value={msg}
        onChangeText={setMsg}
        maxLength={200}
      />
      <Text style={styles.count}>{msg.length}/200</Text>
      <TouchableOpacity
        style={[styles.btn, !msg.trim() && styles.btnDisabled]}
        disabled={!msg.trim()}
        onPress={onComplete}
      >
        <Text style={styles.btnText}>Enviar 💌</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 24, gap: 16 },
  title: { fontSize: 26, fontWeight: "900", color: "#222" },
  sub: { fontSize: 13, color: "#888" },
  input: {
    borderWidth: 1.5,
    borderColor: "#DDD",
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    minHeight: 140,
    textAlignVertical: "top",
  },
  count: { fontSize: 12, color: "#AAA", textAlign: "right" },
  btn: {
    backgroundColor: "#2DC5A2",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnDisabled: { backgroundColor: "#CCC" },
  btnText: { color: "white", fontWeight: "800", fontSize: 16 },
});

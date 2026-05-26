import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function EmpathyScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [seconds, setSeconds] = useState(30);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!running) return;
    if (seconds === 0) {
      setDone(true);
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, seconds]);

  useEffect(() => {
    if (running) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: false,
      }).start();
    }
  }, [running]);

  const fmt = (s: number) => `00:${s.toString().padStart(2, "0")}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Empatia</Text>
      <View style={styles.instrBox}>
        <Text style={styles.instrText}>
          Cierra los ojos si deseas{"\n"}Sostén a esta persona en tu{"\n"}mente
          durante 30 segundos
        </Text>
      </View>
      <View style={styles.timerCircle}>
        <Text style={styles.timerText}>{fmt(seconds)}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => setRunning((r) => !r)}>
          <Text style={styles.controlIcon}>{running ? "⏸" : "▶️"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSeconds(30);
            setRunning(false);
            progress.setValue(0);
          }}
        >
          <Text style={styles.controlIcon}>🔄</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.btn, !running && !done && styles.btnDisabled]}
        disabled={!done}
        onPress={onComplete}
      >
        <Text style={styles.btnText}>Iniciar Empatía 🤍</Text>
      </TouchableOpacity>
      {done && (
        <TouchableOpacity style={styles.continueBtn} onPress={onComplete}>
          <Text style={styles.continueTxt}>Continuar →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    paddingTop: 32,
    gap: 20,
  },
  title: { fontSize: 28, fontWeight: "900", color: "#222" },
  instrBox: {
    backgroundColor: "#7B9FFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
  },
  instrText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 26,
  },
  timerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#2DC5A2",
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: { fontSize: 28, fontWeight: "900", color: "#222" },
  controls: { flexDirection: "row", gap: 24 },
  controlIcon: { fontSize: 28 },
  btn: {
    backgroundColor: "#2DC5A2",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  btnDisabled: { backgroundColor: "#AAA" },
  btnText: { color: "white", fontWeight: "800", fontSize: 16 },
  continueBtn: {
    borderWidth: 1.5,
    borderColor: "#555",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  continueTxt: { fontWeight: "700", fontSize: 15, color: "#333" },
});

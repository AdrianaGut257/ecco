import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Ellipse, Path } from "react-native-svg";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>ELOP</Text>
        <Text style={styles.title}>Bienvenida</Text>
        <Text style={styles.subtitle}>Naty09</Text>
        <Text style={styles.message}>
          No tienes que resolver todo ahora. Respira un momento, ve paso a paso
          y date permiso de sentir sin juzgarte
        </Text>
      </View>
      <View style={styles.wavesContainer}>
        <Svg viewBox="0 0 380 180" style={styles.svg}>
          <Path
            d="M0,60 Q50,20 100,60 Q150,100 200,60 Q250,20 300,60 Q340,90 380,50 L380,180 L0,180 Z"
            fill="rgba(255,255,255,0.15)"
          />
          <Path
            d="M0,90 Q60,50 120,90 Q180,130 240,90 Q300,50 380,80 L380,180 L0,180 Z"
            fill="rgba(255,255,255,0.2)"
          />
          <Path
            d="M0,120 Q70,80 140,120 Q210,160 280,120 Q330,95 380,110 L380,180 L0,180 Z"
            fill="rgba(255,255,255,0.25)"
          />
          <Ellipse
            cx="60"
            cy="150"
            rx="35"
            ry="18"
            fill="#4CAF50"
            opacity="0.8"
          />
          <Ellipse
            cx="50"
            cy="145"
            rx="28"
            ry="14"
            fill="#66BB6A"
            opacity="0.9"
          />
          <Ellipse
            cx="300"
            cy="155"
            rx="30"
            ry="15"
            fill="#4CAF50"
            opacity="0.7"
          />
          <Ellipse
            cx="290"
            cy="150"
            rx="22"
            ry="11"
            fill="#66BB6A"
            opacity="0.8"
          />
        </Svg>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/(tabs)/home")}
      >
        <Text style={styles.buttonText}>Continuar →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2DC5A2",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 60,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  appName: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 3,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  title: { fontSize: 32, fontWeight: "900", color: "white", lineHeight: 36 },
  subtitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 28,
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    lineHeight: 26,
    textAlign: "center",
    maxWidth: 260,
  },
  wavesContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    height: 180,
  },
  svg: { width: "100%", height: 180 },
  button: {
    backgroundColor: "white",
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 32,
    zIndex: 2,
  },
  buttonText: { fontSize: 16, fontWeight: "700", color: "#1A9E82" },
});

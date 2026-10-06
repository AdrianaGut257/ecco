import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AvatarRenderer } from "../components/avatar/avatarRenderer";
import {
  AvatarConfig,
  DEFAULT_AVATAR_CONFIG,
} from "../constants/avatarOptions";

const BG_COLORS = ["#A8D08D", "#FAD02C", "#90CAF9", "#FFAB91", "#C5CAE9"];
const HAIR_COLORS = ["#7A3E28", "#1A1A1A", "#E6A15C", "#4A2511"];
const SKIN_COLORS = ["#F2C1A2", "#8D5B4C", "#E0AC69", "#FFDFC4"];

export default function AvatarTestScreen() {
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);

  const updateConfig = (key: keyof AvatarConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Prueba de Avatar</Text>

      {/* Previsualización del Avatar */}
      <View style={styles.previewCard}>
        <AvatarRenderer config={config} />
      </View>

      {/* Panel de Controles */}
      <View style={styles.controlsContainer}>
        {/* Cabello */}
        <Text style={styles.label}>Estilo de Cabello</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.button,
              config.hairStyle === "short" && styles.buttonActive,
            ]}
            onPress={() => updateConfig("hairStyle", "short")}
          >
            <Text style={styles.buttonText}>Corto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              config.hairStyle === "long" && styles.buttonActive,
            ]}
            onPress={() => updateConfig("hairStyle", "long")}
          >
            <Text style={styles.buttonText}>Largo</Text>
          </TouchableOpacity>
        </View>

        {/* Lentes */}
        <Text style={styles.label}>Lentes</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.button,
              config.glassesStyle === "round" && styles.buttonActive,
            ]}
            onPress={() => updateConfig("glassesStyle", "round")}
          >
            <Text style={styles.buttonText}>Redondos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              config.glassesStyle === "none" && styles.buttonActive,
            ]}
            onPress={() => updateConfig("glassesStyle", "none")}
          >
            <Text style={styles.buttonText}>Sin Lentes</Text>
          </TouchableOpacity>
        </View>

        {/* Color de Fondo */}
        <Text style={styles.label}>Color de Fondo</Text>
        <View style={styles.row}>
          {BG_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                config.bgColor === color && styles.colorSelected,
              ]}
              onPress={() => updateConfig("bgColor", color)}
            />
          ))}
        </View>

        {/* Color de Cabello */}
        <Text style={styles.label}>Color de Cabello</Text>
        <View style={styles.row}>
          {HAIR_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                config.hairColor === color && styles.colorSelected,
              ]}
              onPress={() => updateConfig("hairColor", color)}
            />
          ))}
        </View>

        {/* Tono de Piel */}
        <Text style={styles.label}>Tono de Piel</Text>
        <View style={styles.row}>
          {SKIN_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                config.skinColor === color && styles.colorSelected,
              ]}
              onPress={() => updateConfig("skinColor", color)}
            />
          ))}
        </View>

        {/* Botón de Reset */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => setConfig(DEFAULT_AVATAR_CONFIG)}
        >
          <Text style={styles.resetButtonText}>Restablecer a Original</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#F7F9FC",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 20,
    marginTop: 40,
  },
  previewCard: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  controlsContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: "#3B82F6",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorSelected: {
    borderColor: "#1A1A1A",
  },
  resetButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "600",
  },
});

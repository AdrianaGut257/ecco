import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const EMOTIONS = [
  {
    id: "feliz",
    label: "Feliz",
    emoji: "😊",
    color: "#FFD93D",
    gradientTop: "#FFF9C4",
    gradientBottom: "#FFE082",
    shadow: "#FFD93D",
    textColor: "#7B5800",
  },
  {
    id: "enojado",
    label: "Enojado",
    emoji: "😠",
    color: "#FF6B6B",
    gradientTop: "#FFE5E5",
    gradientBottom: "#FF8A80",
    shadow: "#FF6B6B",
    textColor: "#7B0000",
  },
  {
    id: "triste",
    label: "Triste",
    emoji: "😢",
    color: "#6B9FFF",
    gradientTop: "#E3EEFF",
    gradientBottom: "#90B4FF",
    shadow: "#6B9FFF",
    textColor: "#1A3A7B",
  },
  {
    id: "emocionada",
    label: "Emocionada",
    emoji: "😆",
    color: "#FF9F43",
    gradientTop: "#FFF3E0",
    gradientBottom: "#FFCC80",
    shadow: "#FF9F43",
    textColor: "#7B3D00",
  },
  {
    id: "cansada",
    label: "Cansada",
    emoji: "😔",
    color: "#A8C5A0",
    gradientTop: "#E8F5E9",
    gradientBottom: "#C8E6C9",
    shadow: "#A8C5A0",
    textColor: "#2E5928",
  },
  {
    id: "ansiosa",
    label: "Ansiosa",
    emoji: "😰",
    color: "#B0A8E0",
    gradientTop: "#EDE7F6",
    gradientBottom: "#D1C4E9",
    shadow: "#B0A8E0",
    textColor: "#3E2A7B",
  },
];

const DEFAULT_GRADIENT_TOP = "#F0F4FF";
const DEFAULT_GRADIENT_BOTTOM = "#B3E5FC";

export default function HomeScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const emojiScale = useRef(new Animated.Value(1)).current;
  const emojiRotate = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = useRef(new Animated.Value(20)).current;

  const [fontsLoaded] = useFonts({
    Chewy: require("../../../assets/fonts/Chewy-Regular.ttf"),
  });

  const selectedEmotion = EMOTIONS.find((e) => e.id === selected);
  const currentEmoji = selectedEmotion?.emoji ?? "🙂";
  const gradientTop = selectedEmotion?.gradientTop ?? DEFAULT_GRADIENT_TOP;
  const gradientBottom =
    selectedEmotion?.gradientBottom ?? DEFAULT_GRADIENT_BOTTOM;
  const accentColor = selectedEmotion?.color ?? "#B3D9FF";
  const textColor = selectedEmotion?.textColor ?? "#334";

  const bounceEmoji = () => {
    emojiRotate.setValue(0);
    Animated.sequence([
      Animated.parallel([
        Animated.spring(emojiScale, {
          toValue: 1.35,
          useNativeDriver: true,
          speed: 20,
          bounciness: 18,
        }),
        Animated.timing(emojiRotate, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(emojiScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 12,
          bounciness: 10,
        }),
        Animated.timing(emojiRotate, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  useEffect(() => {
    if (selected) {
      bounceEmoji();
      buttonsOpacity.setValue(0);
      buttonsTranslateY.setValue(24);
      Animated.parallel([
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.spring(buttonsTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 14,
          bounciness: 10,
        }),
      ]).start();
    } else {
      Animated.timing(buttonsOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [selected]);

  const spin = emojiRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "14deg"],
  });

  const chewyFont = fontsLoaded ? { fontFamily: "Chewy" } : {};

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[gradientTop, gradientBottom]}
        style={styles.topSection}
      >
        <View style={styles.userRow}>
          <Text style={[styles.userLabel, chewyFont]}>Hola,</Text>
          <Text style={[styles.username, chewyFont, { color: textColor }]}>
            Naty09
          </Text>
        </View>

        <Animated.Text
          style={[
            styles.bigEmoji,
            {
              transform: [{ scale: emojiScale }, { rotate: spin }],
            },
          ]}
        >
          {currentEmoji}
        </Animated.Text>

        <View
          style={[
            styles.questionPill,
            { backgroundColor: selected ? accentColor + "33" : "#ffffff55" },
          ]}
        >
          <Text style={[styles.question, chewyFont, { color: textColor }]}>
            {selected
              ? `Te sientes ${selectedEmotion?.label.toLowerCase()} 💛`
              : "¿Cómo te sientes hoy?"}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.emotionsGrid}>
        {EMOTIONS.map((e, index) => {
          const isSelected = selected === e.id;
          return (
            <TouchableOpacity
              key={e.id}
              activeOpacity={0.75}
              onPress={() => setSelected(selected === e.id ? null : e.id)}
              style={[
                styles.emotionBtn,
                {
                  backgroundColor: isSelected ? e.color : e.color + "44",
                  shadowColor: e.shadow,
                  shadowOpacity: isSelected ? 0.55 : 0.18,
                  shadowRadius: isSelected ? 14 : 6,
                  shadowOffset: { width: 0, height: isSelected ? 6 : 2 },
                  elevation: isSelected ? 10 : 3,
                  transform: [{ scale: isSelected ? 1.1 : 1 }],
                  borderWidth: isSelected ? 2.5 : 1.5,
                  borderColor: isSelected ? e.color : e.color + "66",
                },
              ]}
            >
              <Text style={styles.emotionEmoji}>{e.emoji}</Text>
              <Text
                style={[
                  styles.emotionLabel,
                  chewyFont,
                  { color: isSelected ? "#fff" : e.textColor },
                ]}
              >
                {e.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selected && (
        <Animated.View
          style={[
            styles.buttonsSection,
            {
              opacity: buttonsOpacity,
              transform: [{ translateY: buttonsTranslateY }],
            },
          ]}
        >
          <Text style={[styles.subheading, chewyFont, { color: textColor }]}>
            ¿Qué necesitas ahora?
          </Text>

          <TouchableOpacity
            activeOpacity={0.82}
            style={[
              styles.btnPrimary,
              {
                backgroundColor: accentColor,
                shadowColor: accentColor,
                shadowOpacity: 0.4,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 8,
              },
            ]}
            onPress={() => router.push("/(tabs)/exchange" as any)}
          >
            <View style={styles.btnIconWrap}>
              <Text style={styles.btnIcon}>👤</Text>
            </View>
            <Text style={[styles.btnText, chewyFont]}>
              Encontrar a mi persona
            </Text>
            <Text style={styles.btnArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.82}
            style={[
              styles.btnSecondary,
              {
                borderColor: accentColor,
                shadowColor: accentColor,
                shadowOpacity: 0.18,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
              },
            ]}
            onPress={() => router.push("/(tabs)/exchange" as any)}
          >
            <View
              style={[
                styles.btnIconWrap,
                { backgroundColor: accentColor + "33" },
              ]}
            >
              <Text style={styles.btnIcon}>😊</Text>
            </View>
            <Text style={[styles.btnText, chewyFont, { color: textColor }]}>
              Hoy solo quiero recibir
            </Text>
            <Text style={[styles.btnArrow, { color: accentColor }]}>›</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 40,
  },
  topSection: {
    width: "100%",
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  userRow: {
    alignItems: "center",
    marginBottom: 4,
  },
  userLabel: {
    fontSize: 15,
    color: "#888",
    letterSpacing: 0.4,
  },
  username: {
    fontSize: 30,
    fontWeight: "900",
    color: "#222",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  bigEmoji: {
    fontSize: 110,
    lineHeight: 130,
    marginVertical: 8,
    textAlign: "center",
  },
  questionPill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 8,
  },
  question: {
    fontSize: 17,
    fontWeight: "700",
    color: "#444",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  emotionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 20,
    marginTop: 22,
  },
  emotionBtn: {
    width: "28%",
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: "center",
    gap: 5,
  },
  emotionEmoji: {
    fontSize: 34,
  },
  emotionLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  buttonsSection: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 28,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
    color: "#444",
    letterSpacing: 0.2,
  },
  btnPrimary: {
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  btnSecondary: {
    backgroundColor: "#ffffff",
    borderRadius: 32,
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  btnIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#ffffff33",
    alignItems: "center",
    justifyContent: "center",
  },
  btnIcon: {
    fontSize: 18,
  },
  btnText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.2,
  },
  btnArrow: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
  },
  bottomPadding: {
    height: 20,
  },
});

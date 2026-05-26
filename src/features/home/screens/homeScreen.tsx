import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");

const EMOTIONS = [
  {
    id: "feliz",
    label: "Feliz",
    emoji: "😊",
    color: "#FFD93D",
    gradientTop: "#FFFBEC",
    gradientBottom: "#FFF0A0",
    shadow: "#FFD93D",
    textColor: "#7B5800",
    particles: ["⭐", "✨", "☀️", "💛", "🌟"],
    pulseColor: "#FFD93D",
  },
  {
    id: "enojado",
    label: "Enojado",
    emoji: "😠",
    color: "#FF6B6B",
    gradientTop: "#FFF0F0",
    gradientBottom: "#FFCACA",
    shadow: "#FF6B6B",
    textColor: "#7B0000",
    particles: ["💢", "🔥", "⚡", "💥", "❗"],
    pulseColor: "#FF6B6B",
  },
  {
    id: "triste",
    label: "Triste",
    emoji: "😢",
    color: "#6B9FFF",
    gradientTop: "#EEF4FF",
    gradientBottom: "#C8D9FF",
    shadow: "#6B9FFF",
    textColor: "#1A3A7B",
    particles: ["💧", "🌧️", "💙", "🫧", "☁️"],
    pulseColor: "#6B9FFF",
  },
  {
    id: "emocionada",
    label: "Emocionada",
    emoji: "😆",
    color: "#FF9F43",
    gradientTop: "#FFF6ED",
    gradientBottom: "#FFE0B5",
    shadow: "#FF9F43",
    textColor: "#7B3D00",
    particles: ["🎉", "🎊", "✨", "🌈", "💫"],
    pulseColor: "#FF9F43",
  },
  {
    id: "cansada",
    label: "Cansada",
    emoji: "😔",
    color: "#A8C5A0",
    gradientTop: "#F2F8F1",
    gradientBottom: "#D4EBD0",
    shadow: "#A8C5A0",
    textColor: "#2E5928",
    particles: ["💤", "🌙", "😴", "☁️", "🍃"],
    pulseColor: "#A8C5A0",
  },
  {
    id: "ansiosa",
    label: "Ansiosa",
    emoji: "😰",
    color: "#B0A8E0",
    gradientTop: "#F3F0FB",
    gradientBottom: "#DDD8F5",
    shadow: "#B0A8E0",
    textColor: "#3E2A7B",
    particles: ["💭", "🌀", "⚡", "🫀", "💜"],
    pulseColor: "#B0A8E0",
  },
];

// Page background - very light warm neutral, not white
const PAGE_BG = "#F7F5F2";
const DEFAULT_GRADIENT: [string, string] = ["#EEF2FF", "#E0EAFF"];
const PARTICLE_COUNT = 10;

function FloatingParticle({
  emoji,
  delay,
  startX,
  color,
  isAngry,
  isTired,
  isAnxious,
}: {
  emoji: string;
  delay: number;
  startX: number;
  color: string;
  isAngry: boolean;
  isTired: boolean;
  isAnxious: boolean;
}) {
  const y = useRef(new Animated.Value(SH * 0.5)).current;
  const x = useRef(new Animated.Value(startX)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.4)).current;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = isTired
      ? 5500 + Math.random() * 3000
      : 2800 + Math.random() * 2000;
    const targetY = isAngry ? SH * 0.05 + Math.random() * SH * 0.3 : -60;
    const driftX = isAngry
      ? startX + (Math.random() - 0.5) * 80
      : isAnxious
        ? startX + Math.sin(delay) * 60
        : startX + (Math.random() - 0.5) * 100;

    const loop = () => {
      y.setValue(SH * 0.55);
      x.setValue(startX);
      opacity.setValue(0);
      scale.setValue(0.3 + Math.random() * 0.4);

      Animated.sequence([
        Animated.delay(delay + Math.random() * 1000),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.9,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(y, {
            toValue: targetY,
            duration,
            easing: isTired ? Easing.linear : Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(x, {
            toValue: driftX,
            duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 0.9 + Math.random() * 0.4,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.3,
              duration: duration - 300,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => loop());
    };

    loop();
  }, []);

  useEffect(() => {
    if (isAngry) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shake, {
            toValue: 4,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(shake, {
            toValue: -4,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(shake, {
            toValue: 0,
            duration: 80,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [isAngry]);

  return (
    <Animated.Text
      style={{
        position: "absolute",
        fontSize: 22 + Math.random() * 14,
        opacity,
        transform: [
          { translateY: y },
          { translateX: x },
          { scale },
          { translateX: shake },
        ],
        zIndex: 0,
      }}
    >
      {emoji}
    </Animated.Text>
  );
}

function PulseRing({
  color,
  delay,
  size,
}: {
  color: string;
  delay: number;
  size: number;
}) {
  const scale = useRef(new Animated.Value(0.3)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = () => {
      scale.setValue(0.3);
      opacity.setValue(0.5);
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 2200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]).start(() => setTimeout(loop, delay));
    };
    setTimeout(loop, delay);
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: color,
        opacity,
        transform: [{ scale }],
        zIndex: 0,
      }}
    />
  );
}

function EmojiParticleBurst({
  particles,
  color,
  trigger,
}: {
  particles: string[];
  color: string;
  trigger: number;
}) {
  const items = Array.from({ length: 8 }).map((_, i) => ({
    angle: (i / 8) * 2 * Math.PI,
    emoji: particles[i % particles.length],
    anim: useRef(new Animated.Value(0)).current,
    opac: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    if (trigger === 0) return;
    items.forEach(({ anim, opac }) => {
      anim.setValue(0);
      opac.setValue(1);
      Animated.parallel([
        Animated.spring(anim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 6,
          bounciness: 5,
        }),
        Animated.timing(opac, {
          toValue: 0,
          duration: 900,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [trigger]);

  return (
    <>
      {items.map(({ angle, emoji, anim, opac }, i) => {
        const tx = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(angle) * 75],
        });
        const ty = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(angle) * 75],
        });
        const sc = anim.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [0, 1.4, 0.7],
        });
        return (
          <Animated.Text
            key={i}
            style={{
              position: "absolute",
              fontSize: 20,
              opacity: opac,
              transform: [
                { translateX: tx },
                { translateY: ty },
                { scale: sc },
              ],
              zIndex: 10,
            }}
          >
            {emoji}
          </Animated.Text>
        );
      })}
    </>
  );
}

export default function HomeScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [burstTrigger, setBurstTrigger] = useState(0);
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
  const gradientColors: [string, string] = selectedEmotion
    ? [selectedEmotion.gradientTop, selectedEmotion.gradientBottom]
    : DEFAULT_GRADIENT;
  const accentColor = selectedEmotion?.color ?? "#B3D9FF";
  const textColor = selectedEmotion?.textColor ?? "#2C3E6B";
  const particles = selectedEmotion?.particles ?? [];
  const isAngry = selected === "enojado";
  const isTired = selected === "cansada";
  const isAnxious = selected === "ansiosa";

  const handleSelect = (id: string) => {
    const next = selected === id ? null : id;
    setSelected(next);
    if (next) setBurstTrigger((t) => t + 1);
  };

  useEffect(() => {
    emojiRotate.setValue(0);
    Animated.sequence([
      Animated.parallel([
        Animated.spring(emojiScale, {
          toValue: 1.4,
          useNativeDriver: true,
          speed: 22,
          bounciness: 20,
        }),
        Animated.timing(emojiRotate, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(emojiScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 14,
          bounciness: 12,
        }),
        Animated.timing(emojiRotate, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    if (selected) {
      buttonsOpacity.setValue(0);
      buttonsTranslateY.setValue(28);
      Animated.parallel([
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 400,
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
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
  }, [selected]);

  const spin = emojiRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "16deg"],
  });
  const chewyFont = fontsLoaded ? { fontFamily: "Chewy" } : {};

  const particleXPositions = useRef(
    Array.from({ length: PARTICLE_COUNT }).map(
      () => Math.random() * SW - SW / 2,
    ),
  ).current;

  return (
    // Outer page background — warm off-white
    <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card — floats on the page background with rounded bottom corners */}
        <View style={styles.heroCard}>
          <LinearGradient colors={gradientColors} style={styles.heroGradient}>
            {selected && (
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
                  <FloatingParticle
                    key={`${selected}-${i}`}
                    emoji={particles[i % particles.length]}
                    delay={i * 280}
                    startX={particleXPositions[i]}
                    color={accentColor}
                    isAngry={isAngry}
                    isTired={isTired}
                    isAnxious={isAnxious}
                  />
                ))}
              </View>
            )}

            {/* Greeting */}
            <View style={styles.userRow}>
              <Text style={[styles.userLabel, chewyFont]}>Hola,</Text>
              <Text style={[styles.username, chewyFont, { color: textColor }]}>
                Naty09 👋
              </Text>
            </View>

            {/* Big emoji */}
            <View style={styles.emojiContainer}>
              {selected && (
                <>
                  <PulseRing color={accentColor} delay={0} size={150} />
                  <PulseRing color={accentColor} delay={700} size={150} />
                  <PulseRing color={accentColor} delay={1400} size={150} />
                </>
              )}
              <EmojiParticleBurst
                particles={particles}
                color={accentColor}
                trigger={burstTrigger}
              />
              <Animated.Text
                style={[
                  styles.bigEmoji,
                  { transform: [{ scale: emojiScale }, { rotate: spin }] },
                ]}
              >
                {currentEmoji}
              </Animated.Text>
            </View>

            {/* Question pill */}
            <View
              style={[
                styles.questionPill,
                {
                  backgroundColor: selected ? accentColor + "28" : "#00000010",
                },
              ]}
            >
              <Text style={[styles.question, chewyFont, { color: textColor }]}>
                {selected
                  ? `Te sientes ${selectedEmotion?.label.toLowerCase()} ✨`
                  : "¿Cómo te sientes hoy?"}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Emotions grid — sits on page bg */}
        <View style={styles.sectionWrapper}>
          <Text style={[styles.sectionLabel, chewyFont]}>¿Cómo estás?</Text>
          <View style={styles.emotionsGrid}>
            {EMOTIONS.map((e) => {
              const isSelected = selected === e.id;
              return (
                <TouchableOpacity
                  key={e.id}
                  activeOpacity={0.75}
                  onPress={() => handleSelect(e.id)}
                  style={[
                    styles.emotionBtn,
                    {
                      backgroundColor: isSelected ? e.color : "#FFFFFF",
                      shadowColor: e.shadow,
                      shadowOpacity: isSelected ? 0.35 : 0.08,
                      shadowRadius: isSelected ? 12 : 4,
                      shadowOffset: { width: 0, height: isSelected ? 5 : 2 },
                      elevation: isSelected ? 8 : 2,
                      transform: [{ scale: isSelected ? 1.07 : 1 }],
                      borderWidth: isSelected ? 0 : 1,
                      borderColor: "#E8E4DF",
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
        </View>

        {/* Action buttons */}
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
                  shadowOpacity: 0.35,
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
                  borderColor: accentColor + "55",
                  shadowColor: accentColor,
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 3 },
                  elevation: 3,
                },
              ]}
              onPress={() => router.push("/(tabs)/exchange" as any)}
            >
              <View
                style={[
                  styles.btnIconWrap,
                  { backgroundColor: accentColor + "22" },
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

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 40,
  },

  // Hero card floats with rounded bottom corners
  heroCard: {
    width: "100%",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    // Subtle shadow so the card lifts off the page bg
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  heroGradient: {
    width: "100%",
    alignItems: "center",
    paddingTop: 52,
    paddingBottom: 40,
    paddingHorizontal: 24,
    overflow: "hidden",
  },

  userRow: {
    alignItems: "center",
    marginBottom: 4,
    zIndex: 2,
  },
  userLabel: {
    fontSize: 14,
    color: "#999",
    letterSpacing: 0.5,
  },
  username: {
    fontSize: 28,
    fontWeight: "900",
    color: "#222",
    marginBottom: 6,
  },

  emojiContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 150,
    marginVertical: 10,
    zIndex: 2,
  },
  bigEmoji: {
    fontSize: 90,
    textAlign: "center",
    zIndex: 5,
  },

  questionPill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginTop: 10,
    zIndex: 2,
  },
  question: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.2,
  },

  // Section below hero
  sectionWrapper: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 28,
  },
  sectionLabel: {
    fontSize: 13,
    color: "#AAA",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 14,
    paddingLeft: 2,
  },

  emotionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  emotionBtn: {
    width: "30%",
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
    gap: 5,
    backgroundColor: "#fff",
  },
  emotionEmoji: { fontSize: 32 },
  emotionLabel: { fontSize: 12, fontWeight: "700" },

  buttonsSection: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 28,
  },
  subheading: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  btnPrimary: {
    borderRadius: 28,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  btnSecondary: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    borderWidth: 1.5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  btnIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ffffff33",
    alignItems: "center",
    justifyContent: "center",
  },
  btnIcon: { fontSize: 17 },
  btnText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.1,
  },
  btnArrow: { fontSize: 22, color: "#fff", fontWeight: "700" },
});

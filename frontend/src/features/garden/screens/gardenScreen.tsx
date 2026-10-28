import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlyingButterfly } from "../../../components/garden/butterfly";
import { MEADOW_WIDTH } from "../../../components/illustrations/meadowParts";
import MeadowScene from "../../../components/illustrations/meadowScene";
import AppHeader from "../../../components/layout/appHeader";
import Banner from "../../../components/ui/banner";
import EmptyState from "../../../components/ui/emptyState";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { friendlyError } from "../../../services/api";
import { gardenService } from "../../../services/gardenService";
import { tabBarBackdrop } from "../../../store/tabBarBackdrop";
import type { GardenEntry, GardenMemory, MatchStatus } from "../../../types";
import GardenPlot, { LABEL_H } from "../components/gardenPlot";
import MemorySheet from "../components/memorySheet";

// Verde de la colina de adelante: la muesca de la barra continúa el paisaje.
const GROUND = "#73A15C";
const SLOT = 138;
const EDGE = 20;
// Cada planta va un poco más arriba que la anterior, como subiendo la colina, y luego vuelve a bajar.
const LEVELS = [0, 1, 2, 3, 2, 1];
// Altura del suelo de cada nivel, en unidades del dibujo (desde abajo): colina de adelante, del medio y de atrás.
const GROUND_AT = [26, 54, 80, 102];

// Mariposas que vuelan por el jardín, cada una a su ritmo y altura.
const BUTTERFLIES = [
  { color: "yellow" as const, size: 34, top: 70, height: 80, duration: 21000, delay: 0, reverse: false },
  { color: "lilac" as const, size: 30, top: 130, height: 60, duration: 26000, delay: 5000, reverse: true },
  { color: "blue" as const, size: 28, top: 30, height: 70, duration: 30000, delay: 11000, reverse: false },
];

const ORDER: Record<MatchStatus, number> = {
  active: 0,
  deciding: 0,
  waiting: 1,
  bloomed: 2,
  rested: 3,
  closed: 3,
};

const sorted = (entries: GardenEntry[]) =>
  [...entries].sort(
    (a, b) => ORDER[a.status] - ORDER[b.status] || Date.parse(b.startedAt) - Date.parse(a.startedAt),
  );

// El jardín como un lugar: las plantas quedan plantadas en las colinas del paisaje, de izquierda a
// derecha y subiendo un poco; si no caben, se desliza hacia la derecha. Tocar una abre su recuerdo.
export default function GardenScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<GardenEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<GardenEntry | null>(null);
  const [memory, setMemory] = useState<GardenMemory | null>(null);
  const [memoryError, setMemoryError] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width, height } = size;

  const load = useCallback(async () => {
    setError(null);
    try {
      setEntries(await gardenService.list());
    } catch (e) {
      setError(friendlyError(e));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
      tabBarBackdrop.set(GROUND);
      return tabBarBackdrop.reset;
    }, [load]),
  );

  const openMemory = async (entry: GardenEntry) => {
    setSelected(entry);
    setMemory(null);
    setMemoryError(null);
    try {
      setMemory(await gardenService.memory(entry.id));
    } catch (e) {
      setMemoryError(friendlyError(e));
    }
  };

  const openChat = () => {
    if (!selected) return;
    const target = selected;
    setSelected(null);
    if (target.status === "bloomed") router.push(`/conversation/${target.id}`);
    else router.navigate("/(tabs)/exchange");
  };

  const plants = entries ? sorted(entries) : [];
  const unit = width / MEADOW_WIDTH;
  // Plantas más grandes en pantallas altas, para no dejar tanto cielo vacío.
  const base = Math.min(Math.max(Math.min(width * 0.42, height * 0.21), 118), 170);
  const sizeAt = (level: number) => base * (1 - 0.1 * level);
  const groundAt = (level: number) => GROUND_AT[level] * unit;
  const fieldH = groundAt(3) + base + LABEL_H + 24;
  const contentW = EDGE * 2 + plants.length * SLOT;
  const scrolls = contentW > width;
  const offsetX = scrolls ? EDGE : (width - plants.length * SLOT) / 2;

  return (
    <View
      className="flex-1"
      onLayout={(e) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
    >
      <MeadowScene variant="garden" />
      <SafeAreaView edges={["top"]} className="flex-1">
        <AppHeader />
        <View className="px-7 pt-4">
          <Text variant="h3">Tu jardín</Text>
          <Text variant="body3" className="text-primary-dark-active">
            Cada conversación deja una planta. Tócala para recordar esa semana.
          </Text>
          {scrolls && (
            <Animated.View entering={FadeIn.delay(900)} className="mt-3 flex-row items-center gap-1 self-start rounded-chip bg-white/80 px-3 py-1">
              <Text variant="caption2" className="text-primary-dark-active">
                Desliza para ver todo tu jardín
              </Text>
              <Ionicons name="arrow-forward" size={14} color={colors.primary["dark-active"]} />
            </Animated.View>
          )}
          {error && (
            <View className="mt-4">
              <Banner tone="error" message={error} actionLabel="Reintentar" onAction={load} />
            </View>
          )}
          {!entries && !error && (
            <ActivityIndicator className="mt-6" color={colors.primary["dark-hover"]} />
          )}
          {entries && entries.length === 0 && (
            <View className="mt-6">
              <EmptyState
                icon="flower-outline"
                title="Tu jardín está esperando"
                message="Cuando empieces tu primera conversación, aquí brotará tu primera planta."
                actionLabel="Conocer a alguien"
                onAction={() => router.navigate("/(tabs)/exchange")}
              />
            </View>
          )}
        </View>
      </SafeAreaView>

      {width > 0 && plants.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: fieldH }}
          contentContainerStyle={{ width: Math.max(contentW, width), height: fieldH }}
        >
          {plants.map((entry, i) => {
            const level = LEVELS[i % LEVELS.length];
            const size = sizeAt(level);
            return (
              <View
                key={entry.id}
                className="absolute items-center"
                style={{
                  left: offsetX + i * SLOT,
                  width: SLOT,
                  // La tierra de la planta queda apoyada sobre la colina.
                  bottom: groundAt(level) - size * 0.06,
                  zIndex: 10 - level,
                }}
              >
                <GardenPlot entry={entry} index={i} size={size} onPress={() => openMemory(entry)} />
              </View>
            );
          })}
        </ScrollView>
      )}

      {width > 0 && entries && entries.length > 0 && (
        <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
          {BUTTERFLIES.map((b, i) => (
            <FlyingButterfly
              key={i}
              color={b.color}
              size={b.size}
              width={width}
              top={height - fieldH + b.top}
              height={b.height}
              duration={b.duration}
              delay={b.delay}
              reverse={b.reverse}
            />
          ))}
        </View>
      )}

      <MemorySheet
        entry={selected}
        memory={memory}
        error={memoryError}
        onClose={() => setSelected(null)}
        onOpenChat={openChat}
      />
    </View>
  );
}

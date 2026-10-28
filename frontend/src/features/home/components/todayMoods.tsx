import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeInDown, LinearTransition } from "react-native-reanimated";
import MoodFace from "../../../components/avatar/moodFace";
import Card from "../../../components/ui/card";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { MOODS } from "../../../constants/emotions";
import type { MoodEntry } from "../../../types";

const VISIBLE = 5;
const ROW = 56;

const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });

const labelOf = (entry: MoodEntry) => MOODS.find((m) => m.id === entry.mood)?.label ?? "";

// Historial privado del día: una cinta con los colores de cada registro y, debajo,
// una línea de tiempo (el más reciente arriba). Muestra 5 y el resto se ve deslizando.
export default function TodayMoods({ entries }: { entries: MoodEntry[] }) {
  const [atEnd, setAtEnd] = useState(false);
  const latestFirst = [...entries].reverse();
  const scrolls = entries.length > VISIBLE;

  return (
    <Card tone="white" className="gap-4">
      <View>
        <Text variant="subtitle2">Tu día</Text>
        <Text variant="caption1" className="text-primary-dark-hover">
          Así has ido sintiéndote hoy. Puedes actualizarlo cuando quieras.
        </Text>
      </View>

      <View
        className="flex-row gap-1"
        accessible
        accessibilityLabel={`Tu día en colores: ${entries.map(labelOf).join(", ")}`}
      >
        {entries.map((entry) => (
          <Animated.View
            key={entry.createdAt}
            entering={FadeIn.duration(400)}
            layout={LinearTransition.duration(300)}
            className="h-2.5 flex-1 rounded-chip"
            style={{ backgroundColor: colors.mood[entry.mood] }}
          />
        ))}
      </View>

      <View style={{ maxHeight: ROW * VISIBLE }}>
        <ScrollView
          nestedScrollEnabled
          scrollEnabled={scrolls}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={64}
          onScroll={(e) => {
            const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
            setAtEnd(contentOffset.y + layoutMeasurement.height >= contentSize.height - 4);
          }}
        >
          {latestFirst.map((entry, i) => {
            const last = i === latestFirst.length - 1;
            return (
              <Animated.View
                key={entry.createdAt}
                entering={i === 0 ? FadeInDown.duration(350) : undefined}
                className="flex-row items-center"
                style={{ height: ROW }}
              >
                <Text variant="caption1" className="w-12 text-primary-dark-hover">
                  {timeOf(entry.createdAt)}
                </Text>

                <View className="h-full w-10 items-center justify-center">
                  {!last && (
                    <View
                      className="absolute w-0.5 bg-primary-light-active"
                      style={{ top: ROW / 2, bottom: -ROW / 2 }}
                    />
                  )}
                  <View className="h-10 w-10 overflow-hidden rounded-full bg-white">
                    <View
                      className="h-full w-full items-center justify-center"
                      style={{ backgroundColor: `${colors.mood[entry.mood]}55` }}
                    >
                      <MoodFace mood={entry.mood} size={28} />
                    </View>
                  </View>
                </View>

                <Text variant="button2" className="ml-3 flex-1 text-primary-dark-active">
                  {labelOf(entry)}
                </Text>
                {i === 0 && (
                  <Text
                    variant="caption2"
                    className="rounded-chip bg-secondary-light-active px-2.5 py-0.5 text-secondary-darker"
                  >
                    Ahora
                  </Text>
                )}
              </Animated.View>
            );
          })}
        </ScrollView>
        {scrolls && !atEnd && (
          <LinearGradient
            pointerEvents="none"
            colors={["rgba(255,255,255,0)", "#FFFFFF"]}
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 36 }}
          />
        )}
      </View>

      {scrolls && (
        <Text variant="caption2" className="-mt-2 text-center text-primary-dark-hover">
          {`${entries.length} registros hoy · desliza para ver todos`}
        </Text>
      )}
    </Card>
  );
}

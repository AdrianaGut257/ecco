import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import Card from "../../../components/ui/card";
import Text from "../../../components/ui/text";
import { MOODS, type MoodId } from "../../../constants/emotions";
import { moodService } from "../../../services/moodService";
import { goodThings } from "../../../store/goodThings";
import { useColors } from "../../../theme";

const DAYS = 28;
const DAY_LABELS = ["D", "L", "M", "X", "J", "V", "S"];

// "Tu mes": un punto por día con el color del último ánimo registrado, para ver de un vistazo cómo
// fueron las últimas cuatro semanas. Sin números ni rachas, y solo lo ve la persona.
// Debajo, las "cosas buenas" que guardó en los últimos días.
export default function MoodMonth() {
  const c = useColors();
  const [days, setDays] = useState<{ date: Date; mood: MoodId | null }[]>([]);
  const [good, setGood] = useState<{ date: Date; text: string }[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      moodService
        .history(DAYS)
        .then((entries) => {
          if (!active) return;
          const byDay = new Map<string, MoodId>();
          entries.forEach((e) => byDay.set(new Date(e.createdAt).toDateString(), e.mood));
          const today = new Date();
          setDays(
            Array.from({ length: DAYS }, (_, i) => {
              const date = new Date(today);
              date.setDate(today.getDate() - (DAYS - 1 - i));
              return { date, mood: byDay.get(date.toDateString()) ?? null };
            }),
          );
        })
        .catch(() => undefined);
      goodThings.recent(7).then((list) => active && setGood(list));
      return () => {
        active = false;
      };
    }, []),
  );

  if (days.length === 0) return null;
  const weeks = Array.from({ length: DAYS / 7 }, (_, w) => days.slice(w * 7, w * 7 + 7));
  const today = new Date().toDateString();

  return (
    <Card tone="white" className="mb-6 gap-3">
      <View>
        <Text variant="subtitle2">Tu mes</Text>
        <Text variant="caption1" className="text-primary-dark-hover">
          Un punto por día, del color de cómo te sentiste. Solo tú lo ves.
        </Text>
      </View>

      <View className="gap-2" accessibilityLabel="Ánimo de las últimas cuatro semanas">
        <View className="flex-row justify-between px-1">
          {weeks[0].map(({ date }) => (
            <Text key={date.toDateString()} variant="caption2" className="w-8 text-center text-primary-dark-hover">
              {DAY_LABELS[date.getDay()]}
            </Text>
          ))}
        </View>
        {weeks.map((week, w) => (
          <View key={w} className="flex-row justify-between px-1">
            {week.map(({ date, mood }) => {
              const isToday = date.toDateString() === today;
              return (
                <View
                  key={date.toDateString()}
                  accessibilityLabel={`${date.getDate()}: ${mood ? MOODS.find((m) => m.id === mood)?.label : "sin registro"}`}
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    mood ? "" : "border-2 border-dashed border-primary-light-active"
                  }`}
                  style={[
                    mood ? { backgroundColor: c.mood[mood] } : null,
                    isToday ? { borderWidth: 2, borderColor: c.primary["dark-hover"] } : null,
                  ]}
                >
                  <Text variant="caption2" className={mood ? "text-primary-ink" : "text-primary-dark-hover"}>
                    {date.getDate()}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap justify-center gap-x-3 gap-y-1">
        {MOODS.map((m) => (
          <View key={m.id} className="flex-row items-center gap-1">
            <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.mood[m.id] }} />
            <Text variant="caption2" className="text-primary-dark-hover">
              {m.label}
            </Text>
          </View>
        ))}
      </View>

      {good.length > 0 && (
        <View className="mt-1 gap-2 border-t border-primary-light-active pt-3">
          <Text variant="caption1" className="text-primary-dark-hover">
            Cosas buenas de estos días
          </Text>
          {good.map(({ date, text }) => (
            <View key={date.toDateString()} className="flex-row gap-2">
              <Text variant="caption2" className="w-12 text-primary-dark-hover">
                {date.toLocaleDateString("es", { day: "numeric", month: "short" })}
              </Text>
              <Text variant="body3" className="flex-1 text-primary-dark-active">
                {text}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

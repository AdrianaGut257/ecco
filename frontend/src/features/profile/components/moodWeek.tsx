import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import MoodFace from "../../../components/avatar/moodFace";
import Card from "../../../components/ui/card";
import Text from "../../../components/ui/text";
import type { MoodId } from "../../../constants/emotions";
import { moodService } from "../../../services/moodService";

const DAY_LABELS = ["D", "L", "M", "X", "J", "V", "S"];

export default function MoodWeek() {
  const [days, setDays] = useState<{ date: Date; mood: MoodId | null }[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      moodService
        .history(7)
        .then((entries) => {
          if (!active) return;
          const byDay = new Map<string, MoodId>();
          entries.forEach((e) => byDay.set(new Date(e.createdAt).toDateString(), e.mood));
          const today = new Date();
          setDays(
            Array.from({ length: 7 }, (_, i) => {
              const date = new Date(today);
              date.setDate(today.getDate() - (6 - i));
              return { date, mood: byDay.get(date.toDateString()) ?? null };
            }),
          );
        })
        .catch(() => undefined);
      return () => {
        active = false;
      };
    }, []),
  );

  if (days.length === 0) return null;
  const any = days.some((d) => d.mood);

  return (
    <Card tone="white" className="mb-6">
      <Text variant="body2" className="font-heading-semibold text-primary-dark-active">
        Tu semana
      </Text>
      <Text variant="caption1" className="mb-3 text-primary-dark-hover">
        {any
          ? "Solo tú ves esto. Notar cómo te sientes ya es cuidarte."
          : "Cuando registres cómo te sientes, aparecerá aquí. Solo tú lo ves."}
      </Text>
      <View className="flex-row justify-between">
        {days.map(({ date, mood }) => (
          <View key={date.toDateString()} className="items-center gap-1">
            {mood ? (
              <MoodFace mood={mood} size={32} />
            ) : (
              <View className="h-8 w-8 rounded-full border-2 border-dashed border-primary-light-active" />
            )}
            <Text variant="caption2" className="text-primary-dark-hover">
              {DAY_LABELS[date.getDay()]}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

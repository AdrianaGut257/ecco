import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import Avatar from "../../../components/avatar/avatar";
import MoodFace from "../../../components/avatar/moodFace";
import Plant from "../../../components/garden/plant";
import Button from "../../../components/ui/button";
import Sheet from "../../../components/ui/sheet";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { CHAT_DAYS, STAGE_NAMES } from "../../../constants/plant";
import { reactionLabel, toneById } from "../../../constants/tones";
import type { GardenEntry, GardenMemory } from "../../../types";
import { allDiscoveries } from "../../exchange/discoveries";

interface Props {
  entry: GardenEntry | null;
  memory: GardenMemory | null;
  error: string | null;
  onClose: () => void;
  onOpenChat?: () => void;
}

const span = (iso: string) => {
  const start = new Date(iso);
  const end = new Date(start.getTime() + (CHAT_DAYS - 1) * 864e5);
  const fmt = (d: Date) => d.toLocaleDateString("es", { day: "numeric", month: "long" });
  return `Del ${fmt(start)} al ${fmt(end)}`;
};

function Section({ icon, title, children, delay }: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: ReactNode;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)} className="gap-2">
      <View className="flex-row items-center gap-1.5">
        <Ionicons name={icon} size={16} color={colors.primary["dark-hover"]} />
        <Text variant="caption2" className="uppercase tracking-wider text-primary-dark-hover">
          {title}
        </Text>
      </View>
      {children}
    </Animated.View>
  );
}

// Postal de una conversación: lo que descubrieron, lo que se regalaron y cómo empezó. Sin cantidades.
export default function MemorySheet({ entry, memory, error, onClose, onOpenChat }: Props) {
  const discoveries = memory ? allDiscoveries(memory).slice(0, 3) : [];
  const tone = toneById(memory?.tone);
  const bloomed = entry?.status === "bloomed";
  const active = entry?.status === "active" || entry?.status === "deciding";

  return (
    <Sheet
      visible={!!entry}
      title={entry ? `Tu semana con ${entry.partnerName}` : ""}
      message={entry ? span(entry.startedAt) : undefined}
      onClose={onClose}
    >
      {entry && (
        <ScrollView style={{ maxHeight: 520 }} showsVerticalScrollIndicator={false}>
          <View
            className="mb-5 flex-row items-center gap-4 rounded-card border border-secondary-light-active p-4"
            style={{ backgroundColor: bloomed ? colors.secondary["light-active"] : colors.white }}
          >
            <Plant stage={entry.stage} size={92} growIn />
            <View className="flex-1 gap-1.5">
              <View className="flex-row items-center gap-2">
                <Avatar config={entry.partnerAvatar} size={30} />
                <Text variant="button1" className="flex-1 text-primary-dark-active">
                  {entry.partnerName}
                </Text>
              </View>
              <Text variant="caption1" className="text-secondary-darker">
                {bloomed
                  ? "Su flor sigue viva: ambos quisieron seguir."
                  : `Su planta llegó a ${STAGE_NAMES[entry.stage].toLowerCase()}.`}
              </Text>
            </View>
          </View>

          {!memory && !error && (
            <ActivityIndicator className="my-6" color={colors.primary["dark-hover"]} />
          )}
          {error && (
            <Text variant="body3" className="my-4 text-center text-primary-dark-hover">
              {error}
            </Text>
          )}

          {memory && (
            <Animated.View entering={FadeIn.duration(300)} className="gap-5 pb-2">
              {(memory.hobbies.length > 0 || discoveries.length > 0) && (
                <Section icon="sparkles" title="Lo que descubrieron" delay={0}>
                  {memory.hobbies.length > 0 && (
                    <View className="flex-row flex-wrap gap-1.5">
                      {memory.hobbies.map((theme) => (
                        <Text
                          key={theme}
                          variant="caption2"
                          className="rounded-chip bg-tertiary-light-active px-2.5 py-1 text-tertiary-darker"
                        >
                          {theme}
                        </Text>
                      ))}
                    </View>
                  )}
                  {discoveries.map((d) => (
                    <Text key={d.title} variant="body3" className="text-primary-dark-active">
                      {`· ${d.title}`}
                    </Text>
                  ))}
                </Section>
              )}

              {memory.reactions.length > 0 && (
                <Section icon="heart-outline" title="Lo que se regalaron" delay={120}>
                  <View className="flex-row flex-wrap gap-3">
                    {memory.reactions.map((r) => (
                      <View key={r} className="items-center gap-1">
                        <MoodFace mood={r} size={34} />
                        <Text variant="caption1" className="text-primary-dark-hover">
                          {reactionLabel(r)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Section>
              )}

              {tone && (
                <Section icon="color-palette-outline" title="Cómo se escribieron" delay={240}>
                  <View
                    className="flex-row items-center gap-2 self-start rounded-chip border px-3 py-1.5"
                    style={{ backgroundColor: tone.bg, borderColor: tone.border }}
                  >
                    <Ionicons name={tone.icon} size={16} color={tone.ink} />
                    <Text variant="caption2" style={{ color: tone.ink }}>
                      {`Se escribieron casi siempre ${tone.hint}`}
                    </Text>
                  </View>
                </Section>
              )}

              {memory.firstMessage && (
                <Section icon="chatbubble-outline" title="Así empezó" delay={360}>
                  <View className="rounded-card rounded-tl-md bg-white px-4 py-3">
                    <Text variant="body3" className="text-primary-dark-active">
                      {`“${memory.firstMessage.text}”`}
                    </Text>
                    <Text variant="caption1" className="mt-1 text-primary-dark-hover">
                      {memory.firstMessage.fromMe ? "Lo escribiste tú" : `Lo escribió ${entry.partnerName}`}
                    </Text>
                  </View>
                </Section>
              )}
            </Animated.View>
          )}
        </ScrollView>
      )}

      {(bloomed || active) && onOpenChat && (
        <View className="mt-4">
          <Button color="secondary" icon="arrow-forward" onPress={onOpenChat}>
            {bloomed ? "Seguir conversando" : "Ir a la conversación"}
          </Button>
        </View>
      )}
    </Sheet>
  );
}

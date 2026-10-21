import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import Avatar from "../../../components/avatar/avatar";
import Chip from "../../../components/ui/chip";
import Text from "../../../components/ui/text";
import {
  BACKGROUND,
  BANGS,
  DETAILS,
  EARRINGS,
  GLASSES,
  HAIR,
  HAIR_STYLES,
  OUTFITS,
  SKIN_SWATCH,
  SWATCHES,
  TOP,
} from "../../../constants/avatar";
import { colors } from "../../../constants/colors";
import type { AvatarConfig, Swatch } from "../../../types";

type Tab = "face" | "hair" | "style";

const TABS: { id: Tab; label: string }[] = [
  { id: "face", label: "Rostro" },
  { id: "hair", label: "Cabello" },
  { id: "style", label: "Estilo" },
];

interface Props {
  value: AvatarConfig;
  onChange: (next: AvatarConfig) => void;
}

const pick = <T,>(items: readonly T[]) =>
  items[Math.floor(Math.random() * items.length)];

function Swatches({
  label,
  palette,
  value,
  onSelect,
}: {
  label: string;
  palette: Record<Swatch, string>;
  value: Swatch;
  onSelect: (s: Swatch) => void;
}) {
  return (
    <View className="mb-5">
      <Text variant="caption1" className="mb-2 ml-1 text-primary-dark-hover">
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {SWATCHES.map((s) => {
          const active = value === s;
          return (
            <Pressable
              key={s}
              onPress={() => onSelect(s)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${label} ${s}`}
              hitSlop={4}
              className={`h-11 w-11 items-center justify-center rounded-full ${
                active
                  ? "border-[3px] border-primary-dark-hover"
                  : "border border-primary-light-active"
              }`}
              style={{ backgroundColor: palette[s] }}
            >
              {active && (
                <Ionicons
                  name="checkmark"
                  size={18}
                  color={colors.primary.darker}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Options<T extends string>({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onSelect: (id: T) => void;
}) {
  return (
    <View className="mb-5">
      <Text variant="caption1" className="mb-2 ml-1 text-primary-dark-hover">
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((o) => (
          <Chip
            key={o.id}
            label={o.label}
            selected={value === o.id}
            onPress={() => onSelect(o.id)}
          />
        ))}
      </View>
    </View>
  );
}

function Looks<T extends string>({
  label,
  options,
  selected,
  preview,
  onSelect,
}: {
  label: string;
  options: { id: T; label: string }[];
  selected: T;
  preview: (id: T) => AvatarConfig;
  onSelect: (id: T) => void;
}) {
  return (
    <View className="mb-5">
      <Text variant="caption1" className="mb-2 ml-1 text-primary-dark-hover">
        {label}
      </Text>
      <View accessibilityRole="radiogroup" className="flex-row flex-wrap gap-3">
        {options.map((o) => {
          const active = selected === o.id;
          return (
            <Pressable
              key={o.id}
              onPress={() => onSelect(o.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={o.label}
              className={`w-[84px] items-center rounded-card p-1.5 ${
                active
                  ? "border-[3px] border-primary-dark-hover bg-white"
                  : "border border-primary-light-active"
              }`}
            >
              <Avatar config={preview(o.id)} size={64} />
              <Text
                variant="caption1"
                numberOfLines={2}
                className="mt-1 text-center text-primary-dark-hover"
              >
                {o.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function AvatarCustomizer({ value, onChange }: Props) {
  const [tab, setTab] = useState<Tab>("face");
  const pop = useSharedValue(1);
  const set = (patch: Partial<AvatarConfig>) => onChange({ ...value, ...patch });

  useEffect(() => {
    pop.value = withSequence(
      withSpring(1.06, { damping: 8, stiffness: 300 }),
      withSpring(1, { damping: 10, stiffness: 200 }),
    );
  }, [value, pop]);

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));

  const surprise = () => {
    const style = pick(HAIR_STYLES);
    onChange({
      skin: pick(SWATCHES),
      hair: style.id,
      bangs: Math.random() < 0.7 ? style.bangs : pick(BANGS).id,
      hairColor: pick(SWATCHES),
      glasses: pick(GLASSES).id,
      earrings: pick(EARRINGS).id,
      headband: Math.random() < 0.2,
      freckles: Math.random() < 0.3,
      mole: Math.random() < 0.2,
      outfit: pick(OUTFITS).id,
      top: pick(SWATCHES),
      background: pick(SWATCHES),
    });
  };

  return (
    <View>
      <View className="mb-4 items-center">
        <Animated.View style={popStyle}>
          <Avatar config={value} size={150} label="Vista previa de tu avatar" />
        </Animated.View>
        <Pressable
          onPress={surprise}
          accessibilityRole="button"
          hitSlop={8}
          className="mt-3 min-h-[40px] flex-row items-center gap-1.5 rounded-chip bg-tertiary-light-active px-4 py-2"
        >
          <Ionicons name="shuffle" size={16} color={colors.tertiary.darker} />
          <Text variant="button2" className="text-tertiary-darker">
            Sorpréndeme
          </Text>
        </Pressable>
      </View>

      <View
        accessibilityRole="tablist"
        className="mb-5 flex-row rounded-chip bg-primary-light-active p-1"
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              className={`min-h-[40px] flex-1 items-center justify-center rounded-chip ${
                active ? "bg-white" : ""
              }`}
            >
              <Text
                variant="button2"
                className={
                  active ? "text-primary-dark-active" : "text-primary-dark-hover"
                }
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {tab === "face" && (
        <>
          <Swatches
            label="Tono de piel"
            palette={SKIN_SWATCH}
            value={value.skin}
            onSelect={(skin) => set({ skin })}
          />
          <Options
            label="Lentes"
            options={GLASSES}
            value={value.glasses}
            onSelect={(glasses) => set({ glasses })}
          />
          <Options
            label="Aretes"
            options={EARRINGS}
            value={value.earrings}
            onSelect={(earrings) => set({ earrings })}
          />
          <View className="mb-5">
            <Text
              variant="caption1"
              className="mb-2 ml-1 text-primary-dark-hover"
            >
              Detalles que te hacen tú
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {DETAILS.map((d) => (
                <Chip
                  key={d.id}
                  label={d.label}
                  selected={value[d.id]}
                  onPress={() => set({ [d.id]: !value[d.id] })}
                />
              ))}
            </View>
          </View>
        </>
      )}

      {tab === "hair" && (
        <>
          <Looks
            label="Peinado"
            options={HAIR_STYLES}
            selected={value.hair}
            preview={(hair) => ({
              ...value,
              hair,
              bangs: HAIR_STYLES.find((h) => h.id === hair)!.bangs,
            })}
            onSelect={(hair) =>
              set({ hair, bangs: HAIR_STYLES.find((h) => h.id === hair)!.bangs })
            }
          />
          <Looks
            label="Flequillo (combínalo con cualquier peinado)"
            options={BANGS}
            selected={value.bangs}
            preview={(bangs) => ({ ...value, bangs })}
            onSelect={(bangs) => set({ bangs })}
          />
          <View className="mb-5">
            <Text
              variant="caption1"
              className="mb-2 ml-1 text-primary-dark-hover"
            >
              Accesorios
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <Chip
                label="Diadema"
                selected={value.headband}
                onPress={() => set({ headband: !value.headband })}
              />
            </View>
          </View>
          <Swatches
            label="Color de cabello"
            palette={HAIR}
            value={value.hairColor}
            onSelect={(hairColor) => set({ hairColor })}
          />
        </>
      )}

      {tab === "style" && (
        <>
          <Looks
            label="Ropa"
            options={OUTFITS}
            selected={value.outfit}
            preview={(outfit) => ({ ...value, outfit })}
            onSelect={(outfit) => set({ outfit })}
          />
          <Swatches
            label="Color de la ropa"
            palette={TOP}
            value={value.top}
            onSelect={(top) => set({ top })}
          />
          <Swatches
            label="Fondo"
            palette={BACKGROUND}
            value={value.background}
            onSelect={(background) => set({ background })}
          />
        </>
      )}
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { type ReactNode, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import Avatar from "../../../components/avatar/avatar";
import LivingAvatar, { AvatarGesture } from "../../../components/avatar/livingAvatar";
import Chip from "../../../components/ui/chip";
import Text from "../../../components/ui/text";
import {
  BACKGROUND,
  BACKGROUND_BY_KIND,
  BANGS,
  DETAILS,
  EARRINGS,
  FACIAL_HAIR,
  forKind,
  GLASSES,
  HAIR,
  HAIR_STYLES,
  KIND_LOOK,
  KINDS,
  OUTFITS,
  SKIN_SWATCH,
  SWATCHES,
  TOP,
  TOP_BY_KIND,
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

const COLUMNS = 4;
const GAP = 10;

// Cuadrícula fija de 4 columnas: celdas grandes en el teléfono y con tope en pantallas anchas.
function Grid<T extends { id: string }>({
  items,
  maxCell,
  label,
  renderItem,
}: {
  items: T[];
  maxCell: number;
  label: string;
  renderItem: (item: T, cell: number) => ReactNode;
}) {
  const [width, setWidth] = useState(0);
  const cell = Math.min((width - GAP * (COLUMNS - 1)) / COLUMNS, maxCell);
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      className="flex-row flex-wrap"
      style={{ gap: GAP }}
    >
      {width > 0 &&
        items.map((item) => (
          <View key={item.id} style={{ width: cell }}>
            {renderItem(item, cell)}
          </View>
        ))}
    </View>
  );
}

function Swatches<K extends string>({
  label,
  palette,
  keys = Object.keys(palette) as K[],
  value,
  onSelect,
}: {
  label: string;
  palette: Record<K, string>;
  keys?: K[];
  value: K;
  onSelect: (s: K) => void;
}) {
  return (
    <View className="mb-5">
      <Text variant="caption1" className="mb-2 ml-1 text-primary-dark-hover">
        {label}
      </Text>
      <Grid
        label={label}
        maxCell={72}
        items={keys.map((id) => ({ id }))}
        renderItem={({ id }, cell) => {
          const active = value === id;
          const size = Math.min(cell, 56);
          return (
            <Pressable
              onPress={() => onSelect(id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${label} ${keys.indexOf(id) + 1}`}
              className="items-center"
            >
              <View
                className={`items-center justify-center rounded-full ${
                  active
                    ? "border-[3px] border-primary-dark-hover"
                    : "border border-primary-light-active"
                }`}
                style={{ width: size, height: size, backgroundColor: palette[id] }}
              >
                {active && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={colors.primary.darker}
                  />
                )}
              </View>
            </Pressable>
          );
        }}
      />
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
      <Grid
        label={label}
        maxCell={120}
        items={options}
        renderItem={(o, cell) => {
          const active = selected === o.id;
          return (
            <Pressable
              onPress={() => onSelect(o.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={o.label}
              className={`items-center rounded-card px-0.5 py-1.5 ${
                active
                  ? "border-[3px] border-primary-dark-hover bg-white"
                  : "border border-primary-light-active"
              }`}
            >
              <Avatar config={preview(o.id)} size={cell - 14} />
              <Text
                variant="caption1"
                numberOfLines={2}
                className="mt-1 text-center tracking-normal text-primary-dark-hover"
              >
                {o.label}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

export default function AvatarCustomizer({ value, onChange }: Props) {
  const [tab, setTab] = useState<Tab>("face");
  const [gesture, setGesture] = useState<{ type: AvatarGesture; key: number } | null>(null);
  const pop = useSharedValue(1);
  const set = (patch: Partial<AvatarConfig>) => onChange({ ...value, ...patch });
  const kind = value.kind;
  const hairStyles = forKind(HAIR_STYLES, kind);
  const bangsFor = (hair: AvatarConfig["hair"]) =>
    HAIR_STYLES.find((h) => h.id === hair)!.bangs;

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
    // El avatar nuevo celebra su look sorpresa.
    setGesture({ type: "cheer", key: Date.now() });
    const style = pick(hairStyles);
    const girl = kind === "girl";
    onChange({
      kind,
      skin: pick(SWATCHES),
      hair: style.id,
      bangs:
        style.id !== "bald" && Math.random() < 0.3
          ? pick(forKind(BANGS, kind)).id
          : style.bangs,
      hairColor: pick(SWATCHES),
      facialHair: girl || Math.random() < 0.5 ? "none" : pick(FACIAL_HAIR).id,
      glasses: pick(GLASSES).id,
      earrings: girl && Math.random() < 0.6 ? pick(EARRINGS).id : "none",
      headband: girl && Math.random() < 0.2,
      freckles: Math.random() < 0.3,
      mole: Math.random() < 0.2,
      outfit: pick(forKind(OUTFITS, kind)).id,
      top: pick(TOP_BY_KIND[kind]),
      background: pick(BACKGROUND_BY_KIND[kind]),
    });
  };

  return (
    <View>
      <View className="mb-4 items-center">
        <Animated.View style={popStyle}>
          <LivingAvatar
            config={value}
            size={150}
            label="Vista previa de tu avatar"
            interactive
            gesture={gesture}
          />
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

      <Options
        label="Estilo de avatar"
        options={KINDS}
        value={kind}
        onSelect={(next) =>
          next !== kind &&
          set({
            kind: next,
            ...KIND_LOOK[next],
            ...(BACKGROUND_BY_KIND[next].includes(value.background) ? {} : { background: "1" }),
          })
        }
      />

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
          {kind === "girl" && (
            <Options
              label="Aretes"
              options={EARRINGS}
              value={value.earrings}
              onSelect={(earrings) => set({ earrings })}
            />
          )}
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
            options={hairStyles}
            selected={value.hair}
            preview={(hair) => ({ ...value, hair, bangs: bangsFor(hair) })}
            onSelect={(hair) => set({ hair, bangs: bangsFor(hair) })}
          />
          {value.hair !== "bald" && (
            <Looks
              label="Flequillo (combínalo con cualquier peinado)"
              options={forKind(BANGS, kind)}
              selected={value.bangs}
              preview={(bangs) => ({ ...value, bangs })}
              onSelect={(bangs) => set({ bangs })}
            />
          )}
          {kind === "boy" && (
            <Looks
              label="Barba"
              options={FACIAL_HAIR}
              selected={value.facialHair}
              preview={(facialHair) => ({ ...value, facialHair })}
              onSelect={(facialHair) => set({ facialHair })}
            />
          )}
          {kind === "girl" && (
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
          )}
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
            options={forKind(OUTFITS, kind)}
            selected={value.outfit}
            preview={(outfit) => ({ ...value, outfit })}
            onSelect={(outfit) => set({ outfit })}
          />
          <Swatches
            label="Color de la ropa"
            palette={TOP}
            keys={TOP_BY_KIND[kind]}
            value={value.top}
            onSelect={(top) => set({ top })}
          />
          <Swatches
            label="Fondo"
            palette={BACKGROUND}
            keys={BACKGROUND_BY_KIND[kind]}
            value={value.background}
            onSelect={(background) => set({ background })}
          />
        </>
      )}
    </View>
  );
}

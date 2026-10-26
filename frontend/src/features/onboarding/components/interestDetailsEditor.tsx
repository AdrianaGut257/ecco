import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import Card from "../../../components/ui/card";
import Chip from "../../../components/ui/chip";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { GENERAL, taxonomyFor } from "../../../constants/interestTaxonomy";
import { INTEREST_CATEGORIES } from "../../../constants/interests";
import type { InterestDetails } from "../../../types";
import ItemInput from "./itemInput";

interface Props {
  interests: string[];
  value: InterestDetails;
  onChange: (next: InterestDetails) => void;
}

const iconFor = (interest: string) =>
  INTEREST_CATEGORIES.find((c) => c.items.includes(interest))?.icon ??
  "sparkles-outline";

function Items({
  items,
  onRemove,
}: {
  items: string[];
  onRemove: (item: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <View className="mb-2 flex-row flex-wrap gap-1.5">
      {items.map((item) => (
        <Chip
          key={item}
          label={item}
          tone="secondary"
          selected
          onRemove={() => onRemove(item)}
        />
      ))}
    </View>
  );
}

export default function InterestDetailsEditor({ interests, value, onChange }: Props) {
  const update = (interest: string, buckets: Record<string, string[]>) => {
    const next = { ...value };
    if (Object.keys(buckets).length === 0) delete next[interest];
    else next[interest] = buckets;
    onChange(next);
  };

  return (
    <View className="gap-4">
      {interests.map((interest) => {
        const taxonomy = taxonomyFor(interest);
        const buckets = value[interest] ?? {};
        const chosen = taxonomy.subtopics.filter((s) => s in buckets);

        const toggleSubtopic = (sub: string) => {
          const next = { ...buckets };
          if (sub in next) delete next[sub];
          else next[sub] = [];
          update(interest, next);
        };
        const addItem = (bucket: string, item: string) =>
          update(interest, { ...buckets, [bucket]: [...(buckets[bucket] ?? []), item] });
        const removeItem = (bucket: string, item: string) => {
          const rest = (buckets[bucket] ?? []).filter((i) => i !== item);
          const next = { ...buckets, [bucket]: rest };
          if (bucket === GENERAL && rest.length === 0) delete next[GENERAL];
          update(interest, next);
        };

        return (
          <Card key={interest} className="gap-3">
            <View className="flex-row items-center gap-2.5">
              <Ionicons
                name={iconFor(interest)}
                size={22}
                color={colors.primary["dark-hover"]}
              />
              <Text
                variant="subtitle2"
              >
                {interest}
              </Text>
            </View>

            {taxonomy.subtopics.length > 0 && (
              <View>
                <Text variant="caption1" className="mb-2 text-primary-dark-hover">
                  {taxonomy.subtopicLabel}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {taxonomy.subtopics.map((sub) => (
                    <Chip
                      key={sub}
                      label={sub}
                      tone="secondary"
                      selected={sub in buckets}
                      onPress={() => toggleSubtopic(sub)}
                    />
                  ))}
                </View>
              </View>
            )}

            {chosen.map((sub) => (
              <View key={sub} className="rounded-field bg-white/70 p-3">
                <Text variant="body3" className="mb-2 text-primary-dark-active">
                  {sub}
                </Text>
                <Items
                  items={buckets[sub] ?? []}
                  onRemove={(item) => removeItem(sub, item)}
                />
                <ItemInput
                  interest={interest}
                  label={`${interest}, ${sub}`}
                  placeholder={taxonomy.placeholder}
                  existing={buckets[sub] ?? []}
                  onAdd={(item) => addItem(sub, item)}
                />
              </View>
            ))}

            <View>
              <Text variant="caption1" className="mb-2 text-primary-dark-hover">
                {taxonomy.examplesLabel}
              </Text>
              <Items
                items={buckets[GENERAL] ?? []}
                onRemove={(item) => removeItem(GENERAL, item)}
              />
              <ItemInput
                interest={interest}
                label={taxonomy.examplesLabel}
                placeholder={taxonomy.placeholder}
                existing={buckets[GENERAL] ?? []}
                onAdd={(item) => addItem(GENERAL, item)}
              />
            </View>
          </Card>
        );
      })}
    </View>
  );
}

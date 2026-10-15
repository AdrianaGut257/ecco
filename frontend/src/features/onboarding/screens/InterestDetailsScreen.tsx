import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import Container from "../../../components/layout/container";
import BackButton from "../../../components/ui/backButton";
import Button from "../../../components/ui/button";
import Card from "../../../components/ui/card";
import Chip from "../../../components/ui/chip";
import IconButton from "../../../components/ui/iconButton";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { DEFAULT_PLACEHOLDER, INTEREST_DETAILS } from "../interestDetailsData";

export type InterestItems = Record<string, Record<string, string[]>>;

interface Props {
  selectedInterests: string[];
  onBack: () => void;
  onComplete: (items: InterestItems) => void;
}

const draftKey = (interest: string, sub: string) => `${interest}|${sub}`;

export default function InterestDetailsScreen({
  selectedInterests,
  onBack,
  onComplete,
}: Props) {
  const [active, setActive] = useState<Record<string, string[]>>({});
  const [items, setItems] = useState<InterestItems>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const toggleSub = (interest: string, sub: string) =>
    setActive((prev) => {
      const current = prev[interest] ?? [];
      return {
        ...prev,
        [interest]: current.includes(sub)
          ? current.filter((s) => s !== sub)
          : [...current, sub],
      };
    });

  const addItem = (interest: string, sub: string) => {
    const key = draftKey(interest, sub);
    const text = (drafts[key] ?? "").trim();
    if (!text) return;
    setItems((prev) => {
      const list = prev[interest]?.[sub] ?? [];
      if (list.some((i) => i.toLowerCase() === text.toLowerCase())) return prev;
      return {
        ...prev,
        [interest]: { ...(prev[interest] ?? {}), [sub]: [...list, text] },
      };
    });
    setDrafts((prev) => ({ ...prev, [key]: "" }));
  };

  const removeItem = (interest: string, sub: string, item: string) =>
    setItems((prev) => ({
      ...prev,
      [interest]: {
        ...(prev[interest] ?? {}),
        [sub]: (prev[interest]?.[sub] ?? []).filter((i) => i !== item),
      },
    }));

  return (
    <Container
      scroll
      footer={
        <>
          <Button onPress={() => onComplete(items)}>Continuar</Button>
          <Pressable
            onPress={() => onComplete({})}
            className="items-center py-3"
            hitSlop={8}
          >
            <Text variant="caption1" className="text-primary-dark-hover">
              Prefiero hacerlo después
            </Text>
          </Pressable>
        </>
      }
    >
      <BackButton className="mb-4" onPress={onBack} />
      <Text variant="h2" className="mb-1">
        Cuéntanos más
      </Text>
      <Text variant="body3" className="mb-6 text-primary-dark-hover">
        Elige géneros y suma ejemplos si quieres. Todo esto es opcional.
      </Text>

      {selectedInterests.map((interest) => {
        const detail = INTEREST_DETAILS[interest];
        const open = active[interest] ?? [];

        return (
          <Card key={interest} className="mb-4">
            <View className="mb-3 flex-row items-center gap-2">
              <Ionicons
                name="sparkles-outline"
                size={16}
                color={colors.primary.normal}
              />
              <Text variant="caption1" className="text-primary-dark-hover">
                {interest}
              </Text>
            </View>

            {detail?.subtopics ? (
              <>
                <View className="mb-3 flex-row flex-wrap gap-2">
                  {detail.subtopics.map((sub) => (
                    <Chip
                      key={sub}
                      label={sub}
                      tone="secondary"
                      selected={open.includes(sub)}
                      onPress={() => toggleSub(interest, sub)}
                    />
                  ))}
                </View>

                {open.map((sub) => {
                  const key = draftKey(interest, sub);
                  const list = items[interest]?.[sub] ?? [];
                  return (
                    <View key={sub} className="mb-3">
                      <Text
                        variant="caption1"
                        className="mb-1.5 text-primary-dark-hover"
                      >
                        {sub}
                      </Text>
                      {list.length > 0 && (
                        <View className="mb-2 flex-row flex-wrap gap-1.5">
                          {list.map((item) => (
                            <Chip
                              key={item}
                              label={item}
                              tone="secondary"
                              selected
                              onRemove={() => removeItem(interest, sub, item)}
                            />
                          ))}
                        </View>
                      )}
                      <View className="flex-row items-center gap-2">
                        <TextInput
                          value={drafts[key] ?? ""}
                          onChangeText={(t) =>
                            setDrafts((p) => ({ ...p, [key]: t }))
                          }
                          onSubmitEditing={() => addItem(interest, sub)}
                          placeholder={detail.placeholder}
                          placeholderTextColor={colors.primary["normal-hover"]}
                          maxLength={60}
                          className="flex-1 rounded-field border border-primary-light-active bg-white px-3 py-2 font-ecco text-body3 text-primary-dark-active"
                          style={{ outlineStyle: "none" } as object}
                        />
                        <IconButton
                          icon="add"
                          label={`Agregar a ${sub}`}
                          onPress={() => addItem(interest, sub)}
                        />
                      </View>
                    </View>
                  );
                })}
              </>
            ) : (
              <TextInput
                value={drafts[draftKey(interest, "general")] ?? ""}
                onChangeText={(t) =>
                  setDrafts((p) => ({
                    ...p,
                    [draftKey(interest, "general")]: t,
                  }))
                }
                placeholder={DEFAULT_PLACEHOLDER}
                placeholderTextColor={colors.primary["normal-hover"]}
                multiline
                maxLength={120}
                className="min-h-[42px] rounded-field border border-primary-light-active bg-white px-3 py-2.5 font-ecco text-body3 text-primary-dark-active"
                style={{ outlineStyle: "none" } as object}
              />
            )}
          </Card>
        );
      })}
    </Container>
  );
}

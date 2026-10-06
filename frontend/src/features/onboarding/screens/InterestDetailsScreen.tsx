import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../../components/ui/Button";
import { DEFAULT_PLACEHOLDER, INTEREST_DETAILS } from "../interestDetailsData";
import BackButton from "../../../components/ui/BackButton";

type ItemsState = Record<string, Record<string, string[]>>;

export default function InterestDetailsScreen({
  selectedInterests,
  onBack,
  onComplete,
}: {
  selectedInterests: string[];
  onBack: () => void;
  onComplete: (items: ItemsState) => void;
}) {
  const [activeSubtopics, setActiveSubtopics] = useState<
    Record<string, string[]>
  >({});
  const [items, setItems] = useState<ItemsState>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({}); // texto que se está escribiendo, por "interes|subtema"

  const toggleSubtopic = (interest: string, subtopic: string) => {
    setActiveSubtopics((prev) => {
      const current = prev[interest] ?? [];
      const already = current.includes(subtopic);
      return {
        ...prev,
        [interest]: already
          ? current.filter((s) => s !== subtopic)
          : [...current, subtopic],
      };
    });
  };

  const draftKey = (interest: string, sub: string) => `${interest}|${sub}`;

  const addItem = (interest: string, sub: string) => {
    const key = draftKey(interest, sub);
    const text = (drafts[key] ?? "").trim();
    if (!text) return;

    setItems((prev) => {
      const currentList = prev[interest]?.[sub] ?? [];
      if (currentList.includes(text)) return prev;
      return {
        ...prev,
        [interest]: {
          ...(prev[interest] ?? {}),
          [sub]: [...currentList, text],
        },
      };
    });
    setDrafts((prev) => ({ ...prev, [key]: "" }));
  };

  const removeItem = (interest: string, sub: string, item: string) => {
    setItems((prev) => ({
      ...prev,
      [interest]: {
        ...(prev[interest] ?? {}),
        [sub]: (prev[interest]?.[sub] ?? []).filter((i) => i !== item),
      },
    }));
  };

  return (
    <View className="flex-1 bg-primaryClear">
      <ScrollView
        className="flex-1 px-6 pt-16"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <BackButton className="mb-6" onPress={onBack} />
        <Text className="font-heading-bold text-h1 text-primaryNormalActive mb-1">
          Cuéntanos más
        </Text>
        <Text className="font-body text-sm text-primaryNormalHover mb-6">
          Elige géneros y agrega tantos ejemplos como quieras. Es opcional.
        </Text>

        {selectedInterests.map((interest) => {
          const detail = INTEREST_DETAILS[interest];
          const active = activeSubtopics[interest] ?? [];

          return (
            <View
              key={interest}
              className="bg-white rounded-card border border-primaryLight p-4 mb-4"
            >
              <Text className="font-heading-semibold text-sm text-primaryNormalActive mb-3">
                {interest}
              </Text>

              {detail?.subtopics ? (
                <>
                  <View className="flex-row flex-wrap gap-2 mb-3">
                    {detail.subtopics.map((sub) => {
                      const isActive = active.includes(sub);
                      return (
                        <TouchableOpacity
                          key={sub}
                          onPress={() => toggleSubtopic(interest, sub)}
                          className={`px-3 py-1.5 rounded-chip border ${
                            isActive
                              ? "bg-secondaryNormal border-secondaryNormal"
                              : "bg-secondaryClear border-secondaryLightActive"
                          }`}
                        >
                          <Text
                            className={`font-body-medium text-xs ${
                              isActive
                                ? "text-white"
                                : "text-secondaryNormalHover"
                            }`}
                          >
                            {sub}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {active.map((sub) => {
                    const key = draftKey(interest, sub);
                    const list = items[interest]?.[sub] ?? [];

                    return (
                      <View key={sub} className="mb-4">
                        <Text className="font-body-medium text-xs text-primaryNormalActive mb-1.5">
                          {sub}
                        </Text>

                        {list.length > 0 && (
                          <View className="flex-row flex-wrap gap-1.5 mb-2">
                            {list.map((item) => (
                              <View
                                key={item}
                                className="flex-row items-center gap-1 bg-secondaryNormal rounded-chip px-2.5 py-1"
                              >
                                <Text className="font-body-medium text-xs text-white">
                                  {item}
                                </Text>
                                <Pressable
                                  onPress={() =>
                                    removeItem(interest, sub, item)
                                  }
                                  hitSlop={6}
                                >
                                  <Ionicons
                                    name="close"
                                    size={12}
                                    color="#FFFFFF"
                                  />
                                </Pressable>
                              </View>
                            ))}
                          </View>
                        )}

                        <View className="flex-row items-center gap-2">
                          <TextInput
                            value={drafts[key] ?? ""}
                            onChangeText={(t) =>
                              setDrafts((prev) => ({ ...prev, [key]: t }))
                            }
                            onSubmitEditing={() => addItem(interest, sub)}
                            placeholder={detail.placeholder}
                            placeholderTextColor="#A27556"
                            className="flex-1 font-body text-sm text-primaryNormalActive border border-primaryLightActive rounded-field px-3 py-2"
                            style={{ outlineStyle: "none" } as any}
                          />
                          <Pressable
                            onPress={() => addItem(interest, sub)}
                            className="w-9 h-9 rounded-full bg-primaryNormal items-center justify-center"
                          >
                            <Ionicons name="add" size={20} color="#FFFFFF" />
                          </Pressable>
                        </View>
                      </View>
                    );
                  })}
                </>
              ) : (
                <TextInput
                  value={drafts[draftKey(interest, "general")] ?? ""}
                  onChangeText={(t) =>
                    setDrafts((prev) => ({
                      ...prev,
                      [draftKey(interest, "general")]: t,
                    }))
                  }
                  placeholder={DEFAULT_PLACEHOLDER}
                  placeholderTextColor="#A27556"
                  multiline
                  className="font-body text-sm text-primaryNormalActive border border-primaryLightActive rounded-field px-3 py-2.5 min-h-[42px]"
                  style={{ outlineStyle: "none" } as any}
                />
              )}
            </View>
          );
        })}
      </ScrollView>

      <View className="px-6 pb-8 pt-3 bg-primaryClear gap-2">
        <Button variant="primary" onPress={() => onComplete(items)}>
          Continuar
        </Button>
        <TouchableOpacity
          onPress={() => onComplete(items)}
          className="items-center py-2"
        >
          <Text className="font-body-medium text-xs text-primaryNormalHover">
            Omitir por ahora
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

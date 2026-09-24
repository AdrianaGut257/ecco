import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../../components/ui/Button";
import { DEFAULT_PLACEHOLDER, INTEREST_DETAILS } from "../interestDetailsData";

type DetailValue = { subtopic?: string; note: string };

export default function InterestDetailsScreen({
  selectedInterests,
  onComplete,
}: {
  selectedInterests: string[];
  onComplete: (details: Record<string, DetailValue>) => void;
}) {
  const [details, setDetails] = useState<Record<string, DetailValue>>({});

  const setSubtopic = (interest: string, subtopic: string) => {
    setDetails((prev) => {
      const current = prev[interest] ?? { note: "" };
      const isSame = current.subtopic === subtopic;
      return {
        ...prev,
        [interest]: { ...current, subtopic: isSame ? undefined : subtopic },
      };
    });
  };

  const setNote = (interest: string, note: string) => {
    setDetails((prev) => ({
      ...prev,
      [interest]: { ...(prev[interest] ?? {}), note },
    }));
  };

  return (
    <View className="flex-1 bg-primaryClear">
      <ScrollView
        className="flex-1 px-6 pt-16"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Text className="font-heading-bold text-h1 text-primaryNormalActive mb-1">
          Cuéntanos más
        </Text>
        <Text className="font-body text-sm text-primaryNormalHover mb-6">
          Es opcional, pero ayuda a encontrar mejores conexiones.
        </Text>

        {selectedInterests.map((interest) => {
          const detail = INTEREST_DETAILS[interest];
          const current = details[interest];

          return (
            <View
              key={interest}
              className="bg-white rounded-card border border-primaryLight p-4 mb-4"
            >
              <Text className="font-heading-semibold text-sm text-primaryNormalActive mb-3">
                {interest}
              </Text>

              {detail?.subtopics && (
                <View className="flex-row flex-wrap gap-2 mb-3">
                  {detail.subtopics.map((sub) => {
                    const active = current?.subtopic === sub;
                    return (
                      <TouchableOpacity
                        key={sub}
                        onPress={() => setSubtopic(interest, sub)}
                        className={`px-3 py-1.5 rounded-chip border ${
                          active
                            ? "bg-secondaryNormal border-secondaryNormal"
                            : "bg-secondaryClear border-secondaryLightActive"
                        }`}
                      >
                        <Text
                          className={`font-body-medium text-xs ${
                            active ? "text-white" : "text-secondaryNormalHover"
                          }`}
                        >
                          {sub}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              <TextInput
                value={current?.note ?? ""}
                onChangeText={(t) => setNote(interest, t)}
                placeholder={detail?.placeholder ?? DEFAULT_PLACEHOLDER}
                placeholderTextColor="#A27556"
                multiline
                className="font-body text-sm text-primaryNormalActive border border-primaryLightActive rounded-field px-3 py-2.5 min-h-[42px]"
                style={{ outlineStyle: "none" } as any}
              />
            </View>
          );
        })}
      </ScrollView>

      <View className="px-6 pb-8 pt-3 bg-primaryClear gap-2">
        <Button variant="primary" onPress={() => onComplete(details)}>
          Continuar
        </Button>
        <TouchableOpacity
          onPress={() => onComplete(details)}
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

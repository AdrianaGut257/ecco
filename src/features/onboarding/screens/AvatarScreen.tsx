import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Button from "../../../components/ui/Button";

type PresetAvatar = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  iconColor: string;
};

const PRESET_AVATARS: PresetAvatar[] = [
  { id: "p1", icon: "person", bg: "#F6DBC9", iconColor: "#E8A77B" },
  { id: "p2", icon: "person", bg: "#D6DECE", iconColor: "#9CAF88" },
  { id: "p3", icon: "person", bg: "#F6E8C3", iconColor: "#E8C468" },
  { id: "p4", icon: "person", bg: "#E3E9EF", iconColor: "#A8B9CC" },
];

export default function AvatarScreen({
  onComplete,
}: {
  onComplete: (avatarId: string, name: string) => void;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState("");

  const selected = PRESET_AVATARS.find((a) => a.id === selectedId);
  const canContinue = !!selectedId && name.trim().length > 0;

  return (
    <View className="flex-1 bg-primaryClear px-8 pt-16 pb-8">
      <Text className="font-heading-bold text-h1 text-primaryNormalActive mb-1">
        Crea tu avatar
      </Text>
      <Text className="font-body text-sm text-primaryNormalHover mb-8">
        Elige uno para empezar. Puedes personalizarlo después.
      </Text>

      <View className="items-center mb-8">
        <View
          className="w-28 h-28 rounded-full items-center justify-center border-2"
          style={{
            backgroundColor: selected?.bg ?? "#FDF6F2",
            borderColor: selected ? selected.iconColor : "#F6DBC9",
          }}
        >
          <Ionicons
            name={selected?.icon ?? "person-outline"}
            size={52}
            color={selected?.iconColor ?? "#ECB691"}
          />
        </View>
      </View>

      <Text className="font-body-medium text-xs text-primaryNormalActive mb-3">
        Elige un avatar
      </Text>
      <View className="flex-row flex-wrap gap-3 mb-8">
        {PRESET_AVATARS.map((avatar) => {
          const active = selectedId === avatar.id;
          return (
            <Pressable
              key={avatar.id}
              onPress={() => setSelectedId(avatar.id)}
              className={`flex-1 aspect-square rounded-field border items-center justify-center ${
                active ? "border-primaryNormal border-2" : "border-primaryLight"
              }`}
              style={{ backgroundColor: avatar.bg }}
            >
              <Ionicons name={avatar.icon} size={28} color={avatar.iconColor} />
              {active && (
                <View className="absolute top-1 right-1 bg-primaryNormal rounded-full w-4 h-4 items-center justify-center">
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <View className="mb-8">
        <Text className="font-body-medium text-xs text-primaryNormalActive mb-1.5">
          ¿Cómo te llamas?
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Tu nombre o apodo"
          placeholderTextColor="#A27556"
          className="font-body border border-primaryLightActive rounded-field px-4 py-3 text-primaryNormalActive bg-white"
        />
      </View>

      <View className="mt-auto">
        <Button
          variant="primary"
          onPress={() => selectedId && onComplete(selectedId, name)}
          disabled={!canContinue}
        >
          Continuar
        </Button>
      </View>
    </View>
  );
}

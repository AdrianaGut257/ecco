import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const AVATAR_COLORS = [
  "#E8A77B", // primary
  "#9CAF88", // secondary
  "#E8C468", // warning/gold
  "#A8B9CC", // lavanda
  "#C97B63", // destructive
];

export default function AvatarScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(AVATAR_COLORS[0]);

  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <View className="flex-1 bg-primaryClear px-8 pt-16 pb-8 items-center">
      <Text className="font-heading-semibold text-2xl text-primaryNormalActive mb-1 self-start">
        Crea tu avatar
      </Text>
      <Text className="font-body text-sm text-primaryNormalHover mb-8 self-start">
        Algo simple para representarte. Puedes cambiarlo después.
      </Text>

      <View
        className="w-28 h-28 rounded-full items-center justify-center mb-8"
        style={{ backgroundColor: color }}
      >
        <Text className="font-heading-semibold text-4xl text-white">
          {initial}
        </Text>
      </View>

      <View className="flex-row gap-3 mb-8">
        {AVATAR_COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setColor(c)}
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{
              backgroundColor: c,
              borderWidth: color === c ? 3 : 0,
              borderColor: "#3D3530",
            }}
          />
        ))}
      </View>

      <View className="w-full mb-10">
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

      <TouchableOpacity
        className={`w-full rounded-chip py-3.5 items-center ${
          name.trim() ? "bg-primaryNormal" : "bg-primaryLightActive"
        }`}
        onPress={onComplete}
        disabled={!name.trim()}
      >
        <Text className="font-heading-semibold text-base text-white">
          Continuar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

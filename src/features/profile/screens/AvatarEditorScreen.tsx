import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Button from "../../../components/ui/Button";

type MainTab = "Cuerpo" | "Ropa" | "Animaciones";

const MAIN_TABS: { key: MainTab; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "Cuerpo", icon: "body-outline" },
  { key: "Ropa", icon: "shirt-outline" },
  { key: "Animaciones", icon: "sparkles-outline" },
];

type OptionItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
};

const SUB_TABS: Record<
  MainTab,
  { key: string; icon: keyof typeof Ionicons.glyphMap; options: OptionItem[] }[]
> = {
  Cuerpo: [
    {
      key: "Cuerpo entero",
      icon: "body-outline",
      options: [
        { id: "b1", icon: "body-outline", color: "#F6DBC9" },
        { id: "b2", icon: "body-outline", color: "#ECB691" },
        { id: "b3", icon: "body-outline", color: "#D6DECE" },
        { id: "b4", icon: "body-outline", color: "#ADBD9C" },
        { id: "b5", icon: "body-outline", color: "#F2CCB2" },
        { id: "b6", icon: "body-outline", color: "#C6D1BA" },
      ],
    },
    {
      key: "Pelo",
      icon: "cut-outline",
      options: [
        { id: "h1", icon: "cut-outline", color: "#3D3530" },
        { id: "h2", icon: "cut-outline", color: "#8E664B" },
        { id: "h3", icon: "cut-outline", color: "#A27556" },
        { id: "h4", icon: "cut-outline", color: "#E8C468" },
        { id: "h5", icon: "cut-outline", color: "#ECB691" },
        { id: "h6", icon: "cut-outline", color: "#B5A99C" },
      ],
    },
    {
      key: "Cara",
      icon: "happy-outline",
      options: [
        { id: "f1", icon: "happy-outline" },
        { id: "f2", icon: "happy-outline" },
        { id: "f3", icon: "glasses-outline" },
        { id: "f4", icon: "eye-outline" },
      ],
    },
    {
      key: "Piel",
      icon: "color-palette-outline",
      options: [
        { id: "s1", icon: "ellipse", color: "#FDF6F2" },
        { id: "s2", icon: "ellipse", color: "#F2CCB2" },
        { id: "s3", icon: "ellipse", color: "#E8A77B" },
        { id: "s4", icon: "ellipse", color: "#A27556" },
        { id: "s5", icon: "ellipse", color: "#8E664B" },
      ],
    },
  ],
  Ropa: [
    {
      key: "Camisetas",
      icon: "shirt-outline",
      options: [
        { id: "t1", icon: "shirt-outline", color: "#E8A77B" },
        { id: "t2", icon: "shirt-outline", color: "#9CAF88" },
        { id: "t3", icon: "shirt-outline", color: "#A8B9CC" },
        { id: "t4", icon: "shirt-outline", color: "#E8C468" },
      ],
    },
    {
      key: "Accesorios",
      icon: "glasses-outline",
      options: [
        { id: "a1", icon: "glasses-outline" },
        { id: "a2", icon: "watch-outline" },
        { id: "a3", icon: "headset-outline" },
      ],
    },
  ],
  Animaciones: [
    {
      key: "Gestos",
      icon: "hand-left-outline",
      options: [
        { id: "g1", icon: "hand-left-outline" },
        { id: "g2", icon: "happy-outline" },
        { id: "g3", icon: "musical-notes-outline" },
        { id: "g4", icon: "walk-outline" },
      ],
    },
  ],
};

export default function AvatarEditorScreen() {
  const router = useRouter();
  const [mainTab, setMainTab] = useState<MainTab>("Cuerpo");
  const [subTab, setSubTab] = useState<string>(SUB_TABS["Cuerpo"][0].key);
  const [selections, setSelections] = useState<Record<string, string>>({});

  const currentSubTabs = SUB_TABS[mainTab];
  const currentOptions = useMemo(
    () => currentSubTabs.find((s) => s.key === subTab)?.options ?? [],
    [currentSubTabs, subTab],
  );

  const selectMainTab = (tab: MainTab) => {
    setMainTab(tab);
    setSubTab(SUB_TABS[tab][0].key);
  };

  const selectOption = (optionId: string) => {
    setSelections((prev) => ({ ...prev, [subTab]: optionId }));
  };

  const previewSkin = SUB_TABS.Cuerpo[3].options.find(
    (o) => o.id === selections["Piel"],
  )?.color;
  const previewHair = SUB_TABS.Cuerpo[1].options.find(
    (o) => o.id === selections["Pelo"],
  )?.color;

  return (
    <View className="flex-1 bg-primaryClear">
      <ScrollView
        className="flex-1 px-6 pt-16"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center gap-1.5 mb-6"
        >
          <Ionicons name="arrow-back" size={18} color="#8E664B" />
          <Text className="font-body-medium text-sm text-primaryNormalHover">
            Volver
          </Text>
        </Pressable>

        <Text className="font-heading-bold text-h1 text-primaryNormalActive mb-1">
          Crea tu avatar
        </Text>
        <Text className="font-body text-sm text-primaryNormalHover mb-8">
          Algo simple para representarte. Puedes cambiarlo después.
        </Text>

        <View className="items-center mb-8">
          <View
            className="w-24 h-24 rounded-full border-2 items-center justify-center mb-1"
            style={{
              borderColor: "#E8A77B",
              backgroundColor: previewSkin ?? "transparent",
            }}
          >
            <Ionicons
              name="person"
              size={48}
              color={previewHair ?? "#E8A77B"}
            />
          </View>
        </View>

        <View className="bg-white rounded-card border border-primaryLight p-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-3"
          >
            <View className="flex-row gap-2">
              {MAIN_TABS.map((tab) => {
                const active = mainTab === tab.key;
                return (
                  <Pressable
                    key={tab.key}
                    onPress={() => selectMainTab(tab.key)}
                    className={`flex-row items-center gap-1.5 px-4 py-2 rounded-chip ${
                      active ? "bg-primaryNormal" : "bg-primaryClear"
                    }`}
                  >
                    <Ionicons
                      name={tab.icon}
                      size={15}
                      color={active ? "#FFFFFF" : "#A27556"}
                    />
                    <Text
                      className={`font-body-medium text-sm ${
                        active ? "text-white" : "text-primaryNormalHover"
                      }`}
                    >
                      {tab.key}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row gap-2">
              {currentSubTabs.map((sub) => {
                const active = subTab === sub.key;
                return (
                  <Pressable
                    key={sub.key}
                    onPress={() => setSubTab(sub.key)}
                    className={`flex-row items-center gap-1.5 px-3.5 py-1.5 rounded-chip ${
                      active ? "bg-primaryLightActive" : "bg-primaryClear"
                    }`}
                  >
                    <Ionicons
                      name={sub.icon}
                      size={13}
                      color={active ? "#8E664B" : "#A27556"}
                    />
                    <Text
                      className={`font-body-medium text-xs ${
                        active
                          ? "text-primaryNormalActive"
                          : "text-primaryNormalHover"
                      }`}
                    >
                      {sub.key}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View className="flex-row flex-wrap gap-3">
            {currentOptions.map((option) => {
              const active = selections[subTab] === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => selectOption(option.id)}
                  className={`w-[30%] aspect-square rounded-field border items-center justify-center ${
                    active
                      ? "border-primaryNormal border-2"
                      : "border-primaryLight"
                  }`}
                  style={{ backgroundColor: option.color ?? "#FDF6F2" }}
                >
                  <Ionicons
                    name={option.icon}
                    size={26}
                    color={option.color ? "#FFFFFF" : "#E8A77B"}
                  />
                  {active && (
                    <View className="absolute top-1.5 right-1.5 bg-primaryNormal rounded-full w-5 h-5 items-center justify-center">
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View className="px-6 pb-8 pt-3 bg-primaryClear">
        <Button variant="primary" onPress={() => router.back()}>
          Continuar
        </Button>
      </View>
    </View>
  );
}

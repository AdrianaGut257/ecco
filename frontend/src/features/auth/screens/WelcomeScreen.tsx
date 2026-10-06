import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import Svg, { Ellipse, Path } from "react-native-svg";
import Button from "../../../components/ui/Button";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-primaryNormal items-center">
      <View className="flex-1 items-center justify-center px-8">
        <Text className="font-heading-medium text-xs text-white/70 tracking-[3px] mb-4 uppercase">
          ECCO
        </Text>
        <Text className="font-heading-bold text-h1 text-white leading-9">
          Bienvenido
        </Text>
        <Text className="font-heading-bold text-h2 text-white mb-7">Sam09</Text>
        <Text className="font-body-medium text-base text-white/90 leading-[26px] text-center max-w-[260px]">
          "Qué bueno verte de nuevo”
        </Text>
      </View>

      <View className="absolute bottom-0 left-0 right-0 h-[220px]">
        <Svg
          viewBox="0 0 380 220"
          width="100%"
          height={220}
          preserveAspectRatio="none"
        >
          <Path
            d="M0,60 Q50,20 100,60 Q150,100 200,60 Q250,20 300,60 Q340,90 380,50 L380,220 L0,220 Z"
            fill="rgba(255,255,255,0.15)"
          />
          <Path
            d="M0,90 Q60,50 120,90 Q180,130 240,90 Q300,50 380,80 L380,220 L0,220 Z"
            fill="rgba(255,255,255,0.2)"
          />
          <Path
            d="M0,120 Q70,80 140,120 Q210,160 280,120 Q330,95 380,110 L380,220 L0,220 Z"
            fill="rgba(255,255,255,0.25)"
          />
          <Ellipse cx="60" cy="200" rx="35" ry="18" fill="#9CAF88" />
          <Ellipse cx="50" cy="175" rx="28" ry="14" fill="#ADBD9C" />
          <Ellipse
            cx="300"
            cy="185"
            rx="30"
            ry="15"
            fill="#9CAF88"
            opacity={0.85}
          />
          <Ellipse
            cx="290"
            cy="180"
            rx="22"
            ry="11"
            fill="#ADBD9C"
            opacity={0.9}
          />
        </Svg>
      </View>

      <View className="absolute bottom-10 left-0 right-0 items-center">
        <Button variant="white" onPress={() => router.replace("/(tabs)/home")}>
          Continuar
        </Button>
      </View>
    </View>
  );
}

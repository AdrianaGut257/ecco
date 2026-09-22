import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Ellipse, Path } from "react-native-svg";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-primaryNormal items-center justify-between pb-[60px]">
      <View className="flex-1 items-center justify-center px-8">
        <Text className="font-body-medium text-sm text-white/70 tracking-[3px] mb-4 uppercase">
          ECCO
        </Text>
        <Text className="font-heading-semibold text-[32px] text-white leading-9">
          Bienvenida
        </Text>
        <Text className="font-heading-semibold text-[28px] text-white mb-7">
          Naty09
        </Text>
        <Text className="font-body-medium text-base text-white/90 leading-[26px] text-center max-w-[260px]">
          No tienes que resolver todo ahora.
        </Text>
      </View>

      <View className="absolute bottom-[60px] left-0 right-0 h-[180px]">
        <Svg viewBox="0 0 380 180" width="100%" height={180}>
          <Path
            d="M0,60 Q50,20 100,60 Q150,100 200,60 Q250,20 300,60 Q340,90 380,50 L380,180 L0,180 Z"
            fill="rgba(255,255,255,0.15)"
          />
          <Path
            d="M0,90 Q60,50 120,90 Q180,130 240,90 Q300,50 380,80 L380,180 L0,180 Z"
            fill="rgba(255,255,255,0.2)"
          />
          <Path
            d="M0,120 Q70,80 140,120 Q210,160 280,120 Q330,95 380,110 L380,180 L0,180 Z"
            fill="rgba(255,255,255,0.25)"
          />
          <Ellipse
            cx="60"
            cy="170"
            rx="35"
            ry="18"
            fill="#9CAF88"
            opacity={1.8}
          />
          <Ellipse
            cx="50"
            cy="145"
            rx="28"
            ry="14"
            fill="#ADBD9C"
            opacity={0.9}
          />
          <Ellipse
            cx="300"
            cy="155"
            rx="30"
            ry="15"
            fill="#9CAF88"
            opacity={0.7}
          />
          <Ellipse
            cx="290"
            cy="150"
            rx="22"
            ry="11"
            fill="#ADBD9C"
            opacity={0.8}
          />
        </Svg>
      </View>

      <TouchableOpacity
        className="bg-white rounded-full py-3.5 px-8 z-10"
        onPress={() => router.replace("/login")}
      >
        <Text className="font-heading-semibold text-base text-primaryNormal">
          Continuar →
        </Text>
      </TouchableOpacity>
    </View>
  );
}

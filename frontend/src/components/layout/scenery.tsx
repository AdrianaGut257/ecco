import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { ReactNode, useCallback, useState } from "react";
import { View } from "react-native";
import { tabBarBackdrop } from "../../store/tabBarBackdrop";

interface Props {
  children: ReactNode;
}

const BACKGROUND = require("../../../assets/svg/background/home.svg");
const FALLBACK_RATIO = 996 / 495;

export default function Scenery({ children }: Props) {
  const [width, setWidth] = useState(0);
  const [ratio, setRatio] = useState(FALLBACK_RATIO);

  useFocusEffect(
    useCallback(() => {
      tabBarBackdrop.set("#FFFFFF");
      return tabBarBackdrop.reset;
    }, []),
  );

  return (
    <View
      className="flex-1 bg-white"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <Image
          source={BACKGROUND}
          contentFit="fill"
          pointerEvents="none"
          accessible={false}
          onLoad={({ source }) => {
            if (source.width > 0 && source.height > 0) {
              setRatio(source.height / source.width);
            }
          }}
          style={{ position: "absolute", top: 0, left: 0, width, height: width * ratio }}
        />
      )}
      {children}
    </View>
  );
}

import { cssInterop } from "nativewind";
import Animated from "react-native-reanimated";

cssInterop(Animated.View, { className: "style" });
cssInterop(Animated.Text, { className: "style" });

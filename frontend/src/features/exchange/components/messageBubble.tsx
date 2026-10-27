import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import Animated, {
  BounceIn,
  type EntryOrExitLayoutType,
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from "react-native-reanimated";
import MoodFace from "../../../components/avatar/moodFace";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import type { MoodId } from "../../../constants/emotions";
import { reactionLabel, toneById, type ToneId } from "../../../constants/tones";
import type { ChatMessage } from "../../../types";
import ReactionBar from "./reactionBar";
import ToneTag from "./toneTag";

interface Props {
  message: ChatMessage;
  partnerName: string;
  // Solo los mensajes que llegan con la pantalla abierta se animan según su tono.
  fresh: boolean;
  canReact: boolean;
  picking: boolean;
  showReactButton: boolean;
  onTogglePicker: (id: string) => void;
  onReact: (id: string, reaction: MoodId | null) => void;
  onRetry: (id: string) => void;
}

const ENTERING: Record<ToneId, EntryOrExitLayoutType> = {
  warm: ZoomIn.springify().damping(12),
  joke: BounceIn.duration(550),
  cheer: FadeInUp.springify().damping(9),
  curious: FadeIn.duration(350),
  thanks: ZoomIn.duration(400),
  serious: FadeInDown.duration(250),
};

export default function MessageBubble({
  message,
  partnerName,
  fresh,
  canReact,
  picking,
  showReactButton,
  onTogglePicker,
  onReact,
  onRetry,
}: Props) {
  const mine = message.fromMe;
  const tone = toneById(message.tone);
  const reacting = canReact && !mine && message.status === "sent";
  const label = reactionLabel(message.reaction);

  const entering =
    tone && fresh ? ENTERING[tone.id] : FadeInDown.duration(250);

  return (
    <View className={`mb-2.5 w-full ${mine ? "items-end" : "items-start"}`}>
      <Animated.View
        entering={entering}
        className={`max-w-[82%] ${mine ? "items-end" : "items-start"}`}
      >
        <View className="flex-row items-end gap-1.5">
          <Pressable
            disabled={!reacting}
            onLongPress={() => onTogglePicker(message.id)}
            delayLongPress={350}
            accessibilityRole={reacting ? "button" : undefined}
            accessibilityHint={
              reacting ? "Mantén presionado para reaccionar" : undefined
            }
            accessibilityActions={
              reacting ? [{ name: "longpress", label: "Reaccionar" }] : undefined
            }
            onAccessibilityAction={() => onTogglePicker(message.id)}
            className="shrink"
          >
            <View
              className={`px-4 py-3 ${
                mine
                  ? "rounded-[20px] rounded-br-md bg-secondary-light-active"
                  : "rounded-[20px] rounded-bl-md bg-white"
              } ${message.status === "sending" ? "opacity-60" : ""}`}
              style={
                tone
                  ? {
                      backgroundColor: tone.bg,
                      borderColor: tone.border,
                      borderWidth: 1,
                    }
                  : undefined
              }
            >
              {tone && <ToneTag tone={tone} animate={fresh} />}
              <Text
                variant="body2"
                className={
                  mine ? "text-secondary-darker" : "text-primary-dark-active"
                }
              >
                {message.text}
              </Text>
            </View>
          </Pressable>

          {reacting && showReactButton && !message.reaction && (
            <Pressable
              onPress={() => onTogglePicker(message.id)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Reaccionar al mensaje"
              className="mb-1 h-8 w-8 items-center justify-center rounded-full bg-white/80 active:bg-primary-light-active"
            >
              <Ionicons
                name={picking ? "close" : "happy-outline"}
                size={18}
                color={colors.primary["dark-hover"]}
              />
            </Pressable>
          )}
        </View>

        {message.reaction && label && (
          <Pressable
            key={message.reaction}
            disabled={!reacting}
            onPress={() => onTogglePicker(message.id)}
            accessibilityRole={reacting ? "button" : "image"}
            accessibilityLabel={
              mine
                ? `${partnerName} reaccionó: ${label}`
                : `Tu reacción: ${label}. Toca para cambiarla`
            }
            className={`-mt-2 ${mine ? "mr-3" : "ml-3"}`}
          >
            <Animated.View
              entering={ZoomIn.springify().damping(10)}
              className="flex-row items-center gap-1 rounded-full border border-primary-light-active bg-white py-0.5 pl-0.5 pr-2"
            >
              <MoodFace mood={message.reaction} size={22} />
              <Text variant="caption2" className="tracking-normal text-primary-dark-hover">
                {label}
              </Text>
            </Animated.View>
          </Pressable>
        )}
      </Animated.View>

      {picking && reacting && (
        <ReactionBar
          current={message.reaction}
          onPick={(reaction) => onReact(message.id, reaction)}
        />
      )}

      {message.status === "failed" && (
        <Pressable
          onPress={() => onRetry(message.id)}
          hitSlop={8}
          accessibilityRole="button"
          className="mt-1 self-end"
        >
          <Text variant="caption2" className="text-error-normal-active">
            No se envió. Toca para reintentar
          </Text>
        </Pressable>
      )}
    </View>
  );
}

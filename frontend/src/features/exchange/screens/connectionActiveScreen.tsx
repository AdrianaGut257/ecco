import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LivingAvatar from "../../../components/avatar/livingAvatar";
import Plant from "../../../components/garden/plant";
import AppHeader from "../../../components/layout/appHeader";
import Scenery from "../../../components/layout/scenery";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import { CHAT_DAYS } from "../../../constants/plant";
import type { Match } from "../../../types";

interface Props {
  match: Match;
  onContinue: () => void;
}

export default function ConnectionActiveScreen({ match, onContinue }: Props) {
  const deciding = match.status === "deciding";

  const caption = deciding
    ? `Terminaron sus ${CHAT_DAYS} días. Es momento de decidir si quieren seguir.`
    : match.canWrite
      ? `Día ${match.day} de ${CHAT_DAYS}. Te quedan ${match.messagesLeft} mensajes hoy.`
      : `Día ${match.day} de ${CHAT_DAYS}. Ya compartiste tus mensajes de hoy.`;

  return (
    <Scenery>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <AppHeader showSettings={false} />
        <View className="w-full max-w-[560px] flex-1 justify-center self-center px-7">
          <View className="items-center rounded-card bg-white/90 p-6">
            <View className="flex-row items-end">
              <LivingAvatar
                config={match.partner.avatar}
                mood={match.partner.mood}
                size={104}
                label={`Avatar de ${match.partner.username}`}
                greet
                interactive
              />
              <View className="-ml-4">
                <Plant stage={match.stage} size={64} />
              </View>
            </View>
            <Text variant="subtitle2" className="mt-3">
              {`Tu conversación con ${match.partner.username}`}
            </Text>
            <Text
              variant="body3"
              className="mb-5 mt-1 text-center text-primary-dark-hover"
            >
              {caption}
            </Text>
            <Button color="secondary" onPress={onContinue}>
              {deciding ? "Decidir" : "Abrir conversación"}
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Scenery>
  );
}

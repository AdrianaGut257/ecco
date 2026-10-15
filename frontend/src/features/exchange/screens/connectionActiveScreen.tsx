import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "../../../components/avatar/avatar";
import AppHeader from "../../../components/layout/appHeader";
import Scenery from "../../../components/layout/scenery";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import { useTimeOfDay } from "../../../hooks/useTimeOfDay";
import type { Match } from "../../../types";

interface Props {
  match: Match;
  onContinue: () => void;
}

export default function ConnectionActiveScreen({ match, onContinue }: Props) {
  const time = useTimeOfDay();

  return (
    <Scenery time={time}>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <AppHeader showSettings={false} />
        <View className="flex-1 justify-center px-7">
          <View className="items-center rounded-card bg-white/85 p-6">
            <Avatar id={match.partner.avatarId} size={110} />
            <Text
              variant="subtitle1"
              className="mt-3 text-primary-normal-active"
            >
              Tu conexión activa
            </Text>
            <Text
              variant="caption1"
              className="mb-5 mt-1 text-center text-primary-dark-hover"
            >
              {`${match.partner.username} te está esperando. Día ${match.day} de 7.`}
            </Text>
            <Button color="secondary" onPress={onContinue}>
              Continuar
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Scenery>
  );
}

import { View } from "react-native";
import Avatar from "../../../components/avatar/avatar";
import AppHeader from "../../../components/layout/appHeader";
import Container from "../../../components/layout/container";
import Button from "../../../components/ui/button";
import Card from "../../../components/ui/card";
import Chip from "../../../components/ui/chip";
import Text from "../../../components/ui/text";
import type { Match } from "../../../types";

interface Props {
  match: Match;
  onContinue: () => void;
}

export default function MatchFoundScreen({ match, onContinue }: Props) {
  return (
    <Container
      flush
      scroll
      padded={false}
      footer={
        <View className="px-7">
          <Button onPress={onContinue}>Continuar</Button>
        </View>
      }
    >
      <AppHeader showSettings={false} />
      <View className="px-7 pt-4">
        <Text variant="h3" className="mb-4 text-center">
          Esta semana charlarás con:
        </Text>
        <View className="mb-6 items-center">
          <Avatar id={match.partner.avatarId} size={120} />
          <Text variant="subtitle1" className="mt-2 text-primary-normal-active">
            {match.partner.username}
          </Text>
        </View>

        <Card className="p-5">
          <Text variant="subtitle2" className="mb-3 text-primary-normal-active">
            Aficiones en común
          </Text>
          {match.commonInterests.length === 0 ? (
            <Text variant="caption1" className="text-primary-dark-hover">
              Todavía no sabemos qué tienen en común, y eso es parte de lo
              bonito de descubrirlo.
            </Text>
          ) : (
            match.commonInterests.map((group) => (
              <View key={group.category} className="mb-3">
                <Text
                  variant="caption1"
                  className="mb-1.5 text-primary-dark-hover"
                >
                  {group.category}
                </Text>
                <View className="flex-row flex-wrap gap-2 rounded-field bg-white p-3">
                  {group.items.map((item) => (
                    <Chip key={item} label={item} tone="secondary" selected />
                  ))}
                </View>
              </View>
            ))
          )}
        </Card>
      </View>
    </Container>
  );
}

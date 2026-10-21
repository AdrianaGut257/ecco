import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import Avatar from "../../../components/avatar/avatar";
import AppHeader from "../../../components/layout/appHeader";
import Container from "../../../components/layout/container";
import Button from "../../../components/ui/button";
import Card from "../../../components/ui/card";
import Chip from "../../../components/ui/chip";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { CHAT_DAYS, MESSAGES_PER_DAY } from "../../../constants/plant";
import type { Match } from "../../../types";

interface Props {
  match: Match;
  onContinue: () => void;
}

export default function MatchFoundScreen({ match, onContinue }: Props) {
  const nothingShared =
    match.commonInterests.length === 0 && match.hobbies.length === 0;

  return (
    <Container
      flush
      scroll
      padded={false}
      footer={
        <View className="px-7">
          <Button onPress={onContinue} icon="chatbubble-ellipses-outline">
            Empezar a conversar
          </Button>
        </View>
      }
    >
      <AppHeader showSettings={false} />
      <View className="px-7 pt-2">
        <Text variant="h3" className="mb-4 text-center">
          Esta semana conversarás con
        </Text>
        <Animated.View entering={ZoomIn.springify().damping(12)} className="mb-6 items-center">
          <Avatar
            config={match.partner.avatar}
            mood={match.partner.mood}
            size={128}
            label={`Avatar de ${match.partner.username}`}
          />
          <Text variant="subtitle1" className="mt-2 text-primary-dark-active">
            {match.partner.username}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250)}>
          <Card className="mb-4 p-5">
            <Text variant="body2" className="mb-3 font-heading-semibold text-primary-dark-active">
              Lo que tienen en común
            </Text>
            {nothingShared ? (
              <Text variant="body3" className="text-primary-dark-hover">
                Todavía no sabemos qué comparten, y eso es parte de lo bonito de
                descubrirlo.
              </Text>
            ) : (
              <View className="gap-3">
                {match.sharedFavorites.length > 0 && (
                  <View className="rounded-field bg-secondary-light-active p-3">
                    <View className="mb-1.5 flex-row items-center gap-1.5">
                      <Ionicons
                        name="sparkles"
                        size={16}
                        color={colors.secondary["dark-active"]}
                      />
                      <Text variant="body3" className="text-secondary-darker">
                        ¡Coinciden en algo muy suyo!
                      </Text>
                    </View>
                    <View className="flex-row flex-wrap gap-2">
                      {match.sharedFavorites.map((f) => (
                        <Chip
                          key={`${f.interest}-${f.kind}-${f.label}`}
                          label={f.kind === "subtopic" ? `${f.interest} · ${f.label}` : f.label}
                          tone="secondary"
                          selected
                        />
                      ))}
                    </View>
                  </View>
                )}
                {match.hobbies.length > 0 && (
                  <View>
                    <Text variant="caption1" className="mb-1.5 text-primary-dark-hover">
                      Quieren hablar de
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {match.hobbies.map((h) => (
                        <Chip key={h} label={h} tone="secondary" selected />
                      ))}
                    </View>
                  </View>
                )}
                {match.commonInterests.map((group) => (
                  <View key={group.category}>
                    <Text variant="caption1" className="mb-1.5 text-primary-dark-hover">
                      {group.category}
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {group.items.map((item) => (
                        <Chip key={item} label={item} selected />
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card>

          <Card tone="blue" className="flex-row items-start gap-3">
            <Ionicons
              name="leaf-outline"
              size={20}
              color={colors.tertiary["dark-active"]}
            />
            <Text variant="caption1" className="flex-1 text-tertiary-dark-active">
              {`Tienen ${CHAT_DAYS} días y ${MESSAGES_PER_DAY} mensajes al día cada uno. Sin prisa: lo importante es que cada mensaje cuente. Si algo no se siente bien, puedes salir o reportar desde el menú de la conversación.`}
            </Text>
          </Card>
        </Animated.View>
      </View>
    </Container>
  );
}

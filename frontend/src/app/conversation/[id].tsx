import { useLocalSearchParams, useRouter } from "expo-router";
import ConversationScreen from "../../features/exchange/screens/conversationScreen";

export default function ConversationRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const back = () =>
    router.canGoBack() ? router.back() : router.replace("/(tabs)/garden");

  return (
    <ConversationScreen
      matchId={id}
      onBack={back}
      onNewConnection={() => router.replace("/(tabs)/exchange")}
      onGarden={() => router.replace("/(tabs)/garden")}
    />
  );
}

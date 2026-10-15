import { useEffect, useState } from "react";
import { View } from "react-native";
import AppHeader from "../../../components/layout/appHeader";
import Container from "../../../components/layout/container";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import { sessionStore } from "../../../store/session";
import type { Match } from "../../../types";
import SearchingAnimation from "../components/searchingAnimation";
import { useMatching } from "../hooks/useMatching";

const MESSAGES = [
  "Mirando lo que tienen en común…",
  "Preparando un lugar tranquilo…",
  "Buscando a alguien con buena energía…",
];

const REVEAL_MS = 1600;

interface Props {
  hobbies: string[];
  onCancel: () => void;
  onFound: (match: Match) => void;
}

export default function MatchingScreen({ hobbies, onCancel, onFound }: Props) {
  const { user } = sessionStore.use();
  const { status, match, error, start } = useMatching();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    start(hobbies);
  }, [start, hobbies]);

  useEffect(() => {
    const id = setInterval(
      () => setMessageIndex((i) => (i + 1) % MESSAGES.length),
      2200,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (status !== "found" || !match) return;
    const id = setTimeout(() => onFound(match), REVEAL_MS);
    return () => clearTimeout(id);
  }, [status, match, onFound]);

  const me = {
    username: user?.username ?? "Tú",
    avatarId: user?.avatarId ?? "a1",
  };
  const found = status === "found" && match ? match.partner : null;

  return (
    <Container flush padded={false}>
      <AppHeader showBack onBack={onCancel} showSettings={false} />
      <View className="flex-1 justify-center px-7">
        <Text variant="h3" className="mb-8 text-center">
          {found ? "¡Te encontramos a alguien!" : "Buscando a alguien"}
        </Text>

        <View className="rounded-card bg-primary-light-active py-8">
          <SearchingAnimation me={me} partner={found} />
        </View>

        {status === "error" ? (
          <View className="mt-8 gap-3">
            <Banner
              tone="error"
              message={error ?? "No pudimos completar la búsqueda."}
            />
            <Button onPress={() => start(hobbies)}>Intentar de nuevo</Button>
            <Button variant="outlined" onPress={onCancel}>
              Volver
            </Button>
          </View>
        ) : (
          <>
            <Text
              variant="body3"
              className="mt-8 text-center text-primary-dark-hover"
            >
              {found
                ? "Preparando su primera conversación…"
                : MESSAGES[messageIndex]}
            </Text>
            {!found && (
              <View className="mt-6">
                <Button variant="outlined" onPress={onCancel}>
                  Cancelar búsqueda
                </Button>
              </View>
            )}
          </>
        )}
      </View>
    </Container>
  );
}

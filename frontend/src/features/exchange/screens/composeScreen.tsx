import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  TextInput,
  View,
} from "react-native";
import GrowthPlant from "../../../components/garden/growthPlant";
import AppHeader from "../../../components/layout/appHeader";
import Container from "../../../components/layout/container";
import Banner from "../../../components/ui/banner";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { CHAT_DAYS, stageForDay } from "../../../constants/plant";
import { sessionStore } from "../../../store/session";
import type { ChatMessage, Match } from "../../../types";
import DecisionCard from "../components/decisionCard";
import { MAX_MESSAGE_LENGTH, useMessageFlow } from "../hooks/useMessageFlow";

interface Props {
  match: Match;
  onBack: () => void;
  onFinished: () => void;
}

function Bubble({
  message,
  partnerName,
  myName,
  onRetry,
}: {
  message: ChatMessage;
  partnerName: string;
  myName: string;
  onRetry: (id: string) => void;
}) {
  const mine = message.fromMe;
  return (
    <View className={`mb-3 max-w-[82%] ${mine ? "self-end" : "self-start"}`}>
      <Text
        variant="caption2"
        className={`mb-1 text-primary-dark-hover ${mine ? "text-right" : ""}`}
      >
        {mine ? myName : partnerName}
      </Text>
      <View
        className={`rounded-card px-4 py-3 ${
          mine ? "bg-secondary-light-active" : "bg-primary-light-active"
        } ${message.status === "sending" ? "opacity-60" : ""}`}
      >
        <Text
          variant="body3"
          className={
            mine ? "text-secondary-dark-active" : "text-primary-dark-active"
          }
        >
          {message.text}
        </Text>
      </View>
      {message.status === "failed" && (
        <Pressable
          onPress={() => onRetry(message.id)}
          hitSlop={8}
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

export default function ComposeScreen({ match, onBack, onFinished }: Props) {
  const { user } = sessionStore.use();
  const { messages, loading, error, reload, send, retry } = useMessageFlow(
    match.id,
    match.day,
  );
  const [text, setText] = useState("");
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const closed = match.day > CHAT_DAYS;
  const decisionDay = match.day === CHAT_DAYS;
  const canSend = text.trim().length > 0 && !closed;

  const submit = () => {
    if (!canSend) return;
    send(text);
    setText("");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <Container
      flush
      padded={false}
      footer={
        <View className="gap-3 px-5">
          {decisionDay && (
            <DecisionCard
              matchId={match.id}
              partnerName={match.partner.username}
              onDecided={onFinished}
            />
          )}
          <View className="flex-row items-center rounded-chip border border-primary-light-active bg-white pl-4 pr-1.5">
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={closed ? "Esta conversación ya terminó" : "Mensaje"}
              placeholderTextColor={colors.primary["normal-hover"]}
              editable={!closed}
              maxLength={MAX_MESSAGE_LENGTH}
              multiline
              onSubmitEditing={submit}
              accessibilityLabel="Escribe un mensaje"
              className="max-h-24 flex-1 py-2.5 font-ecco text-body3 text-primary-dark-active"
              style={{ outlineStyle: "none" } as object}
            />
            <Pressable
              onPress={submit}
              disabled={!canSend}
              accessibilityRole="button"
              accessibilityLabel="Enviar mensaje"
              className={`h-9 w-9 items-center justify-center rounded-full ${
                canSend
                  ? "bg-primary-normal active:bg-primary-normal-active"
                  : "bg-primary-light-active"
              }`}
            >
              <Ionicons name="send" size={16} color={colors.white} />
            </Pressable>
          </View>
        </View>
      }
    >
      <AppHeader showBack onBack={onBack} />
      <View className="items-center py-3">
        <Text variant="subtitle2" className="mb-2 text-primary-dark-hover">
          {`Día ${Math.min(match.day, CHAT_DAYS)}`}
        </Text>
        <GrowthPlant stage={stageForDay(match.day)} size={130} />
      </View>

      {error && (
        <View className="px-5 pb-2">
          <Banner
            tone="error"
            message={error}
            actionLabel="Reintentar"
            onAction={reload}
          />
        </View>
      )}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary.normal} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          className="flex-1"
          contentContainerClassName="grow px-5 pt-2"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: false })
          }
          ListEmptyComponent={
            <View className="items-center px-6 py-6">
              <Text
                variant="body3"
                className="text-center text-primary-dark-hover"
              >
                {`Rompe el hielo con una pregunta abierta. Sin prisa, tienen ${CHAT_DAYS} días.`}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Bubble
              message={item}
              partnerName={match.partner.username}
              myName={user?.username ?? "Tú"}
              onRetry={retry}
            />
          )}
        />
      )}
    </Container>
  );
}

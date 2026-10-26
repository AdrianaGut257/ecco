import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Avatar from "../../../components/avatar/avatar";
import GrowthPlant from "../../../components/garden/growthPlant";
import Container from "../../../components/layout/container";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import Sheet from "../../../components/ui/sheet";
import PressableScale from "../../../components/ui/pressableScale";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { MOODS } from "../../../constants/emotions";
import {
  CHAT_DAYS,
  MESSAGES_PER_DAY,
  STAGE_NAMES,
} from "../../../constants/plant";
import { TONES, toneById, type ToneId } from "../../../constants/tones";
import type { ChatMessage, Match } from "../../../types";
import DecisionCard from "../components/decisionCard";
import MessageBubble from "../components/messageBubble";
import SafetySheet from "../components/safetySheet";
import { MAX_MESSAGE_LENGTH, useConversation } from "../hooks/useConversation";
import { sparksFor } from "../sparks";
import OutcomeScreen from "./outcomeScreen";

interface Props {
  matchId: string;
  initial?: Match | null;
  onBack: () => void;
  onNewConnection: () => void;
  onGarden: () => void;
}

function subtitleFor(match: Match) {
  if (match.status === "bloomed") return "Conexión florecida";
  if (match.status === "closed") return "Conversación cerrada";
  const mood = MOODS.find((m) => m.id === match.partner.mood);
  const day = `Día ${Math.min(match.day, CHAT_DAYS)} de ${CHAT_DAYS}`;
  return mood ? `${day} · hoy se siente ${mood.label.toLowerCase()}` : day;
}

export default function ConversationScreen({
  matchId,
  initial,
  onBack,
  onNewConnection,
  onGarden,
}: Props) {
  const {
    match,
    setMatch,
    messages,
    loading,
    error,
    sendError,
    reload,
    send,
    retry,
    react,
  } = useConversation(matchId, initial);
  const [text, setText] = useState("");
  const [tone, setTone] = useState<ToneId | null>(null);
  const [toneOpen, setToneOpen] = useState(false);
  const [reactingId, setReactingId] = useState<string | null>(null);
  const knownAtLoad = useRef<Set<string> | null>(null);
  const nearBottom = useRef(true);
  const shownCount = useRef(0);
  const [round, setRound] = useState(0);
  const [safety, setSafety] = useState(false);
  const [review, setReview] = useState<{
    text: string;
    message: string;
    tone: ToneId | null;
  } | null>(null);
  const [blocked, setBlocked] = useState<string | null>(null);
  const [grew, setGrew] = useState(false);
  const [outcome, setOutcome] = useState<Match | null>(null);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const onGrow = useCallback(() => {
    setGrew(true);
    setTimeout(() => setGrew(false), 2600);
  }, []);

  useEffect(() => {
    if (!loading && !knownAtLoad.current) {
      knownAtLoad.current = new Set(messages.map((m) => m.id));
    }
  }, [loading, messages]);

  const lastReceivedId = useMemo(
    () => [...messages].reverse().find((m) => !m.fromMe)?.id,
    [messages],
  );

  const sparks = useMemo(
    () => (match ? sparksFor(match, messages.length > 0, round) : []),
    [match, messages.length, round],
  );

  if (outcome) {
    return (
      <OutcomeScreen
        match={outcome}
        onKeepTalking={() => {
          setMatch(outcome);
          setOutcome(null);
        }}
        onNewConnection={onNewConnection}
        onGarden={onGarden}
      />
    );
  }

  if (!match) {
    return (
      <Container center>
        {error ? (
          <View className="gap-4">
            <Banner tone="error" message={error} />
            <Button onPress={reload}>Intentar de nuevo</Button>
            <Button variant="outlined" onPress={onBack}>
              Volver
            </Button>
          </View>
        ) : (
          <ActivityIndicator color={colors.primary["dark-hover"]} />
        )}
      </Container>
    );
  }

  const ended = ["closed", "rested", "waiting"].includes(match.status);
  const deciding = match.status === "deciding";
  const writableToday =
    match.status === "bloomed" ||
    ((match.status === "active" || deciding) && match.day <= CHAT_DAYS);
  const canSend = match.canWrite && text.trim().length > 0;
  const canReact = !ended;
  const chosenTone = toneById(tone);

  const submit = async (value = text, confirmed = false, withTone = tone) => {
    if (!match.canWrite || !value.trim()) return;
    setText("");
    setTone(null);
    setToneOpen(false);
    setReview(null);
    setBlocked(null);
    nearBottom.current = true;
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 60);
    const outcome = await send(value, confirmed, withTone);
    if (outcome?.kind === "review") {
      setText(value);
      setTone(withTone);
      setReview({ text: value, message: outcome.message, tone: withTone });
    } else if (outcome?.kind === "blocked") {
      setText(value);
      setTone(withTone);
      setBlocked(outcome.message);
    }
  };

  return (
    <Container
      flush
      padded={false}
      footer={
        <View className="gap-3 px-5">
          {sendError && <Banner tone="info" message={sendError} />}
          {blocked && <Banner tone="error" message={blocked} />}

          {deciding && (
            <DecisionCard
              match={match}
              onDecided={(updated) => {
                setMatch(updated);
                setOutcome(updated);
              }}
            />
          )}

          {ended && (
            <View className="gap-3">
              <Banner
                tone="info"
                message={
                  match.status === "closed"
                    ? "Esta conversación se cerró. Gracias por el tiempo que compartiste."
                    : "Esta conversación ya terminó. Su planta queda en tu jardín."
                }
              />
              <Button variant="outlined" onPress={onBack}>
                Volver
              </Button>
            </View>
          )}

          {writableToday && (
            <>
              {match.canWrite && toneOpen && (
                <Animated.View entering={FadeIn.duration(200)} className="w-full">
                  <View className="mb-1.5 flex-row items-center justify-between">
                    <Text variant="caption1" className="text-primary-dark-hover">
                      ¿Con qué tono lo dices?
                    </Text>
                    <Pressable
                      onPress={() => setToneOpen(false)}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel="Cerrar los tonos"
                    >
                      <Ionicons name="close" size={18} color={colors.primary["dark-hover"]} />
                    </Pressable>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="w-full grow-0"
                    contentContainerClassName="gap-2"
                    accessibilityRole="radiogroup"
                  >
                    {TONES.map((t) => {
                      const selected = tone === t.id;
                      return (
                        <PressableScale
                          key={t.id}
                          scaleTo={0.93}
                          onPress={() => {
                            setTone(selected ? null : t.id);
                            setToneOpen(false);
                          }}
                          accessibilityRole="radio"
                          accessibilityState={{ selected }}
                          className="min-h-[40px] flex-row items-center gap-1.5 rounded-chip px-3.5"
                          style={{
                            backgroundColor: t.bg,
                            borderColor: selected ? t.ink : t.border,
                            borderWidth: selected ? 2 : 1,
                          }}
                        >
                          <Ionicons name={t.icon} size={15} color={t.ink} />
                          <Text variant="caption1" style={{ color: t.ink }}>
                            {t.label}
                          </Text>
                        </PressableScale>
                      );
                    })}
                  </ScrollView>
                </Animated.View>
              )}

              {match.canWrite && !toneOpen && text.length === 0 && sparks.length > 0 && (
                <View className="w-full">
                  <View className="mb-1.5 flex-row items-center justify-between">
                    <Text variant="caption1" className="text-primary-dark-hover">
                      {messages.length === 0
                        ? "Ideas para romper el hielo"
                        : "¿No sabes qué decir?"}
                    </Text>
                    <Pressable
                      onPress={() => setRound((r) => r + 1)}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel="Ver otras ideas"
                      className="flex-row items-center gap-1"
                    >
                      <Ionicons
                        name="refresh"
                        size={14}
                        color={colors.primary["dark-hover"]}
                      />
                      <Text variant="caption1" className="text-primary-dark-hover">
                        Otras
                      </Text>
                    </Pressable>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="w-full grow-0"
                    contentContainerClassName="gap-2"
                  >
                    {sparks.map((idea) => (
                      <Pressable
                        key={idea}
                        onPress={() => setText(idea)}
                        accessibilityRole="button"
                        accessibilityHint="Pone esta idea en tu mensaje para que la edites"
                        className="max-w-[240px] min-h-[40px] justify-center rounded-chip border border-tertiary-normal bg-tertiary-light px-3.5 py-2"
                      >
                        <Text
                          variant="caption1"
                          numberOfLines={2}
                          className="text-tertiary-darker"
                        >
                          {idea}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}

              {match.canWrite && chosenTone && !toneOpen && (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  className="-mb-1 flex-row items-center self-start rounded-chip pl-3"
                  style={{
                    backgroundColor: chosenTone.bg,
                    borderColor: chosenTone.border,
                    borderWidth: 1,
                  }}
                >
                  <Ionicons name={chosenTone.icon} size={14} color={chosenTone.ink} />
                  <Text variant="caption1" className="ml-1.5" style={{ color: chosenTone.ink }}>
                    {chosenTone.label}
                  </Text>
                  <Pressable
                    onPress={() => setTone(null)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={`Quitar el tono "${chosenTone.label}"`}
                    className="ml-0.5 h-8 w-8 items-center justify-center"
                  >
                    <Ionicons name="close" size={14} color={chosenTone.ink} />
                  </Pressable>
                </Animated.View>
              )}

              {match.canWrite ? (
                <View className="flex-row items-end rounded-[24px] border border-primary-light-active bg-white px-1.5">
                  <PressableScale
                    scaleTo={0.88}
                    onPress={() => setToneOpen((open) => !open)}
                    accessibilityRole="button"
                    accessibilityLabel="Elegir el tono del mensaje"
                    accessibilityState={{ expanded: toneOpen }}
                    className="my-1.5 mr-1 h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: chosenTone ? chosenTone.bg : colors.primary.light,
                    }}
                  >
                    <Ionicons
                      name={chosenTone ? chosenTone.icon : "color-palette-outline"}
                      size={20}
                      color={chosenTone ? chosenTone.ink : colors.primary["dark-hover"]}
                    />
                  </PressableScale>
                  <TextInput
                    value={text}
                    onChangeText={(value) => {
                      setText(value);
                      setBlocked(null);
                    }}
                    placeholder={
                      chosenTone
                        ? `Escribe algo ${chosenTone.hint}…`
                        : "Escribe algo que cuente…"
                    }
                    placeholderTextColor={colors.primary["dark-hover"]}
                    maxLength={MAX_MESSAGE_LENGTH}
                    multiline
                    accessibilityLabel="Escribe un mensaje"
                    className="max-h-28 min-h-[48px] flex-1 py-3 font-body text-body2 text-primary-dark-active"
                    style={{ outlineStyle: "none" } as object}
                  />
                  <PressableScale
                    scaleTo={0.88}
                    onPress={() => submit()}
                    disabled={!canSend}
                    accessibilityRole="button"
                    accessibilityLabel="Enviar mensaje"
                    accessibilityState={{ disabled: !canSend }}
                    className={`my-1.5 h-10 w-10 items-center justify-center rounded-full ${
                      canSend
                        ? "bg-primary-normal active:bg-primary-normal-hover"
                        : "bg-primary-light-active"
                    }`}
                  >
                    <Ionicons
                      name="send"
                      size={17}
                      color={canSend ? colors.primary.darker : colors.primary.normal}
                    />
                  </PressableScale>
                </View>
              ) : (
                <View className="flex-row items-center gap-2 rounded-field bg-secondary-light-active px-4 py-3">
                  <Ionicons
                    name="moon-outline"
                    size={18}
                    color={colors.secondary["dark-active"]}
                  />
                  <Text variant="caption1" className="flex-1 text-secondary-dark-active">
                    Ya compartiste tus mensajes de hoy. Mañana podrás escribir
                    de nuevo.
                  </Text>
                </View>
              )}

              {match.canWrite && (
                <Text
                  variant="caption2"
                  className="text-center text-primary-dark-hover"
                  accessibilityLiveRegion="polite"
                >
                  {`Te quedan ${match.messagesLeft} de ${MESSAGES_PER_DAY} mensajes hoy${
                    text.length > MAX_MESSAGE_LENGTH - 80
                      ? ` · ${MAX_MESSAGE_LENGTH - text.length} caracteres`
                      : ""
                  }`}
                </Text>
              )}
            </>
          )}
        </View>
      }
    >
      <View className="flex-row items-center gap-3 px-5 py-2">
        <Pressable
          onPress={onBack}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          className="h-10 w-10 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={22} color={colors.primary["dark-hover"]} />
        </Pressable>
        <Avatar
          config={match.partner.avatar}
          mood={match.partner.mood}
          size={44}
          label={`Avatar de ${match.partner.username}`}
        />
        <View className="flex-1">
          <Text variant="subtitle2" numberOfLines={1}>
            {match.partner.username}
          </Text>
          <Text variant="caption1" className="text-primary-dark-hover">
            {subtitleFor(match)}
          </Text>
        </View>
        {!ended && (
          <Pressable
            onPress={() => setSafety(true)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Opciones de seguridad"
            className="h-10 w-10 items-center justify-center"
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color={colors.primary["dark-hover"]}
            />
          </Pressable>
        )}
      </View>

      <View className="flex-row items-center gap-4 border-b border-primary-light-active px-6 pb-3">
        <GrowthPlant stage={match.stage} size={72} onGrow={onGrow} />
        <View className="flex-1">
          {grew ? (
            <Animated.View key="grew" entering={FadeIn}>
              <Text variant="body3" className="text-secondary-dark-active">
                ¡Su planta creció!
              </Text>
              <Text variant="caption1" className="text-secondary-dark-active">
                Hoy ambos se escribieron.
              </Text>
            </Animated.View>
          ) : (
            <Animated.View key="stage" entering={FadeIn}>
              <Text variant="body3" className="text-primary-dark-active">
                {STAGE_NAMES[match.stage]}
              </Text>
              <Text variant="caption1" className="text-primary-dark-hover">
                {match.status === "bloomed"
                  ? "Su flor sigue viva mientras conversen."
                  : "Crece cada día en que ambos se escriben."}
              </Text>
            </Animated.View>
          )}
        </View>
      </View>

      {error && (
        <View className="px-5 pt-2">
          <Banner tone="error" message={error} actionLabel="Reintentar" onAction={reload} />
        </View>
      )}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary["dark-hover"]} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.localKey ?? m.id}
          extraData={reactingId}
          className="flex-1"
          contentContainerClassName="grow px-5 pt-3"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={100}
          onScroll={(e) => {
            const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
            nearBottom.current =
              contentSize.height - contentOffset.y - layoutMeasurement.height < 80;
          }}
          onScrollBeginDrag={() => setReactingId(null)}
          onContentSizeChange={() => {
            // Solo baja al final si llegó un mensaje o ya estabas abajo: abrir reacciones más arriba no te mueve.
            const arrived = messages.length !== shownCount.current;
            if (nearBottom.current || arrived) {
              shownCount.current = messages.length;
              listRef.current?.scrollToEnd({ animated: false });
            }
            // Las animaciones de entrada terminan de acomodar la burbuja un poco después.
            if (arrived) {
              setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 450);
            }
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-6 py-6">
              <Text variant="body3" className="text-center text-primary-dark-hover">
                {`Saluda a ${match.partner.username}. Una pregunta abierta sobre algo que compartan es un buen comienzo.`}
              </Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const prev = messages[index - 1];
            const newDay = !prev || prev.day !== item.day;
            return (
              <>
                {newDay && (
                  <Text
                    variant="caption2"
                    className="my-2 self-center rounded-chip bg-primary-light-active px-3 py-1 text-primary-dark-hover"
                  >
                    {item.day > CHAT_DAYS ? "Seguimos conversando" : `Día ${item.day}`}
                  </Text>
                )}
                <MessageBubble
                  message={item}
                  partnerName={match.partner.username}
                  fresh={!!knownAtLoad.current && !knownAtLoad.current.has(item.id)}
                  canReact={canReact}
                  picking={reactingId === item.id}
                  showReactButton={item.id === lastReceivedId}
                  onTogglePicker={(id) =>
                    setReactingId((current) => (current === id ? null : id))
                  }
                  onReact={(id, reaction) => {
                    setReactingId(null);
                    react(id, reaction);
                  }}
                  onRetry={retry}
                />
              </>
            );
          }}
        />
      )}

      <Sheet
        visible={!!review}
        title="¿Lo reformulamos?"
        message={review?.message}
        onClose={() => setReview(null)}
      >
        <View className="mb-4 rounded-field bg-white px-4 py-3">
          <Text variant="body3" className="text-primary-dark-active">
            {review?.text}
          </Text>
        </View>
        <Text variant="caption1" className="mb-4 text-primary-dark-hover">
          Las palabras amables hacen que la conversación florezca. Tómate un
          momento: lo que escribes llega a una persona real.
        </Text>
        <View className="gap-3">
          <Button icon="create-outline" iconPosition="left" onPress={() => setReview(null)}>
            Editar mensaje
          </Button>
          <Button
            variant="outlined"
            onPress={() => review && submit(review.text, true, review.tone)}
          >
            Enviar igual
          </Button>
        </View>
      </Sheet>

      <SafetySheet
        visible={safety}
        matchId={match.id}
        partnerName={match.partner.username}
        onClose={() => setSafety(false)}
        onEnded={() =>
          setOutcome({ ...match, status: "closed", canWrite: false })
        }
      />
    </Container>
  );
}

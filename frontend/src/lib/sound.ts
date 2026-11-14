import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";
import { Platform } from "react-native";
import type { MoodId } from "../constants/emotions";
import { soundSettings } from "../store/soundSettings";
import { haptics } from "./haptics";

// Sonidos sintetizados con scripts/generateSounds.py.
const SOURCES = {
  grow: require("../../assets/sounds/grow.wav"),
  bloom: require("../../assets/sounds/bloom.wav"),
  match: require("../../assets/sounds/match.wav"),
  send: require("../../assets/sounds/send.wav"),
  receive: require("../../assets/sounds/receive.wav"),
  react: require("../../assets/sounds/react.wav"),
  "mood-happy": require("../../assets/sounds/mood-happy.wav"),
  "mood-good": require("../../assets/sounds/mood-good.wav"),
  "mood-okay": require("../../assets/sounds/mood-okay.wav"),
  "mood-bad": require("../../assets/sounds/mood-bad.wav"),
  "mood-awful": require("../../assets/sounds/mood-awful.wav"),
  "breathe-in": require("../../assets/sounds/breathe-in.wav"),
  "breathe-out": require("../../assets/sounds/breathe-out.wav"),
  "breathe-done": require("../../assets/sounds/breathe-done.wav"),
  memory: require("../../assets/sounds/memory.wav"),
} as const;

export type SoundName = keyof typeof SOURCES;

export const MOOD_SOUND: Record<MoodId, SoundName> = {
  feliz: "mood-happy",
  bien: "mood-good",
  normal: "mood-okay",
  mal: "mood-bad",
  fatal: "mood-awful",
};

const VOLUME = 0.55;
const players = new Map<SoundName, AudioPlayer>();
let configured = false;

const playerFor = (name: SoundName) => {
  let player = players.get(name);
  if (!player) {
    player = createAudioPlayer(SOURCES[name]);
    player.volume = VOLUME;
    players.set(name, player);
  }
  return player;
};

// En web, el navegador no deja sonar nada hasta que la persona toca la página.
const blockedOnWeb = () =>
  Platform.OS === "web" &&
  typeof navigator !== "undefined" &&
  (navigator as { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive === false;

// Los momentos con sonido también vibran un poco (aunque el sonido esté apagado): éxito al crecer,
// florecer o encontrar a alguien; un toque leve en lo demás. Abrir un recuerdo no vibra.
const SUCCESS = new Set<string>(["grow", "bloom", "match", "breathe-done"]);

export function playSound(name: SoundName) {
  if (name !== "memory") (SUCCESS.has(name) ? haptics.success : haptics.tap)();
  if (!soundSettings.enabled() || blockedOnWeb()) return;
  try {
    if (!configured) {
      configured = true;
      // Suena junto a la música de la persona sin pausarla, y respeta el modo silencio de iOS.
      setAudioModeAsync({ playsInSilentMode: false, interruptionMode: "mixWithOthers" }).catch(
        () => undefined,
      );
    }
    const player = playerFor(name);
    player.seekTo(0).catch(() => undefined);
    player.play();
  } catch {}
}

// Carga los sonidos de antes para que el primero no llegue tarde.
export function preloadSounds(names: SoundName[]) {
  if (!soundSettings.enabled()) return;
  try {
    names.forEach(playerFor);
  } catch {}
}

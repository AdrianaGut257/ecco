import type { ToneId } from "../constants/tones";
import type { MoodId } from "../constants/emotions";

export type Swatch = "1" | "2" | "3" | "4" | "5" | "6";

export type HairStyle =
  | "flip"
  | "bob"
  | "long"
  | "wavy"
  | "halfBun"
  | "bun"
  | "pixie"
  | "curly"
  | "layered"
  | "blunt"
  | "straight"
  | "volume"
  | "classic"
  | "sidePart"
  | "fringe"
  | "shortWaves"
  | "spiky"
  | "shaggy"
  | "curtains"
  | "quiff"
  | "afro"
  | "bald";
export type Bangs =
  | "lock"
  | "swept"
  | "wispy"
  | "middle"
  | "full"
  | "short"
  | "straightCut"
  | "choppy"
  | "sweep"
  | "tuft"
  | "parted"
  | "messyFringe"
  | "waves"
  | "spiky"
  | "shaggy"
  | "curtains"
  | "sideFringe"
  | "quiff"
  | "curls"
  | "none";
export type Glasses = "none" | "round" | "square" | "wide";
export type Earrings = "none" | "hoops" | "small" | "studs";
export type FacialHair = "none" | "goatee" | "full" | "chinstrap" | "short";
export type Outfit =
  | "tee"
  | "tank"
  | "strap"
  | "vneck"
  | "shirt"
  | "tie"
  | "vneckWide"
  | "raglan"
  | "jersey"
  | "hoodie"
  | "hoodieLight"
  | "crew";
export type AvatarKind = "girl" | "boy";
export type BackgroundColor = Swatch | "7";
export type TopColor =
  | Swatch
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15";

export interface AvatarConfig {
  kind: AvatarKind;
  skin: Swatch;
  hair: HairStyle;
  bangs: Bangs;
  hairColor: Swatch;
  facialHair: FacialHair;
  glasses: Glasses;
  earrings: Earrings;
  headband: boolean;
  freckles: boolean;
  mole: boolean;
  outfit: Outfit;
  top: TopColor;
  background: BackgroundColor;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: AvatarConfig;
  interests: string[];
  interestDetails: InterestDetails;
  shareMood: boolean;
  onboarded: boolean;
}

export type InterestDetails = Record<string, Record<string, string[]>>;

export interface AuthSession {
  accessToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export interface ProfilePatch {
  username?: string;
  avatar?: AvatarConfig;
  interests?: string[];
  interestDetails?: InterestDetails;
  termsAccepted?: boolean;
  shareMood?: boolean;
}

export type MatchStatus =
  | "active"
  | "deciding"
  | "waiting"
  | "bloomed"
  | "rested"
  | "closed";

export interface Partner {
  username: string;
  avatar: AvatarConfig;
  mood: MoodId | null;
}

export interface SharedFavorite {
  interest: string;
  kind: "subtopic" | "item";
  label: string;
}

export interface Match {
  id: string;
  partner: Partner;
  commonInterests: { category: string; items: string[] }[];
  sharedFavorites: SharedFavorite[];
  hobbies: string[];
  startedAt: string;
  day: number;
  stage: number;
  status: MatchStatus;
  canWrite: boolean;
  messagesLeft: number;
}

export interface SearchState {
  status: "idle" | "searching" | "matched";
  match: Match | null;
  hobbies: string[];
}

export interface ChatMessage {
  id: string;
  matchId: string;
  text: string;
  fromMe: boolean;
  day: number;
  createdAt: string;
  tone?: ToneId | null;
  reaction?: MoodId | null;
  reactedAt?: string | null;
  // Clave estable en la lista: el borrador conserva la suya cuando el servidor le da su id real.
  localKey?: string;
  status: "sent" | "sending" | "failed";
}

export interface MoodEntry {
  mood: MoodId;
  createdAt: string;
}

export type MatchDecision = "continue" | "leave";

export type ReportReason = "ofensivo" | "acoso" | "spam" | "incomodo" | "otro";

export interface GardenEntry {
  id: string;
  partnerName: string;
  partnerAvatar: AvatarConfig;
  stage: number;
  status: MatchStatus;
  startedAt: string;
}

export interface Suggestion {
  name: string;
  description: string | null;
}

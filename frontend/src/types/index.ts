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
  | "volume";
export type Bangs =
  | "lock"
  | "swept"
  | "wispy"
  | "middle"
  | "full"
  | "short"
  | "straightCut"
  | "choppy"
  | "sweep";
export type Glasses = "none" | "round" | "square" | "wide";
export type Earrings = "none" | "hoops" | "small" | "studs";
export type Outfit = "tee" | "tank" | "strap" | "vneck";

export interface AvatarConfig {
  skin: Swatch;
  hair: HairStyle;
  bangs: Bangs;
  hairColor: Swatch;
  glasses: Glasses;
  earrings: Earrings;
  headband: boolean;
  freckles: boolean;
  mole: boolean;
  outfit: Outfit;
  top: Swatch;
  background: Swatch;
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

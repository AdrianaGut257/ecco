import type { MoodId } from "../constants/emotions";

export interface User {
  id: string;
  username: string;
  email: string;
  avatarId: string;
  interests: string[];
}

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

export interface Match {
  id: string;
  partner: { username: string; avatarId: string };
  commonInterests: { category: string; items: string[] }[];
  startedAt: string;
  day: number;
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

export interface GardenEntry {
  id: string;
  partnerName: string;
  stage: number;
  startedAt: string;
}

import type { UpdateGeneralPreferencesInput, UpdateProfileInput } from "./schema";

export interface ProfileWithStats {
  id: string;
  email: string;
  fullName: string | null;
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isPublic: boolean;
  defaultCurrency: string;
  aiAutoPropose: boolean;
  emailNotifications: boolean;
  offlineMode: boolean;
  travelPreferences: string | null;
  createdAt: string;
  totalTrips: number;
  publishedTrips: number;
  publishedTemplates?: number;
  publishedStories: number;
  forumDiscussions: number;
  tier: "free" | "pro";
  tripsQuota: number;
  tripsRemaining: number;
  aiCreditsUsed: number;
  aiCreditsQuota: number;
  aiCreditsRemaining: number;
}

export interface TopBarUserInfo {
  name: string;
  email: string | null;
  avatarUrl: string | null;
  username: string | null;
  tier?: "free" | "pro";
  defaultCurrency?: string;
  totalTrips?: number;
  memberSince?: string;
}

export type { UpdateGeneralPreferencesInput, UpdateProfileInput };

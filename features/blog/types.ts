import type { StoryStatus } from "./constants";

export type { StoryStatus };

export interface StoryLinkedTrip {
  id: string;
  title: string;
  destination: string | null;
  coverImageUrl?: string | null;
  isPublic?: boolean;
}

export interface StoryAuthorProfile {
  fullName: string | null;
  username: string | null;
  avatarUrl: string | null;
  isPublic: boolean;
  bio?: string | null;
}

export interface StoryItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content?: string;
  coverImageUrl: string | null;
  images?: string[];
  tags: string[];
  status?: StoryStatus;
  upvotes?: number | null;
  hasLiked?: boolean;
  publishedAt: Date | string | null;
  updatedAt?: Date | string;
  profile?: StoryAuthorProfile | null;
  linkedTrip?: StoryLinkedTrip | null;
}

export type StoryCardItem = StoryItem;

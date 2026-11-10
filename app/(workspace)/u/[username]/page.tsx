import type { Metadata } from "next";
import Link from "next/link";

import { User } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  CreatorProfileView,
  getPublicCreatorProfile,
} from "@/features/profile";

interface PublicProfilePageProps {
  params: Promise<{ username: string }>;
}

export const metadata: Metadata = {
  title: "Creator Profile",
  description: "Explore public travel creator profiles, shared itineraries, stories, and discussions on Prava.",
};

export default async function PublicCreatorProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;
  const res = await getPublicCreatorProfile(username);

  if (!res.success || !res.creator) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-4">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <User className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Profile Not Available</h1>
        <p className="text-xs text-muted-foreground">
          The creator profile <span className="font-semibold text-foreground">@{username}</span> either does not exist or has set their profile to private.
        </p>
        <div className="pt-2 flex justify-center gap-2">
          <Link href="/forum">
            <Button size="sm">Explore Forum</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="border-border">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <CreatorProfileView creator={res.creator} />;
}

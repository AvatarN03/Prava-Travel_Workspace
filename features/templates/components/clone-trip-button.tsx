"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { cloneTripTemplate } from "../actions";

interface CloneTripButtonProps {
  tripId: string;
  tripTitle?: string;
}

export function CloneTripButton({ tripId, tripTitle }: CloneTripButtonProps) {
  const router = useRouter();
  const [isCloning, startCloning] = useTransition();

  const handleClone = () => {
    startCloning(async () => {
      const res = await cloneTripTemplate(tripId);
      if (res.success && res.tripId) {
        toast.success(
          tripTitle
            ? `Cloned "${tripTitle}" to your workspace!`
            : "Trip cloned to your workspace!"
        );
        router.push(`/trips/${res.tripId}/overview`);
      } else {
        toast.error(res.error || "Failed to clone trip. Please sign in.");
      }
    });
  };

  return (
    <Button
      type="button"
      size="sm"
      className="h-7 px-2.5 text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
      onClick={handleClone}
      disabled={isCloning}
    >
      {isCloning ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
      Clone to My Trips
    </Button>
  );
}

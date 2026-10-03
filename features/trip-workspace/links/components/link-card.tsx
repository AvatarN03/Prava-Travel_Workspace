"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Compass,
  Copy,
  ExternalLink,
  Globe,
  Home,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plane,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditLinkDialog } from "./edit-link-dialog";

import { deleteLink } from "../actions";

import type { Link as PrismaLink } from "@prisma/client";

interface LinkCardProps {
  item: PrismaLink;
}

export function LinkCard({ item }: LinkCardProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async () => {
    const res = await deleteLink({ id: item.id, tripId: item.tripId! });
    if (res.success) {
      toast.success("Bookmark deleted.");
      setIsDeleteOpen(false);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete bookmark.");
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(item.url);
    toast.success("URL copied to clipboard!");
  };

  const getDomainInfo = (urlStr: string) => {
    try {
      const u = new URL(urlStr);
      const host = u.hostname.toLowerCase().replace(/^www\./, "");

      if (host.includes("google.com") && u.pathname.includes("maps")) {
        return { label: "Google Maps", host, icon: MapPin, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
      }
      if (host.includes("airbnb")) {
        return { label: "Airbnb", host, icon: Home, color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20" };
      }
      if (host.includes("booking.com")) {
        return { label: "Booking.com", host, icon: Home, color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20" };
      }
      if (host.includes("tripadvisor")) {
        return { label: "TripAdvisor", host, icon: Compass, color: "text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20" };
      }
      if (host.includes("skyscanner") || host.includes("kayak") || host.includes("expedia") || host.includes("airline")) {
        return { label: "Flights/Travel", host, icon: Plane, color: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20" };
      }

      return { label: host, host, icon: Globe, color: "text-[#2D9BF0] bg-[#2D9BF0]/10 border-[#2D9BF0]/20" };
    } catch {
      return { label: "External Link", host: "external", icon: Globe, color: "text-[#2D9BF0] bg-[#2D9BF0]/10 border-[#2D9BF0]/20" };
    }
  };

  const domainInfo = getDomainInfo(item.url);
  const DomainIcon = domainInfo.icon;

  return (
    <>
      <div className="group relative flex flex-col justify-between p-4 rounded-sm border border-border/80 bg-card hover:border-[#2D9BF0]/50 hover:shadow-2xs transition-all duration-200">
        <div className="space-y-2.5 flex-1">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`inline-flex items-center gap-1 text-[10px] font-medium border rounded-xs px-2 py-0.5 ${domainInfo.color}`}>
                  <DomainIcon className="w-2.5 h-2.5" />
                  <span className="truncate max-w-[130px]">{domainInfo.label}</span>
                </span>
                {item.category && (
                  <Badge variant="outline" className="text-[10px] rounded-xs px-1.5 py-0 border-border/60">
                    {item.category}
                  </Badge>
                )}
              </div>

              <h4 className="text-sm font-bold text-foreground leading-snug line-clamp-1 pt-0.5 tracking-tight">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2D9BF0] hover:underline transition-colors"
                >
                  {item.title}
                </a>
              </h4>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer -mr-1 -mt-1 rounded-xs"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-sm">
                <DropdownMenuItem onClick={handleCopyUrl} className="cursor-pointer text-xs">
                  <Copy className="h-3.5 w-3.5 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="cursor-pointer text-xs">
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Edit Bookmark
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsDeleteOpen(true)}
                  className="text-destructive focus:text-destructive cursor-pointer text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete Bookmark
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Footer Link & Copy */}
        <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="text-muted-foreground hover:text-foreground text-[11px] inline-flex items-center gap-1 font-medium cursor-pointer"
            title="Copy URL"
          >
            <Copy className="w-3 h-3" />
            <span className="font-mono text-[10px] truncate max-w-[120px]">{domainInfo.host}</span>
          </button>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#2D9BF0] hover:underline text-xs"
          >
            <span>Visit Link</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <EditLinkDialog
        item={item}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <ConfirmDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Reference Link"
        description={`Are you sure you want to delete "${item.title}"?`}
        onConfirm={handleDelete}
      />
    </>
  );
}

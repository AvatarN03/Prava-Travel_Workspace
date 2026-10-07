"use client";

import { useMemo, useState } from "react";

import {
  Bookmark,
  ExternalLink,
  Globe,
  Link2,
  Plus,
  Search,
  Tag,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AddLinkDialog } from "./add-link-dialog";
import { ImportFromVaultDialog } from "./import-from-vault-dialog";
import { LinkCard } from "./link-card";

import type { Link as PrismaLink } from "@prisma/client";

interface LinksGridProps {
  tripId: string;
  items: PrismaLink[];
}

export function LinksGrid({ tripId, items }: LinksGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const categories = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.category || "Other")));
  }, [items]);

  const domainCount = useMemo(() => {
    const domains = new Set<string>();
    items.forEach((item) => {
      try {
        const u = new URL(item.url);
        domains.add(u.hostname.replace(/^www\./, ""));
      } catch {
        // ignore
      }
    });
    return domains.size;
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((link) => {
      const matchesSearch =
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (link.description &&
          link.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat =
        categoryFilter === "ALL" ? true : (link.category || "Other") === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [items, searchQuery, categoryFilter]);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Reference Vault
              </span>
              <span className="text-muted-foreground/40 text-xs">•</span>
              <span className="text-[11px] font-mono text-muted-foreground">0 bookmarks</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">
              Reference Vault · <span className="italic font-normal">Links & Confirmations</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              Bookmark blogs, hotel listings, Google Maps pins, transit trackers, and ticket confirmation URLs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ImportFromVaultDialog
              tripId={tripId}
              existingUrls={items.map((i) => i.url)}
            />
            <AddLinkDialog
              tripId={tripId}
              trigger={
                <Button size="sm" className="h-9 gap-1.5 text-xs font-semibold rounded-sm cursor-pointer shadow-2xs">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Link</span>
                </Button>
              }
            />
          </div>
        </div>

        {/* Empty State Card */}
        <Card className="rounded-sm border border-dashed border-border/80 p-12 text-center bg-card/40 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-3 text-muted-foreground">
            <Link2 className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-base font-bold text-foreground">No bookmarks saved yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Save travel blogs, Airbnb listings, booking references, or transit maps to access everything with one click.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-6">
            <ImportFromVaultDialog
              tripId={tripId}
              existingUrls={items.map((i) => i.url)}
            />
            <AddLinkDialog
              tripId={tripId}
              trigger={
                <Button size="sm" className="h-9 gap-1.5 text-xs font-semibold rounded-sm cursor-pointer shadow-2xs">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Link</span>
                </Button>
              }
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Editorial Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground dark:text-zinc-400 font-semibold">
              Reference Vault
            </span>
            <span className="text-muted-foreground/40 dark:text-zinc-600 text-xs">•</span>
            <span className="text-[11px] font-mono text-muted-foreground dark:text-zinc-400">
              {items.length} {items.length === 1 ? "bookmark" : "bookmarks"} saved
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-zinc-100 font-serif">
            Reference Vault · <span className="italic font-normal">Links & Confirmations</span>
          </h1>
          <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-1 max-w-xl">
            Bookmark blogs, hotel listings, Google Maps pins, transit trackers, and ticket confirmation URLs.
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <ImportFromVaultDialog
            tripId={tripId}
            existingUrls={items.map((i) => i.url)}
          />

          <AddLinkDialog
            tripId={tripId}
            trigger={
              <Button
                size="sm"
                className="h-9 gap-1.5 text-xs font-semibold rounded-sm cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Link</span>
              </Button>
            }
          />
        </div>
      </div>

      {/* 3-Stat Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Card className="rounded-sm border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/40 transition-colors">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-primary" /> Total Bookmarks
          </span>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
              {items.length}
            </span>
            <span className="text-xs text-muted-foreground">links</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 truncate">
            Direct access to all external resources
          </p>
        </Card>

        <Card className="rounded-sm border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/40 transition-colors">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-primary" /> Unique Domains
          </span>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
              {domainCount}
            </span>
            <span className="text-xs text-muted-foreground">hosts</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 truncate">
            Across maps, booking engines, airlines, and blogs
          </p>
        </Card>

        <Card className="rounded-sm border border-border/80 bg-card p-4 shadow-2xs hover:border-primary/40 transition-colors">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-primary" /> Categories
          </span>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
              {categories.length}
            </span>
            <span className="text-xs text-muted-foreground">tags</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 truncate">
            {categories.slice(0, 3).join(", ") || "General"}
          </p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search links, URLs, descriptions..."
            className="pl-8.5 h-9 text-xs rounded-sm bg-background border-border text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 thin-scrollbar">
          <button
            type="button"
            onClick={() => setCategoryFilter("ALL")}
            className={`px-2.5 py-1 text-xs rounded-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              categoryFilter === "ALL"
                ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            All ({items.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 text-xs rounded-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Links Grid */}
      {filteredItems.length === 0 ? (
        <Card className="rounded-sm border border-dashed border-border/80 p-8 text-center bg-card/40">
          <p className="text-sm font-semibold text-foreground">No links found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search query or category filter.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((link) => (
            <LinkCard key={link.id} item={link} />
          ))}
        </div>
      )}
    </div>
  );
}

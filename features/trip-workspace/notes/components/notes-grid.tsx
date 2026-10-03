"use client";

import { useMemo, useState } from "react";

import {
  FileText,
  Pin,
  Plus,
  Search,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AddNoteDialog } from "./add-note-dialog";
import { NoteCard } from "./note-card";

import type { Note } from "@prisma/client";

interface NotesGridProps {
  tripId: string;
  items: Note[];
}

export function NotesGrid({ tripId, items }: NotesGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const categories = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.category || "General")));
  }, [items]);

  const pinnedCount = useMemo(() => {
    return items.filter((n) => n.isPinned).length;
  }, [items]);

  const filteredItems = useMemo(() => {
    return items
      .filter((note) => {
        const matchesSearch =
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat =
          categoryFilter === "ALL" ? true : (note.category || "General") === categoryFilter;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        // Pinned notes first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [items, searchQuery, categoryFilter]);

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Field Notes & Docs
              </span>
              <span className="text-muted-foreground/40 text-xs">•</span>
              <span className="text-[11px] font-mono text-muted-foreground">0 notes</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">
              Trip Notes · <span className="italic font-normal">Markdown & Advice</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              Keep custom packing guidelines, local customs, transit tips, and restaurant recommendations organized in one place.
            </p>
          </div>
          <AddNoteDialog
            tripId={tripId}
            trigger={
              <Button size="sm" className="h-9 gap-1.5 text-xs font-semibold rounded-sm bg-[#2D9BF0] hover:bg-[#2587d4] text-white cursor-pointer shadow-2xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Note</span>
              </Button>
            }
          />
        </div>

        {/* Empty State Card */}
        <Card className="rounded-sm border border-dashed border-border/80 p-12 text-center bg-card/40 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-3 text-muted-foreground">
            <FileText className="w-6 h-6 text-[#2D9BF0]" />
          </div>
          <h3 className="text-base font-bold text-foreground">No field notes yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Jot down hidden gem recommendations, train schedules, entry requirements, or packing notes with rich Markdown support.
          </p>
          <div className="mt-5">
            <AddNoteDialog
              tripId={tripId}
              trigger={
                <Button size="sm" className="h-8 gap-1.5 text-xs font-semibold rounded-sm bg-[#2D9BF0] hover:bg-[#2587d4] text-white cursor-pointer shadow-2xs">
                  <Plus className="w-3.5 h-3.5" />
                  Create First Note
                </Button>
              }
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Editorial Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Field Notes & Docs
            </span>
            <span className="text-muted-foreground/40 text-xs">•</span>
            <span className="text-[11px] font-mono text-muted-foreground">
              {items.length} {items.length === 1 ? "note" : "notes"} recorded
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">
            Trip Notes · <span className="italic font-normal">Markdown & Advice</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            Keep custom packing guidelines, local customs, transit tips, and restaurant recommendations organized in one place.
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <AddNoteDialog
            tripId={tripId}
            trigger={
              <Button
                size="sm"
                className="h-9 gap-1.5 text-xs font-semibold rounded-sm bg-[#2D9BF0] hover:bg-[#2587d4] text-white cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Note</span>
              </Button>
            }
          />
        </div>
      </div>

      {/* 3-Stat Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Card className="rounded-sm border border-border/80 bg-card p-4 shadow-2xs hover:border-[#2D9BF0]/40 transition-colors">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#2D9BF0]" /> Total Notes
          </span>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
              {items.length}
            </span>
            <span className="text-xs text-muted-foreground">documents</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 truncate">
            Across {categories.length} distinct {categories.length === 1 ? "category" : "categories"}
          </p>
        </Card>

        <Card className="rounded-sm border border-border/80 bg-card p-4 shadow-2xs hover:border-[#2D9BF0]/40 transition-colors">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Pin className="w-3.5 h-3.5 text-[#2D9BF0]" /> Pinned to Top
          </span>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
              {pinnedCount}
            </span>
            <span className="text-xs text-muted-foreground">high-priority</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 truncate">
            {pinnedCount > 0 ? "Highlighted at top of grid" : "No notes pinned yet"}
          </p>
        </Card>

        <Card className="rounded-sm border border-border/80 bg-card p-4 shadow-2xs hover:border-[#2D9BF0]/40 transition-colors">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#2D9BF0]" /> Primary Categories
          </span>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-lg font-bold tracking-tight text-foreground truncate">
              {categories.slice(0, 2).join(", ") || "General"}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 truncate">
            {categories.length > 2 ? `+${categories.length - 2} more categories` : "Quick reference tags"}
          </p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes content or title..."
            className="pl-8.5 h-9 text-xs rounded-sm bg-background border-border"
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
                ? "bg-[#2D9BF0] text-white font-semibold shadow-2xs"
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
                  ? "bg-[#2D9BF0] text-white font-semibold shadow-2xs"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredItems.length === 0 ? (
        <Card className="rounded-sm border border-dashed border-border/80 p-8 text-center bg-card/40">
          <p className="text-sm font-semibold text-foreground">No notes match your filters</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search query or reset the category filter.
          </p>
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("ALL");
              }}
              className="h-8 text-xs cursor-pointer"
            >
              Reset Filters
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((note) => (
            <NoteCard key={note.id} item={note} />
          ))}
        </div>
      )}
    </div>
  );
}

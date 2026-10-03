"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock,
  Filter,
  ListTodo,
  Loader2,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AddTaskDialog } from "./add-task-dialog";
import { TaskItem } from "./task-item";

import { useWorkspaceAi } from "../../context/workspace-ai-context";

import { generateAiChecklist, seedEssentialChecklist } from "../actions";

import type { ChecklistItem } from "@prisma/client";

interface ChecklistViewProps {
  tripId: string;
  items: ChecklistItem[];
}

export function ChecklistView({ tripId, items }: ChecklistViewProps) {
  const router = useRouter();
  const { setUserQuota } = useWorkspaceAi();
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "COMPLETED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSeeding, startSeeding] = useTransition();
  const [isAiGenerating, startAiGenerating] = useTransition();

  const completedCount = useMemo(() => {
    return items.filter((i) => i.isCompleted).length;
  }, [items]);

  const pendingCount = items.length - completedCount;

  const percentage = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.round((completedCount / items.length) * 100);
  }, [items, completedCount]);

  const readinessStatus = useMemo(() => {
    if (percentage === 100) return { label: "Ready for Departure", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
    if (percentage >= 80) return { label: "Final Touches", color: "text-sky-500 bg-sky-500/10 border-sky-500/20" };
    if (percentage >= 40) return { label: "Preparations Underway", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
    return { label: "Getting Started", color: "text-muted-foreground bg-muted/50 border-border" };
  }, [percentage]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesFilter =
        filter === "PENDING"
          ? !item.isCompleted
          : filter === "COMPLETED"
          ? item.isCompleted
          : true;
      const matchesSearch =
        searchQuery === ""
          ? true
          : item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [items, filter, searchQuery]);

  const groupedCategories = useMemo(() => {
    const map = new Map<string, ChecklistItem[]>();

    filteredItems.forEach((item) => {
      const cat = item.category || "General";
      const list = map.get(cat) || [];
      list.push(item);
      map.set(cat, list);
    });

    return Array.from(map.entries());
  }, [filteredItems]);

  const handleSeedEssentials = () => {
    startSeeding(async () => {
      const res = await seedEssentialChecklist(tripId);
      if (res.success) {
        if (res.count && res.count > 0) {
          toast.success(`Added ${res.count} essential travel tasks!`);
        } else {
          toast.info(res.message || "All starter essentials are already in your checklist.");
        }
        router.refresh();
      } else {
        toast.error(res.error || "Failed to add starter checklist");
      }
    });
  };

  const handleGenerateAi = () => {
    startAiGenerating(async () => {
      const res = await generateAiChecklist(tripId);
      if (res.success) {
        if (res.userQuota) {
          setUserQuota(res.userQuota);
        }
        if (res.count && res.count > 0) {
          toast.success(`Generated ${res.count} travel items (-${res.creditsCost || 3} credits)`);
        } else {
          toast.info(res.message || "All suggested items are already in your checklist.");
        }
        router.refresh();
      } else {
        toast.error(res.error || "Failed to generate AI checklist");
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-border/50 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground dark:text-zinc-400 font-semibold">
                Preparation Roadmap
              </span>
              <span className="text-muted-foreground/40 dark:text-zinc-600 text-xs">•</span>
              <span className="text-[11px] font-mono text-muted-foreground dark:text-zinc-400">0 tasks</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-zinc-100 font-serif">
              Checklist & Tasks · <span className="italic font-normal">Readiness & Packing</span>
            </h1>
            <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-1 max-w-xl">
              Stay on track with packing lists, visa applications, bookings, and pre-departure preparation.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateAi}
              disabled={isAiGenerating}
              className="h-9 gap-1.5 text-xs font-semibold rounded-sm border-[#2D9BF0]/40 text-[#2D9BF0] hover:bg-[#2D9BF0]/10 dark:bg-[#2D9BF0]/10 dark:hover:bg-[#2D9BF0]/20 cursor-pointer shadow-2xs"
            >
              {isAiGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#2D9BF0]" />}
              <span>AI Packing List</span>
              <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 bg-[#2D9BF0]/15 text-[#2D9BF0] font-mono">
                -3
              </Badge>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedEssentials}
              disabled={isSeeding}
              className="h-9 gap-1.5 text-xs font-medium rounded-sm border-border dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/60 cursor-pointer shadow-2xs hover:bg-muted/80"
            >
              {isSeeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckSquare className="w-3.5 h-3.5 text-muted-foreground dark:text-zinc-400" />}
              <span>Starter Essentials</span>
            </Button>
            <AddTaskDialog
              tripId={tripId}
              trigger={
                <Button size="sm" className="h-9 gap-1.5 text-xs font-semibold rounded-sm bg-[#2D9BF0] hover:bg-[#2587d4] text-white cursor-pointer shadow-2xs">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </Button>
              }
            />
          </div>
        </div>

        {/* Empty State Card */}
        <Card className="rounded-sm border border-dashed border-border/80 dark:border-zinc-800 p-12 text-center bg-card/40 dark:bg-[#0F131C] shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-muted/60 dark:bg-zinc-800/80 flex items-center justify-center mx-auto mb-3 text-muted-foreground">
            <CheckSquare className="w-6 h-6 text-[#2D9BF0]" />
          </div>
          <h3 className="text-base font-bold text-foreground dark:text-zinc-100">No checklist tasks created</h3>
          <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-1 max-w-md mx-auto">
            Stay on track with packing lists, passport validity checks, visa documents, and departure day reminders.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedEssentials}
              disabled={isSeeding}
              className="h-9 gap-1.5 text-xs font-semibold rounded-sm border-border dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/60 cursor-pointer hover:bg-muted/80 shadow-2xs"
            >
              {isSeeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#2D9BF0]" />}
              <span>Load 10 Essential Travel Tasks</span>
            </Button>
            <AddTaskDialog
              tripId={tripId}
              trigger={
                <Button size="sm" className="h-9 gap-1.5 text-xs font-semibold rounded-sm bg-[#2D9BF0] hover:bg-[#2587d4] text-white cursor-pointer shadow-2xs">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Custom Task</span>
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1 border-b border-border/50 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground dark:text-zinc-400 font-semibold">
              Preparation Roadmap
            </span>
            <span className="text-muted-foreground/40 dark:text-zinc-600 text-xs">•</span>
            <span className="text-[11px] font-mono text-muted-foreground dark:text-zinc-400">
              {completedCount} of {items.length} completed ({percentage}%)
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-zinc-100 font-serif">
            Checklist & Tasks · <span className="italic font-normal">Readiness & Packing</span>
          </h1>
          <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-1 max-w-xl">
            Keep track of gear packing, visa approvals, transit tickets, and pre-departure duties.
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap sm:flex-nowrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateAi}
            disabled={isAiGenerating}
            className="h-9 gap-1.5 text-xs font-semibold rounded-sm border-[#2D9BF0]/40 text-[#2D9BF0] hover:bg-[#2D9BF0]/10 dark:bg-[#2D9BF0]/10 dark:hover:bg-[#2D9BF0]/20 cursor-pointer shadow-2xs"
          >
            {isAiGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#2D9BF0]" />}
            <span>AI Packing List</span>
            <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 bg-[#2D9BF0]/15 text-[#2D9BF0] font-mono">
              -3
            </Badge>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedEssentials}
            disabled={isSeeding}
            className="h-9 gap-1.5 text-xs font-medium rounded-sm border-border dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/60 cursor-pointer hover:bg-muted/80 shadow-2xs"
          >
            {isSeeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckSquare className="w-3.5 h-3.5 text-muted-foreground dark:text-zinc-400" />}
            <span>+ Essentials</span>
          </Button>

          <AddTaskDialog
            tripId={tripId}
            trigger={
              <Button
                size="sm"
                className="h-9 gap-1.5 text-xs font-semibold rounded-sm bg-[#2D9BF0] hover:bg-[#2587d4] text-white cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </Button>
            }
          />
        </div>
      </div>

      {/* 3-Stat Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Card className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4 shadow-2xs hover:border-[#2D9BF0]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground dark:text-zinc-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2D9BF0]" /> Readiness Score
            </span>
            <span className={`text-[10px] font-medium border rounded-xs px-1.5 py-0.5 ${readinessStatus.color}`}>
              {readinessStatus.label}
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-foreground dark:text-zinc-100 tabular-nums">
              {percentage}%
            </span>
            <span className="text-xs text-muted-foreground dark:text-zinc-400">completed</span>
          </div>
          <div className="h-1.5 w-full rounded-xs bg-muted dark:bg-zinc-800 overflow-hidden mt-2.5">
            <div
              className={`h-full rounded-xs transition-all duration-300 ${
                percentage === 100 ? "bg-emerald-500" : percentage >= 50 ? "bg-[#2D9BF0]" : "bg-sky-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </Card>

        <Card className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4 shadow-2xs hover:border-[#2D9BF0]/40 transition-colors">
          <span className="text-xs font-medium text-muted-foreground dark:text-zinc-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#2D9BF0]" /> Tasks Remaining
          </span>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-foreground dark:text-zinc-100 tabular-nums">
              {pendingCount}
            </span>
            <span className="text-xs text-muted-foreground dark:text-zinc-400">pending</span>
          </div>
          <p className="text-[11px] text-muted-foreground dark:text-zinc-400 mt-1 truncate">
            {pendingCount === 0 ? "All items checked off!" : "Pending action items before trip"}
          </p>
        </Card>

        <Card className="rounded-sm border border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] p-4 shadow-2xs hover:border-[#2D9BF0]/40 transition-colors">
          <span className="text-xs font-medium text-muted-foreground dark:text-zinc-400 flex items-center gap-1.5">
            <ListTodo className="w-3.5 h-3.5 text-[#2D9BF0]" /> Total Categories
          </span>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-foreground dark:text-zinc-100 tabular-nums">
              {groupedCategories.length}
            </span>
            <span className="text-xs text-muted-foreground dark:text-zinc-400">groups</span>
          </div>
          <p className="text-[11px] text-muted-foreground dark:text-zinc-400 mt-1 truncate">
            {completedCount} total tasks fulfilled
          </p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-zinc-500" />
          <Input
            placeholder="Search tasks..."
            className="pl-8.5 h-9 text-xs rounded-sm bg-background dark:bg-[#121622] border-border dark:border-zinc-800 text-foreground dark:text-zinc-100 dark:placeholder:text-zinc-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground dark:text-zinc-500 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Filter Pills */}
        <div className="flex items-center gap-1.5">
          {[
            { label: "All Tasks", value: "ALL" as const, count: items.length },
            { label: "To Do", value: "PENDING" as const, count: pendingCount },
            { label: "Completed", value: "COMPLETED" as const, count: completedCount },
          ].map(({ label, value, count }) => {
            const isActive = filter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`px-2.5 py-1 rounded-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 text-xs ${
                  isActive
                    ? "bg-[#2D9BF0] text-white font-semibold shadow-2xs"
                    : "bg-muted/50 dark:bg-[#121622] text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-200 hover:bg-muted dark:hover:bg-zinc-800/60 dark:border dark:border-zinc-800"
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-muted dark:bg-zinc-800 text-muted-foreground dark:text-zinc-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categorized Tasks Groups */}
      <div className="space-y-6">
        {groupedCategories.length === 0 ? (
          <Card className="rounded-sm border border-dashed border-border/80 dark:border-zinc-800 p-8 text-center bg-card/40 dark:bg-[#0F131C]">
            <p className="text-sm font-semibold text-foreground dark:text-zinc-100">
              No {filter === "PENDING" ? "pending" : filter === "COMPLETED" ? "completed" : ""} tasks found
            </p>
            <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-1">
              Try adjusting your search query or switch task filters.
            </p>
          </Card>
        ) : (
          groupedCategories.map(([category, catItems]) => {
            const catCompleted = catItems.filter((i) => i.isCompleted).length;

            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-border/60 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-zinc-400 font-mono">
                      {category}
                    </h4>
                    <span className="text-[11px] font-mono text-muted-foreground dark:text-zinc-500">
                      ({catItems.length})
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground dark:text-zinc-400">
                    {catCompleted}/{catItems.length} done
                  </span>
                </div>

                <div className="space-y-1.5">
                  {catItems.map((item) => (
                    <TaskItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

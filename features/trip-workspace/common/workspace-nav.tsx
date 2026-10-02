"use client";

import { usePathname, useRouter } from "next/navigation";

import {
  BedDouble,
  CheckSquare,
  Compass,
  FileText,
  Link2,
  ListTodo,
  Receipt,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";

export interface WorkspaceCounts {
  itinerary?: number;
  accommodations?: number;
  expenses?: number;
  notes?: number;
  checklist?: { completed: number; total: number };
  links?: number;
}

interface WorkspaceNavProps {
  tripId: string;
  counts?: WorkspaceCounts;
}

const NAV_ITEMS = [
  { label: "Overview",      value: "overview",       icon: Compass,     },
  { label: "Itinerary",     value: "itinerary",      icon: ListTodo,    },
  { label: "Accommodation", value: "accommodations", icon: BedDouble,   },
  { label: "Expenses",      value: "expenses",       icon: Receipt,     },
  { label: "Notes",         value: "notes",          icon: FileText,    },
  { label: "Checklist",     value: "checklist",      icon: CheckSquare, },
  { label: "Links",         value: "links",          icon: Link2,       },
];

export function WorkspaceNav({ tripId, counts }: WorkspaceNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Derive active tab from the current URL segment
  const activeTab =
    NAV_ITEMS.find((item) => pathname.includes(`/${item.value}`))?.value ??
    "overview";

  const activeNavItem =
    NAV_ITEMS.find((item) => item.value === activeTab) || NAV_ITEMS[0];
  const ActiveIcon = activeNavItem.icon;

  const handleTabChange = (value: string) => {
    router.push(`/trips/${tripId}/${value}`);
  };

  const getBadgeContent = (tabValue: string) => {
    if (!counts) return null;
    switch (tabValue) {
      case "itinerary":
        return counts.itinerary !== undefined && counts.itinerary > 0 ? String(counts.itinerary) : null;
      case "accommodations":
        return counts.accommodations !== undefined && counts.accommodations > 0 ? String(counts.accommodations) : null;
      case "expenses":
        return counts.expenses !== undefined && counts.expenses > 0
          ? `$${Math.round(counts.expenses).toLocaleString()}`
          : null;
      case "notes":
        return counts.notes !== undefined && counts.notes > 0 ? String(counts.notes) : null;
      case "checklist":
        return counts.checklist && counts.checklist.total > 0
          ? `${counts.checklist.completed}/${counts.checklist.total}`
          : null;
      case "links":
        return counts.links !== undefined && counts.links > 0 ? String(counts.links) : null;
      default:
        return null;
    }
  };

  return (
    // Hidden on Desktop (md:hidden) because the left Desktop Sidebar contextually drives trip module navigation
    <div className="md:hidden border-b border-border bg-background">
      {/* Mobile Phones (< sm): 1-Tap Select Dropdown */}
      <div className="sm:hidden p-2">
        <Select value={activeTab} onValueChange={handleTabChange}>
          <SelectTrigger className="w-full h-10 bg-card border-border shadow-xs px-3 rounded-sm text-left cursor-pointer focus:ring-[#2D9BF0]">
            <div className="flex items-center gap-2.5 min-w-0">
              <ActiveIcon className="w-4 h-4 text-[#2D9BF0] shrink-0" />
              <span className="truncate font-sans text-xs font-semibold text-foreground">
                {activeNavItem.label}
              </span>
              {getBadgeContent(activeTab) && (
                <span className="ml-auto font-sans text-[10px] px-1.5 py-0.5 rounded-sm bg-[#2D9BF0]/15 text-[#2D9BF0] font-semibold tabular-nums">
                  {getBadgeContent(activeTab)}
                </span>
              )}
            </div>
          </SelectTrigger>
          <SelectContent className="w-[calc(100vw-2rem)] max-w-sm">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const badge = getBadgeContent(item.value);
              return (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="cursor-pointer py-2 font-sans text-xs font-medium"
                >
                  <div className="flex items-center gap-2.5 w-full">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="font-sans font-medium text-foreground text-xs">{item.label}</span>
                    {badge && (
                      <span className="ml-auto font-sans text-[10px] px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground font-semibold">
                        {badge}
                      </span>
                    )}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Tablets (sm to md): Scrollable Tabs Strip */}
      <div className="hidden sm:block overflow-x-auto no-scrollbar">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList
            className={cn(
              "w-full h-auto justify-start rounded-none bg-transparent p-0 gap-0 overflow-x-auto no-scrollbar"
            )}
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.value;
              const badge = getBadgeContent(item.value);

              return (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className={cn(
                    "group inline-flex items-center gap-1.5 px-3 py-2 font-sans text-xs font-medium whitespace-nowrap cursor-pointer",
                    "rounded-none border-b-2 transition-colors duration-150",
                    "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                    "data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "data-[state=active]:text-[#2D9BF0] data-[state=active]:border-[#2D9BF0]",
                    "data-[state=active]:font-semibold"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5 shrink-0",
                      isActive ? "text-[#2D9BF0]" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span>{item.label}</span>
                  {badge && (
                    <span
                      className={cn(
                        "ml-1 font-sans text-[10px] px-1.5 py-0.5 rounded-sm font-semibold tabular-nums transition-colors",
                        isActive
                          ? "bg-[#2D9BF0]/10 text-[#2D9BF0]"
                          : "bg-muted text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {badge}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

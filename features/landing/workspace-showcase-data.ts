import {
  BedDouble,
  Calendar,
  CheckSquare,
  Compass,
  FileText,
  Link2,
  Receipt,
} from "lucide-react";

export type WorkspaceTab =
  | "overview"
  | "itinerary"
  | "accommodation"
  | "expenses"
  | "notes"
  | "checklist"
  | "links";

// Static workspace tabs displayed by WorkspaceShowcase's mock application shell.
export const WORKSPACE_TABS = [
  { id: "overview", label: "Overview", icon: Compass },
  { id: "itinerary", label: "Itinerary", icon: Calendar, badge: "18" },
  { id: "accommodation", label: "Accommodation", icon: BedDouble, badge: "2" },
  { id: "expenses", label: "Expenses", icon: Receipt, badge: "INR54k" },
  { id: "notes", label: "Notes", icon: FileText, badge: "3" },
  { id: "checklist", label: "Checklist", icon: CheckSquare, badge: "4" },
  { id: "links", label: "Links & Saves", icon: Link2, badge: "4" },
] satisfies Array<{
  id: WorkspaceTab;
  label: string;
  icon: typeof Compass;
  badge?: string;
}>;

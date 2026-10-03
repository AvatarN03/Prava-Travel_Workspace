import Link from "next/link";

import { Calendar, CheckSquare } from "lucide-react";
import type { ChecklistItem } from "@prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UrgentChecklistProps {
  tasks: (ChecklistItem & { tripTitle: string })[];
}

export function UrgentChecklist({ tasks }: UrgentChecklistProps) {
  return (
    <Card className="dashboard-card">
      <CardHeader className="dashboard-card-header p-4 pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="dashboard-title flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-primary" />
            Preparation Tasks
          </CardTitle>
          <CardDescription className="dashboard-subtext mt-0.5">
            Pending tasks across your upcoming trips
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-6 font-sans text-xs text-muted-foreground dark:text-zinc-400">
            All checklist items are completed or none created.
          </div>
        ) : (
          tasks.map((task) => (
            <Link
              key={task.id}
              href={`/trips/${task.tripId}/checklist`}
              className="dashboard-interactive-row flex items-center justify-between gap-3 p-2.5 text-xs group"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="font-sans font-semibold text-foreground dark:text-zinc-100 truncate group-hover:text-primary transition-colors">
                  {task.title}
                </div>
                <div className="font-sans text-[11px] text-muted-foreground dark:text-zinc-400 flex items-center gap-2">
                  <span className="font-serif italic truncate max-w-[140px] text-foreground/80 dark:text-zinc-300 font-normal">
                    {task.tripTitle}
                  </span>
                  <span>•</span>
                  <span className="dashboard-surface-subtle px-1.5 py-0.5 rounded-2xs text-[10px] font-medium text-foreground/70 dark:text-zinc-300">
                    {task.category}
                  </span>
                </div>
              </div>

              {task.dueDate && (
                <span className="inline-flex items-center font-sans text-[10px] text-muted-foreground dark:text-zinc-400 tabular-nums shrink-0">
                  <Calendar className="w-3 h-3 mr-1 text-muted-foreground/70 dark:text-zinc-400" />
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default UrgentChecklist;

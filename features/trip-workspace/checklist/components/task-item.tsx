"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Calendar, Check, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { EditTaskDialog } from "./edit-task-dialog";

import { deleteChecklistItem, toggleChecklistItem } from "../actions";

import type { ChecklistItem } from "@prisma/client";

interface TaskItemProps {
  item: ChecklistItem;
}

export function TaskItem({ item }: TaskItemProps) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(item.isCompleted);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    startTransition(async () => {
      const res = await toggleChecklistItem({
        id: item.id,
        tripId: item.tripId,
        isCompleted: nextState,
      });
      if (!res.success) {
        setIsCompleted(!nextState); // rollback on error
        toast.error("Failed to update task state.");
      } else {
        router.refresh();
      }
    });
  };

  const handleDelete = async () => {
    const res = await deleteChecklistItem({ id: item.id, tripId: item.tripId });
    if (res.success) {
      toast.success("Task deleted.");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete task.");
    }
  };

  return (
    <>
      <div
        className={`group flex items-center justify-between gap-3 p-3 rounded-sm border transition-all duration-150 ${
          isCompleted
            ? "border-border/40 bg-muted/20 text-muted-foreground"
            : "border-border/80 bg-card hover:border-[#2D9BF0]/50 text-foreground shadow-2xs"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-xs border transition-colors cursor-pointer ${
              isCompleted
                ? "bg-[#2D9BF0] border-[#2D9BF0] text-white"
                : "border-border/80 bg-background hover:border-[#2D9BF0]"
            }`}
            aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
          >
            {isCompleted && <Check className="h-3 w-3 stroke-[2.5]" />}
          </button>

          <div className="space-y-0.5 min-w-0 flex-1">
            <span
              className={`text-xs font-medium leading-normal block ${
                isCompleted ? "line-through text-muted-foreground/70" : "text-foreground"
              }`}
            >
              {item.title}
            </span>

            {item.dueDate && (
              <span className="inline-flex items-center text-[10px] font-mono text-muted-foreground">
                <Calendar className="w-2.5 h-2.5 mr-1 text-[#2D9BF0]/70" />
                Due:{" "}
                {new Date(item.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons — visible on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer rounded-xs"
            onClick={() => setIsEditOpen(true)}
            title="Edit task"
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive cursor-pointer rounded-xs"
            onClick={() => setIsDeleteOpen(true)}
            title="Delete task"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <EditTaskDialog
        item={item}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <ConfirmDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete this task?"
        description={`"${item.title}" will be permanently removed. This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </>
  );
}

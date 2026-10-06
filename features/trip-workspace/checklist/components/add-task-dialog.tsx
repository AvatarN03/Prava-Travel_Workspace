"use client";

import type * as React from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createChecklistItem } from "../actions";

interface AddTaskDialogProps {
  tripId: string;
  defaultCategory?: string;
  trigger?: React.ReactNode;
}

export function AddTaskDialog({
  tripId,
  defaultCategory = "Packing",
  trigger,
}: AddTaskDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title: "",
    category: defaultCategory,
    dueDate: "",
  });

  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      title: "",
      category: defaultCategory,
      dueDate: "",
    });
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await createChecklistItem({
        tripId,
        title: formData.title,
        category: formData.category,
        dueDate: formData.dueDate || null,
        order: 0,
      });

      if (res.success) {
        setOpen(false);
        resetForm();
        router.refresh();
      } else {
        setError(res.error || "Failed to add checklist item");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Task
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[420px] dark:bg-[#0F131C] dark:border-zinc-800 text-foreground dark:text-zinc-100">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <DialogHeader>
            <DialogTitle className="dark:text-zinc-100">Add Checklist Item</DialogTitle>
            <DialogDescription className="dark:text-zinc-400">
              Create a packing reminder, pre-trip booking, or essential document task.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-sm bg-destructive/10 border border-destructive/20 p-2 text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="task-title" className="dark:text-zinc-300">Task Title *</Label>
              <Input
                id="task-title"
                placeholder="e.g. Passport validity check, Universal travel adapter"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={isPending}
                className="dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="task-cat" className="dark:text-zinc-300">Category</Label>
                <select
                  id="task-cat"
                  className="flex h-9 w-full rounded-sm border border-border bg-background dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100 px-3 py-1 text-sm shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={isPending}
                >
                  <option value="Packing" className="dark:bg-[#121622] dark:text-zinc-100">Packing</option>
                  <option value="Documents" className="dark:bg-[#121622] dark:text-zinc-100">Documents & Visas</option>
                  <option value="Bookings" className="dark:bg-[#121622] dark:text-zinc-100">Reservations & Tickets</option>
                  <option value="Health" className="dark:bg-[#121622] dark:text-zinc-100">Health & Insurance</option>
                  <option value="General" className="dark:bg-[#121622] dark:text-zinc-100">General To-Do</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="task-due" className="dark:text-zinc-300">Due Date</Label>
                <Input
                  id="task-due"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  disabled={isPending}
                  className="dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="cursor-pointer dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isPending} className="cursor-pointer shadow-2xs">
              {isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

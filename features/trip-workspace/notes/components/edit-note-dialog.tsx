"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { updateNote } from "../actions";

import type { Note } from "@prisma/client";

interface EditNoteDialogProps {
  item: Note;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditNoteDialog({ item, open, onOpenChange }: EditNoteDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title: item.title,
    content: item.content,
    category: item.category ?? "General",
    isPinned: item.isPinned,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category ?? "General",
      isPinned: item.isPinned,
    });
    setError(null);
  }, [item, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await updateNote({
        id: item.id,
        tripId: item.tripId,
        title: formData.title,
        content: formData.content,
        category: formData.category,
        isPinned: formData.isPinned,
      });

      if (res.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        setError(res.error || "Failed to update note");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] dark:bg-[#0F131C] dark:border-zinc-800 text-foreground dark:text-zinc-100">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <DialogHeader>
            <DialogTitle className="dark:text-zinc-100">Edit Note</DialogTitle>
            <DialogDescription className="dark:text-zinc-400">
              Update memo title, content, or category tag.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-sm bg-destructive/10 border border-destructive/20 p-2 text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="edit-note-title" className="dark:text-zinc-300">Title *</Label>
              <Input
                id="edit-note-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={isPending}
                className="dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="edit-note-cat" className="dark:text-zinc-300">Category</Label>
                <select
                  id="edit-note-cat"
                  className="flex h-9 w-full rounded-sm border border-border bg-background dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100 px-3 py-1 text-sm shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={isPending}
                >
                  <option value="General" className="dark:bg-[#121622] dark:text-zinc-100">General</option>
                  <option value="Food & Dining" className="dark:bg-[#121622] dark:text-zinc-100">Food & Dining</option>
                  <option value="Sightseeing" className="dark:bg-[#121622] dark:text-zinc-100">Sightseeing</option>
                  <option value="Transport" className="dark:bg-[#121622] dark:text-zinc-100">Transport</option>
                  <option value="Shopping" className="dark:bg-[#121622] dark:text-zinc-100">Shopping</option>
                  <option value="Emergency / Medical" className="dark:bg-[#121622] dark:text-zinc-100">Emergency / Medical</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="edit-note-pinned"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="h-4 w-4 rounded-xs border-border dark:border-zinc-700 bg-background dark:bg-[#121622] text-[#2D9BF0] focus:ring-[#2D9BF0] cursor-pointer"
                  disabled={isPending}
                />
                <Label htmlFor="edit-note-pinned" className="cursor-pointer dark:text-zinc-300">
                  Pin Note to Top
                </Label>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-note-content" className="dark:text-zinc-300">Note Content *</Label>
              <Textarea
                id="edit-note-content"
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                disabled={isPending}
                className="dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 font-mono text-xs leading-relaxed"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="cursor-pointer dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isPending} className="bg-[#2D9BF0] hover:bg-[#2587d4] text-white cursor-pointer shadow-2xs">
              {isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

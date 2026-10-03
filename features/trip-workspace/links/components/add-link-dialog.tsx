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
import { Textarea } from "@/components/ui/textarea";

import { createLink } from "../actions";

interface AddLinkDialogProps {
  tripId: string;
  trigger?: React.ReactNode;
}

export function AddLinkDialog({ tripId, trigger }: AddLinkDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    category: "Guides & Articles",
    description: "",
  });

  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      title: "",
      url: "",
      category: "Guides & Articles",
      description: "",
    });
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let finalUrl = formData.url.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = `https://${finalUrl}`;
    }

    startTransition(async () => {
      const res = await createLink({
        tripId,
        title: formData.title,
        url: finalUrl,
        category: formData.category,
        description: formData.description || null,
      });

      if (res.success) {
        setOpen(false);
        resetForm();
        router.refresh();
      } else {
        setError(res.error || "Failed to add bookmark");
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
            Add Link
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[440px] dark:bg-[#0F131C] dark:border-zinc-800 text-foreground dark:text-zinc-100">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <DialogHeader>
            <DialogTitle className="dark:text-zinc-100">Add Bookmark Link</DialogTitle>
            <DialogDescription className="dark:text-zinc-400">
              Save helpful blog posts, Google Maps pins, tickets, or travel guides.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-sm bg-destructive/10 border border-destructive/20 p-2 text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="link-title" className="dark:text-zinc-300">Link Title *</Label>
              <Input
                id="link-title"
                placeholder="e.g. Kyoto 3-Day Walking Guide"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={isPending}
                className="dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="link-url" className="dark:text-zinc-300">URL / Web Address *</Label>
              <Input
                id="link-url"
                placeholder="https://example.com/guide..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
                disabled={isPending}
                className="dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="link-category" className="dark:text-zinc-300">Category</Label>
              <select
                id="link-category"
                className="flex h-9 w-full rounded-sm border border-border bg-background dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100 px-3 py-1 text-sm shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={isPending}
              >
                <option value="Guides & Articles" className="dark:bg-[#121622] dark:text-zinc-100">Guides & Articles</option>
                <option value="Booking & Tickets" className="dark:bg-[#121622] dark:text-zinc-100">Booking & Tickets</option>
                <option value="Maps & Transit" className="dark:bg-[#121622] dark:text-zinc-100">Maps & Transit</option>
                <option value="Food & Reviews" className="dark:bg-[#121622] dark:text-zinc-100">Food & Reviews</option>
                <option value="Other" className="dark:bg-[#121622] dark:text-zinc-100">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="link-desc" className="dark:text-zinc-300">Description (Optional)</Label>
              <Textarea
                id="link-desc"
                placeholder="Key takeaways or why you saved this..."
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isPending}
                className="dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 text-xs"
              />
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
            <Button type="submit" size="sm" disabled={isPending} className="bg-[#2D9BF0] hover:bg-[#2587d4] text-white cursor-pointer shadow-2xs">
              {isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Save Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

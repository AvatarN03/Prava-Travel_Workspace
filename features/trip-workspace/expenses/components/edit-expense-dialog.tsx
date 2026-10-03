"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { updateExpense } from "../actions";

import type { Expense } from "@prisma/client";
import type { ExpenseCategory } from "../schema";

interface EditExpenseDialogProps {
  item: Expense;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "FOOD", label: "Food & Dining" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "ACCOMMODATION", label: "Accommodation" },
  { value: "FLIGHT", label: "Flights" },
  { value: "ACTIVITIES", label: "Activities / Sightseeing" },
  { value: "SHOPPING", label: "Shopping" },
  { value: "OTHER", label: "Other / Misc" },
];

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "JPY", label: "JPY (¥)" },
  { value: "INR", label: "INR (₹)" },
  { value: "AUD", label: "AUD ($)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "CHF", label: "CHF (Fr)" },
];

export function EditExpenseDialog({
  item,
  open,
  onOpenChange,
}: EditExpenseDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const formatDateForInput = (d?: Date | string | null) => {
    if (!d) return "";
    const date = new Date(d);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    title: item.title,
    amount: String(item.amount),
    currency: item.currency ?? "USD",
    category: (item.category as ExpenseCategory) || "OTHER",
    date: formatDateForInput(item.date),
    paidBy: item.paidBy ?? "",
    notes: item.notes ?? "",
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      title: item.title,
      amount: String(item.amount),
      currency: item.currency ?? "USD",
      category: (item.category as ExpenseCategory) || "OTHER",
      date: formatDateForInput(item.date),
      paidBy: item.paidBy ?? "",
      notes: item.notes ?? "",
    });
    setError(null);
  }, [item, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid expense amount");
      return;
    }

    startTransition(async () => {
      const res = await updateExpense({
        id: item.id,
        tripId: item.tripId!,
        title: formData.title.trim(),
        amount: parsedAmount,
        currency: formData.currency,
        category: formData.category,
        date: formData.date || null,
        paidBy: formData.paidBy.trim() || null,
        notes: formData.notes.trim() || null,
      });

      if (res.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        setError(res.error || "Failed to update expense");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] bg-card dark:bg-[#0F131C] border-border dark:border-zinc-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-foreground dark:text-zinc-50">Edit Expense</DialogTitle>
            <DialogDescription className="text-muted-foreground dark:text-zinc-400">
              Modify expense record details, category, or payment notes.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-sm bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="edit-exp-title" className="text-foreground dark:text-zinc-200">Expense Title *</Label>
              <Input
                id="edit-exp-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={isPending}
                className="dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-exp-amount" className="text-foreground dark:text-zinc-200">Amount *</Label>
                <Input
                  id="edit-exp-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  disabled={isPending}
                  className="dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-exp-currency" className="text-foreground dark:text-zinc-200">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(val) => setFormData({ ...formData, currency: val })}
                  disabled={isPending}
                >
                  <SelectTrigger id="edit-exp-currency" className="w-full dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-[#0F131C] border-border dark:border-zinc-800">
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="dark:hover:bg-[#121622]">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-exp-category" className="text-foreground dark:text-zinc-200">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) =>
                    setFormData({ ...formData, category: val as ExpenseCategory })
                  }
                  disabled={isPending}
                >
                  <SelectTrigger id="edit-exp-category" className="w-full dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-[#0F131C] border-border dark:border-zinc-800">
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="dark:hover:bg-[#121622]">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-exp-date" className="text-foreground dark:text-zinc-200">Date</Label>
                <DatePicker
                  date={formData.date ? new Date(formData.date + "T00:00:00") : null}
                  onDateChange={(selectedDate) => {
                    if (!selectedDate) {
                      setFormData({ ...formData, date: "" });
                    } else {
                      const yyyy = selectedDate.getFullYear();
                      const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
                      const dd = String(selectedDate.getDate()).padStart(2, "0");
                      setFormData({ ...formData, date: `${yyyy}-${mm}-${dd}` });
                    }
                  }}
                  disabled={isPending}
                  placeholder="Select expense date"
                  className="h-9 text-xs rounded-sm dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-exp-paidby" className="text-foreground dark:text-zinc-200">Paid By</Label>
              <Input
                id="edit-exp-paidby"
                placeholder="e.g. Credit Card, Cash, Split"
                value={formData.paidBy}
                onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                disabled={isPending}
                className="dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-exp-notes" className="text-foreground dark:text-zinc-200">Notes</Label>
              <Textarea
                id="edit-exp-notes"
                placeholder="Receipt details, split calculations, or memos..."
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={isPending}
                className="dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-100"
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
              className="dark:bg-[#121622] dark:border-zinc-800 dark:text-zinc-300"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isPending} className="bg-[#2D9BF0] hover:bg-[#2087D6] text-white">
              {isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

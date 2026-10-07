"use client";

import { useState } from "react";

import {
  AlertCircle,
  Calendar,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Hotel,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { acceptAiProposal, rejectAiProposal } from "../actions";

import { SUPPORTED_CURRENCIES } from "@/features/travel-essentials";
import type { AiProposalChange, AiProposalDTO } from "../schema";

function getCurrencySymbol(code?: string): string {
  if (!code) return "$";
  const found = SUPPORTED_CURRENCIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
  return found?.symbol || code;
}

interface AiProposalCardProps {
  proposal: AiProposalDTO;
  tripId: string;
  userCurrency?: string;
  onProposalResolved?: (updatedProposal: AiProposalDTO) => void;
}

export function AiProposalCard({
  proposal,
  tripId,
  userCurrency = "INR",
  onProposalResolved,
}: AiProposalCardProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    proposal.payload.changes.map((c) => c.id)
  );
  const [status, setStatus] = useState<"PENDING" | "ACCEPTED" | "REJECTED" | "PARTIAL">(
    proposal.status
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    if (status !== "PENDING") return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAccept = async (all: boolean = false) => {
    const idsToApply = all ? proposal.payload.changes.map((c) => c.id) : selectedIds;
    if (idsToApply.length === 0) {
      setError("Please select at least one change to apply.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await acceptAiProposal(tripId, proposal.id, idsToApply);
      if (!res.success) {
        setError(res.error || "Failed to apply changes.");
      } else {
        const nextStatus = res.status || (all ? "ACCEPTED" : "PARTIAL");
        setStatus(nextStatus);
        if (onProposalResolved) {
          onProposalResolved({
            ...proposal,
            status: nextStatus,
            resolvedAt: new Date().toISOString(),
          });
        }
      }
    } catch {
      setError("An unexpected error occurred while applying the proposal.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await rejectAiProposal(tripId, proposal.id);
      if (!res.success) {
        setError(res.error || "Failed to reject proposal.");
      } else {
        setStatus("REJECTED");
        if (onProposalResolved) {
          onProposalResolved({
            ...proposal,
            status: "REJECTED",
            resolvedAt: new Date().toISOString(),
          });
        }
      }
    } catch {
      setError("An unexpected error occurred while rejecting the proposal.");
    } finally {
      setLoading(false);
    }
  };

  const renderActionBadge = (action: AiProposalChange["action"]) => {
    switch (action) {
      case "create":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30 dark:bg-emerald-50 dark:text-emerald-700 dark:border-emerald-200 shrink-0">
            <Plus className="h-2.5 w-2.5" /> Add
          </span>
        );
      case "update":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold text-sky-400 border border-sky-500/30 dark:bg-blue-50 dark:text-blue-700 dark:border-blue-200 shrink-0">
            <RefreshCw className="h-2.5 w-2.5" /> Update
          </span>
        );
      case "delete":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/30 dark:bg-rose-50 dark:text-rose-700 dark:border-rose-200 shrink-0">
            <Trash2 className="h-2.5 w-2.5" /> Remove
          </span>
        );
    }
  };

  return (
    <div className="my-3 rounded-xl border border-border bg-card text-card-foreground p-3.5 space-y-3 text-xs shadow-xs transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border pb-2.5">
        <div className="flex items-center gap-1.5 font-bold text-primary">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Workspace Action Proposal</span>
        </div>

        {status === "PENDING" && (
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">
            Pending Review
          </Badge>
        )}
        {status === "ACCEPTED" && (
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="h-2.5 w-2.5" /> Accepted
          </Badge>
        )}
        {status === "PARTIAL" && (
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30">
            Partially Applied
          </Badge>
        )}
        {status === "REJECTED" && (
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30">
            Rejected
          </Badge>
        )}
      </div>

      {/* Proposal Summary */}
      <p className="font-medium text-foreground leading-snug text-xs sm:text-[13px]">
        {proposal.summary}
      </p>

      {error && (
        <div className="flex items-center gap-1.5 rounded-lg bg-destructive/10 border border-destructive/20 p-2 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Changes list */}
      <div className="space-y-2">
        {proposal.payload.changes.map((change) => {
          const isSelected = selectedIds.includes(change.id);
          return (
            <div
              key={change.id}
              onClick={() => toggleSelect(change.id)}
              className={cn(
                "group flex items-start gap-2.5 p-3 rounded-lg border transition-all duration-150",
                status === "PENDING" ? "cursor-pointer" : "",
                isSelected
                  ? "bg-primary/10 border-primary/40 text-foreground shadow-2xs ring-1 ring-primary/20"
                  : "bg-muted/30 border-border text-muted-foreground opacity-70 hover:opacity-100"
              )}
            >
              {status === "PENDING" && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(change.id)}
                  aria-label={`Select ${change.data.title || change.data.name || "item"}`}
                  className="mt-0.5 h-3.5 w-3.5 rounded-xs border-border text-primary focus:ring-primary cursor-pointer shrink-0"
                />
              )}

              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap justify-between">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    {renderActionBadge(change.action)}
                    <span className="font-semibold text-xs text-foreground break-words">
                      {change.data.title || change.data.name || (change.action === "delete" ? "Target Item" : "New Item")}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider shrink-0">
                    {change.domain === "itinerary" ? "Activity" : "Stay"}
                  </span>
                </div>

                {/* Itinerary Details Chips */}
                {change.domain === "itinerary" && (
                  <div className="flex flex-wrap gap-1.5 text-[11px] pt-0.5">
                    {change.data.dayNumber && (
                      <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-muted text-muted-foreground">
                        <Calendar className="h-3 w-3 text-primary" /> Day {change.data.dayNumber}
                      </span>
                    )}
                    {change.data.time && (
                      <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-muted text-muted-foreground">
                        <Clock className="h-3 w-3 text-primary" /> {change.data.time}
                      </span>
                    )}
                    {change.data.location && (
                      <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-muted text-muted-foreground">
                        <MapPin className="h-3 w-3 text-primary" /> {change.data.location}
                      </span>
                    )}
                    {change.data.cost !== undefined && change.data.cost !== null && (
                      <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-muted text-muted-foreground font-mono">
                        <DollarSign className="h-3 w-3 text-primary" />
                        {Number(change.data.cost) === 0
                          ? "Free"
                          : `${getCurrencySymbol(change.data.currency || userCurrency)} ${change.data.cost} ${change.data.currency || userCurrency}`}
                      </span>
                    )}
                  </div>
                )}

                {/* Accommodation Details Chips */}
                {change.domain === "accommodation" && (
                  <div className="flex flex-wrap gap-1.5 text-[11px] pt-0.5">
                    {change.data.type && (
                      <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-muted text-muted-foreground">
                        <Hotel className="h-3 w-3 text-primary" /> {change.data.type}
                      </span>
                    )}
                    {change.data.address && (
                      <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-muted text-muted-foreground">
                        <MapPin className="h-3 w-3 text-primary" /> {change.data.address}
                      </span>
                    )}
                    {change.data.checkIn && (
                      <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-muted text-muted-foreground">
                        <Calendar className="h-3 w-3 text-primary" /> In: {change.data.checkIn}
                      </span>
                    )}
                    {change.data.checkOut && (
                      <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-muted text-muted-foreground">
                        <Calendar className="h-3 w-3 text-primary" /> Out: {change.data.checkOut}
                      </span>
                    )}
                    {change.data.cost !== undefined && change.data.cost !== null && (
                      <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-muted text-muted-foreground font-mono">
                        <DollarSign className="h-3 w-3 text-primary" />
                        {Number(change.data.cost) === 0
                          ? "Free"
                          : `${getCurrencySymbol(change.data.currency || userCurrency)} ${change.data.cost} ${change.data.currency || userCurrency}`}
                      </span>
                    )}
                  </div>
                )}

                {change.data.description && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed pt-0.5">
                    {change.data.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons for Pending Proposals */}
      {status === "PENDING" && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReject}
            disabled={loading}
            className="h-7 px-2.5 text-xs rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer shrink-0 transition-colors"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Reject
          </Button>

          <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0">
            {selectedIds.length > 0 && selectedIds.length < proposal.payload.changes.length && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAccept(false)}
                disabled={loading}
                className="h-7 px-2.5 text-xs rounded-lg border-border text-foreground hover:bg-muted cursor-pointer shrink-0"
              >
                {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1 text-primary" />}
                Apply ({selectedIds.length})
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => handleAccept(true)}
              disabled={loading}
              className="h-7 px-3 text-xs font-semibold rounded-lg shadow-xs cursor-pointer shrink-0 transition-colors"
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <CheckCheck className="h-3.5 w-3.5 mr-1" />
              )}
              Accept All ({proposal.payload.changes.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

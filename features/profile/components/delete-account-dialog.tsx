"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AlertTriangle,
  Compass,
  Loader2,
  Mail,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { createClient } from "@/lib/supabase/client";
import { deleteAccountAction } from "../actions";

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export function DeleteAccountDialog({
  isOpen,
  onClose,
  userEmail,
}: DeleteAccountDialogProps) {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [agreedToConsequences, setAgreedToConsequences] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Handle resend countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Reset dialog state when closed
  const handleDialogClose = () => {
    if (isDeleting) return; // Prevent closing mid-execution
    if (step === 3) {
      window.location.href = "/";
      return;
    }
    setStep(1);
    setAgreedToConsequences(false);
    setOtpCode("");
    setConfirmPhrase("");
    setErrorMessage(null);
    onClose();
  };

  const handleSendOtp = async () => {
    if (!agreedToConsequences) {
      toast.error("Please confirm that you understand the consequences before proceeding.");
      return;
    }

    setIsSendingOtp(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: userEmail,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        toast.error(error.message);
        setErrorMessage(error.message);
      } else {
        toast.success("Verification code sent to your email!");
        setStep(2);
        setResendCooldown(45);
      }
    } catch {
      toast.error("Failed to send verification code. Please try again.");
      setErrorMessage("Failed to send verification code. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otpCode.trim().length !== 6) {
      toast.error("Please enter a valid 6-digit verification code.");
      return;
    }

    if (confirmPhrase.trim().toUpperCase() !== "DELETE") {
      toast.error('Please type "DELETE" to confirm.');
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const result = await deleteAccountAction(otpCode.trim());

      if (!result.success) {
        toast.error(result.error || "Failed to delete account.");
        setErrorMessage(result.error || "Failed to delete account.");
        setIsDeleting(false);
      } else {
        // Show farewell note toast
        toast.success(
          "Thank you for using Prava! Your account and personal data have been permanently deleted. You are always welcome back whenever you're ready to plan your next journey.",
          {
            duration: 8000,
          }
        );
        setStep(3);
      }
    } catch {
      toast.error("An unexpected error occurred while deleting your account.");
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md p-6 bg-card border-border shadow-lg rounded-md">
        {step === 1 && (
          <div className="space-y-5">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2.5 text-destructive">
                <div className="h-8 w-8 rounded-sm bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold text-foreground">
                    Delete Workspace Account
                  </DialogTitle>
                  <p className="text-[11px] font-sans font-medium text-destructive">
                    Step 1 of 2: Impact Confirmation
                  </p>
                </div>
              </div>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
                Permanently deletes your account and wipes all associated records from Prava. This action is irreversible.
              </DialogDescription>
            </DialogHeader>

            {/* Impact checklist */}
            <div className="rounded-sm border border-destructive/20 bg-destructive/5 p-3.5 space-y-2 text-xs text-foreground">
              <p className="font-semibold text-destructive flex items-center gap-1.5 text-xs">
                <AlertTriangle className="h-3.5 w-3.5" />
                The following data will be permanently wiped:
              </p>
              <ul className="space-y-1.5 pl-5 text-[11px] text-muted-foreground list-disc marker:text-destructive">
                <li>All planned trips, daily itineraries, and accommodation bookings</li>
                <li>All expense records, budget trackers, and currency calculations</li>
                <li>All checklist tasks, packing lists, and Markdown travel notes</li>
                <li>All published travel stories, forum posts, upvotes, and replies</li>
                <li>All AI conversation histories, saved bookmarks, and custom avatars</li>
              </ul>
            </div>

            {/* Confirmation checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer text-xs select-none pt-1">
              <input
                type="checkbox"
                checked={agreedToConsequences}
                onChange={(e) => setAgreedToConsequences(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-xs border-border text-destructive focus:ring-destructive cursor-pointer"
              />
              <span className="text-muted-foreground leading-snug">
                I understand that deleting my account is irreversible and all my journeys, notes, and records will be permanently erased.
              </span>
            </label>

            {errorMessage && (
              <div className="rounded-sm border border-red-200 dark:border-red-900/50 bg-red-50/90 dark:bg-red-950/30 p-2.5 text-xs text-red-700 dark:text-red-400">
                {errorMessage}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDialogClose}
                disabled={isSendingOtp}
                className="h-8 rounded-sm text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={!agreedToConsequences || isSendingOtp}
                onClick={handleSendOtp}
                className="h-8 rounded-sm text-xs gap-1.5 cursor-pointer"
              >
                {isSendingOtp && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Send Verification Code
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleConfirmDelete} className="space-y-5">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2.5 text-destructive">
                <div className="h-8 w-8 rounded-sm bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold text-foreground">
                    Verify Deletion Authorization
                  </DialogTitle>
                  <p className="text-[11px] font-sans font-medium text-destructive">
                    Step 2 of 2: Email Verification
                  </p>
                </div>
              </div>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
                We sent a 6-digit confirmation code to{" "}
                <span className="font-semibold text-foreground font-mono">{userEmail}</span>. Enter the code and type{" "}
                <span className="font-semibold text-destructive">DELETE</span> below.
              </DialogDescription>
            </DialogHeader>

            {errorMessage && (
              <div className="rounded-sm border border-red-200 dark:border-red-900/50 bg-red-50/90 dark:bg-red-950/30 p-2.5 text-xs text-red-700 dark:text-red-400">
                {errorMessage}
              </div>
            )}

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  6-Digit Verification Code
                </label>
                <Input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  disabled={isDeleting}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="h-10 text-center font-mono text-lg tracking-[0.3em] font-semibold rounded-sm border-border bg-transparent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Type <span className="font-semibold text-destructive uppercase">DELETE</span> to confirm
                </label>
                <Input
                  type="text"
                  required
                  disabled={isDeleting}
                  placeholder="DELETE"
                  value={confirmPhrase}
                  onChange={(e) => setConfirmPhrase(e.target.value)}
                  className="h-9 rounded-sm border-border bg-transparent text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-muted-foreground">
                  Didn't receive the email code?
                </span>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isSendingOtp || isDeleting}
                  onClick={handleSendOtp}
                  className="text-[11px] font-medium text-[#2D9BF0] hover:underline cursor-pointer disabled:text-muted-foreground disabled:no-underline"
                >
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={() => {
                  setStep(1);
                  setErrorMessage(null);
                }}
                className="h-8 rounded-sm text-xs cursor-pointer"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                disabled={
                  otpCode.trim().length !== 6 ||
                  confirmPhrase.trim().toUpperCase() !== "DELETE" ||
                  isDeleting
                }
                className="h-8 rounded-sm text-xs gap-1.5 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Deleting Everything...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    Permanently Delete Account
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-5 text-center py-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2D9BF0]/10 text-[#2D9BF0]">
              <Compass className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-lg font-light tracking-tight text-foreground">
                Thank you for traveling with Prava
              </DialogTitle>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Your account and all associated personal data have been completely deleted. We are grateful to have been part of your travels, and you are always welcome back whenever you're ready to plan your next journey.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
                className="w-full h-10 font-medium text-xs rounded-sm shadow-xs bg-zinc-950 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 transition-all cursor-pointer"
              >
                Return to Prava Home
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

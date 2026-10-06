"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthBackgroundPattern } from "../auth-background-pattern";

import { createClient } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingSession, setVerifyingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkRecoverySession() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (isMounted) {
          if (user) {
            setHasValidSession(true);
          } else {
            setHasValidSession(false);
          }
          setVerifyingSession(false);
        }
      } catch {
        if (isMounted) {
          setHasValidSession(false);
          setVerifyingSession(false);
        }
      }
    }

    checkRecoverySession();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please verify and try again.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast.error(error.message);
        setErrorMessage(error.message);
      } else {
        setIsSuccess(true);
        toast.success("Password updated successfully!");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      }
    } catch {
      toast.error("An unexpected error occurred while updating your password.");
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-canvas text-zinc-950 dark:text-zinc-50 flex flex-col selection:bg-primary/20 selection:text-primary transition-colors overflow-hidden">
      <AuthBackgroundPattern />

      {/* Subtle Grid Texture */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] z-0"
        aria-hidden="true"
      />

      {/* Minimalist Top Navigation */}
      <header className="relative z-20 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-card/70 dark:bg-canvas/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="group flex items-center gap-3 cursor-pointer"
            aria-label="Back to Prava home"
          >
            <Image
              src="/logo.png"
              alt="Prava Logo"
              width={26}
              height={26}
              className="w-6.5 h-6.5 object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <span className="font-brand font-medium tracking-[0.26em] text-base uppercase text-zinc-950 dark:text-zinc-50 transition-colors">
              Prava
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            <Link
              href="/auth"
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer px-2.5 py-1.5 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md rounded-md border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-900/80 p-6 sm:p-8 shadow-xs backdrop-blur-xs space-y-6">
          {verifyingSession ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-6 w-6 animate-spin text-[#2D9BF0]" />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Verifying password reset session...
              </p>
            </div>
          ) : !hasValidSession ? (
            <div className="space-y-5 text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-xl font-light tracking-tight text-zinc-950 dark:text-zinc-50">
                  Reset link expired or invalid
                </h1>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  This password reset link is invalid or has expired. Please request a new recovery link.
                </p>
              </div>
              <Button
                asChild
                className="w-full h-10 font-medium text-xs rounded-sm shadow-xs bg-zinc-950 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 transition-all cursor-pointer"
              >
                <Link href="/auth?tab=forgot">Request New Reset Link</Link>
              </Button>
            </div>
          ) : isSuccess ? (
            <div className="space-y-5 text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-xl font-light tracking-tight text-zinc-950 dark:text-zinc-50">
                  Password updated!
                </h1>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  Your password has been reset successfully. Redirecting you to your workspace...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider">
                  <Lock className="h-3 w-3" />
                  <span>Security</span>
                </div>
                <h1 className="text-2xl font-light tracking-tight text-zinc-950 dark:text-zinc-50">
                  Set new password
                </h1>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal">
                  Create a strong password with at least 6 characters to secure your account.
                </p>
              </div>

              {errorMessage && (
                <div className="rounded-sm border border-red-200 dark:border-red-900/50 bg-red-50/90 dark:bg-red-950/30 p-3 text-xs text-red-700 dark:text-red-400 flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-zinc-400" /> New Password
                    </label>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500">Min. 6 characters</span>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={loading}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 pr-10 rounded-sm border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-200 placeholder:text-zinc-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 focus:outline-none cursor-pointer p-0.5"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-zinc-400" /> Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      disabled={loading}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-10 pr-10 rounded-sm border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-200 placeholder:text-zinc-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 focus:outline-none cursor-pointer p-0.5"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 font-medium text-xs rounded-sm shadow-xs bg-zinc-950 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
              </form>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-center text-xs text-zinc-500 dark:text-zinc-400">
                <Link
                  href="/auth"
                  className="font-medium text-zinc-950 dark:text-zinc-50 hover:underline underline-offset-4 cursor-pointer"
                >
                  Cancel and return to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Link2,
  Loader2,
  LogOut,
  Mail,
  Shield,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteAccountDialog } from "./delete-account-dialog";

import { createClient } from "@/lib/supabase/client";

import type { ProfileWithStats } from "../actions";

interface SettingsSectionProps {
  profile: ProfileWithStats;
  onSignOut: () => void;
  isSigningOut: boolean;
}

export function SettingsSection({
  profile,
  onSignOut,
  isSigningOut,
}: SettingsSectionProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [providers, setProviders] = useState<string[]>([]);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoadingIdentities, setIsLoadingIdentities] = useState(true);
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadIdentityState = async () => {
      const supabase = createClient();
      const [identitiesResult, userResult] = await Promise.all([
        supabase.auth.getUserIdentities(),
        supabase.auth.getUser(),
      ]);

      if (!isMounted) return;

      if (identitiesResult.error || userResult.error) {
        toast.error("Could not load your linked sign-in methods.");
      } else {
        setProviders(
          Array.from(
            new Set(identitiesResult.data.identities.map((identity) => identity.provider))
          )
        );
        setIsEmailVerified(Boolean(userResult.data.user.email_confirmed_at));
      }

      setIsLoadingIdentities(false);
    };

    void loadIdentityState();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasEmailIdentity = providers.includes("email");
  const hasGoogleIdentity = providers.includes("google");

  const handleLinkGoogle = async () => {
    setIsLinkingGoogle(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.linkIdentity({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/profile?tab=security`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        toast.error(
          error.message.includes("manual linking")
            ? "Enable Manual Linking in Supabase Auth before linking Google."
            : error.message
        );
        setIsLinkingGoogle(false);
        return;
      }

      window.location.assign(data.url);
    } catch {
      toast.error("Could not start Google account linking. Please try again.");
      setIsLinkingGoogle(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <Card className="rounded-sm border border-border bg-card shadow-xs">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-primary/20 bg-primary/10 text-primary">
              <Shield className="h-3.5 w-3.5" />
            </div>
            <div>
              <CardTitle className="font-sans text-sm font-semibold text-foreground">Security & Credentials</CardTitle>
              <CardDescription className="font-sans text-xs text-muted-foreground">
                Review the sign-in methods attached to this workspace account.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3.5 p-4 pt-0 text-xs">
          <div className="flex flex-col justify-between gap-3 rounded-sm border border-border bg-muted/20 p-3.5 sm:flex-row sm:items-center">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <p className="font-sans font-semibold text-foreground">Primary Account Email</p>
                {isEmailVerified && (
                  <Badge variant="outline" className="gap-1 border-success/30 bg-success/10 px-1.5 py-0 text-[10px] font-semibold text-success">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="font-mono text-[11px] text-muted-foreground">{profile.email || "No email bound"}</p>
            </div>
            <Badge variant="outline" className="w-fit border-border bg-card text-[10px] text-muted-foreground">
              {isLoadingIdentities ? "Checking…" : hasEmailIdentity ? "Email linked" : "Email profile"}
            </Badge>
          </div>

          <div className="flex flex-col justify-between gap-3 rounded-sm border border-border bg-card p-3.5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-border bg-background">
                <Image src="/google.svg" alt="Google" width={15} height={15} className="h-3.5 w-3.5" />
              </span>
              <div className="space-y-0.5">
                <p className="font-sans font-semibold text-foreground">Google</p>
                <p className="font-sans text-[11px] text-muted-foreground">
                  {hasGoogleIdentity
                    ? "Google sign-in is connected to this account."
                    : "Add Google as another secure sign-in method."}
                </p>
              </div>
            </div>

            {isLoadingIdentities ? (
              <span className="text-[11px] text-muted-foreground">Checking…</span>
            ) : hasGoogleIdentity ? (
              <Badge variant="outline" className="w-fit gap-1 border-success/30 bg-success/10 text-[10px] font-semibold text-success">
                <CheckCircle2 className="h-3 w-3" />
                Connected
              </Badge>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLinkGoogle}
                disabled={isLinkingGoogle}
                className="h-8 shrink-0 gap-1.5 rounded-sm text-xs"
              >
                {isLinkingGoogle ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Link2 className="h-3.5 w-3.5" />}
                {isLinkingGoogle ? "Redirecting…" : "Connect Google"}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
            <KeyRound className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span>
              {providers.length > 1
                ? "Multiple sign-in methods are linked to this account."
                : "Your sign-in method is managed securely by Supabase Auth."}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-sm border border-border bg-card shadow-xs">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-destructive/20 bg-destructive/10 text-destructive">
              <LogOut className="h-3.5 w-3.5" />
            </div>
            <div>
              <CardTitle className="font-sans text-sm font-semibold text-foreground">Session Management</CardTitle>
              <CardDescription className="font-sans text-xs text-muted-foreground">
                Sign out of the active traveler session in this browser.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 text-xs">
          <div className="flex flex-col justify-between gap-3 py-1 sm:flex-row sm:items-center">
            <div className="space-y-0.5">
              <p className="font-sans font-semibold text-foreground">Active Browser Session</p>
              <p className="font-sans text-[11px] text-muted-foreground">
                Clears stored session tokens and refreshes application state.
              </p>
            </div>
            <Button variant="destructive" size="sm" onClick={onSignOut} disabled={isSigningOut} className="h-8 shrink-0 gap-1.5 rounded-sm text-xs">
              {isSigningOut ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-sm border border-destructive/30 bg-destructive/5 shadow-xs dark:border-destructive/40 dark:bg-destructive/10">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-destructive/30 bg-destructive/15 text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
            <div>
              <CardTitle className="font-sans text-sm font-semibold text-destructive">Danger Zone</CardTitle>
              <CardDescription className="font-sans text-xs text-muted-foreground">
                Irreversible actions affecting your identity and stored workspace data.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 text-xs">
          <div className="flex flex-col justify-between gap-3 py-1 sm:flex-row sm:items-center">
            <div className="space-y-0.5">
              <p className="font-sans font-semibold text-foreground">Delete Account & Wipe Data</p>
              <p className="font-sans text-[11px] text-muted-foreground">
                Permanently purge your account, trips, itineraries, expenses, stories, and uploads.
              </p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)} className="h-8 shrink-0 gap-1.5 rounded-sm text-xs">
              <Trash2 className="h-3.5 w-3.5" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteAccountDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} userEmail={profile.email || ""} />
    </div>
  );
}

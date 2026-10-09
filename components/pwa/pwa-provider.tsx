"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Monitor, Share, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── Types & Interfaces ────────────────────────────────────────────────────────

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PwaContextValue {
  isInstallable: boolean;
  isStandalone: boolean;
  isIos: boolean;
  promptInstall: () => Promise<void>;
}

const PwaContext = createContext<PwaContextValue>({
  isInstallable: false,
  isStandalone: false,
  isIos: false,
  promptInstall: async () => {},
});

export function usePwa() {
  return useContext(PwaContext);
}

// ─── Provider Component ───────────────────────────────────────────────────────

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Register Service Worker for PWA compliance and offline fallback
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          registration.update().catch(() => {});
        })
        .catch((err) => {
          console.warn("[PWA] Service worker registration notice:", err);
        });
    }

    // 2. Detect standalone display mode (already installed & launched from home screen)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone ===
          true;
      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    // 3. Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(ua) &&
      !(window as unknown as { MSStream?: boolean }).MSStream;
    setIsIos(isIosDevice);

    // 4. Listen for Chromium beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else if (!isStandalone) {
      setShowModal(true);
    }
  }, [deferredPrompt, isStandalone]);

  const isInstallable = !isStandalone;

  return (
    <PwaContext.Provider
      value={{
        isInstallable,
        isStandalone,
        isIos,
        promptInstall,
      }}
    >
      {children}

      {/* Install Instructions Modal (iOS Safari & Desktop Browsers) */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm rounded-xl p-5 border-border bg-card">
          <DialogHeader className="text-left space-y-1.5 pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                {isIos ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  {isIos ? "Install Prava on iOS" : "Install Prava on Desktop"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {isIos
                    ? "Add Prava to your home screen for rapid 1-tap workspace access."
                    : "Install Prava as a standalone app for rapid 1-tap workspace access."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {isIos ? (
            <div className="space-y-3.5 py-2 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <div className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 font-bold text-[11px]">
                  1
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground flex items-center gap-1.5">
                    Tap the Share button <Share className="h-3.5 w-3.5 text-primary inline" />
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Located in the bottom navigation bar of Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <div className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 font-bold text-[11px]">
                  2
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">
                    Select &ldquo;Add to Home Screen&rdquo;
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Scroll down the share sheet and tap the &ldquo;Add to Home Screen&rdquo; option.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 font-bold text-[11px]">
                3
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold text-foreground">
                  Tap &ldquo;Add&rdquo;
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Prava will now appear as an app icon on your device home screen.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5 py-2 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <div className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 font-bold text-[11px]">
                  1
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">
                    Look for the Install icon in the address bar
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    In Chrome, Edge, or Brave, click the desktop/download icon on the right side of the URL bar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <div className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 font-bold text-[11px]">
                  2
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">
                    Or select from the browser menu
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Click &ldquo;⋮&rdquo; in the top-right corner &rarr; &ldquo;Save and Share&rdquo; / &ldquo;More Tools&rdquo; &rarr; &ldquo;Install Prava&rdquo;.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="button"
              className="w-full text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PwaContext.Provider>
  );
}

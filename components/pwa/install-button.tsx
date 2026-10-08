"use client";

import React from "react";

import { Check, Download, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";

import { usePwa } from "./pwa-provider";

import { cn } from "@/lib/utils";

interface InstallButtonProps {
  variant?: "default" | "outline" | "ghost" | "sidebar";
  size?: "default" | "sm" | "icon";
  className?: string;
  hideWhenInstalled?: boolean;
}

export function InstallButton({
  variant = "outline",
  size = "sm",
  className,
  hideWhenInstalled = true,
}: InstallButtonProps) {
  const { isInstallable, isStandalone, promptInstall } = usePwa();

  if (isStandalone && hideWhenInstalled) {
    return null;
  }

  if (isStandalone && !hideWhenInstalled) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-md border border-emerald-500/20",
          className
        )}
      >
        <Check className="h-3 w-3" />
        <span>Installed</span>
      </div>
    );
  }

  // If not installable and not on standalone, only render if prompt is available or iOS
  if (!isInstallable) {
    return null;
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={() => promptInstall()}
        className={cn(
          "flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-xs font-medium text-slate-300 dark:text-slate-700 hover:text-white dark:hover:text-slate-900 hover:bg-white/5 dark:hover:bg-slate-900/5 transition-colors cursor-pointer group",
          className
        )}
      >
        <Download className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
        <span className="truncate">Install App</span>
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={() => promptInstall()}
      className={cn("gap-1.5 font-sans cursor-pointer text-xs", className)}
    >
      <Download className="h-3.5 w-3.5" />
      <span>Install App</span>
    </Button>
  );
}

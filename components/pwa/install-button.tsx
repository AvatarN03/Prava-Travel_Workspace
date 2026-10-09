"use client";

import React from "react";

import { Check, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => promptInstall()}
              className={cn(
                "group flex items-center gap-2.5 w-full px-3 py-2.5 rounded-sm text-xs font-medium cursor-pointer transition-colors duration-150",
                "bg-white hover:bg-slate-100 text-slate-900 border border-slate-200",
                "dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white dark:border-slate-800",
                className
              )}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xs bg-slate-100 text-primary dark:bg-slate-800 group-hover:scale-105 transition-transform duration-150">
                <Download className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="font-semibold leading-tight text-slate-900 dark:text-white truncate">
                  Install App
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">
                  Desktop & Mobile
                </span>
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            sideOffset={8}
            className="max-w-xs text-xs font-sans font-medium"
          >
            Install Prava on your device for 1-tap workspace access and offline support.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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

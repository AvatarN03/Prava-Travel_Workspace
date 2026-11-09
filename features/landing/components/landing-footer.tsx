"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { LANDING_NAV_ITEMS } from "@/features/landing/constants";

export function LandingFooter() {
  return (
    <footer className="border-border bg-background border-t py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center md:text-left">
          {/* Column 1 (Left 1/3): Brand & Tagline */}
          <div className="flex flex-col md:flex-row items-center gap-2 space-y-1 md:space-y-0">
            <img src="/logo.png" alt="Prava logo" className="h-8 w-8 object-contain" />
            <span className="font-brand text-base font-medium uppercase tracking-[0.24em] text-foreground">
              Prava
            </span>
            <p className="font-sans text-xs text-muted-foreground">
              A workspace for better journeys.
            </p>
          </div>

          {/* Column 2 (Center 1/3): Minimalist Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-6 font-sans text-xs font-medium text-muted-foreground">
            {LANDING_NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="cursor-pointer transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Column 3 (Right 1/3): GitHub Repo Link & Copyright */}
          <div className="flex flex-col justify-center gap-2.5 font-sans text-xs text-muted-foreground md:items-end">
            <div>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://github.com/AvatarN03/Prava-Travel_Workspace"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Prava Workspace on GitHub"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/github.svg"
                        alt=""
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform group-hover:scale-110 dark:invert"
                      />
                      <span className="font-medium">GitHub</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs font-sans">
                    Prava Workspace on GitHub
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="tabular-nums text-[11px] text-muted-foreground/70">
              © {new Date().getFullYear()} Prava Inc.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


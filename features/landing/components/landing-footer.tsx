"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center md:text-left">
          {/* Column 1 (Left 1/3): Brand & Tagline */}
          <div className="space-y-1">
            <span className="font-brand font-medium text-base tracking-[0.24em] uppercase text-zinc-950 dark:text-zinc-50">
              Prava
            </span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
              A workspace for better journeys.
            </p>
          </div>

          {/* Column 2 (Center 1/3): Minimalist Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-600 dark:text-zinc-400 font-medium font-sans">
            <a
              href="#workspace"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              Workspace
            </a>
            <a
              href="#travel-tools"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              Travel Tools
            </a>
            <a
              href="#community"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              Community
            </a>
            <a
              href="#pricing"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              Pricing
            </a>
          </nav>

          {/* Column 3 (Right 1/3): GitHub Repo Link & Copyright */}
          <div className="flex flex-col md:items-end justify-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-400 font-sans">
            <div>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://github.com/AvatarN03/Prava-Travel_Workspace"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer group"
                      aria-label="Prava Workspace on GitHub"
                    >
                      <GithubIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                      <span className="font-medium">GitHub</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs font-sans">
                    Prava Workspace on GitHub
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="tabular-nums text-[11px] text-zinc-400 dark:text-zinc-500">
              © {new Date().getFullYear()} Prava Inc.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import {
  Lock,
  Menu,
  X,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  WORKSPACE_TABS,
  type WorkspaceTab,
} from "@/features/landing/workspace-showcase-data";
import { WorkspaceShowcaseCanvas } from "./workspace-showcase-canvas";

const easeDecelerate = [0.16, 1, 0.3, 1] as const;

export function WorkspaceShowcase() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({
    task1: true,
    task2: true,
    task3: false,
    task4: false,
    task5: true,
    task6: false,
  });

  const toggleTask = (id: string) => {
    setCheckedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="workspace"
      data-nav-theme="dark"
      className="py-16 sm:py-24 lg:py-28 bg-canvas dark:bg-zinc-950 transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 space-y-10">
        {/* Section Header with Responsive Typography */}
        <div className="space-y-3 max-w-2xl">
          <motion.span
            className="inline-block font-sans text-[11px] font-semibold tracking-widest text-primary uppercase"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: easeDecelerate }}
          >
            The Workspace
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.15] break-words [text-wrap:balance]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.05,
                },
              },
            }}
          >
            <span className="inline-block mr-[0.28em]">
              {["Your", "trip", "has", "a"].map((word) => (
                <motion.span
                  key={word}
                  variants={{
                    hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.65, ease: easeDecelerate },
                    },
                  }}
                  className="inline-block mr-[0.28em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.7, ease: easeDecelerate },
                },
              }}
              className="font-serif italic text-zinc-700 dark:text-zinc-300 inline-block"
            >
              home.
            </motion.span>
          </motion.h2>

          <motion.p
            className="hidden lg:block text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed pt-1 break-words [text-wrap:balance]"
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.3, ease: easeDecelerate }}
          >
            A quiet, structured canvas tailored to human travel. Not a data warehouse,
            but a responsive workspace built for clarity on the road.
          </motion.p>
        </div>

        {/* MacBook Hardware Chassis / Display Enclosure */}
        <motion.div
          className="rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 p-2 sm:p-3 shadow-2xl shadow-zinc-300/60 dark:shadow-black/80 ring-1 ring-zinc-200 dark:ring-zinc-800/80"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: easeDecelerate }}
        >
          {/* MacBook Top Bezel Camera Dot */}
          <div className="hidden sm:flex items-center justify-center pb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700/80 shadow-inner" />
          </div>

          {/* The Workspace Window Frame (Retina Display Screen) */}
          <div className="relative rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-inner">
            {/* macOS Chrome Header / Title Bar */}
            <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/90 dark:bg-zinc-900/95 px-4 py-2.5 text-xs text-zinc-500 select-none">
              {/* Left Group: Traffic Light Buttons + Left-Aligned Rectangular Address Bar */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                {/* macOS Traffic Light Buttons */}
                <TooltipProvider delayDuration={200}>
                  <div className="flex items-center gap-2 shrink-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition-opacity shadow-2xs cursor-pointer inline-block"
                          aria-label="Close window"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-[11px] font-sans">
                        Close window
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:opacity-80 transition-opacity shadow-2xs cursor-pointer inline-block"
                          aria-label="Minimize window"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-[11px] font-sans">
                        Minimize window
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:opacity-80 transition-opacity shadow-2xs cursor-pointer inline-block"
                          aria-label="Fullscreen"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-[11px] font-sans">
                        Fullscreen
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>

                {/* Simple Non-Rounded Rectangular Address Bar Input Box */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-none bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-[11px] text-zinc-600 dark:text-zinc-300 shadow-2xs max-w-[320px] sm:max-w-md truncate tracking-wider">
                  <Lock className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="tracking-wider font-normal truncate">
                    <span className="text-zinc-400 dark:text-zinc-500 font-normal">https://</span>
                    <span className="font-normal text-zinc-800 dark:text-zinc-200">prava-workspace</span>
                    <span className="text-zinc-500 dark:text-zinc-400 font-normal">/rajasthan-heritage-2026</span>
                  </span>
                </div>
              </div>

              {/* Right Window Meta */}
              <div className="hidden sm:block text-[11px] text-zinc-500 dark:text-zinc-400 tabular-nums shrink-0 tracking-wide">
                NOV 14 – 22 · Rajasthan, India
              </div>
            </div>

            {/* Mobile workspace navigation */}
            <div className="flex md:hidden items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/90 dark:bg-zinc-950/90 px-4 py-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Workspace</p>
                <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  {WORKSPACE_TABS.find((tab) => tab.id === activeTab)?.label}
                </p>
              </div>
              <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 cursor-pointer" aria-label="Open workspace menu" aria-expanded={isMobileMenuOpen}>
                <Menu className="h-4 w-4" />
              </button>
            </div>

            <AnimatePresence>
              {isMobileMenuOpen && (
                <>
                  <motion.button type="button" aria-label="Close workspace menu" className="absolute inset-0 z-30 bg-zinc-950/35 md:hidden cursor-pointer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} />
                  <motion.aside className="absolute inset-y-0 left-0 z-40 w-[82%] max-w-xs border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 shadow-2xl md:hidden" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.28, ease: easeDecelerate }}>
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Active Trip</p>
                        <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Royal Rajasthan Circuit</p>
                      </div>
                      <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-zinc-500 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 cursor-pointer" aria-label="Close workspace menu">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <nav className="space-y-1 pt-4">
                      {WORKSPACE_TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center justify-between px-3 py-3 rounded-xs text-xs font-medium cursor-pointer ${isActive ? "text-zinc-950 dark:text-zinc-100 font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/50"}`}>
                            <span className="flex items-center gap-2.5"><Icon className="h-3.5 w-3.5" />{tab.label}</span>
                            {tab.badge && <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{tab.badge}</span>}
                          </button>
                        );
                      })}
                    </nav>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>
            {/* Interior Grid: Left Nav Sidebar + Right Active Canvas with increased height */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[660px] md:min-h-[700px] lg:min-h-[740px]">
              {/* Left Workspace Navigation Sidebar */}
              <div className="hidden md:flex md:col-span-3 border-b md:border-b-0 md:border-r border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-5 flex-col justify-between bg-zinc-50/70 dark:bg-zinc-950/60">
                <div className="space-y-5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        Active Trip
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-zinc-950 dark:text-zinc-50">
                      Royal Rajasthan Circuit
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      8 Days · 18 Stops
                    </p>
                  </div>

                  {/* 7 Tab Navigation Items */}
                  <nav className="space-y-1">
                    {WORKSPACE_TABS.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id as WorkspaceTab)}
                          className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xs text-xs font-medium transition-colors duration-200 cursor-pointer ${
                            isActive
                              ? "text-zinc-950 dark:text-zinc-100 font-semibold"
                              : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/50"
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="workspace-active-tab-pill"
                              className="absolute inset-0 bg-white shadow-xs border border-zinc-200/90 dark:bg-zinc-800 dark:border-zinc-700 rounded-xs"
                              transition={{ type: "spring", stiffness: 450, damping: 32 }}
                            />
                          )}
                          <div className="relative z-10 flex items-center gap-2.5">
                            <Icon className="h-3.5 w-3.5" />
                            <span>{tab.label}</span>
                          </div>
                          {tab.badge && (
                            <span
                              className={`relative z-10 text-[10px] tabular-nums px-1.5 py-0.5 rounded-xs font-medium ${
                                isActive
                                  ? "bg-zinc-100 text-zinc-800 border border-zinc-200/80 dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600"
                                  : "text-zinc-400 dark:text-zinc-500"
                              }`}
                            >
                              {tab.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Bottom Offline Status */}
                <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Synced offline
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Active Workspace Canvas */}
              <WorkspaceShowcaseCanvas
                activeTab={activeTab}
                checkedTasks={checkedTasks}
                onTabChange={setActiveTab}
                onToggleTask={toggleTask}
              />
            </div>
          </div>

          {/* MacBook Display Hinge / Chin */}
          <div className="hidden sm:block h-1 w-28 bg-zinc-300 dark:bg-zinc-800 rounded-b-md mx-auto mt-0.5" />
        </motion.div>
      </div>
    </section>
  );
}




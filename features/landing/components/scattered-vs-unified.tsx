"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import {
  SCATTERED_ITEMS,
  UNIFIED_ITEMS,
} from "@/features/landing/scattered-vs-unified-data";

const easeDecelerate = [0.16, 1, 0.3, 1] as const;

export function ScatteredVsUnified() {
  const [mode, setMode] = useState<"scattered" | "unified">("scattered");

  return (
    <section
      data-nav-theme="light"
      className="py-16 sm:py-24 lg:py-28 border-t border-zinc-200/80 bg-[#FAFAF9] text-zinc-950 transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 space-y-10 sm:space-y-12">
        {/* Editorial Split Header with Responsive Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
          <div className="lg:col-span-7 space-y-3">
            <motion.span
              className="inline-block font-sans text-[11px] font-semibold tracking-widest text-primary uppercase"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: easeDecelerate }}
            >
              The Architecture of Travel
            </motion.span>
            
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-zinc-950 leading-[1.15] break-words"
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
              <span className="block">
                {["Scattered", "across", "apps,"].map((word) => (
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
              <span className="block font-serif italic font-normal text-zinc-900 mt-1 sm:mt-2">
                {["or", "unified", "in", "one", "workspace."].map((word) => (
                  <motion.span
                    key={word}
                    variants={{
                      hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
                      visible: {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.7, ease: easeDecelerate },
                      },
                    }}
                    className="inline-block mr-[0.28em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </motion.h2>
          </div>

          <motion.div
            className="lg:col-span-5 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeDecelerate }}
          >
            {/* Minimalist Switch Toggle with Sliding Active Indicator */}
            <div className="relative inline-flex rounded-sm p-1 bg-zinc-200/60 border border-zinc-200 self-start sm:self-auto select-none">
              <button
                type="button"
                onClick={() => setMode("scattered")}
                className={`relative z-10 px-3.5 py-1.5 text-xs font-sans rounded-xs transition-colors duration-200 cursor-pointer ${
                  mode === "scattered"
                    ? "text-zinc-950 font-semibold"
                    : "text-zinc-600 hover:text-zinc-950 font-medium"
                }`}
              >
                {mode === "scattered" && (
                  <motion.div
                    layoutId="scattered-mode-pill"
                    className="absolute inset-0 bg-white rounded-xs shadow-xs"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">The Scattered Way</span>
              </button>

              <button
                type="button"
                onClick={() => setMode("unified")}
                className={`relative z-10 px-3.5 py-1.5 text-xs font-sans rounded-xs transition-colors duration-200 cursor-pointer ${
                  mode === "unified"
                    ? "text-white font-semibold"
                    : "text-zinc-600 hover:text-zinc-950 font-medium"
                }`}
              >
                {mode === "unified" && (
                  <motion.div
                    layoutId="scattered-mode-pill"
                    className="absolute inset-0 bg-zinc-950 rounded-xs shadow-xs"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">The Prava Workspace</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Card Display with Fluid AnimatePresence Stagger */}
        <AnimatePresence mode="wait">
          {mode === "scattered" ? (
            <motion.div
              key="scattered-grid"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.04 },
                },
                exit: { opacity: 0, transition: { duration: 0.2 } },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {SCATTERED_ITEMS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 14, scale: 0.98 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.4, ease: easeDecelerate },
                      },
                      exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15 } },
                    }}
                    className={`rounded-md border border-zinc-200/90 bg-white/70 p-4 flex-col justify-between space-y-3 opacity-90 hover:opacity-100 transition-opacity ${
                      index >= 4 ? "hidden sm:flex" : "flex"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-400">
                        <span>{item.header}</span>
                        <Icon className="h-3.5 w-3.5 text-zinc-400" />
                      </div>
                      <p className="text-xs font-medium text-zinc-800 whitespace-pre-line leading-relaxed font-sans">
                        {item.title}
                      </p>
                    </div>
                    <span className="text-[10px] font-sans text-zinc-400 border-t border-zinc-200/60 pt-2">
                      {item.detail}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="unified-grid"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.04 },
                },
                exit: { opacity: 0, transition: { duration: 0.2 } },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {UNIFIED_ITEMS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 14, scale: 0.98 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.4, ease: easeDecelerate },
                      },
                      exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15 } },
                    }}
                    className={`rounded-md border p-4 flex-col justify-between space-y-3 transition-all ${
                      index >= 4 ? "hidden sm:flex" : "flex"
                    } ${
                      item.accent
                        ? "border-primary/40 bg-[#F0F8FF]/80 shadow-xs"
                        : "border-zinc-200/90 bg-white shadow-xs"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-sans font-semibold uppercase tracking-wider">
                        <span
                          className={
                            item.accent
                              ? "text-primary"
                              : "text-zinc-500"
                          }
                        >
                          {item.header}
                        </span>
                        <Icon
                          className={`h-3.5 w-3.5 ${
                            item.accent ? "text-primary" : "text-zinc-400"
                          }`}
                        />
                      </div>
                      <p className="text-xs font-semibold text-zinc-900 leading-snug font-sans">
                        {item.title}
                      </p>
                    </div>
                    <span className="text-[10px] font-sans text-zinc-500 border-t border-zinc-200/60 pt-2 leading-relaxed">
                      {item.detail}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}



"use client";

import { useState } from "react";

import { motion } from "motion/react";
import { Check, ChevronDown, ChevronUp, Compass, MapPin, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const easeDecelerate = [0.16, 1, 0.3, 1] as const;

const PROMPTS = [
  "Can you rearrange tomorrow's stops in Jaipur to avoid the afternoon desert heat?",
  "Find a quiet rooftop chai vantage point overlooking Lake Pichola at sunset",
  "Suggest a verified artisan block-printing workshop near Amber",
] as const;

export function AiAssistanceSection() {
  const [applied, setApplied] = useState(false);
  const [showReasoning, setShowReasoning] = useState(true);
  const [activePrompt, setActivePrompt] = useState<string>(PROMPTS[0]);

  const [acceptedStops, setAcceptedStops] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
  });

  const toggleStop = (index: number, value: boolean) => {
    setAcceptedStops((prev) => ({ ...prev, [index]: value }));
    setApplied(false);
  };

  const selectedCount = Object.values(acceptedStops).filter(Boolean).length;

  return (
    <section
      data-nav-theme="dark"
      className="py-16 sm:py-24 lg:py-28 border-t border-border/80 bg-muted/20 backdrop-blur-xs transition-colors overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 space-y-10 sm:space-y-12">
        {/* Editorial Split Header with Responsive Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
          <div className="lg:col-span-6 space-y-3">
            <motion.span
              className="inline-block text-[11px] font-semibold tracking-widest text-primary uppercase font-sans"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: easeDecelerate }}
            >
              Intelligent Accelerant
            </motion.span>
            
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-foreground leading-[1.15] wrap-break-word text-balance"
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
                {["When", "you", "need"].map((word) => (
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
              <span className="block font-serif italic font-normal text-foreground/80 mt-1 sm:mt-2">
                {["a", "little", "help."].map((word) => (
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
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.25, ease: easeDecelerate }}
          >
            <p className="text-sm sm:text-base text-muted-foreground font-normal leading-relaxed wrap-break-word text-balance">
              Prava Assist is not an autonomous bot taking over your plans—it is an
              intelligent thinking partner grounded directly in your trip's real
              constraints. AI drafts proposals. You stay in full control.
            </p>
          </motion.div>
        </div>

        {/* AI Proposal Card Simulation */}
        <motion.div
          className="rounded-sm border border-border bg-card shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.1, ease: easeDecelerate }}
        >
          {/* Card Top Bar with min-w-0 for Mobile Truncation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-border/80 bg-muted/70 px-4 sm:px-6 py-2.5 sm:py-3 text-xs">
            <div className="flex items-center gap-2 text-foreground/80 min-w-0">
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
              <span className="truncate font-medium text-[11px] sm:text-xs">
                Contextual Journey Assistant · Trip: Royal Rajasthan (Day 02)
              </span>
            </div>
            <span className="text-muted-foreground text-[10px] sm:text-[11px] shrink-0 font-medium self-end sm:self-auto">
              Structured Route Proposal
            </span>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
            {/* User Prompt Row with Default User Image from /avatars/default-avatar.jpg */}
            <div className="flex items-start gap-2.5 sm:gap-4 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/avatars/default-avatar.jpg"
                alt="User Avatar"
                className="h-7 w-7 sm:h-9 sm:w-9 rounded-full object-cover border border-border shrink-0 shadow-2xs mt-0.5"
              />
              <p className="text-xs sm:text-sm font-medium text-foreground wrap-break-word flex-1 min-w-0 pt-0.5 sm:pt-1.5">
                "{activePrompt}"
              </p>
            </div>

            {/* Prava Assistant Proposal Box with Ichinose Image from /avatars/ichinose.png */}
            <div className="flex items-start gap-2.5 sm:gap-4 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/avatars/ichinose.png"
                alt="Prava Assistant"
                className="h-7 w-7 sm:h-9 sm:w-9 rounded-full object-cover border border-primary/50 shrink-0 shadow-2xs mt-0.5"
              />

              <div className="flex-1 min-w-0 space-y-4">
                {/* Collapsible Reasoning Process */}
                <div className="rounded-xs border border-border bg-muted/60 p-3 sm:p-3.5 space-y-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => setShowReasoning(!showReasoning)}
                    className="w-full flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground cursor-pointer font-medium gap-2"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Compass className="h-3 w-3 text-primary shrink-0" />
                      <span className="truncate">Route Reasoning & Solar Calculation</span>
                    </span>
                    {showReasoning ? (
                      <ChevronUp className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                    )}
                  </button>
                  {showReasoning && (
                    <p className="text-xs text-muted-foreground leading-relaxed font-sans pt-1 border-t border-border/60 wrap-break-word">
                      Analyzing solar angle and transit between Pink City, Amer Ridge, and
                      Nahargarh. Moving open-air Amer Palace to 08:30 avoids peak 32°C afternoon
                      heat and tourist crowds. Shifting Anokhi Museum indoor galleries to 13:00 provides
                      cool shelter, saving Nahargarh Fort ramparts for golden hour at 17:15.
                    </p>
                  )}
                </div>

                {/* Narrative Summary */}
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed wrap-break-word">
                  Here's an optimized schedule for tomorrow. By visiting Amer early in the morning,
                  you avoid the harsh desert sun and gain an unhurried shaded lunch before
                  climbing to Nahargarh for sunset.
                </p>

                {/* Structured Travel Proposal Schedule with Mobile Responsive Rows */}
                <div className="rounded-xs border border-border overflow-hidden bg-card text-xs shadow-2xs min-w-0">
                  <div className="flex items-center justify-between p-3 sm:p-4 sm:px-6 bg-muted text-[11px] text-muted-foreground uppercase tracking-wider border-b border-border/80 font-medium">
                    <span className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">Re-sequenced Itinerary</span>
                    </span>
                    <span className="tabular-nums shrink-0 ml-2">
                      {selectedCount} of 4 Included
                    </span>
                  </div>

                  <div className="divide-y divide-border/80">
                    {[
                      {
                        time: "08:30",
                        title: "Amer Palace & Sheesh Mahal",
                        loc: "Amber Ridge · Morning mirror light",
                        tag: "Outdoor Heritage",
                        duration: "2h 30m dwell",
                      },
                      {
                        time: "11:30",
                        title: "Panna Meena Ka Kund Stepwell",
                        loc: "Geometric stepwell dwell in Amber foothills",
                        tag: "Architectural Dwell",
                        duration: "45m dwell",
                      },
                      {
                        time: "13:00",
                        title: "Anokhi Museum & Lunch",
                        loc: "1135 AD Amber Ramparts · Shaded thali",
                        tag: "Shaded Dining",
                        duration: "1h 30m dining",
                      },
                      {
                        time: "17:15",
                        title: "Sunset over Nahargarh Fort",
                        loc: "Aravalli Range crest overlooking Pink City",
                        tag: "Sunset Overlook",
                        duration: "1h 45m golden hour",
                      },
                    ].map((item, index) => {
                      const isChosen = acceptedStops[index] !== false;
                      return (
                        <div
                          key={index}
                          className={`p-3 sm:p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-colors ${
                            isChosen
                              ? "hover:bg-muted/60"
                              : "opacity-50 bg-muted/40"
                          }`}
                        >
                          {/* Left: Time + Title + Context Details */}
                          <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                            <span className="text-xs font-semibold text-primary w-11 sm:w-12 shrink-0 tabular-nums pt-0.5">
                              {item.time}
                            </span>
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <span
                                  className={`font-medium text-xs sm:text-sm text-foreground wrap-break-word ${
                                    !isChosen ? "line-through text-muted-foreground" : ""
                                  }`}
                                >
                                  {item.title}
                                </span>
                                <span className="text-[9px] sm:text-[10px] text-muted-foreground bg-muted px-1.5 sm:px-2 py-0.5 rounded-full font-medium shrink-0">
                                  {item.tag}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground wrap-break-word leading-snug">
                                {item.loc} · <span className="text-muted-foreground/80 whitespace-nowrap">{item.duration}</span>
                              </p>
                            </div>
                          </div>

                          {/* Right: Interactive Yes / No Selection Buttons */}
                          <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/60 sm:border-transparent shrink-0">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                              Include?
                            </span>
                            <div className="inline-flex items-center rounded-xs p-0.5 bg-muted border border-border shadow-2xs">
                              <button
                                type="button"
                                onClick={() => toggleStop(index, true)}
                                className={`px-2.5 py-1 text-[11px] rounded-2xs font-medium transition-all cursor-pointer ${
                                  isChosen
                                    ? "bg-card text-primary shadow-xs font-semibold"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleStop(index, false)}
                                className={`px-2.5 py-1 text-[11px] rounded-2xs font-medium transition-all cursor-pointer ${
                                  !isChosen
                                    ? "bg-card text-destructive shadow-xs font-semibold"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                No
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Accept Proposal Action Row with Dynamic Count and Mobile Full-Width Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-muted-foreground leading-tight">
                    Atomic transaction: {selectedCount} of 4 stops selected to update in your workspace
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      onClick={() => setApplied(true)}
                      disabled={applied || selectedCount === 0}
                      className={`w-full sm:w-auto text-xs h-9 px-4 rounded-sm gap-1.5 transition-all cursor-pointer font-medium ${
                        applied
                          ? "bg-success text-white hover:bg-success"
                          : "dashboard-btn-primary"
                      }`}
                    >
                      {applied ? (
                        <>
                          <Check className="h-3.5 w-3.5 shrink-0" />
                          <span>Applied {selectedCount} Stops to Itinerary</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 shrink-0" />
                          <span>Accept {selectedCount} Stops</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Prompt Suggestions */}
                <div className="pt-4 border-t border-border/80 space-y-2">
                  <span className="text-[10px] uppercase text-muted-foreground font-medium tracking-wider">
                    Try other contextual prompts:
                  </span>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                    {PROMPTS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setActivePrompt(p);
                          setApplied(false);
                        }}
                        className="text-[11px] px-2.5 py-1.5 rounded-xs border border-border bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground transition-colors cursor-pointer text-left wrap-break-word max-w-full"
                      >
                        "{p}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

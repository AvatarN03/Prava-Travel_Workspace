"use client";

import Link from "next/link";
import { useState } from "react";

import { motion } from "motion/react";
import { Check, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { User } from "@supabase/supabase-js";

interface PricingSectionProps {
  user: User | null;
}

const easeDecelerate = [0.16, 1, 0.3, 1] as const;

export function PricingSection({ user }: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  return (
    <section
      id="pricing"
      data-nav-theme="dark"
      className="py-20 sm:py-28 lg:py-32 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xs transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 space-y-12 sm:space-y-16">
        
        {/* Section Header with Responsive Typography */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <motion.span
            className="inline-block text-[11px] font-semibold tracking-widest text-[#2D9BF0] uppercase font-sans"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: easeDecelerate }}
          >
            Transparent Membership
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
            <span className="block">
              {["Simple,", "transparent"].map((word) => (
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
            <span className="block font-serif italic font-normal text-zinc-800 dark:text-zinc-200 mt-1 sm:mt-2">
              {["pricing", "for", "every", "journey."].map((word) => (
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

          <motion.p
            className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed break-words [text-wrap:balance]"
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.25, ease: easeDecelerate }}
          >
            Start free with full workspace access. Upgrade when you need higher trip capacities
            and deeper AI reasoning for complex itineraries.
          </motion.p>

          {/* Billing Switcher with Full Dark Theme Support & Spring Sliding Pill */}
          <motion.div
            className="pt-2 flex items-center justify-center select-none"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.35, ease: easeDecelerate }}
          >
            <div className="relative inline-flex items-center rounded-sm p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`relative z-10 px-3.5 py-1.5 text-xs rounded-xs transition-colors cursor-pointer font-medium font-sans ${
                  billingCycle === "monthly"
                    ? "text-zinc-950 dark:text-zinc-50 font-semibold"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {billingCycle === "monthly" && (
                  <motion.div
                    layoutId="billing-cycle-pill"
                    className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-xs shadow-xs border border-zinc-200/60 dark:border-zinc-700"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Monthly</span>
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-xs transition-colors cursor-pointer font-medium font-sans ${
                  billingCycle === "annual"
                    ? "text-zinc-950 dark:text-zinc-50 font-semibold"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {billingCycle === "annual" && (
                  <motion.div
                    layoutId="billing-cycle-pill"
                    className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-xs shadow-xs border border-zinc-200/60 dark:border-zinc-700"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Annual</span>
                <span className="relative z-10 bg-[#2D9BF0] text-white text-[10px] px-1.5 py-0.5 rounded-xs font-semibold">
                  Save 16.5%
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* 2-Tier Pricing Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0.1 },
            },
          }}
        >
          {/* Plan 1: Free Explorer */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeDecelerate } },
            }}
            className="rounded-sm border border-zinc-200 dark:border-zinc-800 bg-[#FAFAF9] dark:bg-zinc-900/80 p-6 sm:p-8 flex flex-col justify-between space-y-8 shadow-xs"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-zinc-950 dark:text-zinc-50">
                    Free Explorer
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 font-sans">
                    For solo travelers and occasional explorers.
                  </p>
                </div>
                <span className="text-xs uppercase px-2 py-0.5 rounded-xs bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium font-sans">
                  Starter
                </span>
              </div>

              <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80 font-sans">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-light text-zinc-950 dark:text-zinc-50 tabular-nums">
                    ₹0
                  </span>
                  <span className="text-xs text-zinc-500">/ forever</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  No credit card required. Free tier forever.
                </p>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3 text-xs text-zinc-700 dark:text-zinc-300 pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80 font-sans">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#2D9BF0] shrink-0 mt-0.5" />
                  <span>
                    <strong>10 Trips</strong> total workspace capacity
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#2D9BF0] shrink-0 mt-0.5" />
                  <span>
                    <strong>30 AI Workspace Credits</strong> per month (Proposal Actions)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#2D9BF0] shrink-0 mt-0.5" />
                  <span>Full 7-tab trip workspace (Itinerary, Stays, Expenses, Notes)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#2D9BF0] shrink-0 mt-0.5" />
                  <span>Live travel essentials (Weather, Currency FX, Emergency)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#2D9BF0] shrink-0 mt-0.5" />
                  <span>Offline cache via IndexedDB for flights & roaming</span>
                </li>
              </ul>
            </div>

            <Button
              asChild
              variant="outline"
              className="w-full text-xs h-10 rounded-sm border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer shadow-none font-medium font-sans"
            >
              <Link href={user ? "/dashboard" : "/auth?tab=signup"}>
                <span>{user ? "Open Dashboard" : "Start Planning Free"}</span>
              </Link>
            </Button>
          </motion.div>

          {/* Plan 2: Pro Wanderer (Featured) */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeDecelerate } },
            }}
            className="relative rounded-sm border-2 border-[#2D9BF0] bg-white dark:bg-zinc-900 p-6 sm:p-8 flex flex-col justify-between space-y-8 shadow-xl shadow-[#2D9BF0]/5"
          >
            {/* Popular Badge */}
            <div className="absolute -top-3 right-6 bg-[#2D9BF0] text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-xs shadow-xs flex items-center gap-1 font-sans">
              <Sparkles className="h-3 w-3" />
              <span>Recommended</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-zinc-950 dark:text-zinc-50">
                    Pro Wanderer
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 font-sans">
                    For frequent adventurers, digital nomads & creators.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80 font-sans">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-light text-zinc-950 dark:text-zinc-50 tabular-nums">
                    {billingCycle === "annual" ? "₹167" : "₹200"}
                  </span>
                  <span className="text-xs text-zinc-500">
                    / mo {billingCycle === "annual" ? "(billed annually)" : ""}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {billingCycle === "annual"
                    ? "₹2,004 billed once per year · Save ₹396"
                    : "Cancel or pause subscription anytime"}
                </p>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3 text-xs text-zinc-700 dark:text-zinc-300 pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80 font-sans">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#2D9BF0] shrink-0 mt-0.5" />
                  <span>
                    <strong>25 Active Trips</strong> with unlimited trip archives
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#2D9BF0] shrink-0 mt-0.5" />
                  <span>
                    <strong>150 AI Workspace Credits</strong> per month (5x capacity)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#2D9BF0] shrink-0 mt-0.5" />
                  <span>AI Route & Itinerary Resequencing (heat & transit buffers)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#2D9BF0] shrink-0 mt-0.5" />
                  <span>Publish unlimited public itineraries & travel stories</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#2D9BF0] shrink-0 mt-0.5" />
                  <span>Verified Creator badge & custom @username profile</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#2D9BF0] shrink-0 mt-0.5" />
                  <span>Priority multi-device cloud synchronization</span>
                </li>
              </ul>
            </div>

            <Button
              asChild
              className="w-full text-xs h-10 rounded-sm bg-zinc-950 hover:bg-black text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white cursor-pointer shadow-none transition-all font-medium font-sans hover:scale-102 active:scale-98"
            >
              <Link href={user ? "/subscription" : "/auth?tab=signup"}>
                <span>{user ? "Manage Subscription" : "Upgrade to Pro"}</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Guarantee Banner */}
        <motion.div
          className="max-w-2xl mx-auto rounded-sm border border-zinc-200/80 dark:border-zinc-800/80 bg-[#FAFAF9]/80 dark:bg-zinc-900/60 p-4 flex flex-wrap items-center justify-around gap-4 text-xs text-zinc-500 font-sans"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: easeDecelerate }}
        >
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="h-4 w-4 text-[#2D9BF0]" />
            <span>Encrypted Payments</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <Zap className="h-4 w-4 text-[#2D9BF0]" />
            <span>Instant Activation</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <Check className="h-4 w-4 text-[#2D9BF0]" />
            <span>Cancel Anytime</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

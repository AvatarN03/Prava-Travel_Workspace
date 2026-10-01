"use client";

import Link from "next/link";
import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Compass, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

import { HeroBackgroundPattern } from "./hero-background-pattern";
import { INDIAN_JOURNEYS } from "../hero-journeys";

import type { User } from "@supabase/supabase-js";

interface HeroSectionProps {
  user: User | null;
}

const easeDecelerate = [0.16, 1, 0.3, 1] as const;

export function HeroSection({ user }: HeroSectionProps) {
  const [selectedJourneyIndex, setSelectedJourneyIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);

  const currentJourney = INDIAN_JOURNEYS[selectedJourneyIndex];
  const currentPhoto = currentJourney.photos[photoIndex % currentJourney.photos.length];

  const handleSelectJourney = (index: number) => {
    setSelectedJourneyIndex(index);
    setPhotoIndex(0);
  };

  const handleCyclePhoto = () => {
    setPhotoIndex((prev) => (prev + 1) % currentJourney.photos.length);
  };

  return (
    <section
      data-nav-theme="light"
      className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 bg-[#FAFAF9] text-zinc-950"
    >
      {/* Topographic & Cartographic Background Pattern */}
      <HeroBackgroundPattern />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Editorial Narrative Column */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 lg:pt-4">
            <div className="space-y-4">
              
              {/* Eyebrow Pill */}
              <motion.div
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: easeDecelerate }}
              >
                <span className="inline-block font-sans text-[11px] font-semibold tracking-widest text-[#2D9BF0] uppercase bg-[#2D9BF0]/10 px-2.5 py-1 rounded-sm border border-[#2D9BF0]/20">
                  Prava Travel Workspace
                </span>
              </motion.div>
              
              {/* Responsive Title with Staggered Kinetic Typography */}
              <motion.h1
                className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-zinc-950 leading-[1.14] break-words"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.09,
                      delayChildren: 0.08,
                    },
                  },
                }}
                initial="hidden"
                animate="visible"
              >
                <span className="block">
                  {["Your", "journey,"].map((word) => (
                    <motion.span
                      key={word}
                      variants={{
                        hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
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
                  {["in", "one", "place."].map((word) => (
                    <motion.span
                      key={word}
                      variants={{
                        hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
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
              </motion.h1>

              {/* Subtitle Paragraph */}
              <motion.p
                className="text-sm sm:text-base lg:text-lg text-zinc-600 font-normal leading-relaxed max-w-lg pt-1 break-words [text-wrap:balance]"
                initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 0.45, ease: easeDecelerate }}
              >
                Plan the route. Organize the details.
                <span className="block sm:inline sm:ml-1">Keep the journey moving.</span>
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: easeDecelerate }}
            >
              <Button
                asChild
                className="bg-zinc-950 hover:bg-black text-white text-xs font-medium px-5 py-2.5 h-10 rounded-sm gap-2 cursor-pointer shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link href={user ? "/dashboard" : "/auth?tab=signup"}>
                  <span>Start Planning</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>

              <a
                href="#workspace"
                className="text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer px-3 py-2 font-sans hover:underline underline-offset-4"
              >
                Explore Workspace
              </a>
            </motion.div>

            {/* Interactive Journey Switcher Chips with Fluid Pill Slider */}
            <motion.div
              className="pt-2 sm:pt-4 space-y-2.5"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: easeDecelerate }}
            >
              <div className="flex items-center justify-between max-w-md">
                <span className="block font-sans text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                  Featured Indian Journeys
                </span>
                <span className="text-[10px] text-zinc-400 font-sans">
                  Click to preview
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 max-w-md">
                {INDIAN_JOURNEYS.map((journey, idx) => {
                  const isSelected = idx === selectedJourneyIndex;
                  return (
                    <button
                      key={journey.id}
                      type="button"
                      onClick={() => handleSelectJourney(idx)}
                      className={`relative text-xs px-3.5 py-2.5 rounded-sm font-sans font-medium transition-all duration-200 cursor-pointer border flex items-center justify-between text-left overflow-hidden select-none ${
                        isSelected
                          ? "text-white border-zinc-950 shadow-xs"
                          : "bg-white/90 text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-white shadow-2xs"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="active-journey-indicator"
                          className="absolute inset-0 bg-zinc-950"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 font-semibold">{journey.name}</span>
                      <span className="relative z-10 opacity-70 text-[10px]">
                        {journey.region}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* 3 Numbered Micro-Pillars */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-6 sm:pt-8 border-t border-zinc-200/80"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.52, ease: easeDecelerate }}
            >
              <div className="space-y-1 group">
                <span className="font-sans text-[11px] font-semibold text-zinc-900 group-hover:text-[#2D9BF0] transition-colors">
                  01. Route
                </span>
                <p className="text-xs text-zinc-500 leading-normal font-sans">
                  Day-by-day flow without clutter
                </p>
              </div>

              <div className="space-y-1 group">
                <span className="font-sans text-[11px] font-semibold text-zinc-900 group-hover:text-[#2D9BF0] transition-colors">
                  02. Stay & Docs
                </span>
                <p className="text-xs text-zinc-500 leading-normal font-sans">
                  Bookings, tickets & Vande Bharat passes
                </p>
              </div>

              <div className="space-y-1 group">
                <span className="font-sans text-[11px] font-semibold text-zinc-900 group-hover:text-[#2D9BF0] transition-colors">
                  03. Essentials
                </span>
                <p className="text-xs text-zinc-500 leading-normal font-sans">
                  UPI, offline maps & emergency numbers
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Dynamic Indian Workspace Preview Frame */}
          <motion.div
            className="lg:col-span-6 w-full"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: easeDecelerate }}
          >
            <div className="rounded-md border border-zinc-200/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 transition-all shadow-xl shadow-zinc-950/5">
              
              {/* Top Frame Metadata with Fluid Transition */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 text-[11px] font-sans font-medium tracking-wider text-zinc-600 border-b border-zinc-200/80">
                <div className="flex items-center gap-2 min-h-[22px]">
                  <Compass className="h-3.5 w-3.5 text-[#2D9BF0] shrink-0" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentJourney.id + "-title"}
                      initial={{ opacity: 0, y: -4, filter: "blur(2px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: 4, filter: "blur(2px)" }}
                      transition={{ duration: 0.25, ease: easeDecelerate }}
                      className="font-semibold text-zinc-900 truncate"
                    >
                      {currentJourney.name} · {currentJourney.dates}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentJourney.id + "-coords"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[10px] text-zinc-500 truncate font-sans"
                  >
                    {currentJourney.coordinates}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Dynamic Archival Photo with Smooth Crossfade */}
              <div className="relative mt-3.5 h-64 sm:h-80 w-full overflow-hidden rounded-xs border border-zinc-200/80 bg-zinc-950 group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPhoto.url}
                    src={currentPhoto.url}
                    alt={currentPhoto.caption}
                    initial={{ opacity: 0.4, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.3 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="h-full w-full object-cover grayscale-[10%] contrast-[1.04]"
                  />
                </AnimatePresence>
                
                {/* Photo Caption Pill */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhoto.caption}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute bottom-2.5 left-2.5 rounded-xs bg-black/75 px-2.5 py-1 text-[10px] font-sans font-medium uppercase tracking-wider text-white backdrop-blur-xs max-w-[85%] truncate"
                  >
                    {currentPhoto.caption}
                  </motion.div>
                </AnimatePresence>

                {/* Switch Photo Button in Top Right */}
                <button
                  type="button"
                  onClick={handleCyclePhoto}
                  className="absolute top-2.5 right-2.5 rounded-xs bg-black/75 hover:bg-black px-2 py-1 text-[10px] font-sans font-medium text-white/90 backdrop-blur-xs flex items-center gap-1 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Next photo"
                >
                  <RefreshCw className="h-2.5 w-2.5" />
                  <span>
                    Photo {(photoIndex % currentJourney.photos.length) + 1}/
                    {currentJourney.photos.length}
                  </span>
                </button>
              </div>

              {/* Dynamic Widgets Below Photo with Smooth Crossfade */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 pt-3.5 border-t border-zinc-200/80">
                
                {/* Day Itinerary Highlights */}
                <div className="sm:col-span-7 space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-sans font-semibold tracking-wider uppercase text-zinc-500">
                    <span>Day 02 · Itinerary</span>
                    <span className="text-zinc-500 font-sans">
                      {currentJourney.itinerary.length} stops logged
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentJourney.id + "-itinerary"}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3, ease: easeDecelerate }}
                      className="space-y-2 text-xs"
                    >
                      {currentJourney.itinerary.map((stop, sIdx) => (
                        <motion.div
                          key={sIdx}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: sIdx * 0.05, ease: easeDecelerate }}
                          className="flex items-start gap-2.5"
                        >
                          <span
                            className={`font-sans text-[11px] font-medium shrink-0 ${
                              stop.isPrimary
                                ? "font-semibold text-[#2D9BF0]"
                                : "text-zinc-500"
                            }`}
                          >
                            {stop.time}
                          </span>
                          <div>
                            <p className="font-medium text-zinc-900 font-sans">
                              {stop.title}
                            </p>
                            <p className="text-[11px] text-zinc-500 leading-snug font-sans">
                              {stop.location}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Right Sub-Widgets: Budget in INR & Verified Checklist */}
                <div className="sm:col-span-5 space-y-3.5 border-t sm:border-t-0 sm:border-l border-zinc-200/80 pt-3 sm:pt-0 sm:pl-4">
                  {/* Budget */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-500">
                      <span>Trip Budget</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={currentJourney.id + "-budget-total"}
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="font-semibold text-zinc-900 font-sans"
                        >
                          {currentJourney.budget.total}
                        </motion.span>
                      </AnimatePresence>
                    </div>

                    {/* Fluid Animated Progress Bar */}
                    <div className="h-1.5 w-full bg-zinc-100 border border-zinc-200/60 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-zinc-900 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: currentJourney.budget.percent }}
                        transition={{ duration: 0.6, ease: easeDecelerate }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={currentJourney.id + "-budget-spent"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-zinc-500 font-sans"
                        >
                          Spent {currentJourney.budget.spent}
                        </motion.span>
                      </AnimatePresence>

                      <AnimatePresence mode="wait">
                        <motion.span
                          key={currentJourney.id + "-budget-left"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="font-semibold text-[#2D9BF0] font-sans"
                        >
                          {currentJourney.budget.left}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-1.5 pt-2 border-t border-zinc-200/80">
                    <div className="flex items-center justify-between text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-500">
                      <span>Checklist</span>
                      <span className="font-sans">3 of 3</span>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.ul
                        key={currentJourney.id + "-checklist"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-1 text-[11px] text-zinc-700 font-sans"
                      >
                        {currentJourney.checklist.map((item, cIdx) => (
                          <motion.li
                            key={cIdx}
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: cIdx * 0.04 }}
                            className="flex items-center gap-1.5"
                          >
                            <Check className="h-3 w-3 text-[#2D9BF0] shrink-0" />
                            <span className="truncate">{item}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </AnimatePresence>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}


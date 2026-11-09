"use client";

import { motion } from "motion/react";
import { Clock, MapPin, Navigation } from "lucide-react";

import { ITINERARY_SCHEDULE_ITEMS } from "@/features/landing/itinerary-data";

const easeDecelerate = [0.16, 1, 0.3, 1] as const;

export function ItinerarySection() {
  return (
    <section data-nav-theme="light" className="py-16 sm:py-24 lg:py-28 border-t border-zinc-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 space-y-10 sm:space-y-12">
        {/* Editorial Split Header with Responsive Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
          <div className="lg:col-span-6 space-y-3">
            <motion.span
              className="inline-block text-[11px] font-semibold tracking-widest text-primary uppercase"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: easeDecelerate }}
            >
              Temporal Structure
            </motion.span>
            
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-zinc-950 leading-[1.15] break-words [text-wrap:balance]"
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
                {["Plan", "the", "days."].map((word) => (
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
              <span className="block font-serif italic font-normal text-zinc-800 mt-1 sm:mt-2">
                {["Not", "the", "chaos."].map((word) => (
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
            className="hidden lg:block lg:col-span-6"
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.25, ease: easeDecelerate }}
          >
            <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed break-words [text-wrap:balance]">
              An itinerary should breathe. Prava organizes your hours with natural transit
              buffers, contextual coordinates, and unhurried pacing so your travel feels like
              discovery, not a frantic checklist.
            </p>
          </motion.div>
        </div>

        {/* Timeline Items in Pure Crisp Light Theme */}
        <motion.div
          className="border border-zinc-200/90 rounded-sm divide-y divide-zinc-200/80 bg-[#FAFAF9]/80 overflow-hidden shadow-xs"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
        >
          {ITINERARY_SCHEDULE_ITEMS.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: easeDecelerate },
                },
              }}
              className={`p-5 sm:p-7 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start hover:bg-white transition-colors ${item.hideOnMobile ? "hidden sm:grid" : ""}`}
            >
              {/* Time Column */}
              <div className="md:col-span-3 space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary md:hidden" />
                  <span className="text-2xl sm:text-3xl font-light text-zinc-950 tracking-tight tabular-nums">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 tracking-normal">{item.duration}</p>
              </div>

              {/* Main Detail Column */}
              <div className="md:col-span-6 space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-primary break-words">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed pt-1 break-words">
                  {item.description}
                </p>
              </div>

              {/* Transit Note Column */}
              <div className="md:col-span-3 md:pl-4">
                <div className="rounded-xs border border-zinc-200/90 bg-white p-3.5 space-y-1 text-xs shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                    <Navigation className="h-3 w-3 text-primary" />
                    <span>Transit Buffer</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-snug">
                    {item.transit}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


"use client";

import Link from "next/link";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const easeDecelerate = [0.16, 1, 0.3, 1] as const;

export function LandscapeBanner() {
  return (
    <section
      data-nav-theme="dark"
      data-always-dark="true"
      className="relative w-full h-[460px] sm:h-[540px] overflow-hidden flex items-center justify-center border-y border-zinc-200 dark:border-zinc-800"
    >
      {/* Background Scenic Himalayan Pass / Tea Estate Landscape */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=2000&q=85"
        alt="Scenic tea hills mist and mountain highway"
        className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.55] contrast-[1.08]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/65" />

      {/* Center Editorial Content with Responsive Typography */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center space-y-4 sm:space-y-5">
        <motion.span
          className="inline-block text-[11px] font-semibold tracking-widest text-[#2D9BF0] uppercase font-sans"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: easeDecelerate }}
        >
          Where Next?
        </motion.span>

        <motion.h2
          className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight break-words [text-wrap:balance]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.09,
                delayChildren: 0.05,
              },
            },
          }}
        >
          <span className="block">
            {["The", "journey"].map((word) => (
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
          <span className="block font-serif italic font-normal text-white mt-1 sm:mt-2">
            {["is", "yours."].map((word) => (
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
          className="text-sm sm:text-base text-zinc-200 font-normal leading-relaxed max-w-xl mx-auto break-words [text-wrap:balance]"
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.25, ease: easeDecelerate }}
        >
          From high Himalayan passes to quiet backwaters, keep every step organized in peace.
        </motion.p>

        <motion.div
          className="pt-2 sm:pt-3"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.4, ease: easeDecelerate }}
        >
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 bg-white text-zinc-950 hover:bg-zinc-100 px-5 py-2.5 rounded-sm text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-lg hover:scale-102 active:scale-98"
          >
            <span>Explore Prava</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}


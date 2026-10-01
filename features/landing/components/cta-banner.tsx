"use client";

import Link from "next/link";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CtaBackgroundPattern } from "./cta-background-pattern";

import type { User } from "@supabase/supabase-js";

interface CtaBannerProps {
  user: User | null;
}

const easeDecelerate = [0.16, 1, 0.3, 1] as const;

export function CtaBanner({ user }: CtaBannerProps) {
  return (
    <section
      data-nav-theme="light"
      className="relative py-20 sm:py-28 lg:py-32 border-t border-zinc-200/80 bg-white text-center overflow-hidden"
    >
      {/* Animated Fluid Canvas Background */}
      <CtaBackgroundPattern />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-10 space-y-6">
        <motion.span
          className="inline-block text-[11px] font-semibold tracking-widest text-[#2D9BF0] uppercase font-sans"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: easeDecelerate }}
        >
          Get Started
        </motion.span>

        <motion.h2
          className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-zinc-950 leading-[1.12] break-words [text-wrap:balance]"
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
            {["Make", "space"].map((word) => (
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
            {["for", "the", "journey."].map((word) => (
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
          className="text-sm sm:text-base lg:text-lg text-zinc-600 font-normal leading-relaxed max-w-md mx-auto break-words [text-wrap:balance]"
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.25, ease: easeDecelerate }}
        >
          Plan less chaotically. Travel more intentionally.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.35, ease: easeDecelerate }}
        >
          <Button
            asChild
            className="bg-zinc-950 hover:bg-black text-white text-xs font-medium px-6 h-11 rounded-sm gap-2 cursor-pointer shadow-none transition-all hover:scale-102 active:scale-98 font-sans"
          >
            <Link href={user ? "/dashboard" : "/auth?tab=signup"}>
              <span>Start Planning</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>

          <a
            href="#workspace"
            className="text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer px-4 py-2.5 font-sans hover:underline underline-offset-4"
          >
            Explore Prava
          </a>
        </motion.div>
      </div>
    </section>
  );
}


"use client";

import { motion } from "motion/react";

const easeDecelerate = [0.16, 1, 0.3, 1] as const;

export function CorePhilosophySection() {
  const principles = [
    {
      num: "01",
      title: "PLAN",
      subtitle: "Build your trip your way.",
      description:
        "No rigid pre-baked templates. Add stops, flexible timeblocks, and open exploration hours with total creative freedom.",
    },
    {
      num: "02",
      title: "ORGANIZE",
      subtitle: "Keep everything together.",
      description:
        "Accommodations, vouchers, passes, express train routes, UPI payments, and split expenses reside in a single coherent workspace.",
    },
    {
      num: "03",
      title: "ASSIST",
      subtitle: "Use AI when you need it.",
      description:
        "Never an overbearing chatbot. Contextual intelligence that respects your taste, solves route puzzles, and stays quiet otherwise.",
    },
  ];

  return (
    <section data-nav-theme="light" className="py-16 sm:py-24 lg:py-28 bg-[#FAFAF9] border-t border-zinc-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 space-y-12 sm:space-y-16">
        {/* Section Header with Responsive Typography */}
        <div className="space-y-3 max-w-2xl">
          <motion.span
            className="inline-block text-[11px] font-semibold tracking-widest text-[#2D9BF0] uppercase font-sans"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: easeDecelerate }}
          >
            Core Philosophy
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
              {["Three", "principles", "for"].map((word) => (
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
              {["modern", "journeys."].map((word) => (
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

        {/* 3 Columns in Pure Crisp Light Theme with Staggered Entrance */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-16 pt-4 border-t border-zinc-200/80"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
              },
            },
          }}
        >
          {principles.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeDecelerate } },
              }}
              className="space-y-3 sm:space-y-4"
            >
              <span className="text-xs text-zinc-400 block tabular-nums font-medium font-sans">
                {item.num}
              </span>
              <h3 className="font-bold text-lg tracking-tight text-zinc-950 font-sans">
                {item.title}
              </h3>
              <p className="text-sm font-medium text-zinc-800 font-sans">
                {item.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed break-words font-sans">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


"use client";

import { useMemo, useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Compass } from "lucide-react";

import {
  COMMUNITY_STORIES,
  COMMUNITY_STORY_CATEGORIES,
  type CommunityStoryCategory,
} from "@/features/landing/community-stories-data";

const easeDecelerate = [0.16, 1, 0.3, 1] as const;

export function CommunityStoriesSection() {
  const [activeCategory, setActiveCategory] = useState<CommunityStoryCategory>("all");

  const filteredStories = useMemo(() => {
    if (activeCategory === "all") {
      return COMMUNITY_STORIES.slice(0, 3);
    }

    return COMMUNITY_STORIES.filter((story) => story.category === activeCategory).slice(0, 3);
  }, [activeCategory]);

  return (
    <section
      id="community"
      data-nav-theme="light"
      className="border-t border-zinc-200/80 bg-white py-16 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:space-y-12 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-3 lg:col-span-6">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: easeDecelerate }}
            >
              <Compass className="h-3.5 w-3.5 text-primary" />
              <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-primary">
                Shared Journeys
              </span>
            </motion.div>

            <motion.h2
              className="break-words text-3xl font-light leading-[1.15] tracking-tight text-zinc-950 [text-wrap:balance] sm:text-4xl lg:text-5xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
              }}
            >
              <span className="block">
                {["Before", "you", "go,"].map((word) => (
                  <motion.span
                    key={word}
                    variants={{
                      hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
                      visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: easeDecelerate } },
                    }}
                    className="mr-[0.28em] inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="mt-1 block font-serif font-normal italic text-zinc-800 sm:mt-2">
                {["see", "how", "others", "travelled."].map((word) => (
                  <motion.span
                    key={word}
                    variants={{
                      hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
                      visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: easeDecelerate } },
                    }}
                    className="mr-[0.28em] inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </motion.h2>
          </div>

          <div className="space-y-4 lg:col-span-6">
            <motion.p
              className="hidden break-words text-sm font-normal leading-relaxed text-zinc-600 [text-wrap:balance] lg:block sm:text-base"
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.25, ease: easeDecelerate }}
            >
              Authentic travel itineraries shared by creators, writers, and explorers. Clone verified stops,
              palace stays, and mountain passes straight into your own Prava workspace with 1 click.
            </motion.p>

            <motion.div
              className="flex flex-wrap select-none items-center gap-1.5 pt-1"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.35, ease: easeDecelerate }}
            >
              {COMMUNITY_STORY_CATEGORIES.map((category) => {
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`relative cursor-pointer rounded-md px-3.5 py-1.5 font-sans text-xs font-medium transition-colors ${
                      isActive ? "text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="community-category-pill"
                        className="absolute inset-0 rounded-md bg-zinc-950 shadow-xs"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{category.label}</span>
                  </button>
                );
              })}
            </motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              exit: { opacity: 0, transition: { duration: 0.15 } },
            }}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 md:snap-none"
          >
            {filteredStories.map((story) => (
              <motion.div
                key={story.id}
                variants={{
                  hidden: { opacity: 0, y: 16, scale: 0.98 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: easeDecelerate } },
                  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15 } },
                }}
                className="group flex min-w-[78%] cursor-pointer snap-start flex-col justify-between overflow-hidden rounded-sm border border-zinc-200/90 bg-[#FAFAF9]/90 shadow-xs transition-all hover:border-zinc-300 md:min-w-0"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-zinc-100 sm:h-52 md:h-60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-103"
                    />
                    <div className="absolute left-3 top-3 rounded-xs bg-black/75 px-2.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-xs">
                      {story.destination}
                    </div>
                  </div>

                  <div className="space-y-2.5 p-4 md:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="break-words text-base font-semibold leading-snug text-zinc-950 transition-colors group-hover:text-primary">
                        {story.title}
                      </h3>
                      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 transition-colors group-hover:text-primary" />
                    </div>
                    <p className="line-clamp-3 break-words font-sans text-xs leading-relaxed text-zinc-600">
                      {story.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-200/80 p-4 pt-3 font-sans text-[11px] text-zinc-500 md:p-5 md:pt-3">
                  <span className="max-w-[60%] truncate font-medium">By {story.author}</span>
                  <span className="shrink-0 tabular-nums">{story.meta}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

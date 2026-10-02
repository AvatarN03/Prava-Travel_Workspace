"use client";

import { useMemo, useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Compass } from "lucide-react";

const easeDecelerate = [0.16, 1, 0.3, 1] as const;

interface Story {
  id: string;
  category: "all" | "himalayas" | "heritage" | "south" | "east";
  destination: string;
  title: string;
  excerpt: string;
  author: string;
  meta: string;
  imageUrl: string;
  href: string;
}

const ALL_STORIES: Story[] = [
  {
    id: "ladakh",
    category: "himalayas",
    destination: "LADAKH · TRANS-HIMALAYAS",
    title: "High Passes & Ancient Chants: 7 Days in Ladakh",
    excerpt:
      "Waking at 5:30 AM to monastic horns at Thiksey, traversing prayer flags over Khardung La at 5,359m, and watching twilight settle on the cyan waters of Pangong Tso.",
    author: "Tenzin Norbu & Priya Sharma",
    meta: "14 stops · 3 monastery stays",
    imageUrl:
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
    href: "/stories",
  },
  {
    id: "rajasthan",
    category: "heritage",
    destination: "JAIPUR & UDAIPUR · RAJASTHAN",
    title: "The Amber Route: A Slow Guide to Royal Rajasthan",
    excerpt:
      "Stepping past courtyards of mirrored glass in Amer Palace, discovering forgotten stepwells in the Aravalli hills, and drifting across Lake Pichola at sunset.",
    author: "Kabir Sen",
    meta: "11 stops · 2 heritage havelis",
    imageUrl:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    href: "/stories",
  },
  {
    id: "kerala",
    category: "south",
    destination: "ALLEPPEY & MUNNAR · KERALA",
    title: "Where the Waters Slow Down: Kerala's Backwater Corridors",
    excerpt:
      "Drifting in a cedar kettuvallam through narrow canals lined with coconut palms, tasting fresh karimeen pollichathu, and winding upward into the cool tea mist of Munnar.",
    author: "Ananya Nair",
    meta: "9 stops · 1 kettuvallam stay",
    imageUrl:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    href: "/stories",
  },
  {
    id: "varanasi",
    category: "east",
    destination: "VARANASI · UTTAR PRADESH",
    title: "Dawn on the Sacred Ghats of Kashi",
    excerpt:
      "Boarding an oarsman's wooden boat at Assi Ghat before sunrise, watching sacred lamps illuminate the morning river mist, and threading ancient lanes for Banarasi silk.",
    author: "Devraj Mukherjee",
    meta: "8 stops · 4 morning rituals",
    imageUrl:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    href: "/stories",
  },
  {
    id: "hampi",
    category: "south",
    destination: "HAMPI · KARNATAKA",
    title: "Boulders and Empires: Cycling the Forgotten Capital",
    excerpt:
      "Pedaling between surreal granite boulders, crossing the Tungabhadra River in round coracles, and admiring the monolithic stone chariot of Vijayanagara at dusk.",
    author: "Vikram Rao",
    meta: "12 stops · 2 riverside stays",
    imageUrl:
      "https://images.unsplash.com/photo-1600100397608-f010f444f417?auto=format&fit=crop&w=800&q=80",
    href: "/stories",
  },
  {
    id: "meghalaya",
    category: "east",
    destination: "MEGHALAYA · NORTHEAST",
    title: "Living Root Bridges & The Clouds of Cherrapunji",
    excerpt:
      "Descending 3,500 stone steps into the subtropical valleys of Nongriat to cross double-decker living root bridges and swimming in the glass-clear waters of the Umngot River.",
    author: "Natasha Lyngdoh",
    meta: "10 stops · 2 eco-homestays",
    imageUrl:
      "https://images.unsplash.com/photo-1626014303757-646633b3ea59?auto=format&fit=crop&w=800&q=80",
    href: "/stories",
  },
];

export function CommunityStoriesSection() {
  const [activeCategory, setActiveCategory] = useState<
    "all" | "himalayas" | "heritage" | "south" | "east"
  >("all");

  const filteredStories = useMemo(() => {
    if (activeCategory === "all") {
      return ALL_STORIES.slice(0, 3);
    }
    return ALL_STORIES.filter((s) => s.category === activeCategory).slice(0, 3);
  }, [activeCategory]);

  return (
    <section
      id="community"
      data-nav-theme="light"
      className="py-16 sm:py-24 lg:py-28 border-t border-zinc-200/80 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 space-y-10 sm:space-y-12">
        {/* Editorial Split Header with Responsive Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
          <div className="lg:col-span-6 space-y-3">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: easeDecelerate }}
            >
              <Compass className="h-3.5 w-3.5 text-[#2D9BF0]" />
              <span className="text-[11px] font-semibold tracking-widest text-[#2D9BF0] uppercase font-sans">
                Shared Journeys
              </span>
            </motion.div>

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
                {["Before", "you", "go,"].map((word) => (
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
                {["see", "how", "others", "travelled."].map((word) => (
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

          <div className="lg:col-span-6 space-y-4">
            <motion.p
              className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed break-words [text-wrap:balance]"
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.25, ease: easeDecelerate }}
            >
              Authentic travel itineraries shared by creators, writers,
              and explorers. Clone verified stops, palace stays, and mountain passes
              straight into your own Prava workspace with 1 click.
            </motion.p>

            {/* Filter Controls with Animated Sliding Active Pill */}
            <motion.div
              className="flex flex-wrap items-center gap-1.5 pt-1 select-none"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.35, ease: easeDecelerate }}
            >
              {[
                { id: "all", label: "All Journeys" },
                { id: "himalayas", label: "Himalayas" },
                { id: "heritage", label: "Royal Heritage" },
                { id: "south", label: "Coastal & South" },
                { id: "east", label: "Ancient & East" },
              ].map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`relative text-xs px-3.5 py-1.5 rounded-md transition-colors cursor-pointer font-medium font-sans ${
                      isActive
                        ? "text-white"
                        : "text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="community-category-pill"
                        className="absolute inset-0 bg-zinc-950 rounded-md shadow-xs"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{cat.label}</span>
                  </button>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Dynamic Editorial Story Cards in Pure Crisp Light Theme */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
              exit: { opacity: 0, transition: { duration: 0.15 } },
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {filteredStories.map((story) => (
              <motion.div
                key={story.id}
                variants={{
                  hidden: { opacity: 0, y: 16, scale: 0.98 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.5, ease: easeDecelerate },
                  },
                  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15 } },
                }}
                className="group flex flex-col justify-between rounded-sm border border-zinc-200/90 bg-[#FAFAF9]/90 overflow-hidden hover:border-zinc-300 transition-all cursor-pointer shadow-xs"
              >
                <div>
                  {/* Cover Image with Archival Destination Tag */}
                  <div className="relative h-60 w-full overflow-hidden bg-zinc-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-103"
                    />
                    <div className="absolute top-3 left-3 bg-black/75 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white backdrop-blur-xs font-medium rounded-xs font-sans">
                      {story.destination}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-base text-zinc-950 leading-snug group-hover:text-[#2D9BF0] transition-colors break-words">
                        {story.title}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-[#2D9BF0] transition-colors shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed font-sans line-clamp-3 break-words">
                      {story.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-3 border-t border-zinc-200/80 flex items-center justify-between text-[11px] text-zinc-500 font-sans">
                  <span className="truncate max-w-[60%] font-medium">By {story.author}</span>
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

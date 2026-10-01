"use client";

import { motion } from "motion/react";
import { Clock, MapPin, Navigation } from "lucide-react";

const easeDecelerate = [0.16, 1, 0.3, 1] as const;

export function ItinerarySection() {
  const scheduleItems = [
    {
      time: "07:15",
      duration: "45m · Morning Ritual",
      title: "Sunrise Chai at Hawa Mahal",
      location: "Badi Chaupar · Pink City Old Quarters",
      description:
        "Quiet dawn light hitting the 953 honeycomb sandstone windows. Sip spiced cardamom kulhad chai before morning street vendors arrive.",
      transit: "12 min e-rickshaw through historic Johari Bazaar",
    },
    {
      time: "09:30",
      duration: "2h 30m · Heritage Exploration",
      title: "Amer Fort & Sheesh Mahal (Mirror Palace)",
      location: "Amber Ridge · Overlooking Maota Lake",
      description:
        "Wander through Rajput courtyards, marble pillar arcades, and concave Belgian glass mosaics illuminated by morning sun rays.",
      transit: "Private AC transit via scenic Aravalli bypass road (20 min)",
    },
    {
      time: "13:00",
      duration: "1h 30m · Artisan & Culinary",
      title: "Royal Thali Tasting & Hand-Block Ateliers",
      location: "1135 AD & Anokhi Museum of Printing",
      description:
        "Traditional hand-ground spices and slow-cooked dal baati churma, followed by demonstrations of heritage indigo block printing.",
      transit: "15 min gentle drive toward Nahargarh scenic ridge",
    },
    {
      time: "17:15",
      duration: "1h 15m · Golden Hour",
      title: "Sunset over Nahargarh Stepwell",
      location: "Nahargarh Fort · Aravalli Crest",
      description:
        "Watch the setting sun cast warm amber hues across the entire Pink City basin from the carved ramparts.",
      transit: "Evening descent back to Samode Haveli (25 min)",
    },
  ];

  return (
    <section data-nav-theme="light" className="py-16 sm:py-24 lg:py-28 border-t border-zinc-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 space-y-10 sm:space-y-12">
        {/* Editorial Split Header with Responsive Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
          <div className="lg:col-span-6 space-y-3">
            <motion.span
              className="inline-block text-[11px] font-semibold tracking-widest text-[#2D9BF0] uppercase"
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
            className="lg:col-span-6"
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
          {scheduleItems.map((item, index) => (
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
              className="p-5 sm:p-7 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start hover:bg-white transition-colors"
            >
              {/* Time Column */}
              <div className="md:col-span-3 space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#2D9BF0] md:hidden" />
                  <span className="text-2xl sm:text-3xl font-light text-zinc-950 tracking-tight tabular-nums">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 tracking-normal">{item.duration}</p>
              </div>

              {/* Main Detail Column */}
              <div className="md:col-span-6 space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-[#2D9BF0] break-words">
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
                    <Navigation className="h-3 w-3 text-[#2D9BF0]" />
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

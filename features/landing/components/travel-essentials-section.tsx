"use client";

import { useState } from "react";

import { motion } from "motion/react";
import { Cloud, Globe2, PhoneCall, Sun, Zap } from "lucide-react";

const easeDecelerate = [0.16, 1, 0.3, 1] as const;

export function TravelEssentialsSection() {
  const [inrAmount, setInrAmount] = useState<number>(10000);
  const exchangeRate = 83.2; // INR per USD
  const usdEquivalent = (inrAmount / exchangeRate).toFixed(2);

  return (
    <section
      id="travel-tools"
      data-nav-theme="light"
      className="py-16 sm:py-24 lg:py-28 border-t border-zinc-200/80 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 space-y-10 sm:space-y-12">
        {/* Section Header with Responsive Typography */}
        <div className="space-y-3 max-w-2xl">
          <motion.span
            className="inline-block text-[11px] font-semibold tracking-widest text-[#2D9BF0] uppercase font-sans"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: easeDecelerate }}
          >
            Contextual Utilities
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
              {["Useful", "when", "you", "need", "it."].map((word) => (
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
              {["Quiet", "when", "you", "don't."].map((word) => (
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
            className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed pt-1 break-words [text-wrap:balance]"
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.25, ease: easeDecelerate }}
          >
            No cluttering app switchboards or widget bars. Weather forecasts, live spot
            currency conversions, country guide matrices, and emergency helplines live quietly
            alongside your itinerary.
          </motion.p>
        </div>

        {/* 3-Column Card Grid in Pure Crisp Light Theme with Staggered Entrance */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
          {/* Card 1: Weather (OpenWeather live matrix) */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeDecelerate } },
            }}
            className="rounded-sm border border-zinc-200/90 bg-[#FAFAF9]/80 p-5 sm:p-6 flex flex-col justify-between space-y-6 shadow-xs hover:border-zinc-300 transition-colors"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] text-zinc-500 uppercase tracking-wider font-medium font-sans">
                <span>Destination Weather</span>
                <span>Jaipur · Nov</span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-5xl font-light text-zinc-950 tracking-tight tabular-nums">
                    24°
                  </span>
                  <p className="text-xs font-semibold text-zinc-900 mt-1">
                    Clear & Pleasant
                  </p>
                  <p className="text-[11px] text-zinc-500 tabular-nums font-sans">
                    High 28° · Low 15° · UV Index 4 (Moderate)
                  </p>
                </div>
                <Sun className="h-9 w-9 text-amber-500/80 stroke-1" />
              </div>

              {/* 5-Day Forecast Strip */}
              <div className="grid grid-cols-5 gap-1 pt-3 text-center border-t border-zinc-200/80">
                {[
                  { day: "MON", temp: "25°", icon: Sun },
                  { day: "TUE", temp: "24°", icon: Sun },
                  { day: "WED", temp: "23°", icon: Cloud },
                  { day: "THU", temp: "24°", icon: Sun },
                  { day: "FRI", temp: "26°", icon: Sun },
                ].map((d, i) => {
                  const Icon = d.icon;
                  return (
                    <div key={i} className="space-y-1">
                      <span className="text-[10px] text-zinc-400 font-medium font-sans">{d.day}</span>
                      <Icon className="h-3.5 w-3.5 mx-auto text-amber-500/80" />
                      <span className="text-[11px] block text-zinc-800 font-medium tabular-nums font-sans">
                        {d.temp}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200/80 text-[11px] text-zinc-500 leading-relaxed font-sans">
              OpenWeather integration: Afternoon sunshine is warm; morning palace corridors require a light jacket.
            </div>
          </motion.div>

          {/* Card 2: Currency Converter (Frankfurter ECB rates) */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeDecelerate } },
            }}
            className="rounded-sm border border-zinc-200/90 bg-[#FAFAF9]/80 p-5 sm:p-6 flex flex-col justify-between space-y-6 shadow-xs hover:border-zinc-300 transition-colors"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] text-zinc-500 uppercase tracking-wider font-medium font-sans">
                <span>Spot FX Converter</span>
                <span>ECB Central Rates</span>
              </div>

              <div className="space-y-3">
                <div className="rounded-xs border border-zinc-300/90 bg-white p-3.5 shadow-2xs">
                  <label
                    htmlFor="inr-spend-input"
                    className="block text-[10px] uppercase text-zinc-500 font-medium tracking-wider font-sans"
                  >
                    You Spend (INR)
                  </label>
                  <div className="flex items-center mt-1">
                    <span className="text-base text-zinc-500 mr-2 font-medium font-sans">
                      ₹
                    </span>
                    <input
                      id="inr-spend-input"
                      type="number"
                      aria-label="Amount in Indian Rupees"
                      value={inrAmount}
                      onChange={(e) => setInrAmount(Number(e.target.value) || 0)}
                      className="w-full text-xl font-light text-zinc-950 bg-transparent focus:outline-hidden tabular-nums font-sans"
                    />
                  </div>
                </div>

                <div className="text-center text-[11px] text-zinc-500 tabular-nums font-sans">
                  Live Rate: 1 USD = 83.20 INR
                </div>

                <div className="rounded-xs border border-zinc-300/90 bg-white p-3.5 shadow-2xs">
                  <span className="block text-[10px] uppercase text-zinc-500 font-medium tracking-wider font-sans">
                    Equivalent in USD
                  </span>
                  <div className="text-2xl font-light text-[#2D9BF0] mt-1 tabular-nums font-sans">
                    ${usdEquivalent}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200/80 text-[11px] text-zinc-500 font-sans">
              Offline calculator cached in IndexedDB · Zero roaming data needed.
            </div>
          </motion.div>

          {/* Card 3: Country Brief & Emergency (REST Countries v3.1) */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeDecelerate } },
            }}
            className="rounded-sm border border-zinc-200/90 bg-[#FAFAF9]/80 p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-zinc-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-sans">
                <span className="text-zinc-500 font-medium">Country Guide · India</span>
                <span className="text-emerald-600 font-semibold">
                  Verified
                </span>
              </div>

              <div className="space-y-3.5 text-xs leading-relaxed">
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-900">
                    <Globe2 className="h-3.5 w-3.5 text-[#2D9BF0]" />
                    <h5>UPI & Digital Payments</h5>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5 font-sans">
                    UPI One World wallet lets international travelers scan QR codes at bazaars and auto-rickshaws.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-900">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <h5>Power & Voltage</h5>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5 font-sans">
                    230V / 50Hz · Type C, D, and M round pin sockets standard in hotels.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-900">
                    <PhoneCall className="h-3.5 w-3.5 text-rose-500" />
                    <h5>Emergency Helplines</h5>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5 tabular-nums font-sans">
                    Universal: 112 · Tourist Helpline: 1363 (24/7 Toll-Free) · Ambulance: 108
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-200/80 text-[10px] text-zinc-500 font-sans">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                ✓ Indian e-Visa ready
              </span>
              <span>REST Countries v3.1</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


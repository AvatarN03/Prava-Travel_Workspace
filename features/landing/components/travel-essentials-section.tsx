"use client";

import { useEffect, useMemo, useState } from "react";

import { motion } from "motion/react";
import { Cloud, Globe2, PhoneCall, Sun, Zap } from "lucide-react";

import {
  TRAVEL_ESSENTIALS_EXCHANGE_RATE,
  TRAVEL_ESSENTIALS_FORECAST,
} from "@/features/landing/travel-essentials-data";
import { getLandingEssentialsAction } from "@/features/landing/actions";

import type { WeatherData } from "@/features/travel-essentials/types";

const easeDecelerate = [0.16, 1, 0.3, 1] as const;

export function TravelEssentialsSection() {
  const [inrAmount, setInrAmount] = useState<number>(10000);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [usdToInrRate, setUsdToInrRate] = useState(TRAVEL_ESSENTIALS_EXCHANGE_RATE);

  useEffect(() => {
    let isActive = true;

    getLandingEssentialsAction().then(({ weather: liveWeather, usdToInrRate: liveRate }) => {
      if (!isActive) return;
      if (liveWeather) setWeather(liveWeather);
      if (liveRate) setUsdToInrRate(liveRate);
    });

    return () => {
      isActive = false;
    };
  }, []);

  const usdEquivalent = (inrAmount / usdToInrRate).toFixed(2);
  const currentForecast = useMemo(
    () =>
      weather?.forecastDays?.slice(0, 5).map((day, index) => ({
        day: index === 0 ? "TODAY" : day.dayName.slice(0, 3).toUpperCase(),
        temp: `${Math.round(day.temperatureMax)}°`,
        icon: day.weatherCode >= 2 ? Cloud : Sun,
      })) ?? TRAVEL_ESSENTIALS_FORECAST,
    [weather]
  );
  const currentHigh = weather?.forecastDays?.[0]?.temperatureMax ?? 28;
  const currentLow = weather?.forecastDays?.[0]?.temperatureMin ?? 15;

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
            className="inline-block text-[11px] font-semibold tracking-widest text-primary uppercase font-sans"
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
            className="hidden lg:block text-sm sm:text-base text-zinc-600 font-normal leading-relaxed pt-1 break-words [text-wrap:balance]"
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
                <span>{weather?.city ?? "Mumbai"} · Live</span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-5xl font-light text-zinc-950 tracking-tight tabular-nums">
                    {weather ? `${Math.round(weather.temperature)}°` : "24°"}
                  </span>
                  <p className="text-xs font-semibold text-zinc-900 mt-1">
                    {weather?.weatherDescription ?? "Clear & Pleasant"}
                  </p>
                  <p className="text-[11px] text-zinc-500 tabular-nums font-sans">
                    High {Math.round(currentHigh)}° · Low {Math.round(currentLow)}°
                    {weather?.uvIndex ? ` · UV Index ${Math.round(weather.uvIndex)}` : ""}
                  </p>
                </div>
                <Sun className="h-9 w-9 text-amber-500/80 stroke-1" />
              </div>

              {/* 5-Day Forecast Strip */}
              <div className="grid grid-cols-5 gap-1 pt-3 text-center border-t border-zinc-200/80">
                {currentForecast.map((d, i) => {
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
              Afternoon sunshine is warm; morning palace corridors require a light jacket.
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
                <span>Live Spot Rates</span>
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
                  Live Rate: 1 USD = {usdToInrRate.toFixed(2)} INR
                </div>

                <div className="rounded-xs border border-zinc-300/90 bg-white p-3.5 shadow-2xs">
                  <span className="block text-[10px] uppercase text-zinc-500 font-medium tracking-wider font-sans">
                    Equivalent in USD
                  </span>
                  <div className="text-2xl font-light text-primary mt-1 tabular-nums font-sans">
                    ${usdEquivalent}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200/80 text-[11px] text-zinc-500 font-sans">
              Offline calculator cached · Zero roaming data needed.
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
                    <Globe2 className="h-3.5 w-3.5 text-primary" />
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
              <span>Travel-ready reference</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}



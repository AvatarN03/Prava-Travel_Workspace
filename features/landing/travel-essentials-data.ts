import { Cloud, Sun } from "lucide-react";

export const TRAVEL_ESSENTIALS_EXCHANGE_RATE = 83.2;

// Static five-day forecast displayed by TravelEssentialsSection.
export const TRAVEL_ESSENTIALS_FORECAST = [
  { day: "MON", temp: "25°", icon: Sun },
  { day: "TUE", temp: "24°", icon: Sun },
  { day: "WED", temp: "23°", icon: Cloud },
  { day: "THU", temp: "24°", icon: Sun },
  { day: "FRI", temp: "26°", icon: Sun },
] as const;

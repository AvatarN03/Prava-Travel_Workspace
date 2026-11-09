"use server";

import { fetchFxRates } from "@/features/travel-essentials/currency/currency-service";
import { fetchWeather } from "@/features/travel-essentials/weather/weather-service";

export async function getLandingEssentialsAction() {
  const [weatherResult, fxResult] = await Promise.allSettled([
    fetchWeather("Mumbai"),
    fetchFxRates("INR"),
  ]);

  const weather = weatherResult.status === "fulfilled" ? weatherResult.value : null;
  const fxRates = fxResult.status === "fulfilled" ? fxResult.value : null;
  const inrToUsd = fxRates?.rates?.USD;

  return {
    weather,
    usdToInrRate: inrToUsd ? 1 / inrToUsd : null,
  };
}

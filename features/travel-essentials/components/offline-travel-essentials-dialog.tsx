"use client";

import { useMemo, useState } from "react";

import {
  ArrowRightLeft,
  BookOpen,
  Check,
  Coins,
  Compass,
  Copy,
  Languages,
  MapPin,
  Phone,
  Search,
  ShieldAlert,
  Volume2,
  WifiOff,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";

import { QUICK_PICK_COUNTRIES } from "../country-guide/country-constants";
import {
  getFallbackRates,
  SUPPORTED_CURRENCIES,
} from "../currency/currency-service";
import { EMERGENCY_DIRECTORY } from "../emergency/emergency-data";
import { LANGUAGE_GUIDES } from "../language/language-data";

interface OfflineTravelEssentialsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "language" | "emergency" | "guide" | "currency";
}

const PHRASE_CATEGORIES = [
  "ALL",
  "Greetings",
  "Essentials",
  "Dining",
  "Transit",
  "Emergency",
  "Numbers",
] as const;

export function OfflineTravelEssentialsDialog({
  open,
  onOpenChange,
  initialTab = "language",
}: OfflineTravelEssentialsDialogProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // ─── Language State ──────────────────────────────────────────────────────────
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    LANGUAGE_GUIDES[0]?.language || "Hindi"
  );
  const [languageCategory, setLanguageCategory] = useState<string>("ALL");
  const [languageSearch, setLanguageSearch] = useState<string>("");
  const [copiedPhraseIndex, setCopiedPhraseIndex] = useState<number | null>(null);

  const currentGuide = useMemo(() => {
    return (
      LANGUAGE_GUIDES.find((g) => g.language === selectedLanguage) ||
      LANGUAGE_GUIDES[0]
    );
  }, [selectedLanguage]);

  const filteredPhrases = useMemo(() => {
    if (!currentGuide?.phrases) return [];
    const query = languageSearch.toLowerCase().trim();

    return currentGuide.phrases.filter((p) => {
      const matchesCategory =
        languageCategory === "ALL" || p.category === languageCategory;
      if (!matchesCategory) return false;

      if (!query) return true;
      return (
        p.english.toLowerCase().includes(query) ||
        p.translated.toLowerCase().includes(query) ||
        (p.pronunciation && p.pronunciation.toLowerCase().includes(query)) ||
        (p.notes && p.notes.toLowerCase().includes(query))
      );
    });
  }, [currentGuide, languageCategory, languageSearch]);

  const handleCopyPhrase = (text: string, index: number) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedPhraseIndex(index);
      setTimeout(() => setCopiedPhraseIndex(null), 1500);
    }
  };

  // ─── Emergency State ────────────────────────────────────────────────────────
  const [emergencySearch, setEmergencySearch] = useState<string>("");

  const filteredEmergency = useMemo(() => {
    const query = emergencySearch.toLowerCase().trim();
    if (!query) return EMERGENCY_DIRECTORY;
    return EMERGENCY_DIRECTORY.filter(
      (e) =>
        e.country.toLowerCase().includes(query) ||
        e.code.toLowerCase().includes(query) ||
        (e.notes && e.notes.toLowerCase().includes(query))
    );
  }, [emergencySearch]);

  // ─── Country Guide State ───────────────────────────────────────────────────
  const [guideSearch, setGuideSearch] = useState<string>("");

  const filteredQuickCountries = useMemo(() => {
    const query = guideSearch.toLowerCase().trim();
    if (!query) return QUICK_PICK_COUNTRIES;
    return QUICK_PICK_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.capital.toLowerCase().includes(query) ||
        c.region.toLowerCase().includes(query) ||
        c.visaStatus.toLowerCase().includes(query) ||
        c.visaNote.toLowerCase().includes(query)
    );
  }, [guideSearch]);

  // ─── Offline Currency State ────────────────────────────────────────────────
  const [baseCurrency, setBaseCurrency] = useState<string>("USD");
  const [targetCurrency, setTargetCurrency] = useState<string>("EUR");
  const [currencyAmount, setCurrencyAmount] = useState<string>("100");

  const offlineFxRates = useMemo(() => {
    return getFallbackRates(baseCurrency);
  }, [baseCurrency]);

  const convertedResult = useMemo(() => {
    const amt = parseFloat(currencyAmount);
    if (isNaN(amt) || amt <= 0) return 0;
    const rate = offlineFxRates.rates[targetCurrency] || 1.0;
    return Number((amt * rate).toFixed(2));
  }, [currencyAmount, offlineFxRates, targetCurrency]);

  const currentRateDisplay = useMemo(() => {
    const rate = offlineFxRates.rates[targetCurrency] || 1.0;
    return `1 ${baseCurrency} = ${rate.toFixed(4)} ${targetCurrency}`;
  }, [baseCurrency, targetCurrency, offlineFxRates]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[88vh] overflow-hidden flex flex-col p-0 rounded-sm border border-border dark:border-zinc-800 bg-background dark:bg-[#0B0F19] text-foreground">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 pb-3 border-b border-border/80 dark:border-zinc-800/80 bg-card dark:bg-[#0F131C] shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="rounded-xs border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5"
                >
                  <WifiOff className="h-3 w-3" />
                  Offline Travel Hub
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">
                  Zero Network Required
                </span>
              </div>

              <DialogTitle className="text-base sm:text-lg font-bold font-sans text-foreground dark:text-zinc-100">
                Travel Essentials — Offline Companion
              </DialogTitle>

              <DialogDescription className="text-xs text-muted-foreground dark:text-zinc-400">
                Instant access to language phrasebooks, verified emergency numbers, country entry rules, and currency conversion without an internet connection.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tab Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 overflow-hidden flex flex-col min-h-0"
        >
          <div className="px-4 sm:px-5 pt-2 border-b border-border/60 dark:border-zinc-800/80 bg-muted/20 dark:bg-[#0D121F] shrink-0 overflow-x-auto">
            <TabsList className="bg-transparent h-9 p-0 space-x-1 sm:space-x-2">
              <TabsTrigger
                value="language"
                className="data-[state=active]:bg-card dark:data-[state=active]:bg-[#121622] data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-9 text-xs px-2.5 sm:px-3 font-medium gap-1.5 cursor-pointer"
              >
                <Languages className="h-3.5 w-3.5 text-violet-500" />
                <span>Phrasebook</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted dark:bg-zinc-800 text-muted-foreground">
                  {LANGUAGE_GUIDES.length} langs
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="emergency"
                className="data-[state=active]:bg-card dark:data-[state=active]:bg-[#121622] data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-9 text-xs px-2.5 sm:px-3 font-medium gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                <span>Emergency Numbers</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted dark:bg-zinc-800 text-muted-foreground">
                  {EMERGENCY_DIRECTORY.length} countries
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="guide"
                className="data-[state=active]:bg-card dark:data-[state=active]:bg-[#121622] data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-9 text-xs px-2.5 sm:px-3 font-medium gap-1.5 cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                <span>Visa & Facts</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted dark:bg-zinc-800 text-muted-foreground">
                  {QUICK_PICK_COUNTRIES.length}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="currency"
                className="data-[state=active]:bg-card dark:data-[state=active]:bg-[#121622] data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-9 text-xs px-2.5 sm:px-3 font-medium gap-1.5 cursor-pointer"
              >
                <Coins className="h-3.5 w-3.5 text-emerald-500" />
                <span>Offline FX</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Viewport Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* 1. PHRASEBOOK TAB */}
            <TabsContent value="language" className="m-0 space-y-4 focus-visible:outline-none">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Language Select */}
                <div className="w-full sm:w-60">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="h-8.5 rounded-sm text-xs cursor-pointer bg-card dark:bg-[#121622] border-border dark:border-zinc-800">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-[#0F131C] dark:border-zinc-800 max-h-60">
                      {LANGUAGE_GUIDES.map((g) => (
                        <SelectItem key={g.language} value={g.language} className="text-xs cursor-pointer">
                          <span className="mr-1.5">{g.flag}</span>
                          <span>{g.language}</span>
                          <span className="text-muted-foreground ml-1.5">({g.nativeName})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Phrase Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={languageSearch}
                    onChange={(e) => setLanguageSearch(e.target.value)}
                    placeholder={`Search ${selectedLanguage} phrases (e.g. water, hotel, help)...`}
                    className="h-8.5 pl-8 text-xs rounded-sm bg-card dark:bg-[#121622] border-border dark:border-zinc-800"
                  />
                </div>
              </div>

              {/* Category Filter Bar */}
              <div className="flex items-center gap-1.5 flex-wrap pb-1 border-b border-border/40 dark:border-zinc-800">
                {PHRASE_CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={languageCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguageCategory(cat)}
                    className="h-6 text-[11px] px-2.5 rounded-xs cursor-pointer"
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              {/* Phrase Cards Grid */}
              {filteredPhrases.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs font-sans">
                  No phrases found matching &quot;{languageSearch}&quot;.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredPhrases.map((phrase, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-sm border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] space-y-1.5 shadow-2xs relative group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-foreground dark:text-zinc-200">
                          {phrase.english}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyPhrase(phrase.translated, idx)}
                          className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                          title="Copy translation"
                        >
                          {copiedPhraseIndex === idx ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>

                      <p className="text-sm sm:text-base font-bold text-primary dark:text-sky-400 tracking-wide font-sans">
                        {phrase.translated}
                      </p>

                      {phrase.pronunciation && (
                        <p className="text-[11px] font-mono text-muted-foreground dark:text-zinc-400 bg-muted/40 dark:bg-[#121622] px-2 py-0.5 rounded-xs inline-block">
                          🗣️ {phrase.pronunciation}
                        </p>
                      )}

                      {phrase.notes && (
                        <p className="text-[11px] text-muted-foreground/80 dark:text-zinc-500 italic pt-0.5">
                          💡 {phrase.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* 2. EMERGENCY DIRECTORY TAB */}
            <TabsContent value="emergency" className="m-0 space-y-4 focus-visible:outline-none">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={emergencySearch}
                  onChange={(e) => setEmergencySearch(e.target.value)}
                  placeholder="Search emergency country (e.g. Japan, France, Bali, United Kingdom)..."
                  className="h-8.5 pl-8 text-xs rounded-sm bg-card dark:bg-[#121622] border-border dark:border-zinc-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredEmergency.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-sm border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-border/40 dark:border-zinc-800/80 pb-2">
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-foreground dark:text-zinc-100">
                          {item.country}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Dial Code: {item.dialCode}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                        {item.code}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {/* General Dispatch */}
                      <div className="p-2 rounded-xs bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300">
                        <span className="text-[10px] font-semibold uppercase block text-rose-600 dark:text-rose-400">
                          🚨 General Emergency
                        </span>
                        <a
                          href={`tel:${item.general.split(" ")[0]}`}
                          className="font-mono text-sm font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="h-3 w-3" />
                          {item.general}
                        </a>
                      </div>

                      {/* Police */}
                      <div className="p-2 rounded-xs bg-sky-500/10 border border-sky-500/20 text-sky-800 dark:text-sky-300">
                        <span className="text-[10px] font-semibold uppercase block text-sky-600 dark:text-sky-400">
                          🚔 Police
                        </span>
                        <a
                          href={`tel:${item.police.split(" ")[0]}`}
                          className="font-mono text-sm font-bold hover:underline inline-flex items-center gap-1 mt-0.5 truncate"
                        >
                          <Phone className="h-3 w-3 shrink-0" />
                          <span className="truncate">{item.police}</span>
                        </a>
                      </div>

                      {/* Ambulance */}
                      <div className="p-2 rounded-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                        <span className="text-[10px] font-semibold uppercase block text-emerald-600 dark:text-emerald-400">
                          🚑 Ambulance / Medical
                        </span>
                        <a
                          href={`tel:${item.ambulance.split(" ")[0]}`}
                          className="font-mono text-sm font-bold hover:underline inline-flex items-center gap-1 mt-0.5 truncate"
                        >
                          <Phone className="h-3 w-3 shrink-0" />
                          <span className="truncate">{item.ambulance}</span>
                        </a>
                      </div>

                      {/* Fire */}
                      <div className="p-2 rounded-xs bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
                        <span className="text-[10px] font-semibold uppercase block text-amber-600 dark:text-amber-400">
                          🚒 Fire Dispatch
                        </span>
                        <a
                          href={`tel:${item.fire.split(" ")[0]}`}
                          className="font-mono text-sm font-bold hover:underline inline-flex items-center gap-1 mt-0.5 truncate"
                        >
                          <Phone className="h-3 w-3 shrink-0" />
                          <span className="truncate">{item.fire}</span>
                        </a>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-muted-foreground dark:text-zinc-400 bg-muted/30 dark:bg-[#121622] p-2 rounded-xs leading-relaxed">
                        💡 {item.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* 3. VISA & FACTS TAB */}
            <TabsContent value="guide" className="m-0 space-y-4 focus-visible:outline-none">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={guideSearch}
                  onChange={(e) => setGuideSearch(e.target.value)}
                  placeholder="Search countries, capitals, visa rules (e.g. Thailand, UAE, Japan)..."
                  className="h-8.5 pl-8 text-xs rounded-sm bg-card dark:bg-[#121622] border-border dark:border-zinc-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredQuickCountries.map((c) => (
                  <div
                    key={c.code}
                    className="p-3.5 rounded-sm border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-border/40 dark:border-zinc-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{c.flag}</span>
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-foreground dark:text-zinc-100">
                            {c.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Capital: {c.capital} • {c.region}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] font-semibold px-2 py-0.5 rounded-xs",
                          c.visaStatus === "Visa Free" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                          c.visaStatus === "Visa on Arrival" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
                          c.visaStatus === "eVisa" && "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                        )}
                      >
                        {c.visaStatus}
                      </Badge>
                    </div>

                    {c.visaDuration && (
                      <p className="text-[11px] text-muted-foreground font-sans">
                        Duration: <strong className="text-foreground dark:text-zinc-200">{c.visaDuration}</strong>
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed font-sans">
                      {c.visaNote}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* 4. OFFLINE CURRENCY CONVERTER TAB */}
            <TabsContent value="currency" className="m-0 space-y-4 focus-visible:outline-none">
              <div className="p-4 rounded-sm border border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-border/40 dark:border-zinc-800 pb-3">
                  <div>
                    <p className="font-semibold text-sm text-foreground dark:text-zinc-100">
                      Offline Currency Calculator
                    </p>
                    <p className="text-[11px] text-muted-foreground font-sans">
                      Calculate rates using baseline conversion standards with zero internet access.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono px-2 py-0.5 text-muted-foreground">
                    Offline Baseline
                  </Badge>
                </div>

                {/* Conversion Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Base Currency & Amount */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      From (Amount & Currency)
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={currencyAmount}
                        onChange={(e) => setCurrencyAmount(e.target.value)}
                        placeholder="100"
                        className="h-9 text-sm font-mono font-semibold rounded-sm bg-background dark:bg-[#121622] border-border dark:border-zinc-800"
                      />
                      <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                        <SelectTrigger className="w-28 h-9 text-xs font-mono font-semibold rounded-sm cursor-pointer bg-background dark:bg-[#121622] border-border dark:border-zinc-800">
                          <SelectValue placeholder="Base" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-[#0F131C] dark:border-zinc-800 max-h-56">
                          {SUPPORTED_CURRENCIES.map((c) => (
                            <SelectItem key={c.code} value={c.code} className="text-xs cursor-pointer">
                              {c.code} ({c.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quick Amount Pills */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {["50", "100", "500", "1000"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setCurrencyAmount(preset)}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-xs border border-border dark:border-zinc-800 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        >
                          +{preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Currency & Result */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      To (Converted Result)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="h-9 flex-1 px-3 flex items-center rounded-sm bg-muted/30 dark:bg-[#121622] border border-border dark:border-zinc-800 font-mono font-bold text-sm text-foreground dark:text-zinc-100 truncate">
                        {convertedResult.toLocaleString()} {targetCurrency}
                      </div>
                      <Select value={targetCurrency} onValueChange={setTargetCurrency}>
                        <SelectTrigger className="w-28 h-9 text-xs font-mono font-semibold rounded-sm cursor-pointer bg-background dark:bg-[#121622] border-border dark:border-zinc-800">
                          <SelectValue placeholder="Target" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-[#0F131C] dark:border-zinc-800 max-h-56">
                          {SUPPORTED_CURRENCIES.map((c) => (
                            <SelectItem key={c.code} value={c.code} className="text-xs cursor-pointer">
                              {c.code} ({c.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <p className="text-[11px] font-mono text-muted-foreground pt-1">
                      {currentRateDisplay}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className="p-3 px-4 border-t border-border/80 dark:border-zinc-800 bg-card dark:bg-[#0F131C] flex items-center justify-between text-xs text-muted-foreground shrink-0">
          <span className="text-[11px]">Prava Static Travel Essentials Engine</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-7 px-3 text-xs rounded-sm cursor-pointer"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

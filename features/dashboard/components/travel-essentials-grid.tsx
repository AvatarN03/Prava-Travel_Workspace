import Link from "next/link";

import {
  ArrowUpRight,
  BookOpen,
  CloudSun,
  Coins,
  Languages,
  Map,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TravelEssentialsGrid() {
  const essentialsTools = [
    {
      title: "Weather",
      subtitle: "Live forecasts & radar",
      icon: CloudSun,
      href: "/travel-essentials?tab=weather",
    },
    {
      title: "Currency (FX)",
      subtitle: "Live ECB rates & converter",
      icon: Coins,
      href: "/travel-essentials?tab=currency",
    },
    {
      title: "Interactive Maps",
      subtitle: "Leaflet & OSM exploration",
      icon: Map,
      href: "/travel-essentials?tab=maps",
    },
    {
      title: "Country Guide",
      subtitle: "Visa facts & emergency lines",
      icon: BookOpen,
      href: "/travel-essentials?tab=guide",
    },
    {
      title: "Language Essentials",
      subtitle: "Local phrases & essentials",
      icon: Languages,
      href: "/travel-essentials?tab=language",
    },
  ];

  return (
    <Card className="dashboard-card">
      <CardHeader className="dashboard-card-header p-4 pb-3 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="dashboard-title">
            Travel Essentials
          </CardTitle>
          <p className="dashboard-subtext">
            Contextual live utilities for active &amp; foreign travel
          </p>
        </div>

        <Link
          href="/travel-essentials"
          className="font-sans text-xs text-primary font-medium hover:underline inline-flex items-center"
        >
          Open all <ArrowUpRight className="w-3 h-3 ml-0.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {essentialsTools.map((tool, index) => {
            const Icon = tool.icon;
            const isLastOnTwoCol = index === 4;

            return (
              <Link
                key={tool.title}
                href={tool.href}
                className={`dashboard-interactive-row p-3 text-left group flex flex-col justify-between space-y-2.5 cursor-pointer shadow-2xs ${
                  isLastOnTwoCol ? "col-span-2 sm:col-span-1" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="dashboard-icon-box p-1.5 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/50 dark:text-zinc-500 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>

                <div>
                  <div className="font-sans text-xs font-semibold text-foreground dark:text-zinc-200 group-hover:text-primary transition-colors">
                    {tool.title}
                  </div>
                  <div className="font-sans text-[10px] text-muted-foreground dark:text-zinc-400 truncate mt-0.5">
                    {tool.subtitle}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default TravelEssentialsGrid;

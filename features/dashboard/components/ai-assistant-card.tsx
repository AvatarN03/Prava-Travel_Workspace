import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AiAssistantCard() {
  return (
    <Card className="dashboard-card">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative h-5 w-5 shrink-0 rounded-full overflow-hidden ring-1 ring-primary/40 shadow-2xs">
            <Image
              src="/avatars/ichinose.png"
              alt="Ichinose"
              width={20}
              height={20}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-sans text-xs font-semibold text-foreground dark:text-zinc-100">
            Ichinose — Prava Travel Assistant
          </span>
        </div>

        <p className="font-sans text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed">
          Ask Ichinose to organize efficient transit, balance multi-currency expenses, or audit pacing for your upcoming stops.
        </p>

        <Button
          size="sm"
          variant="outline"
          asChild
          className="w-full gap-1.5 border-primary/30 hover:border-primary/60 font-sans text-xs font-medium cursor-pointer rounded-xs text-primary dark:text-[#38BDF8] hover:bg-primary/5 dark:hover:bg-primary/10 dark:border-primary/40"
        >
          <Link href="/trips">
            <span>Open in Trip Workspace</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default AiAssistantCard;

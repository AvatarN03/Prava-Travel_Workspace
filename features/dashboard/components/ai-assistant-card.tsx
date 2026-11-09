import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AiAssistantCard() {
  return (
    <Card className="dashboard-card min-h-80 overflow-hidden">
      <CardContent className="flex h-full min-h-80 flex-col p-5">
        <div className="flex items-center gap-2">
          <div className="relative h-7 w-7 shrink-0 rounded-full overflow-hidden ring-1 ring-primary/40 shadow-2xs">
            <Image
              src="/avatars/ichinose.png"
              alt="Ichinose"
              width={28}
              height={28}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-sans text-xs font-semibold text-foreground">
            Ichinose — Prava Travel Assistant
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center py-5">
          <div className="relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-primary/10 shadow-sm sm:h-36 sm:w-36">
            <Image
              src="/avatars/ichinose.png"
              alt=""
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>
        </div>

        <p className="font-sans text-xs text-muted-foreground leading-relaxed">
          Ask Ichinose to organize efficient transit, balance multi-currency expenses, or audit pacing for your upcoming stops.
        </p>

        <Button
          size="sm"
          asChild
          className="dashboard-btn-primary mt-4 h-9 w-full gap-1.5 rounded-xs font-sans text-xs font-medium cursor-pointer"
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

import Link from "next/link";

import { ArrowLeft, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TripNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full border-border dark:border-zinc-800 bg-card dark:bg-[#0F131C] text-center p-6 rounded-sm shadow-sm">
        <CardHeader className="pb-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-[#2D9BF0]/10 text-[#2D9BF0] mb-3">
            <Compass className="h-6 w-6" />
          </div>
          <CardTitle className="font-sans text-lg sm:text-xl font-light tracking-tight text-foreground">
            Trip Not Found or{" "}
            <span className="font-serif italic font-normal">Access Denied</span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            The trip workspace you are trying to access does not exist, was deleted, or belongs to another user account.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Button size="sm" asChild className="cursor-pointer rounded-sm bg-[#2D9BF0] hover:bg-[#2085d3] text-white font-medium">
            <Link href="/trips">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to Trips List
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

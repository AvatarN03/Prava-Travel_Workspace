import {
  AiAssistanceSection,
  CommunityStoriesSection,
  CorePhilosophySection,
  CtaBanner,
  ExpensesSection,
  HeroSection,
  ItinerarySection,
  LandingContentWrapper,
  LandingFooter,
  LandingHeader,
  LandscapeBanner,
  PricingSection,
  ScatteredVsUnified,
  ThesisSection,
  TravelEssentialsSection,
  WorkspaceShowcase,
} from "@/features/landing";

import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  let user = null;

  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch {
    // Graceful fallback if Supabase is initializing or unconfigured
    user = null;
  }

  return (
    <div className="relative min-h-screen bg-canvas text-zinc-950 dark:text-zinc-50 flex flex-col selection:bg-primary/20 selection:text-primary transition-colors">
      <LandingContentWrapper>
        <LandingHeader user={user} />
        <main className="relative z-10 flex-1">
          <HeroSection user={user} />
          <ThesisSection />
          <ScatteredVsUnified />
          <WorkspaceShowcase />
          <ItinerarySection />
          <ExpensesSection />
          <TravelEssentialsSection />
          <AiAssistanceSection />
          <CommunityStoriesSection />
          <LandscapeBanner />
          <CorePhilosophySection />
          <PricingSection user={user} />
          <CtaBanner user={user} />
        </main>
        <LandingFooter />
      </LandingContentWrapper>
    </div>
  );
}

import dynamic from "next/dynamic";

import {
  HeroSection,
  LandingContentWrapper,
  LandingFooter,
  LandingHeader,
  ThesisSection,
} from "@/features/landing";

const ScatteredVsUnified = dynamic(() =>
  import("@/features/landing/components/scattered-vs-unified").then(
    (module) => module.ScatteredVsUnified
  )
);
const WorkspaceShowcase = dynamic(() =>
  import("@/features/landing/components/workspace-showcase").then(
    (module) => module.WorkspaceShowcase
  )
);
const ItinerarySection = dynamic(() =>
  import("@/features/landing/components/itinerary-section").then(
    (module) => module.ItinerarySection
  )
);
const ExpensesSection = dynamic(() =>
  import("@/features/landing/components/expenses-section").then(
    (module) => module.ExpensesSection
  )
);
const TravelEssentialsSection = dynamic(() =>
  import("@/features/landing/components/travel-essentials-section").then(
    (module) => module.TravelEssentialsSection
  )
);
const AiAssistanceSection = dynamic(() =>
  import("@/features/landing/components/ai-assistance-section").then(
    (module) => module.AiAssistanceSection
  )
);
const CommunityStoriesSection = dynamic(() =>
  import("@/features/landing/components/community-stories-section").then(
    (module) => module.CommunityStoriesSection
  )
);
const LandscapeBanner = dynamic(() =>
  import("@/features/landing/components/landscape-banner").then(
    (module) => module.LandscapeBanner
  )
);
const CorePhilosophySection = dynamic(() =>
  import("@/features/landing/components/core-philosophy-section").then(
    (module) => module.CorePhilosophySection
  )
);
const PricingSection = dynamic(() =>
  import("@/features/landing/components/pricing-section").then(
    (module) => module.PricingSection
  )
);
const CtaBanner = dynamic(() =>
  import("@/features/landing/components/cta-banner").then(
    (module) => module.CtaBanner
  )
);

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
    <div className="relative min-h-screen bg-canvas text-foreground flex flex-col selection:bg-primary/20 selection:text-primary transition-colors">
      <LandingContentWrapper>
        <LandingHeader user={user} />
        <main className="relative z-10 flex-1">
          <HeroSection />
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
          <CtaBanner />
        </main>
        <LandingFooter />
      </LandingContentWrapper>
    </div>
  );
}

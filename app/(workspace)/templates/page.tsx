import { getPublicTripTemplates, TemplatesView } from "@/features/templates";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trip Templates & Curated Itineraries",
  description:
    "Explore curated trip templates, discover destination itineraries, and 1-click clone complete travel plans into your personal Prava workspace.",
};

export default async function TemplatesPage() {
  const trips = await getPublicTripTemplates();

  return <TemplatesView initialTrips={trips} />;
}


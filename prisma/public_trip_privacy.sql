-- Run on the target Supabase database after reviewing its existing policies.
-- Public trip previews are served by the application using a restricted projection.
-- Direct table access must not expose whole rows containing private fields.
BEGIN;

DROP POLICY IF EXISTS "Trips view policy" ON public.trips;
CREATE POLICY "Trips view policy" ON public.trips FOR SELECT
USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Itinerary items view policy" ON public.itinerary_items;
CREATE POLICY "Itinerary items view policy" ON public.itinerary_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.trips
  WHERE trips.id = itinerary_items.trip_id AND trips.profile_id = auth.uid()
));

DROP POLICY IF EXISTS "Accommodations select policy" ON public.accommodations;
CREATE POLICY "Accommodations select policy" ON public.accommodations FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.trips
  WHERE trips.id = accommodations.trip_id AND trips.profile_id = auth.uid()
));

DROP POLICY IF EXISTS "Links select policy" ON public.links;
CREATE POLICY "Links select policy" ON public.links FOR SELECT
USING (auth.uid() = profile_id OR EXISTS (
  SELECT 1 FROM public.trips
  WHERE trips.id = links.trip_id AND trips.profile_id = auth.uid()
));

COMMIT;

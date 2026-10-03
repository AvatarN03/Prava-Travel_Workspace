-- ==============================================================================
-- Prava Travel Workspace V2 - Comprehensive Row Level Security (RLS) Policies
-- Protects Supabase PostgREST Data API against unauthorized external queries
-- Does NOT affect Prisma server-side queries (Prisma connects via 'postgres' role)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROFILES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles view policy" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update policy" ON public.profiles;
DROP POLICY IF EXISTS "Profiles insert policy" ON public.profiles;
DROP POLICY IF EXISTS "Profiles delete policy" ON public.profiles;

-- Allow reading own profile, or any profile marked as public (creator view)
CREATE POLICY "Profiles view policy"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR is_public = true);

-- Only user can update their own profile
CREATE POLICY "Profiles update policy"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow inserting own profile on registration/sync
CREATE POLICY "Profiles insert policy"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow user to delete their own profile
CREATE POLICY "Profiles delete policy"
ON public.profiles FOR DELETE
USING (auth.uid() = id);


-- ------------------------------------------------------------------------------
-- 2. TRIPS
-- ------------------------------------------------------------------------------
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Trips view policy" ON public.trips;
DROP POLICY IF EXISTS "Trips insert policy" ON public.trips;
DROP POLICY IF EXISTS "Trips update policy" ON public.trips;
DROP POLICY IF EXISTS "Trips delete policy" ON public.trips;

-- Viewable if public, if community template, or owned by the user
CREATE POLICY "Trips view policy"
ON public.trips FOR SELECT
USING (is_public = true OR is_template = true OR auth.uid() = profile_id);

CREATE POLICY "Trips insert policy"
ON public.trips FOR INSERT
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Trips update policy"
ON public.trips FOR UPDATE
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Trips delete policy"
ON public.trips FOR DELETE
USING (auth.uid() = profile_id);


-- ------------------------------------------------------------------------------
-- 3. ITINERARY ITEMS
-- ------------------------------------------------------------------------------
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Itinerary items view policy" ON public.itinerary_items;
DROP POLICY IF EXISTS "Itinerary items insert policy" ON public.itinerary_items;
DROP POLICY IF EXISTS "Itinerary items update policy" ON public.itinerary_items;
DROP POLICY IF EXISTS "Itinerary items delete policy" ON public.itinerary_items;

CREATE POLICY "Itinerary items view policy"
ON public.itinerary_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.trips 
  WHERE trips.id = itinerary_items.trip_id 
    AND (trips.is_public = true OR trips.is_template = true OR trips.profile_id = auth.uid())
));

CREATE POLICY "Itinerary items insert policy"
ON public.itinerary_items FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.trips 
  WHERE trips.id = itinerary_items.trip_id AND trips.profile_id = auth.uid()
));

CREATE POLICY "Itinerary items update policy"
ON public.itinerary_items FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.trips 
  WHERE trips.id = itinerary_items.trip_id AND trips.profile_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.trips 
  WHERE trips.id = itinerary_items.trip_id AND trips.profile_id = auth.uid()
));

CREATE POLICY "Itinerary items delete policy"
ON public.itinerary_items FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.trips 
  WHERE trips.id = itinerary_items.trip_id AND trips.profile_id = auth.uid()
));


-- ------------------------------------------------------------------------------
-- 4. PRIVATE TRIP SUB-ENTITIES (Accommodations, Expenses, Notes, Checklists, Links)
-- ------------------------------------------------------------------------------
-- Accommodations
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Accommodations select policy" ON public.accommodations;
DROP POLICY IF EXISTS "Accommodations insert policy" ON public.accommodations;
DROP POLICY IF EXISTS "Accommodations update policy" ON public.accommodations;
DROP POLICY IF EXISTS "Accommodations delete policy" ON public.accommodations;

CREATE POLICY "Accommodations select policy" ON public.accommodations FOR SELECT
USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = accommodations.trip_id AND (trips.is_public = true OR trips.is_template = true OR trips.profile_id = auth.uid())));

CREATE POLICY "Accommodations insert policy" ON public.accommodations FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = accommodations.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Accommodations update policy" ON public.accommodations FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = accommodations.trip_id AND trips.profile_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = accommodations.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Accommodations delete policy" ON public.accommodations FOR DELETE
USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = accommodations.trip_id AND trips.profile_id = auth.uid()));

-- Expenses (Private financial data: only owner can see or edit)
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Expenses select policy" ON public.expenses;
DROP POLICY IF EXISTS "Expenses insert policy" ON public.expenses;
DROP POLICY IF EXISTS "Expenses update policy" ON public.expenses;
DROP POLICY IF EXISTS "Expenses delete policy" ON public.expenses;

CREATE POLICY "Expenses select policy" ON public.expenses FOR SELECT
USING (auth.uid() = profile_id OR EXISTS (SELECT 1 FROM public.trips WHERE trips.id = expenses.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Expenses insert policy" ON public.expenses FOR INSERT
WITH CHECK (auth.uid() = profile_id OR EXISTS (SELECT 1 FROM public.trips WHERE trips.id = expenses.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Expenses update policy" ON public.expenses FOR UPDATE
USING (auth.uid() = profile_id OR EXISTS (SELECT 1 FROM public.trips WHERE trips.id = expenses.trip_id AND trips.profile_id = auth.uid()))
WITH CHECK (auth.uid() = profile_id OR EXISTS (SELECT 1 FROM public.trips WHERE trips.id = expenses.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Expenses delete policy" ON public.expenses FOR DELETE
USING (auth.uid() = profile_id OR EXISTS (SELECT 1 FROM public.trips WHERE trips.id = expenses.trip_id AND trips.profile_id = auth.uid()));

-- Notes (Private notes and travel documents)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Notes select policy" ON public.notes;
DROP POLICY IF EXISTS "Notes insert policy" ON public.notes;
DROP POLICY IF EXISTS "Notes update policy" ON public.notes;
DROP POLICY IF EXISTS "Notes delete policy" ON public.notes;

CREATE POLICY "Notes select policy" ON public.notes FOR SELECT
USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = notes.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Notes insert policy" ON public.notes FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = notes.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Notes update policy" ON public.notes FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = notes.trip_id AND trips.profile_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = notes.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Notes delete policy" ON public.notes FOR DELETE
USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = notes.trip_id AND trips.profile_id = auth.uid()));

-- Checklist Items
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Checklist select policy" ON public.checklist_items;
DROP POLICY IF EXISTS "Checklist insert policy" ON public.checklist_items;
DROP POLICY IF EXISTS "Checklist update policy" ON public.checklist_items;
DROP POLICY IF EXISTS "Checklist delete policy" ON public.checklist_items;

CREATE POLICY "Checklist select policy" ON public.checklist_items FOR SELECT
USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = checklist_items.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Checklist insert policy" ON public.checklist_items FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = checklist_items.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Checklist update policy" ON public.checklist_items FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = checklist_items.trip_id AND trips.profile_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = checklist_items.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Checklist delete policy" ON public.checklist_items FOR DELETE
USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = checklist_items.trip_id AND trips.profile_id = auth.uid()));

-- Links
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Links select policy" ON public.links;
DROP POLICY IF EXISTS "Links insert policy" ON public.links;
DROP POLICY IF EXISTS "Links update policy" ON public.links;
DROP POLICY IF EXISTS "Links delete policy" ON public.links;

CREATE POLICY "Links select policy" ON public.links FOR SELECT
USING (auth.uid() = profile_id OR EXISTS (SELECT 1 FROM public.trips WHERE trips.id = links.trip_id AND (trips.is_public = true OR trips.is_template = true OR trips.profile_id = auth.uid())));

CREATE POLICY "Links insert policy" ON public.links FOR INSERT
WITH CHECK (auth.uid() = profile_id OR EXISTS (SELECT 1 FROM public.trips WHERE trips.id = links.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Links update policy" ON public.links FOR UPDATE
USING (auth.uid() = profile_id OR EXISTS (SELECT 1 FROM public.trips WHERE trips.id = links.trip_id AND trips.profile_id = auth.uid()))
WITH CHECK (auth.uid() = profile_id OR EXISTS (SELECT 1 FROM public.trips WHERE trips.id = links.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Links delete policy" ON public.links FOR DELETE
USING (auth.uid() = profile_id OR EXISTS (SELECT 1 FROM public.trips WHERE trips.id = links.trip_id AND trips.profile_id = auth.uid()));


-- ------------------------------------------------------------------------------
-- 5. AI WORKSPACE DATA
-- ------------------------------------------------------------------------------
-- AI Conversations
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Ai conversations select policy" ON public.ai_conversations;
DROP POLICY IF EXISTS "Ai conversations insert policy" ON public.ai_conversations;
DROP POLICY IF EXISTS "Ai conversations update policy" ON public.ai_conversations;
DROP POLICY IF EXISTS "Ai conversations delete policy" ON public.ai_conversations;

CREATE POLICY "Ai conversations select policy" ON public.ai_conversations FOR SELECT
USING (auth.uid() = profile_id);

CREATE POLICY "Ai conversations insert policy" ON public.ai_conversations FOR INSERT
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Ai conversations update policy" ON public.ai_conversations FOR UPDATE
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Ai conversations delete policy" ON public.ai_conversations FOR DELETE
USING (auth.uid() = profile_id);

-- AI Messages
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Ai messages select policy" ON public.ai_messages;
DROP POLICY IF EXISTS "Ai messages insert policy" ON public.ai_messages;
DROP POLICY IF EXISTS "Ai messages delete policy" ON public.ai_messages;

CREATE POLICY "Ai messages select policy" ON public.ai_messages FOR SELECT
USING (EXISTS (SELECT 1 FROM public.ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.profile_id = auth.uid()));

CREATE POLICY "Ai messages insert policy" ON public.ai_messages FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.profile_id = auth.uid()));

CREATE POLICY "Ai messages delete policy" ON public.ai_messages FOR DELETE
USING (EXISTS (SELECT 1 FROM public.ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.profile_id = auth.uid()));

-- AI Proposals
ALTER TABLE public.ai_proposals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Ai proposals select policy" ON public.ai_proposals;
DROP POLICY IF EXISTS "Ai proposals insert policy" ON public.ai_proposals;
DROP POLICY IF EXISTS "Ai proposals update policy" ON public.ai_proposals;
DROP POLICY IF EXISTS "Ai proposals delete policy" ON public.ai_proposals;

CREATE POLICY "Ai proposals select policy" ON public.ai_proposals FOR SELECT
USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = ai_proposals.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Ai proposals insert policy" ON public.ai_proposals FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = ai_proposals.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Ai proposals update policy" ON public.ai_proposals FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = ai_proposals.trip_id AND trips.profile_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = ai_proposals.trip_id AND trips.profile_id = auth.uid()));

CREATE POLICY "Ai proposals delete policy" ON public.ai_proposals FOR DELETE
USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = ai_proposals.trip_id AND trips.profile_id = auth.uid()));


-- ------------------------------------------------------------------------------
-- 6. COMMUNITY & STORIES
-- ------------------------------------------------------------------------------
-- Community Posts
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Community posts view policy" ON public.community_posts;
DROP POLICY IF EXISTS "Community posts insert policy" ON public.community_posts;
DROP POLICY IF EXISTS "Community posts update policy" ON public.community_posts;
DROP POLICY IF EXISTS "Community posts delete policy" ON public.community_posts;

CREATE POLICY "Community posts view policy" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Community posts insert policy" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Community posts update policy" ON public.community_posts FOR UPDATE USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Community posts delete policy" ON public.community_posts FOR DELETE USING (auth.uid() = profile_id);

-- Community Replies
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Community replies view policy" ON public.community_replies;
DROP POLICY IF EXISTS "Community replies insert policy" ON public.community_replies;
DROP POLICY IF EXISTS "Community replies update policy" ON public.community_replies;
DROP POLICY IF EXISTS "Community replies delete policy" ON public.community_replies;

CREATE POLICY "Community replies view policy" ON public.community_replies FOR SELECT USING (true);
CREATE POLICY "Community replies insert policy" ON public.community_replies FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Community replies update policy" ON public.community_replies FOR UPDATE USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Community replies delete policy" ON public.community_replies FOR DELETE USING (auth.uid() = profile_id);

-- Community Upvotes
ALTER TABLE public.community_post_upvotes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Community upvotes view policy" ON public.community_post_upvotes;
DROP POLICY IF EXISTS "Community upvotes insert policy" ON public.community_post_upvotes;
DROP POLICY IF EXISTS "Community upvotes delete policy" ON public.community_post_upvotes;

CREATE POLICY "Community upvotes view policy" ON public.community_post_upvotes FOR SELECT USING (true);
CREATE POLICY "Community upvotes insert policy" ON public.community_post_upvotes FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Community upvotes delete policy" ON public.community_post_upvotes FOR DELETE USING (auth.uid() = profile_id);

-- Community Saved Posts
ALTER TABLE public.community_saved_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Community saved posts select policy" ON public.community_saved_posts;
DROP POLICY IF EXISTS "Community saved posts insert policy" ON public.community_saved_posts;
DROP POLICY IF EXISTS "Community saved posts delete policy" ON public.community_saved_posts;

CREATE POLICY "Community saved posts select policy" ON public.community_saved_posts FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Community saved posts insert policy" ON public.community_saved_posts FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Community saved posts delete policy" ON public.community_saved_posts FOR DELETE USING (auth.uid() = profile_id);

-- Blog Posts (Stories)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Blog posts view policy" ON public.blog_posts;
DROP POLICY IF EXISTS "Blog posts insert policy" ON public.blog_posts;
DROP POLICY IF EXISTS "Blog posts update policy" ON public.blog_posts;
DROP POLICY IF EXISTS "Blog posts delete policy" ON public.blog_posts;

CREATE POLICY "Blog posts view policy" ON public.blog_posts FOR SELECT USING (status = 'PUBLISHED' OR auth.uid() = profile_id);
CREATE POLICY "Blog posts insert policy" ON public.blog_posts FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Blog posts update policy" ON public.blog_posts FOR UPDATE USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Blog posts delete policy" ON public.blog_posts FOR DELETE USING (auth.uid() = profile_id);

-- Blog Post Likes
ALTER TABLE public.blog_post_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Blog likes view policy" ON public.blog_post_likes;
DROP POLICY IF EXISTS "Blog likes insert policy" ON public.blog_post_likes;
DROP POLICY IF EXISTS "Blog likes delete policy" ON public.blog_post_likes;

CREATE POLICY "Blog likes view policy" ON public.blog_post_likes FOR SELECT USING (true);
CREATE POLICY "Blog likes insert policy" ON public.blog_post_likes FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Blog likes delete policy" ON public.blog_post_likes FOR DELETE USING (auth.uid() = profile_id);


-- ------------------------------------------------------------------------------
-- 7. SUBSCRIPTIONS, WEBHOOKS & SYSTEM TABLES
-- ------------------------------------------------------------------------------
-- Subscriptions: User can only read their own subscription
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Subscriptions view policy" ON public.subscriptions;
CREATE POLICY "Subscriptions view policy" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Webhook Events: Strictly internal (Only accessible via postgres service role)
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Prisma Migrations: Strictly internal
ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;

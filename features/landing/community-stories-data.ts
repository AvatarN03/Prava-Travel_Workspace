export type CommunityStoryCategory =
  | "all"
  | "himalayas"
  | "heritage"
  | "south"
  | "east";

export interface CommunityStory {
  id: string;
  category: Exclude<CommunityStoryCategory, "all">;
  destination: string;
  title: string;
  excerpt: string;
  author: string;
  meta: string;
  imageUrl: string;
  href: string;
}

export const COMMUNITY_STORIES: CommunityStory[] = [
  {
    id: "ladakh",
    category: "himalayas",
    destination: "LADAKH · TRANS-HIMALAYAS",
    title: "High Passes & Ancient Chants: 7 Days in Ladakh",
    excerpt:
      "Waking at 5:30 AM to monastic horns at Thiksey, traversing prayer flags over Khardung La at 5,359m, and watching twilight settle on the cyan waters of Pangong Tso.",
    author: "Tenzin Norbu & Priya Sharma",
    meta: "14 stops · 3 monastery stays",
    imageUrl:
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
    href: "/stories",
  },
  {
    id: "rajasthan",
    category: "heritage",
    destination: "JAIPUR & UDAIPUR · RAJASTHAN",
    title: "The Amber Route: A Slow Guide to Royal Rajasthan",
    excerpt:
      "Stepping past courtyards of mirrored glass in Amer Palace, discovering forgotten stepwells in the Aravalli hills, and drifting across Lake Pichola at sunset.",
    author: "Kabir Sen",
    meta: "11 stops · 2 heritage havelis",
    imageUrl:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    href: "/stories",
  },
  {
    id: "kerala",
    category: "south",
    destination: "ALLEPPEY & MUNNAR · KERALA",
    title: "Where the Waters Slow Down: Kerala's Backwater Corridors",
    excerpt:
      "Drifting in a cedar kettuvallam through narrow canals lined with coconut palms, tasting fresh karimeen pollichathu, and winding upward into the cool tea mist of Munnar.",
    author: "Ananya Nair",
    meta: "9 stops · 1 kettuvallam stay",
    imageUrl:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    href: "/stories",
  },
  {
    id: "varanasi",
    category: "east",
    destination: "VARANASI · UTTAR PRADESH",
    title: "Dawn on the Sacred Ghats of Kashi",
    excerpt:
      "Boarding an oarsman's wooden boat at Assi Ghat before sunrise, watching sacred lamps illuminate the morning river mist, and threading ancient lanes for Banarasi silk.",
    author: "Devraj Mukherjee",
    meta: "8 stops · 4 morning rituals",
    imageUrl:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    href: "/stories",
  },
  {
    id: "hampi",
    category: "south",
    destination: "HAMPI · KARNATAKA",
    title: "Boulders and Empires: Cycling the Forgotten Capital",
    excerpt:
      "Pedaling between surreal granite boulders, crossing the Tungabhadra River in round coracles, and admiring the monolithic stone chariot of Vijayanagara at dusk.",
    author: "Vikram Rao",
    meta: "12 stops · 2 riverside stays",
    imageUrl:
      "https://images.unsplash.com/photo-1600100397608-f010f444f417?auto=format&fit=crop&w=800&q=80",
    href: "/stories",
  },
  {
    id: "meghalaya",
    category: "east",
    destination: "MEGHALAYA · NORTHEAST",
    title: "Living Root Bridges & The Clouds of Cherrapunji",
    excerpt:
      "Descending 3,500 stone steps into the subtropical valleys of Nongriat to cross double-decker living root bridges and swimming in the glass-clear waters of the Umngot River.",
    author: "Natasha Lyngdoh",
    meta: "10 stops · 2 eco-homestays",
    imageUrl:
      "https://images.unsplash.com/photo-1626014303757-646633b3ea59?auto=format&fit=crop&w=800&q=80",
    href: "/stories",
  },
];

export const COMMUNITY_STORY_CATEGORIES = [
  { id: "all", label: "All Journeys" },
  { id: "himalayas", label: "Himalayas" },
  { id: "heritage", label: "Royal Heritage" },
  { id: "south", label: "Coastal & South" },
  { id: "east", label: "Ancient & East" },
] as const satisfies ReadonlyArray<{
  id: CommunityStoryCategory;
  label: string;
}>;

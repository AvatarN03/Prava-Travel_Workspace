import {
  Bookmark,
  Calendar,
  CheckSquare,
  CloudSun,
  FileSpreadsheet,
  FileText,
  Hotel,
  MapPin,
  MessageSquare,
  Receipt,
  Search,
  Sparkles,
  Train,
} from "lucide-react";

// Data displayed by ScatteredVsUnified's "The Scattered Way" view.
export const SCATTERED_ITEMS = [
  { icon: Search, header: "Browser Tab 1", title: '"best dal baati churma and lassi near old jaipur"', detail: "14 tabs open · conflicting blog reviews" },
  { icon: FileText, header: "Quick Note (Untitled 4)", title: "- buy UPI One World pass at Delhi airport?\n- Kabir says visit Panna Meena Stepwell early\n- luggage cloakroom at Jaipur Jn??", detail: "Unformatted notes app scratchpad" },
  { icon: Train, header: "IRCTC Train Confirmation", title: "Vande Bharat Express 20978 · Exec Chair Car C1", detail: "Depart 06:10 · New Delhi to Jaipur · PNR: 2458991204" },
  { icon: MapPin, header: "Saved Pins (42 items)", title: "Unsorted Rajasthan pins", detail: "Pins clustered across Jaipur, Jodhpur & Udaipur without days" },
  { icon: FileSpreadsheet, header: "Trip Budget & Split_final", title: "Samode Haveli: ₹37,000\nVande Bharat: ₹7,200", detail: "Total?: Missing auto-rickshaw receipts" },
  { icon: Bookmark, header: "Saved Reel", title: '"Secret rooftop overlooking Lake Pichola at sunset"', detail: "No location tagged · screenshot buried in gallery" },
  { icon: CloudSun, header: "Weather App", title: "Jaipur 28°C · Dry desert breeze on Tuesday", detail: "Need to shift open-air Amer Palace to morning" },
  { icon: MessageSquare, header: "Group Chat", title: '"Hey did anyone book the sunset boat on Lake Pichola yet?"', detail: "Sent 2 days ago · no confirmation" },
] as const;

// Data displayed by ScatteredVsUnified's "The Prava Workspace" view.
export const UNIFIED_ITEMS = [
  { icon: Calendar, header: "Itinerary Tab", title: "08:30 Amer Palace & Sheesh Mahal", detail: "Scheduled in Day 02 morning corridor with scenic Aravalli transit buffer", accent: true },
  { icon: Hotel, header: "Accommodations Tab", title: "Samode Haveli · Deluxe Suite", detail: "Check-in Nov 14, booking voucher code, and hotel phone stored in one card", accent: false },
  { icon: Receipt, header: "Expenses Tab", title: "Multi-Currency Ledger & Categories", detail: "Logged ₹54,200 with automatic USD conversion · Categorized & tracked against budget", accent: false },
  { icon: FileText, header: "Notes Tab", title: "Rajasthan Rail & UPI Transit Guide", detail: "Clean markdown doc with pinned IRCTC schedules & verified station tips", accent: false },
  { icon: CheckSquare, header: "Checklist Tab", title: "Packing & Pre-Trip To-Dos", detail: "Verified ILP permits, camera gear, and electrolyte packs checked off", accent: false },
  { icon: Bookmark, header: "Links & Bookmarks", title: "Lake Pichola Sunset Pier", detail: "Saved restaurant reservation and verified boat jetty coordinate links", accent: false },
  { icon: CloudSun, header: "Travel Essentials", title: "Live Weather, FX & Country Guide", detail: "5-day forecast, ECB exchange rates, and 24/7 tourist helpline (1363)", accent: false },
  { icon: Sparkles, header: "Workspace AI", title: "Contextual Route Proposals", detail: "Suggests optimal morning stop order to avoid desert midday heat", accent: true },
] as const;

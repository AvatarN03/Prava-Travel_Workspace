export const AI_ASSISTANT_PROMPTS = [
  "Can you rearrange tomorrow's stops in Jaipur to avoid the afternoon desert heat?",
  "Find a quiet rooftop chai vantage point overlooking Lake Pichola at sunset",
  "Suggest a verified artisan block-printing workshop near Amber",
] as const;

export const AI_ASSISTANT_PROPOSAL_STOPS = [
  { time: "08:30", title: "Amer Palace & Sheesh Mahal", loc: "Amber Ridge · Morning mirror light", tag: "Outdoor Heritage", duration: "2h 30m dwell" },
  { time: "11:30", title: "Panna Meena Ka Kund Stepwell", loc: "Geometric stepwell dwell in Amber foothills", tag: "Architectural Dwell", duration: "45m dwell" },
  { time: "13:00", title: "Anokhi Museum & Lunch", loc: "1135 AD Amber Ramparts · Shaded thali", tag: "Shaded Dining", duration: "1h 30m dining" },
  { time: "17:15", title: "Sunset over Nahargarh Fort", loc: "Aravalli Range crest overlooking Pink City", tag: "Sunset Overlook", duration: "1h 45m golden hour" },
] as const;

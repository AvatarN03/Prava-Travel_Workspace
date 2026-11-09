export interface ItineraryScheduleItem {
  time: string;
  duration: string;
  title: string;
  location: string;
  description: string;
  transit: string;
  hideOnMobile?: boolean;
}

// Static timeline content displayed by ItinerarySection.
export const ITINERARY_SCHEDULE_ITEMS: ItineraryScheduleItem[] = [
  { time: "07:15", duration: "45m · Morning Ritual", title: "Sunrise Chai at Hawa Mahal", location: "Badi Chaupar · Pink City Old Quarters", description: "Quiet dawn light hitting the 953 honeycomb sandstone windows. Sip spiced cardamom kulhad chai before morning street vendors arrive.", transit: "12 min e-rickshaw through historic Johari Bazaar" },
  { time: "09:30", duration: "2h 30m · Heritage Exploration", title: "Amer Fort & Sheesh Mahal (Mirror Palace)", location: "Amber Ridge · Overlooking Maota Lake", description: "Wander through Rajput courtyards, marble pillar arcades, and concave Belgian glass mosaics illuminated by morning sun rays.", transit: "Private AC transit via scenic Aravalli bypass road (20 min)", hideOnMobile: true },
  { time: "13:00", duration: "1h 30m · Artisan & Culinary", title: "Royal Thali Tasting & Hand-Block Ateliers", location: "1135 AD & Anokhi Museum of Printing", description: "Traditional hand-ground spices and slow-cooked dal baati churma, followed by demonstrations of heritage indigo block printing.", transit: "15 min gentle drive toward Nahargarh scenic ridge" },
  { time: "17:15", duration: "1h 15m · Golden Hour", title: "Sunset over Nahargarh Stepwell", location: "Nahargarh Fort · Aravalli Crest", description: "Watch the setting sun cast warm amber hues across the entire Pink City basin from the carved ramparts.", transit: "Evening descent back to Samode Haveli (25 min)", hideOnMobile: true },
];

export interface DestinationJourney {
  id: string;
  name: string;
  region: string;
  dates: string;
  coordinates: string;
  photos: {
    url: string;
    caption: string;
  }[];
  itinerary: {
    time: string;
    title: string;
    location: string;
    isPrimary?: boolean;
  }[];
  budget: {
    total: string;
    spent: string;
    left: string;
    percent: string;
  };
  checklist: string[];
}

export const INDIAN_JOURNEYS: DestinationJourney[] = [
  {
    id: "ladakh",
    name: "LADAKH",
    region: "Trans-Himalayas",
    dates: "10 — 18 JUL",
    coordinates: "34.1526° N, 77.5771° E · ELEV 3,500M",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
        caption: "FRAME 01 · Pangong Tso Glacial Waterline",
      },
      {
        url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
        caption: "FRAME 02 · Thiksey Monastery Indus Ridge",
      },
      {
        url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
        caption: "FRAME 03 · Hunder High Altitude Sand Dunes",
      },
    ],
    itinerary: [
      {
        time: "06:30",
        title: "Sunrise Prayers at Thiksey",
        location: "Indus Valley · Morning chanting dwell",
      },
      {
        time: "11:00",
        title: "Khardung La Pass Crossing",
        location: "5,359m Summit · Prayer flag corridor",
      },
      {
        time: "16:00",
        title: "Nubra Valley Sand Dunes",
        location: "Hunder · High mountain desert oasis",
        isPrimary: true,
      },
    ],
    budget: {
      total: "₹1,10,000",
      spent: "₹42,500",
      left: "₹67,500 left",
      percent: "38%",
    },
    checklist: [
      "Inner Line Permit (ILP) approved",
      "Acclimatization salts & hydration packed",
      "Offline Leh & Nubra maps cached",
    ],
  },
  {
    id: "rajasthan",
    name: "RAJASTHAN",
    region: "Royal Heritage",
    dates: "14 — 22 NOV",
    coordinates: "26.9124° N, 75.7873° E · JAIPUR & UDAIPUR",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
        caption: "FRAME 01 · Amer Palace over Maota Lake",
      },
      {
        url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        caption: "FRAME 02 · Lake Pichola Dusk over Udaipur",
      },
      {
        url: "https://images.unsplash.com/photo-1609137144822-26302b115664?auto=format&fit=crop&w=1200&q=80",
        caption: "FRAME 03 · Hawa Mahal Sandstone Honeycomb",
      },
    ],
    itinerary: [
      {
        time: "08:30",
        title: "Amer Palace & Sheesh Mahal",
        location: "Amber · Morning light on mirror mosaics",
      },
      {
        time: "12:30",
        title: "Culinary Tasting at 1135 AD",
        location: "Amer Fort Ramparts · Royal Rajasthani thali",
      },
      {
        time: "17:00",
        title: "Sunset at Nahargarh Stepwell",
        location: "Aravalli Range · Overlook across Pink City",
        isPrimary: true,
      },
    ],
    budget: {
      total: "₹1,45,000",
      spent: "₹54,200",
      left: "₹90,800 left",
      percent: "37%",
    },
    checklist: [
      "Samode Haveli stay confirmed",
      "UPI One World pass active",
      "Private Lake Pichola boat reserved",
    ],
  },
  {
    id: "kerala",
    name: "KERALA",
    region: "Coastal South",
    dates: "04 — 12 DEC",
    coordinates: "9.4981° N, 76.3388° E · ALLEPPEY & MUNNAR",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
        caption: "FRAME 01 · Alleppey Kettuvallam Houseboat Drift",
      },
      {
        url: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80",
        caption: "FRAME 02 · Munnar Tea Highlands Emerald Mist",
      },
      {
        url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
        caption: "FRAME 03 · Vembanad Waterway Sunset Dwell",
      },
    ],
    itinerary: [
      {
        time: "07:00",
        title: "Canoe Exploration of Backwaters",
        location: "Vembanad Lake · Morning birdsong canal",
      },
      {
        time: "12:30",
        title: "Traditional Lunch on Houseboat",
        location: "Punnamada Waterway · Karimeen pollichathu",
      },
      {
        time: "17:30",
        title: "Fort Kochi Heritage Stroll",
        location: "Jew Town & Chinese Fishing Nets sunset",
        isPrimary: true,
      },
    ],
    budget: {
      total: "₹95,000",
      spent: "₹34,800",
      left: "₹60,200 left",
      percent: "36%",
    },
    checklist: [
      "Houseboat boarding pass saved",
      "Ayurvedic wellness session booked",
      "Mosquito repellent & rain gear packed",
    ],
  },
  {
    id: "varanasi",
    name: "VARANASI",
    region: "Ancient Ghats",
    dates: "18 — 25 OCT",
    coordinates: "25.3176° N, 82.9739° E · SACRED GANGA",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
        caption: "FRAME 01 · Dawn Rowboats on River Ganga",
      },
      {
        url: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80",
        caption: "FRAME 02 · Ancient Sandstone Ghats of Kashi",
      },
      {
        url: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=1200&q=80",
        caption: "FRAME 03 · Dashashwamedh Maha Aarti Ritual",
      },
    ],
    itinerary: [
      {
        time: "05:45",
        title: "Subah-e-Banaras Sunrise Boat",
        location: "Assi to Manikarnika · Morning classical flute",
      },
      {
        time: "09:30",
        title: "Chowk Heritage Weavers Walk",
        location: "Old Alleyways · Banarasi silk ateliers & kachori",
      },
      {
        time: "18:30",
        title: "Dashashwamedh Maha Aarti",
        location: "Ganga Waterfront · Chants and brass fire lamps",
        isPrimary: true,
      },
    ],
    budget: {
      total: "₹75,000",
      spent: "₹24,100",
      left: "₹50,900 left",
      percent: "32%",
    },
    checklist: [
      "Assi Ghat sunrise boatman reserved",
      "Sarnath archaeological pass downloaded",
      "Temple modest dress guidelines noted",
    ],
  },
];

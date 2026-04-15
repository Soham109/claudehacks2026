export interface DiningHall {
  id: string;
  name: string;
  shortName: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  hours: string;
  vibes: string[];
  image: string;
}

export const DINING_HALLS: DiningHall[] = [
  {
    id: "gordon",
    name: "Gordon Avenue Market",
    shortName: "Gordon's",
    address: "770 W Dayton St, Madison, WI 53706",
    lat: 43.0695,
    lng: -89.4065,
    description: "Located in the heart of the Southeast neighborhood near Sellery and Witte halls. Known for diverse food options and a bustling atmosphere.",
    hours: "7:00 AM - 9:00 PM",
    vibes: ["Energetic", "Social hub", "Late-night crowd"],
    image: "/dining/gordon.jpg",
  },
  {
    id: "rhetas",
    name: "Rheta's Market",
    shortName: "Rheta's",
    address: "420 N Park St, Madison, WI 53706",
    lat: 43.0762,
    lng: -89.3988,
    description: "Connected to Dejope Residence Hall on the Lakeshore path. A modern dining space with beautiful lake views.",
    hours: "7:00 AM - 9:00 PM",
    vibes: ["Chill", "Lakeshore views", "Study-friendly"],
    image: "/dining/rhetas.jpg",
  },
  {
    id: "four-lakes",
    name: "Four Lakes Market",
    shortName: "Four Lakes",
    address: "640 Elm Dr, Madison, WI 53706",
    lat: 43.0721,
    lng: -89.4132,
    description: "Located in the Lakeshore neighborhood near Smith and Slichter halls. A cozy spot with great comfort food.",
    hours: "7:00 AM - 8:30 PM",
    vibes: ["Cozy", "Comfort food", "Quieter"],
    image: "/dining/four-lakes.jpg",
  },
  {
    id: "lizs",
    name: "Liz's Market",
    shortName: "Liz's",
    address: "1180 Observatory Dr, Madison, WI 53706",
    lat: 43.0764,
    lng: -89.4197,
    description: "Nestled along Observatory Drive in the Lakeshore area near the lakeshore dorms. Known for fresh, healthy options.",
    hours: "7:00 AM - 8:00 PM",
    vibes: ["Health-conscious", "Peaceful", "Nature-adjacent"],
    image: "/dining/lizs.jpg",
  },
  {
    id: "carsons",
    name: "Carson's Market",
    shortName: "Carson's",
    address: "1515 Tripp Circle, Madison, WI 53706",
    lat: 43.0713,
    lng: -89.3935,
    description: "Located on the southeast side of campus, convenient for students in that area. Offers quick grab-and-go options.",
    hours: "10:00 AM - 8:00 PM",
    vibes: ["Quick bites", "Grab-and-go", "Casual"],
    image: "/dining/carsons.jpg",
  },
];

export const RESIDENCE_HALLS = [
  { id: "sellery", name: "Sellery Hall", lat: 43.0688, lng: -89.4052, area: "Southeast" },
  { id: "witte", name: "Witte Hall", lat: 43.0692, lng: -89.4060, area: "Southeast" },
  { id: "ogg", name: "Ogg Hall", lat: 43.0680, lng: -89.4048, area: "Southeast" },
  { id: "smith", name: "Smith Hall", lat: 43.0718, lng: -89.4120, area: "Lakeshore" },
  { id: "slichter", name: "Slichter Hall", lat: 43.0725, lng: -89.4115, area: "Lakeshore" },
  { id: "dejope", name: "Dejope Residence Hall", lat: 43.0767, lng: -89.3995, area: "Lakeshore" },
  { id: "leopold", name: "Leopold Residence Hall", lat: 43.0758, lng: -89.4180, area: "Lakeshore" },
  { id: "chadbourne", name: "Chadbourne Residence Hall", lat: 43.0710, lng: -89.4005, area: "Southeast" },
  { id: "barnard", name: "Barnard Hall", lat: 43.0730, lng: -89.4100, area: "Lakeshore" },
  { id: "cole", name: "Cole Hall", lat: 43.0735, lng: -89.4108, area: "Lakeshore" },
  { id: "sullivan", name: "Sullivan Hall", lat: 43.0728, lng: -89.4095, area: "Lakeshore" },
  { id: "kronshage", name: "Kronshage Hall", lat: 43.0742, lng: -89.4145, area: "Lakeshore" },
  { id: "adams", name: "Adams Hall", lat: 43.0720, lng: -89.4090, area: "Lakeshore" },
  { id: "tripp", name: "Tripp Hall", lat: 43.0715, lng: -89.4085, area: "Lakeshore" },
  { id: "waters", name: "Waters Residence Hall", lat: 43.0700, lng: -89.4040, area: "Southeast" },
  { id: "davis", name: "Phillips-Davis Hall", lat: 43.0682, lng: -89.3930, area: "Southeast" },
  { id: "off-campus", name: "Off Campus", lat: 43.0731, lng: -89.4012, area: "Off Campus" },
];

export const VIBES = [
  { id: "quiet", label: "Quiet lunch, light conversation", icon: "volume-x", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "tech", label: "Startup / tech talk", icon: "laptop", color: "bg-violet-50 text-violet-700 border-violet-200" },
  { id: "freshmen", label: "First-years", icon: "backpack", color: "bg-green-50 text-green-700 border-green-200" },
  { id: "international", label: "International students", icon: "globe", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "bad-day", label: "Just had a bad day", icon: "heart", color: "bg-sky-50 text-sky-700 border-sky-200" },
  { id: "study-break", label: "Study break needed", icon: "book-open", color: "bg-rose-50 text-rose-700 border-rose-200" },
  { id: "sports", label: "Sports / game day talk", icon: "trophy", color: "bg-red-50 text-red-700 border-red-200" },
  { id: "creative", label: "Creative minds", icon: "palette", color: "bg-pink-50 text-pink-700 border-pink-200" },
  { id: "fitness", label: "Gym & fitness chat", icon: "dumbbell", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "music", label: "Music lovers", icon: "music", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "food", label: "Foodies unite", icon: "chef-hat", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { id: "random", label: "Surprise me!", icon: "shuffle", color: "bg-teal-50 text-teal-700 border-teal-200" },
];

export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function walkingTimeMinutes(distanceMiles: number): number {
  return Math.round(distanceMiles / 0.05);
}

export function findOptimalDiningHall(
  memberLocations: { lat: number; lng: number }[]
): DiningHall {
  let bestHall = DINING_HALLS[0];
  let bestScore = Infinity;

  for (const hall of DINING_HALLS) {
    const totalDistance = memberLocations.reduce((sum, loc) => {
      return sum + haversineDistance(loc.lat, loc.lng, hall.lat, hall.lng);
    }, 0);
    const avgDistance = totalDistance / memberLocations.length;
    const maxDistance = Math.max(
      ...memberLocations.map((loc) =>
        haversineDistance(loc.lat, loc.lng, hall.lat, hall.lng)
      )
    );
    const score = avgDistance * 0.6 + maxDistance * 0.4;

    if (score < bestScore) {
      bestScore = score;
      bestHall = hall;
    }
  }

  return bestHall;
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowLeft, Sparkles, Clock, DollarSign, Calendar, Star, Info } from "lucide-react";
import WaitTimesPanel from "@/components/WaitTimesPanel";
import WeatherPanel from "@/components/WeatherPanel";
import ParkHoursPanel from "@/components/ParkHoursPanel";

const RESORTS: Record<string, {
  name: string;
  location: string;
  country: string;
  emoji: string;
  tagline: string;
  accentColor: string;
  heroGradient: string;
  description: string;
  openYear: number;
  size: string;
  annualVisitors: string;
  parks: { name: string; icon: string; description: string; mustDos: string[] }[];
  hotels: { name: string; tier: string; priceRange: string; highlight: string }[];
  tips: string[];
  bestTimes: string[];
  budgetGuide: { category: string; budget: string; moderate: string; deluxe: string }[];
}> = {
  wdw: {
    name: "Walt Disney World Resort",
    location: "Orlando, Florida",
    country: "USA",
    emoji: "🏰",
    tagline: "The Most Magical Place on Earth",
    accentColor: "#F5C842",
    heroGradient: "radial-gradient(ellipse at 30% 40%, #1a3a6e 0%, #0D1B2A 65%)",
    description: "The world's largest theme park resort, spanning 25,000 acres with four iconic theme parks, two water parks, over 30 resort hotels, and endless entertainment — Walt Disney World is a destination unto itself.",
    openYear: 1971,
    size: "25,000 acres",
    annualVisitors: "58M+",
    parks: [
      {
        name: "Magic Kingdom",
        icon: "🏰",
        description: "The classic — Cinderella Castle, classic rides, and nightly fireworks. Best for families and first-timers.",
        mustDos: ["Seven Dwarfs Mine Train", "Space Mountain", "Haunted Mansion", "Pirates of the Caribbean", "Festival of Fantasy Parade"],
      },
      {
        name: "EPCOT",
        icon: "🌍",
        description: "Future World meets World Showcase — innovation, culture, and the best food at Disney.",
        mustDos: ["Guardians of the Galaxy: Cosmic Rewind", "Remy's Ratatouille Adventure", "Soarin'", "Test Track", "World Showcase dining"],
      },
      {
        name: "Hollywood Studios",
        icon: "🎬",
        description: "Home to Star Wars: Galaxy's Edge and the most thrilling rides in WDW.",
        mustDos: ["Rise of the Resistance", "Slinky Dog Dash", "Millennium Falcon: Smugglers Run", "Tower of Terror", "Mickey & Minnie's Runaway Railway"],
      },
      {
        name: "Animal Kingdom",
        icon: "🦁",
        description: "Where nature meets adventure — Pandora and incredible animal experiences.",
        mustDos: ["Avatar Flight of Passage", "Expedition Everest", "Kilimanjaro Safaris", "Na'vi River Journey", "Finding Nemo: The Big Blue"],
      },
    ],
    hotels: [
      { name: "Disney's Grand Floridian", tier: "Deluxe", priceRange: "$600–$1,200/night", highlight: "Monorail access to Magic Kingdom" },
      { name: "Disney's Polynesian Village", tier: "Deluxe", priceRange: "$500–$900/night", highlight: "Stunning Magic Kingdom fireworks view" },
      { name: "Disney's Pop Century", tier: "Value", priceRange: "$120–$220/night", highlight: "Best value with Disney Skyliner access" },
      { name: "Swan & Dolphin", tier: "Moderate/Partner", priceRange: "$200–$400/night", highlight: "Walk to EPCOT + Hollywood Studios" },
    ],
    tips: [
      "Arrive 30–45 minutes before rope drop for the biggest rides",
      "Buy Lightning Lane Multi Pass early in the morning for peak days",
      "Book dining reservations 60 days in advance — especially Be Our Guest and Cinderella's Royal Table",
      "The Skyliner gondola connects EPCOT, Hollywood Studios, and several resorts free of charge",
      "Early Entry (7am) is available daily for resort guests — use it for Seven Dwarfs or Tron",
    ],
    bestTimes: ["January–February (post-holidays)", "Late August–early September", "Mid-November (before Thanksgiving)"],
    budgetGuide: [
      { category: "Tickets (per day)", budget: "$109", moderate: "$129", deluxe: "$189+" },
      { category: "Hotel (per night)", budget: "$120–$220", moderate: "$250–$450", deluxe: "$500–$1,200" },
      { category: "Food (per day/person)", budget: "$40–$60", moderate: "$70–$100", deluxe: "$120–$200" },
      { category: "Parking", budget: "$30/day", moderate: "Free (resort)", deluxe: "Free (resort)" },
    ],
  },
  disneyland: {
    name: "Disneyland Resort",
    location: "Anaheim, California",
    country: "USA",
    emoji: "✨",
    tagline: "The Happiest Place on Earth",
    accentColor: "#FF6B6B",
    heroGradient: "radial-gradient(ellipse at 60% 40%, #6e1a1a 0%, #0D1B2A 65%)",
    description: "The original Disney park — the one Walt Disney himself walked through. Smaller and more intimate than WDW but packed with history, classic attractions, and unmatched charm.",
    openYear: 1955,
    size: "500 acres",
    annualVisitors: "18M+",
    parks: [
      {
        name: "Disneyland Park",
        icon: "✨",
        description: "The original. Every land feels handcrafted — this is where Disney magic was invented.",
        mustDos: ["Matterhorn Bobsleds", "Pirates of the Caribbean", "Haunted Mansion Holiday", "Indiana Jones Adventure", "Star Wars: Rise of the Resistance"],
      },
      {
        name: "Disney California Adventure",
        icon: "🌅",
        description: "A love letter to California — Pixar, Avengers Campus, and the incredible Radiator Springs Racers.",
        mustDos: ["Radiator Springs Racers", "Web Slingers: A Spider-Man Adventure", "Guardians of the Galaxy: Mission Breakout", "Incredicoaster", "World of Color"],
      },
    ],
    hotels: [
      { name: "Disneyland Hotel", tier: "Deluxe", priceRange: "$400–$800/night", highlight: "Walking distance to both parks" },
      { name: "Disney's Grand Californian", tier: "Deluxe", priceRange: "$500–$900/night", highlight: "Direct entrance into DCA" },
      { name: "Paradise Pier Hotel", tier: "Moderate", priceRange: "$200–$400/night", highlight: "Affordable Disney official option" },
    ],
    tips: [
      "Disneyland is walkable — the two parks share an entrance plaza",
      "MaxPass (Lightning Lane equivalent) sells out fast — buy at 7am",
      "Blue Bayou restaurant is inside Pirates of the Caribbean — worth the reservation",
      "Park hopping is easy and recommended — stay for World of Color at DCA at night",
      "The Matterhorn and Haunted Mansion have unique elements only at Disneyland",
    ],
    bestTimes: ["January–March", "September–October (Halloween season)", "Weekdays year-round"],
    budgetGuide: [
      { category: "Tickets (per day)", budget: "$104", moderate: "$154", deluxe: "$189+" },
      { category: "Hotel (per night)", budget: "$150–$250 (off-site)", moderate: "$200–$400", deluxe: "$500–$900" },
      { category: "Food (per day/person)", budget: "$35–$55", moderate: "$65–$90", deluxe: "$100–$160" },
      { category: "Parking", budget: "$35/day", moderate: "Hotel included", deluxe: "Hotel included" },
    ],
  },
  paris: {
    name: "Disneyland Paris",
    location: "Chessy, France",
    country: "France",
    emoji: "🗼",
    tagline: "Où la Magie Prend Vie",
    accentColor: "#4ECDC4",
    heroGradient: "radial-gradient(ellipse at 40% 30%, #1a4e6e 0%, #0D1B2A 65%)",
    description: "The most-visited tourist destination in Europe and Disney's most architecturally stunning resort. European elegance meets Disney magic — plus the most dramatic Sleeping Beauty Castle in the world.",
    openYear: 1992,
    size: "4,800 acres",
    annualVisitors: "15M+",
    parks: [
      {
        name: "Disneyland Park Paris",
        icon: "🏰",
        description: "The European version of the original, with gothic architecture and unique French touches.",
        mustDos: ["Phantom Manor", "Big Thunder Mountain", "Pirates of the Caribbean", "Buzz Lightyear Laser Blast", "Star Wars Hyperspace Mountain"],
      },
      {
        name: "Disney Adventure World",
        icon: "⚡",
        description: "The thrill park — Avengers Campus, Toy Story Land, and Marvel at full scale.",
        mustDos: ["Avengers Assemble: Flight Force", "Cars ROAD TRIP", "Ratatouille: The Adventure", "Toy Soldiers Parachute Drop"],
      },
    ],
    hotels: [
      { name: "Disneyland Hotel", tier: "Deluxe", priceRange: "€400–€900/night", highlight: "Castle-view rooms, direct park entry" },
      { name: "Disney's Sequoia Lodge", tier: "Moderate", priceRange: "€200–€450/night", highlight: "Beautiful American frontier theming" },
      { name: "Disney's Hotel Cheyenne", tier: "Value", priceRange: "€100–€200/night", highlight: "Best value on-site, Toy Story theming" },
    ],
    tips: [
      "Book the Disneyland Hotel for the most magical experience — it sits at the park entrance",
      "The parks are best visited on weekdays; weekends bring European visitors in large numbers",
      "The food quality at DLP is significantly better than US Disney parks — don't skip the restaurants",
      "Phantom Manor is DLP's take on Haunted Mansion and is genuinely superior in storytelling",
      "RER A train runs directly from Paris city center to the park in ~40 minutes",
    ],
    bestTimes: ["January–March", "October–early November", "Midweek visits year-round"],
    budgetGuide: [
      { category: "Tickets (per day)", budget: "€56", moderate: "€89", deluxe: "€120+" },
      { category: "Hotel (per night)", budget: "€100–€200", moderate: "€200–€450", deluxe: "€400–€900" },
      { category: "Food (per day/person)", budget: "€30–€50", moderate: "€60–€90", deluxe: "€100–€160" },
      { category: "Transport from Paris", budget: "€8 RER A", moderate: "€8 RER A", deluxe: "€60–€80 taxi" },
    ],
  },
  tokyo: {
    name: "Tokyo Disney Resort",
    location: "Urayasu, Chiba",
    country: "Japan",
    emoji: "🌸",
    tagline: "A World of Harmony and Magic",
    accentColor: "#FF9EBB",
    heroGradient: "radial-gradient(ellipse at 50% 30%, #6e1a4e 0%, #0D1B2A 65%)",
    description: "Widely regarded as the best-operated Disney resort in the world. Tokyo Disney Resort is immaculate, detail-obsessed, and beloved by Japanese guests and international visitors alike. DisneySea is frequently called the best theme park on the planet.",
    openYear: 1983,
    size: "494 acres",
    annualVisitors: "30M+",
    parks: [
      {
        name: "Tokyo Disneyland",
        icon: "🌸",
        description: "The original Tokyo park — meticulously maintained and beloved for its classic Disney atmosphere.",
        mustDos: ["Pooh's Hunny Hunt (no Fastpass equivalent)", "Space Mountain", "Haunted Mansion", "Big Thunder Mountain", "Fantasyland expansion"],
      },
      {
        name: "Tokyo DisneySea",
        icon: "🌊",
        description: "The most unique Disney park in the world — a nautical-themed marvel with stunning architecture and theming unmatched anywhere.",
        mustDos: ["Journey to the Center of the Earth", "20,000 Leagues Under the Sea", "Indiana Jones Adventure", "Tower of Terror", "Fantasy Springs (new 2024)"],
      },
    ],
    hotels: [
      { name: "Disney Ambassador Hotel", tier: "Deluxe", priceRange: "¥45,000–¥80,000/night", highlight: "Only hotel connected directly to both parks" },
      { name: "Tokyo DisneySea Hotel MiraCosta", tier: "Deluxe", priceRange: "¥60,000–¥120,000/night", highlight: "Inside the DisneySea park itself" },
      { name: "Disney Resort Line hotels", tier: "Moderate", priceRange: "¥25,000–¥45,000/night", highlight: "Connected by monorail" },
    ],
    tips: [
      "Purchase a vacation package through the Japanese Disney site for Premier Access (Fastpass equivalent)",
      "Tokyo DisneySea is worth a full day or more — plan at minimum one full day there",
      "Arrive before gates open — the Japanese queuing culture means lines form extremely early",
      "The food at Tokyo Disney is exceptional — themed snacks and popcorn buckets are a must",
      "Keiyo Line or Musashino Line from Tokyo Station reaches Maihama Station in ~15 minutes",
    ],
    bestTimes: ["November–December", "January–February", "Weekdays in any month"],
    budgetGuide: [
      { category: "Tickets (per day)", budget: "¥7,900", moderate: "¥8,900", deluxe: "¥10,900" },
      { category: "Hotel (per night)", budget: "¥15,000 (off-site)", moderate: "¥25,000–¥45,000", deluxe: "¥60,000–¥120,000" },
      { category: "Food (per day/person)", budget: "¥3,000–¥5,000", moderate: "¥6,000–¥10,000", deluxe: "¥12,000–¥20,000" },
      { category: "Transport", budget: "¥400 train", moderate: "¥400 train", deluxe: "¥3,000 taxi" },
    ],
  },
  hongkong: {
    name: "Hong Kong Disneyland",
    location: "Lantau Island, Hong Kong",
    country: "Hong Kong",
    emoji: "🏮",
    tagline: "Where Fantasy Meets Asia",
    accentColor: "#F5A623",
    heroGradient: "radial-gradient(ellipse at 60% 40%, #6e3a1a 0%, #0D1B2A 65%)",
    description: "The smallest and most intimate Disney park — but one that has undergone a massive expansion with Marvel, Frozen, and Moana-themed lands. A local gem that rewards repeat visits.",
    openYear: 2005,
    size: "310 acres",
    annualVisitors: "6M+",
    parks: [
      {
        name: "Hong Kong Disneyland",
        icon: "🏮",
        description: "Compact but deeply charming, with unique Asia-exclusive attractions and stunning nighttime shows.",
        mustDos: ["Iron Man Experience", "Ant-Man and the Wasp: Nano Battle!", "Hyperspace Mountain", "Big Grizzly Mountain Runaway Mine Cars", "Moana: A Homecoming Celebration"],
      },
    ],
    hotels: [
      { name: "Hong Kong Disneyland Hotel", tier: "Deluxe", priceRange: "HK$1,800–$4,000/night", highlight: "Victorian-themed, castle views, beach access" },
      { name: "Disney Explorers Lodge", tier: "Moderate", priceRange: "HK$1,200–$2,500/night", highlight: "Nature-explorer theming, great for families" },
      { name: "Disney Hollywood Hotel", tier: "Moderate", priceRange: "HK$900–$2,000/night", highlight: "Hollywood Golden Age theming, most affordable on-site" },
    ],
    tips: [
      "HKDL is walkable in a day — it pairs well with a day at Ocean Park",
      "The MTR Disneyland Resort Line runs directly to the park from Sunny Bay station",
      "The park is quieter on weekdays and during non-holiday periods",
      "The Main Street Electrical Parade and Castle of Magical Dreams are must-sees at night",
      "Language signage is in English, Cantonese, and Mandarin — very accessible for international visitors",
    ],
    bestTimes: ["October–December", "February–April", "Any weekday"],
    budgetGuide: [
      { category: "Tickets (per day)", budget: "HK$619", moderate: "HK$689", deluxe: "HK$769" },
      { category: "Hotel (per night)", budget: "HK$900–$1,200", moderate: "HK$1,200–$2,500", deluxe: "HK$1,800–$4,000" },
      { category: "Food (per day/person)", budget: "HK$200–$350", moderate: "HK$400–$600", deluxe: "HK$700–$1,200" },
      { category: "Transport", budget: "HK$25 MTR", moderate: "HK$25 MTR", deluxe: "HK$400 taxi" },
    ],
  },
  shanghai: {
    name: "Shanghai Disney Resort",
    location: "Pudong, Shanghai",
    country: "China",
    emoji: "🐉",
    tagline: "Authentically Disney, Distinctly Chinese",
    accentColor: "#7ED321",
    heroGradient: "radial-gradient(ellipse at 40% 50%, #1a6e1a 0%, #0D1B2A 65%)",
    description: "The newest and most technologically advanced Disney park in the world. Shanghai Disneyland features the largest castle in Disney history, never-before-seen attractions, and a unique fusion of Chinese culture and Disney storytelling.",
    openYear: 2016,
    size: "963 acres",
    annualVisitors: "11M+",
    parks: [
      {
        name: "Shanghai Disneyland",
        icon: "🐉",
        description: "The most modern Disney park anywhere — built without a Main Street, with the Enchanted Storybook Castle at its heart.",
        mustDos: ["TRON Lightcycle Power Run", "Pirates of the Caribbean: Battle for the Sunken Treasure", "Roaring Rapids", "Soaring Over the Horizon", "Zootopia"],
      },
    ],
    hotels: [
      { name: "Shanghai Disneyland Hotel", tier: "Deluxe", priceRange: "¥1,500–$3,500/night", highlight: "Fairy tale theming, direct park connection" },
      { name: "Toy Story Hotel", tier: "Moderate", priceRange: "¥800–$1,800/night", highlight: "Full Toy Story immersion, great for kids" },
    ],
    tips: [
      "Purchase park tickets on the official Disney China app — international visitors need a Chinese payment method or advance planning",
      "The TRON ride at Shanghai is still unique globally — it's the best version of this attraction",
      "Arrive at rope drop — the park can reach capacity on holidays",
      "The Chinese-language entertainment is stunning even without understanding the language",
      "Subway Line 11 connects the park to downtown Shanghai in about 60 minutes",
    ],
    bestTimes: ["October–November", "March–April", "January (outside Chinese New Year)"],
    budgetGuide: [
      { category: "Tickets (per day)", budget: "¥399", moderate: "¥575", deluxe: "¥719" },
      { category: "Hotel (per night)", budget: "¥800–$1,000 (off-site)", moderate: "¥800–$1,800", deluxe: "¥1,500–$3,500" },
      { category: "Food (per day/person)", budget: "¥150–$250", moderate: "¥300–$500", deluxe: "¥600–$1,000" },
      { category: "Transport", budget: "¥10 subway", moderate: "¥10 subway", deluxe: "¥200 taxi" },
    ],
  },
  "universal-orlando": {
    name: "Universal Orlando Resort",
    location: "Orlando, Florida",
    country: "USA",
    emoji: "🎬",
    tagline: "Vacation Like You Mean It",
    accentColor: "#BD10E0",
    heroGradient: "radial-gradient(ellipse at 50% 40%, #4a1a6e 0%, #0D1B2A 65%)",
    description: "Universal Orlando is the thrill capital of Orlando — home to The Wizarding World of Harry Potter, a new Epic Universe opening in 2025, and the most technically ambitious rides in theme park history.",
    openYear: 1990,
    size: "840 acres",
    annualVisitors: "21M+",
    parks: [
      {
        name: "Universal Studios Florida",
        icon: "🎬",
        description: "Hollywood-themed storytelling with Harry Potter, Minions, and Springfield.",
        mustDos: ["Hagrid's Magical Creatures Motorbike Adventure", "Hollywood Rip Ride Rockit", "Revenge of the Mummy", "MEN IN BLACK Alien Attack", "The Simpsons Ride"],
      },
      {
        name: "Islands of Adventure",
        icon: "🏝️",
        description: "The original Wizarding World and the most adventurous park in Orlando.",
        mustDos: ["Hagrid's Magical Creatures Motorbike Adventure", "Jurassic World VelociCoaster", "The Amazing Adventures of Spider-Man", "Doctor Doom's Fearfall", "Skull Island: Reign of Kong"],
      },
      {
        name: "Epic Universe",
        icon: "🌌",
        description: "Opening 2025 — Universal's most ambitious park yet, with Wizarding World, Monster-verse, and more.",
        mustDos: ["The Wizarding World of Harry Potter (Ministry of Magic)", "How to Train Your Dragon", "Universal Monsters", "Super Nintendo World", "Celestial Park"],
      },
      {
        name: "Volcano Bay",
        icon: "🌊",
        description: "Universal's water park — a single volcano tower anchors an elaborate tropical experience.",
        mustDos: ["Krakatau Aqua Coaster", "Ko'okiri Body Plunge", "Honu ika Moana", "Punga Racers", "Kopiko Wai Winding River"],
      },
    ],
    hotels: [
      { name: "Loews Portofino Bay", tier: "Premier", priceRange: "$300–$700/night", highlight: "Italian Riviera theming, Express Pass included" },
      { name: "Hard Rock Hotel", tier: "Premier", priceRange: "$280–$600/night", highlight: "Rock & Roll theming, pool with underwater music" },
      { name: "Cabana Bay Beach Resort", tier: "Value", priceRange: "$120–$280/night", highlight: "Retro-Florida theming, lazy river, best value" },
    ],
    tips: [
      "Premier hotels include Express Pass — this alone makes the upcharge worth it on busy days",
      "Hagrid's is the most popular ride — arrive before opening and go straight there",
      "The Universal Orlando App shows wait times and lets you join virtual lines",
      "Park-to-park tickets are needed to ride the Hogwarts Express — buy them upfront",
      "Epic Universe opens Spring 2025 — plan a multi-day trip to do both parks",
    ],
    bestTimes: ["January–February", "September–October", "Weekdays year-round"],
    budgetGuide: [
      { category: "Tickets (1-park/day)", budget: "$109", moderate: "$139", deluxe: "$179+" },
      { category: "Hotel (per night)", budget: "$120–$200 (off-site)", moderate: "$200–$400", deluxe: "$300–$700" },
      { category: "Food (per day/person)", budget: "$35–$55", moderate: "$60–$90", deluxe: "$100–$160" },
      { category: "Express Pass", budget: "Not included", moderate: "$80–$120/day", deluxe: "Included w/ Premier hotel" },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(RESORTS).map((id) => ({ id }));
}

export default async function ResortPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resort = RESORTS[id];
  if (!resort) notFound();

  return (
    <main className="min-h-screen" style={{ background: "#0D1B2A" }}>
      {/* Hero */}
      <div
        className="relative pt-0 pb-16 overflow-hidden"
        style={{ background: resort.heroGradient }}
      >
        <div className="stars" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 50% 60% at 70% 50%, ${resort.accentColor}10 0%, transparent 70%)`,
          }}
        />

        {/* Nav bar */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft size={16} className="text-park-mist group-hover:text-park-gold transition-colors" />
            <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center">
              <MapPin size={13} className="text-park-night" />
            </div>
            <span className="font-display font-700 text-lg text-park-cream">
              Park<span className="text-park-gold">Plan</span>
              <span className="text-park-mist text-xs font-body font-normal ml-1">.ai</span>
            </span>
          </Link>
          <Link
            href={`/plan?resort=${id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-600 text-park-night"
            style={{ background: "linear-gradient(135deg, #F5C842, #E8A020)" }}
          >
            <Sparkles size={13} />
            Plan This Trip
          </Link>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-6">
          <div className="text-6xl mb-4">{resort.emoji}</div>
          <p className="font-body text-xs uppercase tracking-widest mb-2 font-600" style={{ color: resort.accentColor }}>
            {resort.location} · Est. {resort.openYear}
          </p>
          <h1 className="font-display font-900 text-4xl sm:text-5xl md:text-6xl text-park-cream mb-3 leading-tight">
            {resort.name}
          </h1>
          <p className="font-body italic text-park-mist text-lg mb-6">&ldquo;{resort.tagline}&rdquo;</p>
          <p className="font-body text-park-mist leading-relaxed max-w-2xl text-base">{resort.description}</p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { icon: Calendar, label: `Open since ${resort.openYear}` },
              { icon: MapPin, label: resort.size },
              { icon: Star, label: `${resort.annualVisitors} annual visitors` },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body"
                style={{
                  background: "rgba(255,248,231,0.07)",
                  border: "1px solid rgba(255,248,231,0.12)",
                  color: "#B8C9D9",
                }}
              >
                <Icon size={11} style={{ color: resort.accentColor }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Parks + Tips */}
          <div className="lg:col-span-2 space-y-8">

            {/* Parks */}
            <section>
              <h2 className="font-display font-700 text-2xl text-park-cream mb-5">
                The Parks
              </h2>
              <div className="space-y-4">
                {resort.parks.map((park) => (
                  <div
                    key={park.name}
                    className="p-5 rounded-2xl border"
                    style={{
                      background: "rgba(26,46,69,0.5)",
                      borderColor: `${resort.accentColor}18`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{park.icon}</span>
                      <h3 className="font-display font-700 text-lg text-park-cream">{park.name}</h3>
                    </div>
                    <p className="font-body text-sm text-park-mist mb-4 leading-relaxed">{park.description}</p>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-body font-600 mb-2" style={{ color: resort.accentColor }}>
                        Must-Dos
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {park.mustDos.map((ride) => (
                          <span
                            key={ride}
                            className="px-2.5 py-1 rounded-full text-xs font-body"
                            style={{
                              background: `${resort.accentColor}12`,
                              color: resort.accentColor,
                              border: `1px solid ${resort.accentColor}25`,
                            }}
                          >
                            {ride}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Insider Tips */}
            <section>
              <h2 className="font-display font-700 text-2xl text-park-cream mb-5 flex items-center gap-2">
                <Info size={20} style={{ color: resort.accentColor }} />
                Insider Tips
              </h2>
              <div className="space-y-3">
                {resort.tips.map((tip, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-4 rounded-xl border"
                    style={{
                      background: "rgba(26,46,69,0.4)",
                      borderColor: "rgba(255,248,231,0.06)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-body font-700 mt-0.5"
                      style={{ background: resort.accentColor, color: "#0D1B2A" }}
                    >
                      {i + 1}
                    </div>
                    <p className="font-body text-sm text-park-mist leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Budget Guide */}
            <section>
              <h2 className="font-display font-700 text-2xl text-park-cream mb-5 flex items-center gap-2">
                <DollarSign size={20} style={{ color: resort.accentColor }} />
                Budget Guide
              </h2>
              <div
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="grid grid-cols-4 px-4 py-2.5 text-[10px] uppercase tracking-widest font-body font-600"
                  style={{ background: "rgba(30,58,95,0.7)", color: "#B8C9D9" }}
                >
                  <span>Category</span>
                  <span className="text-center">Budget</span>
                  <span className="text-center">Moderate</span>
                  <span className="text-center">Deluxe</span>
                </div>
                {resort.budgetGuide.map((row, i) => (
                  <div
                    key={row.category}
                    className="grid grid-cols-4 px-4 py-3 text-xs font-body border-t"
                    style={{
                      background: i % 2 === 0 ? "rgba(26,46,69,0.3)" : "rgba(13,27,42,0.5)",
                      borderColor: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <span className="text-park-cream font-500">{row.category}</span>
                    <span className="text-center text-green-400">{row.budget}</span>
                    <span className="text-center text-park-gold">{row.moderate}</span>
                    <span className="text-center text-park-coral">{row.deluxe}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Live data sidebar */}
          <div className="space-y-6">

            {/* Weather */}
            <WeatherPanel resortId={id} />

            {/* Park Hours & LL */}
            {/* Rendered client-side via WaitTimesPanel which now includes shows tab */}

            {/* Live Wait Times */}
            <WaitTimesPanel resortId={id} />

            {/* Best Times */}
            <div
              className="p-5 rounded-2xl border"
              style={{
                background: "rgba(26,46,69,0.5)",
                borderColor: `${resort.accentColor}18`,
              }}
            >
              <h3 className="font-display font-700 text-lg text-park-cream mb-4 flex items-center gap-2">
                <Calendar size={16} style={{ color: resort.accentColor }} />
                Best Times to Visit
              </h3>
              <div className="space-y-2">
                {resort.bestTimes.map((time, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-xl text-sm font-body"
                    style={{ background: `${resort.accentColor}10` }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: resort.accentColor }} />
                    <span className="text-park-mist">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotels */}
            <div
              className="p-5 rounded-2xl border"
              style={{
                background: "rgba(26,46,69,0.5)",
                borderColor: `${resort.accentColor}18`,
              }}
            >
              <h3 className="font-display font-700 text-lg text-park-cream mb-4">
                🏨 Where to Stay
              </h3>
              <div className="space-y-3">
                {resort.hotels.map((hotel) => (
                  <div
                    key={hotel.name}
                    className="p-3 rounded-xl border"
                    style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(13,27,42,0.4)" }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-body font-600 text-sm text-park-cream leading-tight">{hotel.name}</span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-body flex-shrink-0"
                        style={{
                          background: `${resort.accentColor}15`,
                          color: resort.accentColor,
                        }}
                      >
                        {hotel.tier}
                      </span>
                    </div>
                    <p className="text-xs text-park-mist font-body mb-1">{hotel.priceRange}</p>
                    <p className="text-[11px] text-park-mist/70 font-body italic">{hotel.highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI CTA */}
            <Link
              href={`/plan?resort=${id}`}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-body font-700 text-park-night transition-all hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #F5C842, #E8A020)",
                boxShadow: "0 8px 24px rgba(245,200,66,0.25)",
              }}
            >
              <Sparkles size={16} />
              Plan My {resort.name.split(" ")[0]} Trip
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

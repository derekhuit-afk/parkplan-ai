import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowLeft, Sparkles, Clock, DollarSign, Calendar, Star, Info } from "lucide-react";
import WaitTimesPanel from "@/components/WaitTimesPanel";
import WeatherPanel from "@/components/WeatherPanel";
import CrowdCalendar from "@/components/CrowdCalendar";

const RESORTS: Record<string, {
  name: string; location: string; country: string; emoji: string; tagline: string;
  accentColor: string; heroGradient: string; description: string; openYear: number;
  size: string; annualVisitors: string;
  parks: { name: string; icon: string; description: string; mustDos: string[] }[];
  hotels: { name: string; tier: string; priceRange: string; highlight: string }[];
  tips: string[];
  bestTimes: string[];
  budgetGuide: { category: string; budget: string; moderate: string; deluxe: string }[];
}> = {
  wdw: {
    name: "Walt Disney World Resort", location: "Orlando, Florida", country: "USA",
    emoji: "🏰", tagline: "The Most Magical Place on Earth",
    accentColor: "#FFD700",
    heroGradient: "radial-gradient(ellipse at 40% 60%, rgba(255,215,0,0.2) 0%, #0A1F5C 50%, #00194B 100%)",
    description: "The world's largest theme park resort spanning 25,000 acres — four theme parks, two water parks, Disney Springs, and over 30 resort hotels. TRON Lightcycle / Run, Tiana's Bayou Adventure, and Guardians of the Galaxy: Cosmic Rewind are among the newest headline attractions.",
    openYear: 1971, size: "25,000 acres", annualVisitors: "58M+",
    parks: [
      {
        name: "Magic Kingdom", icon: "🏰",
        description: "The iconic park — Cinderella Castle, classic rides, nightly fireworks, and the newest headliner TRON Lightcycle / Run. Perfect for families and first-timers.",
        mustDos: ["TRON Lightcycle / Run", "Seven Dwarfs Mine Train", "Tiana's Bayou Adventure", "Haunted Mansion", "Pirates of the Caribbean", "Space Mountain"],
      },
      {
        name: "EPCOT", icon: "🌍",
        description: "Future World meets World Showcase — innovation, world cultures, and the best dining at Disney. Journey of Water and Guardians: Cosmic Rewind are the newest must-rides.",
        mustDos: ["Guardians of the Galaxy: Cosmic Rewind", "Remy's Ratatouille Adventure", "Journey of Water, Inspired by Moana", "Soarin' Around the World", "Test Track", "World Showcase dining"],
      },
      {
        name: "Hollywood Studios", icon: "🎬",
        description: "Star Wars: Galaxy's Edge, Toy Story Land, and thrilling dark rides. Rise of the Resistance remains one of the most technically impressive attractions on Earth.",
        mustDos: ["Star Wars: Rise of the Resistance", "Slinky Dog Dash", "Millennium Falcon: Smugglers Run", "The Twilight Zone Tower of Terror", "Mickey & Minnie's Runaway Railway"],
      },
      {
        name: "Animal Kingdom", icon: "🦁",
        description: "Nature, adventure, and Pandora — The World of Avatar. The newest attraction is Zootopia: Better Zoogether! joining Avatar Flight of Passage as a must-do.",
        mustDos: ["Avatar Flight of Passage", "Expedition Everest", "Kilimanjaro Safaris", "Na'vi River Journey", "Zootopia: Better Zoogether!"],
      },
    ],
    hotels: [
      { name: "Disney's Grand Floridian Resort & Spa", tier: "Deluxe", priceRange: "$700–$1,400/night", highlight: "Monorail access to Magic Kingdom, most iconic resort" },
      { name: "Disney's Polynesian Village Resort", tier: "Deluxe", priceRange: "$600–$1,100/night", highlight: "Best Magic Kingdom fireworks view, monorail access" },
      { name: "Disney's Pop Century Resort", tier: "Value", priceRange: "$130–$250/night", highlight: "Best value + Disney Skyliner access to EPCOT & Hollywood Studios" },
      { name: "Swan Reserve / Dolphin (Marriott)", tier: "Partner Deluxe", priceRange: "$250–$500/night", highlight: "Walking distance to EPCOT & HS, use Marriott points" },
    ],
    tips: [
      "Arrive 30–45 min before park open — resort guests get Early Entry (7:30am) every day for an extra 30 minutes",
      "Lightning Lane Multi Pass is $30–$49/person/day depending on date — buy it at 7am; TRON and Seven Dwarfs sell out within minutes",
      "Book dining reservations exactly 60 days in advance — Be Our Guest, Space 220, and Cinderella's Royal Table fill instantly",
      "The Disney Skyliner gondola connects EPCOT, Hollywood Studios, and Pop Century/Art of Animation/Caribbean Beach resorts for free",
      "Genie+ has been replaced by Lightning Lane — there is no longer a 'free' FastPass system at any WDW park",
    ],
    bestTimes: ["January–mid February (post-holidays, lowest crowds of year)", "Late August–early September (kids back in school)", "Mid-November (before Thanksgiving week)"],
    budgetGuide: [
      { category: "Park tickets (per day)", budget: "$109–$129", moderate: "$149–$169", deluxe: "$189–$219" },
      { category: "Hotel (per night)", budget: "$130–$250 (Value)", moderate: "$300–$550 (Moderate)", deluxe: "$600–$1,400 (Deluxe)" },
      { category: "Lightning Lane Multi Pass", budget: "Skip it", moderate: "$30–$40/person", deluxe: "$40–$49/person" },
      { category: "Food (per day/person)", budget: "$40–$65 (quick service)", moderate: "$80–$110 (mixed)", deluxe: "$130–$200 (table service)" },
    ],
  },
  disneyland: {
    name: "Disneyland Resort", location: "Anaheim, California", country: "USA",
    emoji: "✨", tagline: "The Happiest Place on Earth",
    accentColor: "#FF9EBB",
    heroGradient: "radial-gradient(ellipse at 60% 40%, rgba(255,158,187,0.2) 0%, #0A1F5C 50%, #00194B 100%)",
    description: "The original — the one Walt Disney himself walked. More intimate than WDW but packed with history and Disneyland exclusives. In 2026 both parks now feature Mickey & Minnie's Runaway Railway, Tiana's Bayou Adventure, and continued Star Wars expansion.",
    openYear: 1955, size: "500 acres", annualVisitors: "18M+",
    parks: [
      {
        name: "Disneyland Park", icon: "✨",
        description: "The original park, handcrafted land by land. Features Disneyland-exclusive attractions and newly added Mickey & Minnie's Runaway Railway in Toontown.",
        mustDos: ["Star Wars: Rise of the Resistance", "Matterhorn Bobsleds", "Indiana Jones Adventure", "Tiana's Bayou Adventure", "Mickey & Minnie's Runaway Railway", "Pirates of the Caribbean"],
      },
      {
        name: "Disney California Adventure", icon: "🌅",
        description: "Avengers Campus, Pixar Pier, Cars Land, and Soarin' Over California. WEB SLINGERS and Guardians: Mission Breakout are the top thrill rides.",
        mustDos: ["Radiator Springs Racers", "WEB SLINGERS: A Spider-Man Adventure", "Guardians of the Galaxy — Mission: BREAKOUT!", "Incredicoaster", "Inside Out Emotional Whirlwind"],
      },
    ],
    hotels: [
      { name: "Disney's Grand Californian Hotel & Spa", tier: "Deluxe", priceRange: "$550–$1,000/night", highlight: "Direct entrance into Disney California Adventure — best location at the resort" },
      { name: "Disneyland Hotel", tier: "Deluxe", priceRange: "$400–$750/night", highlight: "Walking distance to both parks, newly renovated in 2024" },
      { name: "Pixar Place Hotel (formerly Paradise Pier)", tier: "Moderate", priceRange: "$250–$450/night", highlight: "Most affordable on-site option, Pixar-themed rooms" },
    ],
    tips: [
      "Disneyland is a walkable resort — both parks, all three hotels, and Downtown Disney are within easy walking distance",
      "Lightning Lane Single Pass sells out fast for Rise of the Resistance — buy the moment you enter the park at 8am",
      "Blue Bayou Restaurant is located inside Pirates of the Caribbean — one of the most unique dining experiences at any Disney park",
      "Mickey & Minnie's Runaway Railway opened at Disneyland in 2023 in the newly expanded Toontown — don't miss it",
      "The Haunted Mansion and Matterhorn have unique elements only found at Disneyland, not replicated at WDW",
    ],
    bestTimes: ["January–March (lowest crowds)", "September (back to school)", "Weekdays year-round"],
    budgetGuide: [
      { category: "Park tickets (per day)", budget: "$104–$124", moderate: "$149–$169", deluxe: "$189+" },
      { category: "Hotel (per night)", budget: "$150–$300 (off-site)", moderate: "$250–$450 (Pixar Place)", deluxe: "$550–$1,000 (Grand Californian)" },
      { category: "Lightning Lane", budget: "Skip it", moderate: "$20–$30/person", deluxe: "$30–$40/person" },
      { category: "Food (per day/person)", budget: "$35–$55", moderate: "$65–$90", deluxe: "$100–$160" },
    ],
  },
  paris: {
    name: "Disneyland Paris", location: "Chessy, France", country: "France",
    emoji: "🗼", tagline: "Où la Magie Prend Vie",
    accentColor: "#87CEEB",
    heroGradient: "radial-gradient(ellipse at 40% 30%, rgba(135,206,235,0.2) 0%, #0A1F5C 50%, #00194B 100%)",
    description: "Europe's most-visited tourist destination. Disneyland Paris is in the midst of a multi-year expansion project as part of the 'Disney Imagineering Grand Plan' — Avengers Campus, Frozen Land, and new Sleeping Beauty Castle upgrades have made this the most architecturally spectacular Disney resort.",
    openYear: 1992, size: "4,800 acres", annualVisitors: "16M+",
    parks: [
      {
        name: "Disneyland Park", icon: "🏰",
        description: "The European flagship with gothic architecture and unique French touches. Phantom Manor and Big Thunder Mountain are standout exclusives.",
        mustDos: ["Phantom Manor", "Big Thunder Mountain", "Pirates of the Caribbean", "Star Wars Hyperspace Mountain", "The Twilight Zone Tower of Terror"],
      },
      {
        name: "Disney Adventure World (formerly Walt Disney Studios)", icon: "⚡",
        description: "Rebranded and expanded — Avengers Campus is now open with Spider-Man, Iron Man, and more. Cars ROAD TRIP and Ratatouille are family favorites.",
        mustDos: ["Avengers Assemble: Flight Force", "The Twilight Zone Tower of Terror", "Cars ROAD TRIP", "Ratatouille: The Adventure", "Spider-Man W.E.B. Adventure"],
      },
    ],
    hotels: [
      { name: "Disneyland Hotel", tier: "Castle Club Deluxe", priceRange: "€500–€1,200/night", highlight: "Newly renovated, directly above park entrance, castle views" },
      { name: "Disney's Hotel New York — The Art of Marvel", tier: "Deluxe", priceRange: "€300–€700/night", highlight: "Marvel-themed rooms, walking distance to Disney Village" },
      { name: "Disney's Hotel Cheyenne", tier: "Value", priceRange: "€120–€220/night", highlight: "Best value on-site, Toy Story theming, 20-min walk to parks" },
    ],
    tips: [
      "The newly renovated Disneyland Hotel reopened in 2024 — its castle-view suites are among the most spectacular rooms at any Disney resort worldwide",
      "Food quality at DLP is significantly better than US Disney parks — the brasseries and buffets are genuinely good",
      "Phantom Manor is the superior version of Haunted Mansion — richer storytelling and more elaborate theming",
      "RER A train runs directly from central Paris (Châtelet-Les Halles) to Marne-la-Vallée/Chessy station in about 40 minutes",
      "Park-to-park tickets are required to visit both Disneyland Park and Disney Adventure World in the same day",
    ],
    bestTimes: ["January–March", "October (Halloween season — exceptional theming)", "Midweek visits year-round"],
    budgetGuide: [
      { category: "Tickets (1-day/1-park)", budget: "€56–€75", moderate: "€89–€110", deluxe: "€120+ (2-park)" },
      { category: "Hotel (per night)", budget: "€120–€220 (Value)", moderate: "€220–€450 (Moderate)", deluxe: "€500–€1,200 (Deluxe)" },
      { category: "Lightning Lane", budget: "Skip", moderate: "€8–€15/person", deluxe: "€20–€35/person" },
      { category: "Transport from Paris", budget: "€8 RER A", moderate: "€8 RER A", deluxe: "€70–€90 taxi/Uber" },
    ],
  },
  tokyo: {
    name: "Tokyo Disney Resort", location: "Urayasu, Chiba", country: "Japan",
    emoji: "🌸", tagline: "A World of Harmony and Magic",
    accentColor: "#FFB7C5",
    heroGradient: "radial-gradient(ellipse at 50% 30%, rgba(255,183,197,0.2) 0%, #0A1F5C 50%, #00194B 100%)",
    description: "Widely considered the best-operated Disney resort in the world. Fantasy Springs — the massive new expansion with Peter Pan, Rapunzel, and Frozen — opened in June 2024 at Tokyo DisneySea, making it the most must-visit Disney destination of 2025–2026.",
    openYear: 1983, size: "494 acres", annualVisitors: "30M+",
    parks: [
      {
        name: "Tokyo Disneyland", icon: "🌸",
        description: "Immaculate, detail-obsessed, and beloved. The iconic Pooh's Hunny Hunt attraction uses no tracks — riders float freely through scenes, unique to Tokyo only.",
        mustDos: ["Pooh's Hunny Hunt (trackless, Tokyo exclusive)", "Haunted Mansion", "Space Mountain", "Big Thunder Mountain", "Buzz Lightyear's Astro Blasters"],
      },
      {
        name: "Tokyo DisneySea", icon: "🌊",
        description: "Universally rated the most beautiful theme park on Earth. The new Fantasy Springs expansion (2024) added Peter Pan's Never Land, Rapunzel's Forest, and Frozen Kingdom.",
        mustDos: ["Journey to the Center of the Earth", "Soaring: Fantastic Flight", "Fantasy Springs (Peter Pan, Rapunzel, Frozen — all new 2024)", "Indiana Jones Adventure", "20,000 Leagues Under the Sea"],
      },
    ],
    hotels: [
      { name: "Tokyo DisneySea Hotel MiraCosta", tier: "Deluxe", priceRange: "¥80,000–¥200,000/night", highlight: "The only hotel built inside a Disney park — overlooks Mediterranean Harbor" },
      { name: "Fantasy Springs Hotel (NEW 2024)", tier: "Deluxe", priceRange: "¥60,000–¥150,000/night", highlight: "Opened 2024 alongside Fantasy Springs — Peter Pan, Tangled, and Frozen rooms" },
      { name: "Tokyo Disneyland Hotel", tier: "Deluxe", priceRange: "¥50,000–¥100,000/night", highlight: "Victorian theming, connected to Disneyland via monorail" },
    ],
    tips: [
      "Fantasy Springs opened June 2024 — book a package through the Japanese Disney website for guaranteed access via a lottery system",
      "Tokyo DisneySea is worth two full days minimum — do not try to rush it",
      "The parks are immaculately maintained and guest behavior is extremely respectful — queues and crowd flow are far more orderly than US parks",
      "Food at Tokyo Disney is exceptional — themed popcorn buckets, seasonal treats, and high-quality in-park dining",
      "Keiyo Line from Tokyo Station reaches Maihama Station (park entrance) in about 15 minutes — easiest access of any Disney resort globally",
    ],
    bestTimes: ["November–December", "January–February", "Any weekday outside Japanese school holidays"],
    budgetGuide: [
      { category: "Tickets (per day)", budget: "¥7,900", moderate: "¥8,900", deluxe: "¥10,900" },
      { category: "Hotel (per night)", budget: "¥15,000–25,000 (off-site)", moderate: "¥30,000–50,000", deluxe: "¥60,000–200,000" },
      { category: "Premier Access (LL equiv)", budget: "¥1,500/attraction", moderate: "¥1,500/attraction", deluxe: "¥1,500/attraction" },
      { category: "Transport from Tokyo", budget: "¥240–400 train", moderate: "¥240–400 train", deluxe: "¥5,000+ taxi" },
    ],
  },
  hongkong: {
    name: "Hong Kong Disneyland", location: "Lantau Island, Hong Kong", country: "Hong Kong",
    emoji: "🏮", tagline: "Where Fantasy Meets Asia",
    accentColor: "#FFA500",
    heroGradient: "radial-gradient(ellipse at 60% 40%, rgba(255,165,0,0.2) 0%, #0A1F5C 50%, #00194B 100%)",
    description: "Hong Kong Disneyland has undergone a major transformation — World of Frozen, Marvel-themed attractions, and a new castle experience have expanded it significantly. The Castle of Magical Dreams replaced the old Sleeping Beauty Castle in 2020 and is genuinely stunning.",
    openYear: 2005, size: "310 acres (expanding)", annualVisitors: "6.7M+",
    parks: [
      {
        name: "Hong Kong Disneyland", icon: "🏮",
        description: "Asia-Pacific exclusive Marvel experiences and the first Frozen-themed land outside of Epcot. The Castle of Magical Dreams is a highlight.",
        mustDos: ["Ant-Man and The Wasp: Nano Battle!", "Iron Man Experience", "Hyperspace Mountain", "World of Frozen (Frozen Ever After + new land)", "Castle of Magical Dreams experience"],
      },
    ],
    hotels: [
      { name: "Hong Kong Disneyland Hotel", tier: "Deluxe", priceRange: "HK$1,800–4,500/night", highlight: "Victorian garden theming, beach access, stunning castle views" },
      { name: "Disney Explorers Lodge", tier: "Deluxe", priceRange: "HK$1,400–3,000/night", highlight: "Nature explorer theming, four forest-themed wings" },
      { name: "Disney Hollywood Hotel", tier: "Moderate", priceRange: "HK$1,000–2,200/night", highlight: "Hollywood Golden Age theming, most affordable on-site" },
    ],
    tips: [
      "World of Frozen opened 2023 — it is the largest Frozen-themed land at any Disney park globally",
      "The MTR Disneyland Resort Line connects directly from Sunny Bay in about 6 minutes",
      "HKDL is manageable in a single day for most visitors — pairs well with Ocean Park nearby",
      "The Castle of Magical Dreams incorporates 13 princess and queen stories from Disney films — genuinely impressive at night with projections",
      "Signage is in English, Cantonese, and Mandarin — very accessible for international visitors",
    ],
    bestTimes: ["October–December (cooler, less humid)", "February–April", "Weekdays year-round"],
    budgetGuide: [
      { category: "Tickets (per day)", budget: "HK$619", moderate: "HK$689", deluxe: "HK$769" },
      { category: "Hotel (per night)", budget: "HK$1,000–1,400", moderate: "HK$1,400–3,000", deluxe: "HK$1,800–4,500" },
      { category: "Food (per day/person)", budget: "HK$200–350", moderate: "HK$400–600", deluxe: "HK$700–1,200" },
      { category: "Transport", budget: "HK$25 MTR", moderate: "HK$25 MTR", deluxe: "HK$400+ taxi" },
    ],
  },
  shanghai: {
    name: "Shanghai Disney Resort", location: "Pudong, Shanghai", country: "China",
    emoji: "🐉", tagline: "Authentically Disney, Distinctly Chinese",
    accentColor: "#7FDB8A",
    heroGradient: "radial-gradient(ellipse at 40% 50%, rgba(127,219,138,0.2) 0%, #0A1F5C 50%, #00194B 100%)",
    description: "The newest and most technologically advanced Disney park. Shanghai Disneyland's TRON Lightcycle Power Run opened here first — still the smoothest version of the ride. Zootopia Land (opened 2023) is the most immersive Disney themed land ever built, with no visible show buildings.",
    openYear: 2016, size: "963 acres", annualVisitors: "11M+",
    parks: [
      {
        name: "Shanghai Disneyland", icon: "🐉",
        description: "The most modern Disney park — no Main Street, with the world's largest Disney castle at its center. Zootopia Land is the park's newest and most technically ambitious world.",
        mustDos: ["TRON Lightcycle Power Run", "Zootopia: Hot Pursuit (new)", "Pirates of the Caribbean: Battle for the Sunken Treasure", "Soaring Over the Horizon", "Roaring Rapids"],
      },
    ],
    hotels: [
      { name: "Shanghai Disneyland Hotel", tier: "Deluxe", priceRange: "¥1,800–4,500/night", highlight: "Fairy tale castle theming, direct enclosed walkway to park" },
      { name: "Toy Story Hotel", tier: "Moderate", priceRange: "¥900–2,000/night", highlight: "Full Toy Story immersion, excellent value, shuttle to park" },
    ],
    tips: [
      "Zootopia Land opened 2023 — the rides use technology not seen anywhere else; no visible show building roofs or mechanical infrastructure from inside",
      "TRON Lightcycle Power Run has the longest launch track of any Disney roller coaster — it opened here before WDW",
      "Purchase tickets via the Shanghai Disney official app — international visitors need a WeChat Pay or Alipay account or must use the official website",
      "The Enchanted Storybook Castle is the tallest and most elaborate Disney castle ever built",
      "Metro Line 11 from downtown Shanghai takes about 60 minutes to the park station",
    ],
    bestTimes: ["October–November", "March–April", "January (outside Chinese New Year)"],
    budgetGuide: [
      { category: "Tickets (per day)", budget: "¥399", moderate: "¥575", deluxe: "¥719" },
      { category: "Hotel (per night)", budget: "¥800–1,000 (off-site)", moderate: "¥900–2,000 (Toy Story)", deluxe: "¥1,800–4,500 (Disney Hotel)" },
      { category: "Food (per day/person)", budget: "¥150–250", moderate: "¥300–500", deluxe: "¥600–1,000" },
      { category: "Transport", budget: "¥10 subway", moderate: "¥10 subway", deluxe: "¥200+ taxi" },
    ],
  },
  "universal-orlando": {
    name: "Universal Orlando Resort", location: "Orlando, Florida", country: "USA",
    emoji: "🎬", tagline: "Vacation Like You Mean It",
    accentColor: "#C084FC",
    heroGradient: "radial-gradient(ellipse at 50% 40%, rgba(192,132,252,0.2) 0%, #0A1F5C 50%, #00194B 100%)",
    description: "Universal Orlando is now a four-park destination with Epic Universe opening in 2025 — the biggest theme park expansion in decades. Epic Universe brings Super Nintendo World, The Wizarding World of Harry Potter (Ministry of Magic), How to Train Your Dragon Isle, Monster-verse, and Celestial Park.",
    openYear: 1990, size: "840+ acres (expanding)", annualVisitors: "22M+",
    parks: [
      {
        name: "Universal Studios Florida", icon: "🎬",
        description: "Hollywood storytelling, Harry Potter's Diagon Alley, Minions, and The Simpsons. New for 2025: Illumination's Villain-Con Minion Blast replaced Despicable Me.",
        mustDos: ["Harry Potter and the Escape from Gringotts", "Hollywood Rip Ride Rockit", "Revenge of the Mummy", "Illumination's Villain-Con Minion Blast", "The Bourne Stuntacular"],
      },
      {
        name: "Islands of Adventure", icon: "🏝",
        description: "The original Wizarding World and the most thrilling park in Orlando. Hagrid's remains the most in-demand ride at any US theme park.",
        mustDos: ["Hagrid's Magical Creatures Motorbike Adventure", "Jurassic World VelociCoaster", "Harry Potter and the Forbidden Journey", "The Amazing Adventures of Spider-Man", "The Incredible Hulk Coaster"],
      },
      {
        name: "Epic Universe", icon: "🌌",
        description: "Opened May 2025 — Universal's most ambitious park. Five themed worlds anchored by Celestial Park. Super Nintendo World and Harry Potter (Ministry of Magic) are already being called generation-defining theme park experiences.",
        mustDos: ["Harry Potter and the Battle at the Ministry", "Mario Kart: Bowser's Challenge", "How to Train Your Dragon: Dragon Racer's Rally", "Monsters Unchained: The Frankenstein Experiment", "Stardust Racers"],
      },
      {
        name: "Volcano Bay", icon: "🌊",
        description: "Universal's water park — Krakatau Aqua Coaster is the centerpiece ride. Virtual queue system means no physical waiting in line.",
        mustDos: ["Krakatau Aqua Coaster", "Ko'okiri Body Plunge", "Honu ika Moana", "Punga Racers", "Kopiko Wai Winding River"],
      },
    ],
    hotels: [
      { name: "Loews Portofino Bay Hotel", tier: "Premier", priceRange: "$350–$750/night", highlight: "Italian Riviera theming, Express Pass included, water taxi to parks" },
      { name: "Hard Rock Hotel", tier: "Premier", priceRange: "$300–$650/night", highlight: "Rock & roll theming, pool with underwater speakers, Express Pass included" },
      { name: "Cabana Bay Beach Resort", tier: "Value/Standard", priceRange: "$130–$300/night", highlight: "Retro Florida theming, lazy river and bowling alley, best value" },
      { name: "Universal's Stella Nova Resort", tier: "Standard (NEW 2024)", priceRange: "$180–$380/night", highlight: "Opened 2024, celestial theming aligned with Epic Universe" },
    ],
    tips: [
      "Epic Universe requires a separate park ticket — buy a 4-park or 5-park ticket to include it",
      "Premier hotel guests get Express Pass Unlimited — worth the upcharge on busy days since regular waits hit 90+ minutes",
      "Hagrid's Magical Creatures Motorbike Adventure: arrive at rope drop and go straight there — it typically has 3–4 hour waits by 10am",
      "The Hogwarts Express runs between Hogsmeade (Islands of Adventure) and Diagon Alley (USF) — requires park-to-park ticket",
      "Epic Universe is currently the #1 most-anticipated theme park destination globally — book hotel well in advance",
    ],
    bestTimes: ["January–February", "September–October", "Weekdays year-round"],
    budgetGuide: [
      { category: "Tickets (1-park/day)", budget: "$114–$129", moderate: "$144–$164", deluxe: "$184+" },
      { category: "Epic Universe add-on", budget: "+$89 single day", moderate: "+$89", deluxe: "Included in multi-park" },
      { category: "Hotel (per night)", budget: "$130–$300 (Cabana Bay)", moderate: "$200–$420 (Standard)", deluxe: "$300–$750 (Premier)" },
      { category: "Express Pass", budget: "Not included", moderate: "$80–$150/day add-on", deluxe: "Included (Premier hotels)" },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resort = RESORTS[id];
  if (!resort) return { title: "ParkPlan.ai" };
  return {
    title: `${resort.name} Trip Planner 2026 — ParkPlan.ai`,
    description: `AI-powered planning for ${resort.name} in 2026. Live wait times, crowd forecasts, hotel picks, and optimized itineraries. Free forever.`,
  };
}

export async function generateStaticParams() {
  return Object.keys(RESORTS).map((id) => ({ id }));
}

export default async function ResortPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resort = RESORTS[id];
  if (!resort) notFound();

  return (
    <main className="min-h-screen" style={{ background: "#00194B" }}>
      {/* Hero */}
      <div className="relative pt-0 pb-16 overflow-hidden" style={{ background: resort.heroGradient }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 100% 70% at 50% 100%, rgba(61,26,120,0.4) 0%, transparent 65%)` }} />

        {/* Nav */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft size={16} style={{ color: "rgba(220,235,255,0.6)" }} />
            <span className="text-xl">🏰</span>
            <span style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "1rem", color: "#FFD700" }}>
              ParkPlan<span style={{ color: "rgba(220,235,255,0.4)", fontWeight: 400 }}>.ai</span>
            </span>
          </Link>
          <Link href={`/plan?resort=${id}`}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm">
            <Sparkles size={14} />
            <span>Plan This Trip</span>
          </Link>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-6">
          <div className="text-5xl mb-4">{resort.emoji}</div>
          <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: resort.accentColor, marginBottom: "8px" }}>
            {resort.location} · Est. {resort.openYear}
          </p>
          <h1 style={{ fontFamily: "var(--font-cinzel)", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.8rem)", color: "#FFFFFF", marginBottom: "12px", lineHeight: 1.1 }}>
            {resort.name}
          </h1>
          <p className="text-script text-lg mb-5" style={{ color: resort.accentColor }}>
            &ldquo;{resort.tagline}&rdquo;
          </p>
          <p style={{ fontFamily: "var(--font-nunito)", color: "rgba(220,235,255,0.85)", lineHeight: 1.7, maxWidth: "640px", fontSize: "0.95rem" }}>
            {resort.description}
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            {[
              { icon: Calendar, label: `Est. ${resort.openYear}` },
              { icon: MapPin,   label: resort.size },
              { icon: Star,     label: `${resort.annualVisitors} annual visitors` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <Icon size={11} style={{ color: resort.accentColor }} />
                <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.72rem", color: "rgba(220,235,255,0.8)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left col */}
          <div className="lg:col-span-2 space-y-8">

            {/* Parks */}
            <section>
              <h2 style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "1.5rem", color: "#FFFFFF", marginBottom: "16px" }}>
                The Parks
              </h2>
              <div className="space-y-4">
                {resort.parks.map((park) => (
                  <div key={park.name} className="p-5 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${resort.accentColor}20` }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{park.icon}</span>
                      <h3 style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "1.05rem", color: "#FFFFFF" }}>{park.name}</h3>
                    </div>
                    <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.85rem", color: "rgba(220,235,255,0.8)", marginBottom: "14px", lineHeight: 1.6 }}>
                      {park.description}
                    </p>
                    <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: resort.accentColor, marginBottom: "8px" }}>
                      Must-Do Attractions
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {park.mustDos.map((ride) => (
                        <span key={ride} className="px-2.5 py-1 rounded-full"
                          style={{ background: `${resort.accentColor}12`, color: resort.accentColor, border: `1px solid ${resort.accentColor}28`, fontFamily: "var(--font-nunito)", fontSize: "0.75rem", fontWeight: 600 }}>
                          {ride}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tips */}
            <section>
              <h2 style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "1.5rem", color: "#FFFFFF", marginBottom: "16px" }}
                className="flex items-center gap-2">
                <Info size={20} style={{ color: resort.accentColor }} /> Insider Tips 2026
              </h2>
              <div className="space-y-3">
                {resort.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5"
                      style={{ background: resort.accentColor, color: "#00194B" }}>
                      {i + 1}
                    </div>
                    <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.85rem", color: "rgba(220,235,255,0.85)", lineHeight: 1.6 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Budget guide */}
            <section>
              <h2 style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "1.5rem", color: "#FFFFFF", marginBottom: "16px" }}
                className="flex items-center gap-2">
                <DollarSign size={20} style={{ color: resort.accentColor }} /> 2026 Budget Guide
              </h2>
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="grid grid-cols-4 px-4 py-2.5"
                  style={{ background: "rgba(255,255,255,0.06)", fontFamily: "var(--font-nunito)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(220,235,255,0.6)" }}>
                  <span>Category</span>
                  <span className="text-center">Budget</span>
                  <span className="text-center">Moderate</span>
                  <span className="text-center">Deluxe</span>
                </div>
                {resort.budgetGuide.map((row, i) => (
                  <div key={row.category} className="grid grid-cols-4 px-4 py-3 border-t"
                    style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.2)", borderColor: "rgba(255,255,255,0.05)", fontFamily: "var(--font-nunito)", fontSize: "0.78rem" }}>
                    <span style={{ color: "#FFFFFF", fontWeight: 600 }}>{row.category}</span>
                    <span className="text-center" style={{ color: "#7FDB8A" }}>{row.budget}</span>
                    <span className="text-center" style={{ color: "#FFD700" }}>{row.moderate}</span>
                    <span className="text-center" style={{ color: "#FF9EBB" }}>{row.deluxe}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">

            {/* Live wait times */}
            <WaitTimesPanel resortId={id} />

            {/* Weather */}
            <WeatherPanel resortId={id} />

            {/* Best times */}
            <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${resort.accentColor}18` }}>
              <h3 style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "1rem", color: "#FFFFFF", marginBottom: "12px" }}
                className="flex items-center gap-2">
                <Calendar size={16} style={{ color: resort.accentColor }} /> Best Times to Visit
              </h3>
              <div className="space-y-2">
                {resort.bestTimes.map((time, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl"
                    style={{ background: `${resort.accentColor}0e` }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: resort.accentColor }} />
                    <span style={{ fontFamily: "var(--font-nunito)", fontSize: "0.8rem", color: "rgba(220,235,255,0.85)" }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotels */}
            <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${resort.accentColor}18` }}>
              <h3 style={{ fontFamily: "var(--font-cinzel)", fontWeight: 700, fontSize: "1rem", color: "#FFFFFF", marginBottom: "12px" }}>
                🏨 Where to Stay
              </h3>
              <div className="space-y-3">
                {resort.hotels.map((hotel) => (
                  <a key={hotel.name}
                    href={`https://www.booking.com/search.html?ss=${encodeURIComponent(hotel.name)}&aid=304142`}
                    target="_blank" rel="noopener noreferrer"
                    className="block p-3 rounded-xl group transition-all"
                    style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span style={{ fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "0.82rem", color: "#FFFFFF", lineHeight: 1.3 }}
                        className="group-hover:text-yellow-300 transition-colors">
                        {hotel.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0"
                        style={{ background: `${resort.accentColor}15`, color: resort.accentColor, fontFamily: "var(--font-nunito)" }}>
                        {hotel.tier}
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.75rem", color: "rgba(220,235,255,0.6)", marginBottom: "4px" }}>{hotel.priceRange}</p>
                    <p style={{ fontFamily: "var(--font-nunito)", fontSize: "0.72rem", color: "rgba(220,235,255,0.55)", fontStyle: "italic" }}>{hotel.highlight}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* 30-day crowd calendar */}
            <CrowdCalendar resortId={id} />

            {/* Plan CTA */}
            <Link href={`/plan?resort=${id}`}
              className="btn-primary flex items-center justify-center gap-2 w-full py-4">
              <Sparkles size={16} />
              Plan My {resort.name.split(" ")[0]} Trip
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

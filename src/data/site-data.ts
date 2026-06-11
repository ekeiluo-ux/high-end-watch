export const topBarItems = [
  "Whatsapp: + 44 7942 866 158",
  "CONTACT US",
] as const;

export const primaryNavigation = [
  {
    label: "BRANDS",
    items: [],
  },
  {
    label: "COLLECTIONS",
    items: ["Men's Watches"],
  },
  {
    label: "ABOUT",
    items: ["About us"],
  },
] as const;

export const brandsMenu = {
  columns: [
    ["A. Lange & Söhne", "Audemars Piguet", "BVLGARI", "Cartier", "Chopard"],
    ["De Bethune", "F.P.Journe", "Girard Perregaux", "Greubel Forsey", "Hublot"],
    ["Jacob & Co.", "Jaeger LeCoultre", "MB&F", "OMEGA", "Panerai"],
    ["Patek Philippe", "Richard Mille", "Rolex", "Vacheron Constantin", "Van Cleef & Arpels"],
  ],
} as const;

export const heroContent = {
  eyebrow: "Men's Watches",
  title: "Men's Luxury Watches",
  description:
    "Wrist Aficionado curates rare and highly sought-after luxury timepieces from Rolex, Audemars Piguet, Richard Mille, Patek Philippe, and more. This homepage recreates the refined browsing experience of a premium watch collection with a tighter navigation focused on shopping and brand trust. If you'd like to place an order, please reach out to us on WhatsApp at: +44 7942 866 158.",
};

export const filterGroups = [
  {
    title: "Filter by Brand",
    options: [
      "Rolex",
      "Audemars Piguet",
      "Richard Mille",
      "Patek Philippe",
    ],
  },
  {
    title: "Filter by Model Family",
    options: [
      "Royal Oak",
      "Royal Oak Offshore",
      "GMT-Master II",
      "Submariner",
      "Nautilus",
    ],
  },
  {
    title: "Filter by Price",
    options: ["Under $25,000", "$25,000 - $100,000", "Above $100,000"],
  },
  {
    title: "Filter by Case Material",
    options: [
      "Stainless Steel",
      "Rose Gold",
      "White Gold",
      "Titanium",
      "Ceramic",
    ],
  },
  {
    title: "Filter by Bracelet Material",
    options: ["Rubber Strap", "Stainless Steel", "Leather Strap"],
  },
  {
    title: "Filter by Complications",
    options: ["Chronograph", "GMT", "Tourbillon", "Perpetual Calendar"],
  },
] as const;

export const editorialSections = [
  {
    title: "Rolex - The Crown of Excellence",
    description:
      "Discover iconic references like the Submariner, Day-Date, GMT-Master II, and Daytona, celebrated for timeless design, reliability, and enduring prestige.",
    links: ["Submariner", "Day-Date", "GMT-Master II", "Daytona"],
  },
  {
    title: "Audemars Piguet - Bold Innovation and Heritage",
    description:
      "From the Royal Oak to the Royal Oak Offshore, Audemars Piguet timepieces fuse sculptural design with technical mastery for modern collectors.",
    links: ["Royal Oak", "Royal Oak Offshore", "Royal Oak Concept"],
  },
  {
    title: "Richard Mille - The Art of Innovation",
    description:
      "Performance-led cases, technical materials, and modern silhouettes make Richard Mille one of the most recognisable names in contemporary horology.",
    links: ["RM 11-03 Chronograph", "RM 27-03 Rafael Nadal", "RM 67-01"],
  },
  {
    title: "Patek Philippe - Timeless Elegance",
    description:
      "Explore classics from the Nautilus, Aquanaut, Calatrava, and Grand Complications lines, each known for its extraordinary craftsmanship.",
    links: ["Nautilus", "Aquanaut", "Calatrava", "Grand Complications"],
  },
] as const;

export const boutiqueLocations = [
  {
    city: "New York City",
    address: "腕表精品体验空间",
    phone: "646-693-9384",
  },
  {
    city: "Miami",
    address: "南海滩精品陈列空间",
    phone: "305-680-3735",
  },
  {
    city: "Beverly Hills",
    address: "比佛利山庄私享门店",
    phone: "310-388-8201",
  },
] as const;

export const instagramCards = [
  "Collector Stories",
  "Boutique Highlights",
  "New Wrist Shots",
  "Rare Complications",
  "Editorial Moments",
  "Private Appointments",
] as const;

export const footerColumns = [
  {
    title: "Contact",
    items: [
      "Whatsapp: +44 7942 866 158",
      "proxvape.com",
      "About Us",
    ],
  },
  {
    title: "Popular Links",
    items: [
      "Patek Philippe Nautilus",
      "Rolex Daytona",
      "Audemars Piguet Royal Oak",
      "Men's Watches",
    ],
  },
] as const;

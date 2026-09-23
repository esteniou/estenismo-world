// Curated placeholder data for the EST portfolio.
// Positions are the world coordinates for each destination in the 3D scene.
//
// Each project has:
//   image     → local file path (drop your file into /public/portfolio/<cat>/)
//   fallback  → remote placeholder used automatically if the local file is missing

export const DESTINATIONS = [
  { id: "illustration", name: "Illustration", label: "Explore Illustration", position: [-14, 0, -8], accent: "#8CE4D5" },
  { id: "murals", name: "Murals", label: "Explore Murals", position: [0, 0, -16], accent: "#20B9AE" },
  { id: "packaging", name: "Packaging Solutions", label: "Explore Packaging", position: [14, 0, -8], accent: "#F4F5ED" },
  { id: "printing", name: "Printing", label: "Explore Printing", position: [-16, 0, 6], accent: "#8CE4D5" },
  { id: "fashion", name: "Fashion", label: "Explore Fashion", position: [16, 0, 6], accent: "#20B9AE" },
  { id: "games", name: "Games", label: "Play Games", position: [-7, 0, 15], accent: "#20B9AE" },
  { id: "contact", name: "Contact", label: "Enter Portal", position: [7, 0, 15], accent: "#8CE4D5" },
];

export const CONTENT = {
  illustration: {
    title: "Illustration",
    subtitle: "Digital canvases, characters & poster art",
    year: "2024 — 2026",
    projects: [
      {
        title: "Cybernetic Flora",
        year: "2026",
        category: "Digital Artwork",
        description:
          "Layered generative illustration series exploring iridescent botanical forms and paper-craft textures.",
        image: "/portfolio/illustration/project-1.jpg",
        fallback:
          "https://images.unsplash.com/photo-1704426882813-8acfff020487?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
      },
      {
        title: "Neomorphic Dreams",
        year: "2025",
        category: "Character Design",
        description:
          "Stylised voxel-inspired character line built for a next-gen interactive gaming platform.",
        image: "/portfolio/illustration/project-2.jpg",
        fallback:
          "https://images.pexels.com/photos/31120860/pexels-photo-31120860.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
  },
  murals: {
    title: "Murals",
    subtitle: "Large-scale walls and urban interventions",
    year: "2023 — 2026",
    projects: [
      {
        title: "Prismatic Spectrum",
        year: "2026",
        category: "Urban Street Art",
        description:
          "A 40-metre facade mural painted in downtown Lisbon featuring bold geometric fields.",
        image: "/portfolio/murals/project-1.jpg",
        fallback:
          "https://images.unsplash.com/photo-1601913463731-cfba9fd31ed3?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
      },
      {
        title: "Flow State Facade",
        year: "2024",
        category: "Architectural Paint",
        description:
          "Kinetic pattern painted for a creative tech studio HQ — designed to shimmer under sunlight.",
        image: "/portfolio/murals/project-2.jpg",
        fallback:
          "https://images.pexels.com/photos/20387219/pexels-photo-20387219.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
  },
  packaging: {
    title: "Packaging Solutions",
    subtitle: "Tactile, luxury & eco containers",
    year: "2024 — 2026",
    projects: [
      {
        title: "Obsidian Reserve",
        year: "2026",
        category: "Luxury Packaging",
        description:
          "Matte container series with hot-stamped teal foil and custom structural folds.",
        image: "/portfolio/packaging/project-1.jpg",
        fallback:
          "https://images.unsplash.com/photo-1716540103530-cc33cdd20cde?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
      },
      {
        title: "Craft Unboxing",
        year: "2025",
        category: "Eco Branding",
        description:
          "Sustainable raw cardboard packaging system with monochromatic display typography.",
        image: "/portfolio/packaging/project-2.jpg",
        fallback:
          "https://images.unsplash.com/photo-1595246007497-15e0ed4b8d96?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
      },
    ],
  },
  printing: {
    title: "Printing",
    subtitle: "Risograph, letterpress, editorial",
    year: "2022 — 2026",
    projects: [
      {
        title: "EST Editorial Vol. 1",
        year: "2026",
        category: "Zine & Typography",
        description:
          "A cotton-paper zine featuring metallic inks and a custom EST display sans typeface.",
        image: "/portfolio/printing/project-1.jpg",
        fallback:
          "https://images.pexels.com/photos/6620972/pexels-photo-6620972.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      {
        title: "Risograph Poster Series",
        year: "2025",
        category: "Poster Art",
        description:
          "Two-tone riso posters exploring neon teal, charcoal overlays and hand-mixed inks.",
        image: "/portfolio/printing/project-2.jpg",
        fallback:
          "https://images.pexels.com/photos/6620970/pexels-photo-6620970.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
  },
  fashion: {
    title: "Fashion",
    subtitle: "Capsule streetwear & garment identity",
    year: "2025 — 2026",
    projects: [
      {
        title: "Voxel Capsule",
        year: "2026",
        category: "Streetwear Line",
        description:
          "Oversized hoodies and technical garments embroidered with the EST voxel emblem.",
        image: "/portfolio/fashion/project-1.jpg",
        fallback:
          "https://images.unsplash.com/photo-1721637686340-de9f8cebda5a?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85",
      },
      {
        title: "Neon Studio Lookbook",
        year: "2025",
        category: "Editorial Fashion",
        description:
          "Urban apparel photography shot under ambient night lighting for our capsule launch.",
        image: "/portfolio/fashion/project-2.jpg",
        fallback:
          "https://images.pexels.com/photos/12151002/pexels-photo-12151002.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
  },
  games: {
    title: "Games",
    subtitle: "Playful web toys and arcade worlds",
    year: "2024 — 2026",
    projects: [
      {
        title: "Synthwave Voxel Arcade",
        year: "2026",
        category: "3D Web Game",
        description:
          "A browser arcade with retro synthwave lighting, custom particle FX and live leaderboards.",
        image: "/portfolio/games/project-1.jpg",
        fallback:
          "https://images.pexels.com/photos/25798272/pexels-photo-25798272.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
      {
        title: "Vector Pinball",
        year: "2025",
        category: "Physical-Digital Arcade",
        description:
          "Arcade cabinet design with LED-reactive animations and nostalgic vector graphics.",
        image: "/portfolio/games/project-2.jpg",
        fallback:
          "https://images.pexels.com/photos/4841182/pexels-photo-4841182.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
  },
  contact: {
    title: "Contact",
    subtitle: "Let's make something wild together",
    year: "Always open",
    email: "hello@est-studio.art",
    location: "Global · Remote & Studio",
    socials: [
      { platform: "Instagram", handle: "@est.creative.world", url: "https://instagram.com" },
      { platform: "Twitter", handle: "@est_studio", url: "https://twitter.com" },
      { platform: "Behance", handle: "est-creative", url: "https://behance.net" },
    ],
  },
};

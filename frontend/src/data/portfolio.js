// EST — Portfolio content configuration
// ---------------------------------------------------------------
// Edit this file to update project titles, descriptions, years and
// optional external URLs. Images are loaded automatically from
// /public/portfolio/<category>/project-<n>.{webp|jpg|jpeg|png}
//
// If the image file for a slot does not exist, that project is
// simply skipped — no placeholder is shown.
// ---------------------------------------------------------------

// 3D-world destination coordinates. Do NOT edit — used by the scene.
export const DESTINATIONS = [
  { id: "illustration", name: "Illustration", label: "Explore Illustration", position: [-14, 0, -8], accent: "#8CE4D5" },
  { id: "murals", name: "Murals", label: "Explore Murals", position: [0, 0, -16], accent: "#20B9AE" },
  { id: "packaging", name: "Packaging Solutions", label: "Explore Packaging", position: [14, 0, -8], accent: "#F4F5ED" },
  { id: "printing", name: "Printing", label: "Explore Printing", position: [-16, 0, 6], accent: "#8CE4D5" },
  { id: "fashion", name: "Fashion", label: "Explore Fashion", position: [16, 0, 6], accent: "#20B9AE" },
  { id: "games", name: "Games", label: "Play Games", position: [-7, 0, 15], accent: "#20B9AE" },
  { id: "contact", name: "Contact", label: "Enter Portal", position: [7, 0, 15], accent: "#8CE4D5" },
];

// Maximum number of project slots per category.
export const MAX_PROJECTS_PER_CATEGORY = 10;

// Extensions to try (in order) when locating an image for a slot.
export const IMAGE_EXTENSIONS = ["webp", "jpg", "jpeg", "png"];

// Build a default slot with neutral placeholder metadata.
// You can override any field in CATEGORY_OVERRIDES below.
const buildDefaultSlots = (categoryId) =>
  Array.from({ length: MAX_PROJECTS_PER_CATEGORY }, (_, i) => {
    const n = i + 1;
    return {
      slot: n,
      // ↓ Edit these to describe each real EST project
      title: `Project ${String(n).padStart(2, "0")}`,
      description: "",
      year: "",
      url: "", // optional — leave empty or set to a full https:// link
      // Do not edit `imageBase` — used by the loader to probe extensions
      imageBase: `/portfolio/${categoryId}/project-${n}`,
    };
  });

// If you want to hand-edit a specific project quickly, put overrides
// here. The `slot` number matches the filename `project-<n>`.
// Example:
//   illustration: [{ slot: 1, title: "Neo Noir", year: "2026", description: "…" }]
const CATEGORY_OVERRIDES = {
  illustration: [],
  murals: [],
  packaging: [],
  printing: [],
  fashion: [],
  games: [],
};

const mergeOverrides = (defaults, overrides) =>
  defaults.map((d) => {
    const o = overrides.find((x) => x.slot === d.slot);
    return o ? { ...d, ...o } : d;
  });

// -------- Category meta (title / subtitle / range shown on the panel) --------
const CATEGORY_META = {
  illustration: {
    title: "Illustration",
    subtitle: "Digital canvases, characters & poster art",
    year: "",
  },
  murals: {
    title: "Murals",
    subtitle: "Large-scale walls and urban interventions",
    year: "",
  },
  packaging: {
    title: "Packaging Solutions",
    subtitle: "Tactile, luxury & eco containers",
    year: "",
  },
  printing: {
    title: "Printing",
    subtitle: "Risograph, letterpress, editorial",
    year: "",
  },
  fashion: {
    title: "Fashion",
    subtitle: "Capsule streetwear & garment identity",
    year: "",
  },
  games: {
    title: "Games",
    subtitle: "Playful web toys and arcade worlds",
    year: "",
  },
};

// Assemble the final content map consumed by the UI.
const buildCategory = (id) => ({
  ...CATEGORY_META[id],
  projects: mergeOverrides(buildDefaultSlots(id), CATEGORY_OVERRIDES[id] || []),
});

export const CONTENT = {
  illustration: buildCategory("illustration"),
  murals: buildCategory("murals"),
  packaging: buildCategory("packaging"),
  printing: buildCategory("printing"),
  fashion: buildCategory("fashion"),
  games: buildCategory("games"),
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

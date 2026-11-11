/**
 * AURELIA — Kinetic Atelier Monolith palette.
 * The ONLY TypeScript location (besides tokens/chartPalette.ts) allowed to hold raw hex values.
 * Numeric values feed three.js materials; string mirrors feed SVG/CSS-in-JS where a CSS var cannot be used.
 */

export const HEX = {
  paper: 0xffffff,
  bone: 0xf3f0e6,
  fog: 0xe5e0d5,
  ink: 0x09090b,
  inkMuted: 0x4a4946,
  flash: 0xff3300,
  volt: 0xd4ff00,
  success: 0x00a859,
  warning: 0xff9900,
  danger: 0xe60026,
  info: 0x0055ff,
  steel: 0x1c1c1f,
} as const;

export const CSS = {
  paper: "#FFFFFF",
  bone: "#F3F0E6",
  fog: "#E5E0D5",
  ink: "#09090B",
  inkMuted: "#4A4946",
  flash: "#FF3300",
  volt: "#D4FF00",
  success: "#00A859",
  warning: "#FF9900",
  danger: "#E60026",
  info: "#0055FF",
} as const;

export type TierKey = "bronze" | "silver" | "gold" | "diamond" | "royal";

export const TIER_HEX: Record<TierKey, number> = {
  bronze: 0xb87333,
  silver: 0xc0c5ce,
  gold: 0xe5b80b,
  diamond: 0x7df9ff,
  royal: 0x09090b,
};

export const TIER_CSS: Record<TierKey, string> = {
  bronze: "#B87333",
  silver: "#C0C5CE",
  gold: "#E5B80B",
  diamond: "#7DF9FF",
  royal: "#09090B",
};

/** Text colour that guarantees AA contrast on each tier fill. */
export const TIER_INK: Record<TierKey, string> = {
  bronze: "#09090B",
  silver: "#09090B",
  gold: "#09090B",
  diamond: "#09090B",
  royal: "#FFFFFF",
};

/** Maps a free-form tier label coming from the API to a tier key. */
export function toTierKey(label: string | null | undefined): TierKey {
  const v = (label || "").toLowerCase();
  if (v.includes("royal") || v.includes("vip")) return "royal";
  if (v.includes("diamond") || v.includes("kim cương") || v.includes("kim cuong")) return "diamond";
  if (v.includes("gold") || v.includes("vàng") || v.includes("vang")) return "gold";
  if (v.includes("silver") || v.includes("bạc") || v.includes("bac")) return "silver";
  return "bronze";
}

/** Product colour-name → swatch fill. Used for presentational swatches only. */
export const SWATCH_HEX: Record<string, string> = {
  "đen": "#1A1A1A",
  "trắng": "#F5F5F5",
  "đỏ": "#C0392B",
  "xanh navy": "#1A2A4A",
  "xanh": "#1A6B3A",
  "xanh dương": "#1A4080",
  "xanh lá": "#2D6A2A",
  "be": "#D4B896",
  "kem": "#F5EAD3",
  "nâu": "#6B4226",
  "vàng": "#C9A227",
  "hồng": "#E8A0A8",
  "tím": "#6A3D7A",
  "xám": "#888888",
  "cam": "#D4600A",
  "rêu": "#5A6B3A",
  "sand": "#C9A88A",
  "navy": "#1A2A4A",
  "nude": "#DDB89A",
  "olive": "#6B7A3A",
  "black": "#1A1A1A",
  "white": "#F5F5F5",
  "red": "#C0392B",
  "blue": "#1A4080",
  "green": "#2D6A2A",
  "grey": "#888888",
  "gray": "#888888",
  "beige": "#D4B896",
  "brown": "#6B4226",
  "pink": "#E8A0A8",
  "yellow": "#C9A227",
  "purple": "#6A3D7A",
  "orange": "#D4600A",
};

export const SWATCH_FALLBACK = "#888888";

export function swatchHex(name: string | null | undefined): string {
  if (!name) return SWATCH_FALLBACK;
  const key = name.trim().toLowerCase();
  if (SWATCH_HEX[key]) return SWATCH_HEX[key];
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(key)) return key;
  return SWATCH_FALLBACK;
}

/** Botanical meadow, sky, foliage & floral palette for the 3D garden exhibition. */
export const MEADOW_HEX = {
  // Atmospheric golden-hour morning & dusk twilight sky tones
  skyDay: 0x7da4cc,
  skyDayMid: 0xb7cfe0,
  skyDayHorizon: 0xf4e4c9,
  skyNight: 0x0a141a,
  skyNightZenith: 0x070d14,
  skyNightHorizon: 0x1d2b30,
  sunWarm: 0xffe4ad,
  sunDisc: 0xfff8e6,
  sunHalo: 0xffc985,
  cloudLit: 0xfff4e0,
  cloudShadow: 0xb5bfd1,
  mistDay: 0xebe3d1,
  mistNight: 0x162426,

  // Natural olive-emerald turf, soil humus, straw & hillside haze
  soilRich: 0x2f291e,
  soilMoss: 0x3b4d2b,
  lawnLight: 0x7d964f,
  lawnMid: 0x4b6836,
  lawnDeep: 0x263b21,
  hillLush: 0x3d5932,
  hillFar: 0x567157,
  strawGold: 0xc2ab6f,

  // Multi-layered natural foliage & silver-olive bark
  foliageLight: 0x85a35a,
  foliageMid: 0x456639,
  foliageSage: 0x6f8762,
  foliageDark: 0x223620,
  barkBirch: 0xd6cfc2,
  barkDark: 0x423a32,

  // Architectural bronze pergola, cedar & weathered limestone
  pergolaBronze: 0x282722,
  pergolaBrass: 0x9b8256,
  pergolaCedar: 0x5c4635,
  stoneCream: 0xe6dfd0,
  stoneWarm: 0xcfc4b0,
  stoneRim: 0xa69d8b,

  // Still mirror water basin & botanical blossoms
  waterDay: 0x7d989b,
  waterNight: 0x121d24,
  pampasCream: 0xf2e9d8,
  pampasGold: 0xd9c298,
  pampasTaupe: 0xb39a7d,
  petalPink: 0xe89eb0,
  petalRose: 0xd9738c,
  petalCoral: 0xe3846b,
  petalCream: 0xfbf6ea,
  petalLavender: 0x9e88c4,
  petalViolet: 0x6b5399,
  petalGold: 0xe6b647,
  petalPollenDark: 0x784f1d,
} as const;



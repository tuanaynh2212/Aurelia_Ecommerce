/**
 * AURELIA — chart styling tokens (Chart.js + Recharts).
 * Styling only: datasets, labels, scales and aggregation stay inside the consuming components.
 */

export const CHART = {
  ink: "#09090B",
  inkMuted: "#4A4946",
  flash: "#FF3300",
  volt: "#D4FF00",
  info: "#0055FF",
  success: "#00A859",
  warning: "#FF9900",
  danger: "#E60026",
  bone: "#F3F0E6",
  fog: "#E5E0D5",
  paper: "#FFFFFF",
  grid: "rgba(9, 9, 11, 0.12)",
  inkSoft: "rgba(9, 9, 11, 0.08)",
  flashSoft: "rgba(255, 51, 0, 0.18)",
  voltSoft: "rgba(212, 255, 0, 0.45)",
  infoSoft: "rgba(0, 85, 255, 0.16)",
  transparent: "transparent",
} as const;

/** Ordered series palette for multi-dataset / pie charts. */
export const SERIES = [
  CHART.ink,
  CHART.flash,
  CHART.volt,
  CHART.info,
  CHART.success,
  CHART.warning,
  CHART.inkMuted,
  CHART.danger,
] as const;

export const seriesColor = (i: number): string => SERIES[i % SERIES.length];

export const MONO_FONT = "'JetBrains Mono Variable', ui-monospace, monospace";

/** Chart.js tooltip style — 2px ink bordered paper slip. */
export const chartJsTooltip = {
  backgroundColor: CHART.paper,
  titleColor: CHART.ink,
  bodyColor: CHART.ink,
  borderColor: CHART.ink,
  borderWidth: 2,
  cornerRadius: 0,
  padding: 10,
  displayColors: true,
  boxPadding: 4,
  titleFont: { family: MONO_FONT, size: 11, weight: 700 as const },
  bodyFont: { family: MONO_FONT, size: 11 },
};

/** Chart.js axis tick/grid style. */
export const chartJsAxis = {
  ticks: { color: CHART.inkMuted, font: { family: MONO_FONT, size: 10 } },
  grid: { color: CHART.grid },
  border: { color: CHART.ink, width: 2 },
};

export const chartJsLegend = {
  labels: {
    color: CHART.ink,
    font: { family: MONO_FONT, size: 11 },
    boxWidth: 12,
    boxHeight: 12,
  },
};

/** Recharts helpers. */
export const rechartsAxis = {
  stroke: CHART.ink,
  tick: { fill: CHART.inkMuted, fontFamily: MONO_FONT, fontSize: 10 },
  tickLine: false,
  axisLine: { stroke: CHART.ink, strokeWidth: 2 },
};

export const rechartsGrid = {
  stroke: CHART.grid,
  strokeDasharray: "3 3",
};

export const rechartsTooltip = {
  contentStyle: {
    background: CHART.paper,
    border: `2px solid ${CHART.ink}`,
    borderRadius: 0,
    boxShadow: `4px 4px 0px ${CHART.ink}`,
    fontFamily: MONO_FONT,
    fontSize: 11,
    color: CHART.ink,
  },
  labelStyle: { color: CHART.ink, fontWeight: 700, textTransform: "uppercase" as const },
  itemStyle: { color: CHART.ink },
  cursor: { fill: CHART.inkSoft },
};


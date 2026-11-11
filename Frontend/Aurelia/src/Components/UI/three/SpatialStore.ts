import { useSyncExternalStore } from "react";

export type SpatialStation =
  | "HOME_HALL"
  | "RACK_AISLE"
  | "FITTING_SPOT"
  | "CASHIER_DESK"
  | "TICKET_BOOTH"
  | "OPTICAL_RIG"
  | "BACKSTAGE"
  | "CONTROL_ROOM";

export type SpatialQuality = "high" | "medium" | "low" | "fallback-2d";

export interface SpatialState {
  station: SpatialStation;
  scrollProgress: number;
  pointer: { x: number; y: number };
  activeSeasonIndex: number | null;
  quality: SpatialQuality;
}

let state: SpatialState = {
  station: "HOME_HALL",
  scrollProgress: 0,
  pointer: { x: 0, y: 0 },
  activeSeasonIndex: null,
  quality: "high",
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export const spatialStore = {
  getState(): SpatialState {
    return state;
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setStation(station: SpatialStation) {
    if (state.station === station) return;
    state = { ...state, station };
    emit();
  },
  setScrollProgress(scrollProgress: number) {
    const clamped = Math.max(0, Math.min(1, scrollProgress));
    if (Math.abs(state.scrollProgress - clamped) < 0.002) return;
    state = { ...state, scrollProgress: clamped };
    emit();
  },
  setPointer(x: number, y: number) {
    if (
      Math.abs(state.pointer.x - x) < 0.005 &&
      Math.abs(state.pointer.y - y) < 0.005
    ) {
      return;
    }
    state = { ...state, pointer: { x, y } };
    emit();
  },
  setActiveSeasonIndex(activeSeasonIndex: number | null) {
    if (state.activeSeasonIndex === activeSeasonIndex) return;
    state = { ...state, activeSeasonIndex };
    emit();
  },
  setQuality(quality: SpatialQuality) {
    if (state.quality === quality) return;
    state = { ...state, quality };
    emit();
  },
};

export const spatialActions = spatialStore;

export function useSpatialStore(): SpatialState;
export function useSpatialStore<T>(selector: (s: SpatialState) => T): T;
export function useSpatialStore<T>(selector?: (s: SpatialState) => T): T | SpatialState {
  return useSyncExternalStore(
    spatialStore.subscribe,
    () => (selector ? selector(spatialStore.getState()) : spatialStore.getState()),
    () => (selector ? selector(spatialStore.getState()) : spatialStore.getState())
  );
}

/** Pure route-pathname to SpatialStation mapper. */
export function resolveStationFromPath(pathname: string): SpatialStation {
  const p = pathname.toLowerCase();
  if (p === "/" || p === "") return "HOME_HALL";
  if (p.startsWith("/fashion/products/")) return "FITTING_SPOT";
  if (
    p.startsWith("/fashion/products") ||
    p.startsWith("/collection") ||
    p.startsWith("/search")
  ) {
    return "RACK_AISLE";
  }
  if (p === "/cart" || p === "/payment") return "CASHIER_DESK";
  if (p.startsWith("/payment/")) return "TICKET_BOOTH";
  if (p.startsWith("/bodymeasurements")) return "OPTICAL_RIG";
  if (
    p.startsWith("/bookingappointment") ||
    p.startsWith("/about") ||
    p.startsWith("/login") ||
    p.startsWith("/forgot-password") ||
    p.startsWith("/reset-password")
  ) {
    return "BACKSTAGE";
  }
  if (
    p.startsWith("/account") ||
    p.startsWith("/dashboardshop") ||
    p.startsWith("/admin") ||
    p.startsWith("/orders") ||
    p.startsWith("/tracking")
  ) {
    return "CONTROL_ROOM";
  }
  return "HOME_HALL";
}

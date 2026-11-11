import { Suspense, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Maximize2,
  Moon,
  Move3d,
  Pause,
  Play,
  RotateCcw,
  Sun,
  Zap,
  ZoomIn,
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import type { Product } from "../../types/type";
import { cn } from "../../utils/cn";
import { formatVND } from "../../utils/formatters";
import {
  getPrimaryProductImage,
  getSalePrice,
} from "../../utils/productHelpers";
import { Equalizer } from "../UI/primitives/Meter";
import {
  ExhibitionGalleryScene,
  type GalleryAmbience,
  type GalleryBeamTone,
  type GalleryViewMode,
} from "../UI/three/ExhibitionGalleryScene";
import { useSpatialQuality } from "../UI/three/useSpatialQuality";
import { MerchStageInspector } from "./MerchStageInspector";

export interface MerchSelector3DProps {
  products: Product[];
}

const BEAM_TONES: { id: GalleryBeamTone; label: string; dotClass: string }[] = [
  { id: "volt", label: "VOLT", dotClass: "bg-volt" },
  { id: "flash", label: "PYRO", dotClass: "bg-flash" },
  { id: "optic", label: "OPTIC", dotClass: "bg-tier-diamond" },
];

export function MerchSelector3D({ products }: MerchSelector3DProps) {
  const { isFallback2D } = useSpatialQuality();
  const [activeIdx, setActiveIdx] = useState(0);
  const [viewMode, setViewMode] = useState<GalleryViewMode>("overview");
  const [ambience, setAmbience] = useState<GalleryAmbience>("day");
  const [beamTone, setBeamTone] = useState<GalleryBeamTone>("volt");
  const [autoTour, setAutoTour] = useState(false);
  const [cameraResetTick, setCameraResetTick] = useState(0);

  const total = products.length;
  const safeIdx = total > 0 ? Math.min(Math.max(activeIdx, 0), total - 1) : 0;

  useEffect(() => {
    if (!autoTour || total <= 1) return;
    const id = window.setInterval(() => {
      setViewMode("focus");
      setActiveIdx((prev) => (prev + 1) % total);
    }, 3600);
    return () => window.clearInterval(id);
  }, [autoTour, total]);

  if (total === 0) return null;

  const activeProduct = products[safeIdx];

  const handleSelectExhibit = (idx: number, focusCamera = true) => {
    setActiveIdx(idx);
    if (focusCamera) {
      setViewMode("focus");
    }
    setCameraResetTick((n) => n + 1);
  };

  const handleStep = (delta: number) => {
    handleSelectExhibit((safeIdx + delta + total) % total, true);
  };

  const handleToggleOverview = (nextMode: GalleryViewMode) => {
    setAutoTour(false);
    setViewMode(nextMode);
    setCameraResetTick((n) => n + 1);
  };

  const handleResetView = () => {
    setAutoTour(false);
    setCameraResetTick((n) => n + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setAutoTour(false);
      handleStep(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setAutoTour(false);
      handleStep(1);
    } else if (e.key === "o" || e.key === "O") {
      handleToggleOverview(viewMode === "overview" ? "focus" : "overview");
    }
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left 8 cols: Architectural 3D Hanging Garment Exhibition Gallery */}
      <div className="relative flex flex-col overflow-hidden rounded-[2px] border-[3px] border-ink bg-ink shadow-hard-lg lg:col-span-8">
        {/* Top Gallery Control Bar */}
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 border-b-2 border-paper/25 bg-ink px-4 py-2.5 mono-label text-[10px] font-extrabold text-paper">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-volt animate-rec" aria-hidden="true" />
            <span>BOTANICAL GARDEN // TRIỂN LÃM THẢO NGUYÊN 3D</span>
            <Equalizer
              bars={4}
              className="hidden h-3.5 sm:inline-flex [&>span]:w-0.5 [&>span]:bg-volt"
            />
          </div>

          {/* Camera Framing, Gallery Room Theme, Beam Color & Tour Controls */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Overview vs Close Focus */}
            <div
              role="group"
              aria-label="Góc máy triển lãm 3D"
              className="flex items-center rounded-[2px] border border-paper/30 bg-ink p-0.5"
            >
              <button
                type="button"
                onClick={() => handleToggleOverview("overview")}
                aria-pressed={viewMode === "overview"}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1 rounded-[1px] px-2 py-0.5 mono-label text-[9px] font-extrabold",
                  viewMode === "overview" ? "bg-volt text-ink" : "text-fog hover:text-paper"
                )}
              >
                <Maximize2 size={10} aria-hidden="true" />
                <span>TOÀN CẢNH</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleOverview("focus")}
                aria-pressed={viewMode === "focus"}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1 rounded-[1px] px-2 py-0.5 mono-label text-[9px] font-extrabold",
                  viewMode === "focus" ? "bg-volt text-ink" : "text-fog hover:text-paper"
                )}
              >
                <ZoomIn size={10} aria-hidden="true" />
                <span>CẬN CẢNH #{String(safeIdx + 1).padStart(2, "0")}</span>
              </button>
            </div>

            {/* Garden Lighting Ambience Toggle (Sunlit Meadow vs Evening Fireflies) */}
            <button
              type="button"
              onClick={() =>
                setAmbience((prev) => (prev === "day" ? "twilight" : "day"))
              }
              title={
                ambience === "day"
                  ? "Đổi sang vườn đêm đom đóm"
                  : "Đổi sang bãi cỏ ban mai"
              }
              className="inline-flex cursor-pointer items-center gap-1 rounded-[2px] border border-paper/35 bg-ink px-2 py-1 mono-label text-[9px] font-extrabold text-paper hover:border-volt"
            >
              {ambience === "day" ? (
                <>
                  <Sun size={10} className="text-volt" aria-hidden="true" />
                  <span>NẮNG MAI</span>
                </>
              ) : (
                <>
                  <Moon size={10} className="text-volt" aria-hidden="true" />
                  <span>VƯỜN ĐÊM</span>
                </>
              )}
            </button>

            {/* Spotlight Tone */}
            <div
              role="group"
              aria-label="Màu đèn rọi triển lãm"
              className="hidden items-center rounded-[2px] border border-paper/30 bg-ink p-0.5 sm:flex"
            >
              <Zap size={10} className="mx-1 text-volt" aria-hidden="true" />
              {BEAM_TONES.map((m) => {
                const active = beamTone === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setBeamTone(m.id)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1 rounded-[1px] px-1.5 py-0.5 mono-label text-[9px] font-extrabold",
                      active ? "bg-paper text-ink" : "text-fog hover:text-paper"
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", m.dotClass)} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Auto Guided Gallery Tour */}
            {total > 1 && (
              <button
                type="button"
                onClick={() => setAutoTour((prev) => !prev)}
                aria-pressed={autoTour}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1 rounded-[2px] border px-2 py-1 mono-label text-[9px] font-extrabold",
                  autoTour
                    ? "border-flash bg-flash text-paper"
                    : "border-paper/35 bg-ink text-paper hover:border-volt"
                )}
              >
                {autoTour ? <Pause size={10} /> : <Play size={10} />}
                <span>{autoTour ? "DỪNG TOUR" : "AUTO TOUR"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive 3D Exhibition Hall Stage */}
        <div
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Phòng triển lãm treo sản phẩm 3D — kéo chuột để xoay, cuộn để thu phóng, nhấn vào tác phẩm để xem"
          className={cn(
            "relative isolate h-[480px] w-full overflow-hidden select-none outline-none sm:h-[540px] md:h-[590px]",
            ambience === "day" ? "bg-bone" : "bg-ink"
          )}
        >
          {!isFallback2D ? (
            <Canvas
              camera={{ position: [0, 1.35, 8.2], fov: 46, near: 0.1, far: 220 }}
              dpr={[1, 1.75]}
              shadows="soft"
              gl={{
                antialias: true,
                powerPreference: "high-performance",
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.06,
              }}
              className="h-full w-full cursor-grab active:cursor-grabbing"
            >
              <Suspense fallback={null}>
                <ExhibitionGalleryScene
                  products={products}
                  activeIndex={safeIdx}
                  viewMode={viewMode}
                  ambience={ambience}
                  beamTone={beamTone}
                  cameraResetTick={cameraResetTick}
                  onSelect={(idx) => {
                    setAutoTour(false);
                    handleSelectExhibit(idx, true);
                  }}
                  onUserInteract={() => setAutoTour(false)}
                />
              </Suspense>
            </Canvas>
          ) : (
            /* Clean 2D Architectural Hanging Rack Fallback when WebGL/Reduced Motion active */
            <div className="relative h-full w-full overflow-y-auto px-4 py-8">
              <div className="mx-auto mb-6 h-2 max-w-4xl border-y border-paper/40 bg-ink-muted" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {products.map((p, idx) => {
                  const active = idx === safeIdx;
                  const img = getPrimaryProductImage(p);
                  const salePrice = getSalePrice(p);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectExhibit(idx, true)}
                      className={cn(
                        "group relative flex cursor-pointer flex-col border-2 p-2 text-left transition-transform",
                        active
                          ? "-translate-y-1 border-volt bg-paper text-ink shadow-hard-sm"
                          : "border-ink bg-paper/95 text-ink hover:border-volt"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -top-6 left-1/2 h-6 w-0.5 -translate-x-1/2 bg-fog"
                      />
                      <span className="mono-label mb-1 text-[9px] font-extrabold">
                        EXHIBIT {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="aspect-[4/4.2] w-full overflow-hidden border border-ink bg-bone">
                        {img && (
                          <img
                            src={img}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <span className="mt-1.5 truncate text-xs font-bold">{p.name}</span>
                      <span className="font-mono text-[11px] font-extrabold text-flash">
                        {formatVND(salePrice ?? p.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top-Left Live Exhibit Location Readout */}
          <div className="pointer-events-none absolute left-3 top-3 z-30 flex items-center gap-2 border border-paper/35 bg-ink/85 px-2.5 py-1 mono-label text-[9px] font-extrabold text-paper backdrop-blur-xs">
            <Compass size={11} className="text-volt" aria-hidden="true" />
            <span>
              TRẠM #{String(safeIdx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              {" · "}
              {activeProduct.brand || "AURELIA"}
            </span>
          </div>

          {/* Top-Right Quick View Reset */}
          {!isFallback2D && (
            <button
              type="button"
              onClick={handleResetView}
              className="absolute right-3 top-3 z-30 inline-flex cursor-pointer items-center gap-1 border border-paper/35 bg-ink/85 px-2.5 py-1 mono-label text-[9px] font-extrabold text-paper backdrop-blur-xs hover:border-volt hover:text-volt"
            >
              <RotateCcw size={10} aria-hidden="true" />
              <span>RESET GÓC</span>
            </button>
          )}

          {/* Bottom-Center Interactive Walkthrough Hint */}
          {!isFallback2D && (
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-30 flex max-w-[92%] -translate-x-1/2 items-center gap-2 border border-paper/30 bg-ink/85 px-3 py-1 mono-label text-[9px] font-bold text-fog backdrop-blur-xs">
              <Move3d size={12} className="shrink-0 text-volt" aria-hidden="true" />
              <span className="truncate">
                KÉO XOAY 360° · CUỘN THU PHÓNG · CLICK KHUNG TREO ĐỂ CẬN CẢNH (PHÍM O: TOÀN CẢNH)
              </span>
            </div>
          )}
        </div>

        {/* Bottom Exhibition Station Bar & Plaque Jumper */}
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 border-t-2 border-paper/25 bg-ink px-4 py-3 text-paper">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setAutoTour(false);
                handleStep(-1);
              }}
              aria-label="Tác phẩm trưng bày trước"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[2px] border-2 border-paper/50 bg-ink text-paper hover:border-volt hover:bg-volt hover:text-ink"
            >
              <ChevronLeft size={17} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => {
                setAutoTour(false);
                handleStep(1);
              }}
              aria-label="Tác phẩm trưng bày tiếp theo"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[2px] border-2 border-paper/50 bg-ink text-paper hover:border-volt hover:bg-volt hover:text-ink"
            >
              <ChevronRight size={17} strokeWidth={2.5} />
            </button>
            {viewMode === "focus" && (
              <button
                type="button"
                onClick={() => handleToggleOverview("overview")}
                className="ml-1 inline-flex h-9 cursor-pointer items-center gap-1 rounded-[2px] border border-paper/35 bg-ink px-2.5 mono-label text-[9px] font-extrabold text-fog hover:border-volt hover:text-volt"
              >
                <Maximize2 size={11} aria-hidden="true" />
                <span className="hidden sm:inline">LÙI TOÀN CẢNH</span>
              </button>
            )}
          </div>

          <div
            className="flex flex-wrap items-center gap-1.5"
            role="tablist"
            aria-label="Chọn tác phẩm treo trong triển lãm 3D"
          >
            {products.map((p, idx) => {
              const active = idx === safeIdx;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setAutoTour(false);
                    handleSelectExhibit(idx, true);
                  }}
                  title={p.name}
                  className={cn(
                    "h-8 min-w-[34px] cursor-pointer rounded-[2px] border px-2 font-mono text-[10px] font-extrabold transition-colors",
                    active
                      ? "border-volt bg-volt text-ink"
                      : "border-paper/35 bg-ink text-fog hover:border-paper hover:text-paper"
                  )}
                >
                  {String(idx + 1).padStart(2, "0")}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right 4 cols: Live Exhibit Inspector & Variant Picker */}
      <div className="lg:col-span-4">
        <MerchStageInspector
          product={activeProduct}
          activeIndex={safeIdx}
          totalCount={total}
        />
      </div>
    </div>
  );
}

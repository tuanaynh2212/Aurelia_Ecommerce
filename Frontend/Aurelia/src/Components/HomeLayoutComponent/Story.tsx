import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Film,
  Grid3X3,
  Heart,
  Pause,
  Play,
  ScanLine,
  Sparkles,
  Video,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { AdminContext } from "../../contexts/AdminContext";
import { CollectionContext } from "../../contexts/SeasonContext";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import type { Product } from "../../types/type";
import { SectionTitle } from "../UI/primitives/SectionTitle";
import { Button } from "../UI/primitives/Button";
import { Equalizer } from "../UI/primitives/Meter";
import { filterRealProducts } from "../../utils/productFilters";
import { formatVND } from "../../utils/formatters";
import { getPrimaryProductImage, getSalePrice } from "../../utils/productHelpers";
import {
  startSoundcheckAudio,
  stopSoundcheckAudio,
  subscribeSoundcheckBeat,
} from "../../utils/soundcheckAudio";
import { cn } from "../../utils/cn";

export interface StoryData {
  id?: string;
  linkUrl?: string;
  mainTitle?: string;
  h1?: string;
  h2?: string;
  pagaraph?: string;
  layout?: string;
}

type OpticalLook = "studio" | "film35" | "noir";

interface BackstageFeed {
  id: string;
  camCode: string;
  channelRole: string;
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaLabel: string;
  ctaPath: string;
  lensSpec: string;
  lightingCue: string;
  linkedProduct?: Product;
}

const OPTICAL_LOOKS: {
  id: OpticalLook;
  label: string;
  filterClass: string;
  telemetryTag: string;
}[] = [
  {
    id: "studio",
    label: "RAW STUDIO",
    filterClass: "brightness-100 contrast-100 saturate-100",
    telemetryTag: "REC.709 NATURAL",
  },
  {
    id: "film35",
    label: "35MM FILM",
    filterClass: "sepia-[0.2] contrast-[1.12] saturate-[1.18] brightness-[0.97]",
    telemetryTag: "KODAK 250D LUT",
  },
  {
    id: "noir",
    label: "NOIR B&W",
    filterClass: "grayscale contrast-[1.28] brightness-[0.95]",
    telemetryTag: "SILVER MONO",
  },
];

const AUTO_CUT_INTERVAL_MS = 5000;
const TARGET_FEED_COUNT = 4;

function formatSmpteTimecode(secondsOffset: number, camIndex: number): string {
  const hrs = "00";
  const mins = String(camIndex + 1).padStart(2, "0");
  const secs = String(secondsOffset % 60).padStart(2, "0");
  const frames = String((secondsOffset * 7 + camIndex * 5) % 24).padStart(2, "0");
  return `${hrs}:${mins}:${secs}:${frames}`;
}

export const Story = () => {
  const navigate = useNavigate();
  const { StoryBanner, MainBanner } = useContext(AdminContext);
  const { collectionData } = useContext(CollectionContext);
  const { dataProduct, isFavouriteProduct, toggleFavourite } =
    useContext(FilterProductContext);

  const realProducts = useMemo(() => filterRealProducts(dataProduct), [dataProduct]);

  const feeds = useMemo<BackstageFeed[]>(() => {
    const items: BackstageFeed[] = [];
    const seenImages = new Set<string>();

    const storyList = Array.isArray(StoryBanner) ? StoryBanner : [];
    storyList.forEach((raw, idx) => {
      const url = typeof raw.linkUrl === "string" ? raw.linkUrl.trim() : "";
      if (url && seenImages.has(url)) return;
      if (url) seenImages.add(url);
      const linked = realProducts[idx] || realProducts[0];
      items.push({
        id: String(raw.id || `story-${idx}`),
        camCode: `CAM-${String(items.length + 1).padStart(2, "0")}`,
        channelRole: "FITTING RACK // HẬU TRƯỜNG",
        badge: String(raw.h1 || "BACKSTAGE"),
        title: String(raw.mainTitle || raw.h1 || "Khoảnh khắc chuẩn bị trước giờ diễn"),
        description: String(
          raw.pagaraph ||
            "Mỗi thiết kế đều được hấp hơi, cân phom và kiểm tra ánh đèn trước khi bước lên sàn diễn."
        ),
        imageUrl: url,
        ctaLabel: linked ? "Xem thiết kế tiêu biểu" : "Xem toàn bộ danh mục",
        ctaPath: linked ? `/Fashion/Products/${linked.id}` : "/Fashion/Products",
        lensSpec: "50MM F/1.4 PRIME",
        lightingCue: "WARM RACK KEY",
        linkedProduct: linked,
      });
    });

    const mainList = Array.isArray(MainBanner) ? MainBanner : [];
    for (const mb of mainList) {
      if (items.length >= TARGET_FEED_COUNT) break;
      const url = typeof mb.linkUrl === "string" ? mb.linkUrl.trim() : "";
      if (!url || seenImages.has(url)) continue;
      seenImages.add(url);
      const linked = realProducts[items.length % Math.max(realProducts.length, 1)];
      items.push({
        id: String(mb.id || `main-cam-${items.length}`),
        camCode: `CAM-${String(items.length + 1).padStart(2, "0")}`,
        channelRole: "MAIN STAGE // ÁNH ĐÈN SÂN KHẤU",
        badge: String(mb.h1 || "STAGE CAM"),
        title: String(mb.mainTitle || "Tổng duyệt ánh sáng sân khấu"),
        description: String(
          mb.pagaraph ||
            "Căn chỉnh độ rọi spotlight và chuyển động chất liệu dưới ánh sáng trình diễn thực tế."
        ),
        imageUrl: url,
        ctaLabel: String(mb.textInButton || "Khám phá bộ sưu tập"),
        ctaPath: "/Fashion/Products",
        lensSpec: "35MM F/1.8 WIDE",
        lightingCue: "VOLT STROBE RIG",
        linkedProduct: linked,
      });
    }

    const seasons = Array.isArray(collectionData) ? collectionData : [];
    for (const season of seasons) {
      if (items.length >= TARGET_FEED_COUNT) break;
      const url = typeof season.banner === "string" ? season.banner.trim() : "";
      if (!url || seenImages.has(url)) continue;
      seenImages.add(url);
      const seasonProductId = season.products?.[0]?.id;
      const linked =
        (seasonProductId && realProducts.find((p) => p.id === seasonProductId)) ||
        realProducts[items.length % Math.max(realProducts.length, 1)];
      items.push({
        id: `season-cam-${season.id}`,
        camCode: `CAM-${String(items.length + 1).padStart(2, "0")}`,
        channelRole: `CAM RUNWAY // ${(season.seasonalAttributes?.mood || "LOOKBOOK").toUpperCase()}`,
        badge: season.name,
        title: season.slogan || `Hậu trường ${season.name}`,
        description:
          season.description ||
          "Góc quay hậu trường theo sát từng bộ sưu tập theo mùa và bảng chất liệu đặc trưng.",
        imageUrl: url,
        ctaLabel: "Vào triển lãm 3D mùa này",
        ctaPath: `/Collection/${season.id}`,
        lensSpec: "85MM PORTRAIT",
        lightingCue: "RUNWAY FILL",
        linkedProduct: linked,
      });
    }

    const productCamRoles = [
      "ATELIER LAB // SOI CHẤT LIỆU",
      "DRESSING BAY // CHỈNH PHOM DÁNG",
      "CLOSE-UP // CHI TIẾT ĐƯỜNG MAY",
    ];
    for (const product of realProducts) {
      if (items.length >= TARGET_FEED_COUNT) break;
      const url = getPrimaryProductImage(product);
      if (!url || seenImages.has(url)) continue;
      seenImages.add(url);
      const roleIdx = Math.max(0, items.length - 1) % productCamRoles.length;
      items.push({
        id: `product-cam-${product.id}`,
        camCode: `CAM-${String(items.length + 1).padStart(2, "0")}`,
        channelRole: productCamRoles[roleIdx],
        badge: `${product.brand || "AURELIA"} · ${product.type || "DESIGN"}`,
        title: product.name,
        description:
          product.description ||
          `Kiểm tra cấu trúc vải ${product.material || "cao cấp"} và độ rủ phom dưới ánh đèn xưởng diễn.`,
        imageUrl: url,
        ctaLabel: "Xem chi tiết thiết kế",
        ctaPath: `/Fashion/Products/${product.id}`,
        lensSpec: "90MM MACRO",
        lightingCue: "CRISP STUDIO",
        linkedProduct: product,
      });
    }

    return items;
  }, [StoryBanner, MainBanner, collectionData, realProducts]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [autoCut, setAutoCut] = useState(true);
  const [opticalLook, setOpticalLook] = useState<OpticalLook>("studio");
  const [showGrid, setShowGrid] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [panOrigin, setPanOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [clockTick, setClockTick] = useState(0);
  const [beatStep, setBeatStep] = useState(-1);
  const [audioOn, setAudioOn] = useState(false);

  const safeIndex = feeds.length > 0 ? Math.min(activeIndex, feeds.length - 1) : 0;

  useEffect(() => {
    const unsub = subscribeSoundcheckBeat((step) => {
      setBeatStep(step);
      setAudioOn(step >= 0);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setClockTick((t) => (t + 1) % 3600);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!autoCut || feeds.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % feeds.length);
    }, AUTO_CUT_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [autoCut, feeds.length]);

  const handleCutCamera = useCallback(
    (nextIndex: number) => {
      if (feeds.length === 0) return;
      const wrapped = ((nextIndex % feeds.length) + feeds.length) % feeds.length;
      setActiveIndex(wrapped);
    },
    [feeds.length]
  );

  const handleToggleAudio = () => {
    if (audioOn) {
      stopSoundcheckAudio();
      setAudioOn(false);
    } else {
      const ok = startSoundcheckAudio();
      setAudioOn(ok);
    }
  };

  const handleViewportMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
    setPanOrigin({ x, y });
  };

  if (feeds.length === 0) return null;

  const activeFeed = feeds[safeIndex];
  const activeLookConfig =
    OPTICAL_LOOKS.find((l) => l.id === opticalLook) || OPTICAL_LOOKS[0];
  const isBeatAccent = beatStep >= 0 && beatStep % 2 === 0;
  const linkedProduct = activeFeed.linkedProduct;
  const linkedSalePrice = linkedProduct ? getSalePrice(linkedProduct) : null;
  const linkedFav = linkedProduct ? isFavouriteProduct(linkedProduct.id) : false;

  return (
    <section
      aria-label="Backstage Reels"
      className="stage-grid-dark relative border-b-[3px] border-ink bg-ink py-14 md:py-20 text-paper"
    >
      <div className="container-atelier">
        <SectionTitle
          tone="dark"
          index="03"
          eyebrow="BACKSTAGE REELS // LIVE CAMERA SWITCHER"
          title="HẬU TRƯỜNG XƯỞNG DIỄN"
          subtitle="Chuyển góc máy trực tiếp từ phòng thử đồ, đổi bộ lọc ống kính và soi chi tiết từng thiết kế trước giờ lên sân khấu."
          count={feeds.length}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleToggleAudio}
                aria-pressed={audioOn}
                className={cn(
                  "press-collapse inline-flex h-10 items-center gap-2 border-2 px-3 mono-label text-[11px] font-extrabold cursor-pointer rounded-[2px]",
                  audioOn
                    ? "border-volt bg-volt text-ink shadow-hard-sm"
                    : "border-paper/40 bg-ink text-volt hover:border-volt"
                )}
              >
                {audioOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <Equalizer
                  bars={4}
                  label="Backstage Audio Feed"
                  className={cn("h-3.5", audioOn ? "[&>span]:bg-ink" : "[&>span]:bg-volt")}
                />
                <span>{audioOn ? "BEAT: LIVE" : "BACKSTAGE BEAT"}</span>
              </button>

              {feeds.length > 1 && (
                <div className="inline-flex items-center gap-1 border-2 border-paper/40 bg-ink p-1 rounded-[2px]">
                  <button
                    type="button"
                    onClick={() => handleCutCamera(safeIndex - 1)}
                    aria-label="Góc máy trước"
                    className="flex h-8 w-8 items-center justify-center border border-paper/30 bg-ink text-paper hover:bg-volt hover:text-ink cursor-pointer"
                  >
                    <ChevronLeft size={15} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAutoCut((v) => !v)}
                    aria-pressed={autoCut}
                    className={cn(
                      "inline-flex h-8 items-center gap-1.5 border px-2.5 mono-label text-[10px] font-extrabold cursor-pointer",
                      autoCut
                        ? "border-volt bg-volt text-ink"
                        : "border-paper/30 bg-ink text-paper hover:border-volt"
                    )}
                  >
                    {autoCut ? <Pause size={12} /> : <Play size={12} />}
                    <span>{autoCut ? "AUTO CUT" : "MANUAL"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCutCamera(safeIndex + 1)}
                    aria-label="Góc máy tiếp theo"
                    className="flex h-8 w-8 items-center justify-center border border-paper/30 bg-ink text-paper hover:bg-volt hover:text-ink cursor-pointer"
                  >
                    <ChevronRight size={15} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          }
        />

        {/* 12-Column Live Director Control Room */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT 8 COLS: Master Program Monitor */}
          <div
            className={cn(
              "lg:col-span-8 flex flex-col border-[3px] bg-ink transition-colors duration-150 rounded-[2px] overflow-hidden",
              isBeatAccent
                ? "border-volt shadow-hard-volt"
                : "border-paper/55 shadow-hard-volt"
            )}
          >
            <div aria-hidden="true" className="film-sprocket h-4 w-full border-b-2 border-ink" />

            {/* Top Camera Telemetry & Optical LUT Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-paper/25 bg-ink px-3.5 py-2.5">
              <div className="flex flex-wrap items-center gap-2.5 mono-label text-[10px] font-extrabold">
                <span className="inline-flex items-center gap-1.5 border border-flash bg-flash/20 px-2 py-0.5 text-paper">
                  <span className="h-2 w-2 rounded-full bg-flash animate-rec" aria-hidden="true" />
                  PGM // {activeFeed.camCode}
                </span>
                <span className="tabular text-volt">
                  {formatSmpteTimecode(clockTick, safeIndex)}
                </span>
                <span className="hidden sm:inline text-paper/60">
                  · {activeLookConfig.telemetryTag}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {OPTICAL_LOOKS.map((look) => {
                  const selected = opticalLook === look.id;
                  return (
                    <button
                      key={look.id}
                      type="button"
                      onClick={() => setOpticalLook(look.id)}
                      className={cn(
                        "inline-flex items-center gap-1 border px-2 py-1 mono-label text-[9px] font-extrabold cursor-pointer rounded-[1px]",
                        selected
                          ? "border-volt bg-volt text-ink"
                          : "border-paper/30 bg-ink text-paper/80 hover:border-volt hover:text-volt"
                      )}
                    >
                      <Film size={10} aria-hidden="true" />
                      {look.label}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setShowGrid((g) => !g)}
                  aria-pressed={showGrid}
                  title="Bật/tắt lưới khung hình"
                  className={cn(
                    "inline-flex items-center gap-1 border px-2 py-1 mono-label text-[9px] font-extrabold cursor-pointer rounded-[1px]",
                    showGrid
                      ? "border-paper bg-paper text-ink"
                      : "border-paper/30 bg-ink text-paper/80 hover:border-paper"
                  )}
                >
                  <Grid3X3 size={10} aria-hidden="true" />
                  GRID
                </button>

                <button
                  type="button"
                  onClick={() => setIsZoomed((z) => !z)}
                  aria-pressed={isZoomed}
                  title="Phóng to soi chi tiết chất liệu"
                  className={cn(
                    "inline-flex items-center gap-1 border px-2 py-1 mono-label text-[9px] font-extrabold cursor-pointer rounded-[1px]",
                    isZoomed
                      ? "border-flash bg-flash text-paper"
                      : "border-paper/30 bg-ink text-paper/80 hover:border-flash"
                  )}
                >
                  {isZoomed ? <ZoomOut size={10} /> : <ZoomIn size={10} />}
                  {isZoomed ? "1.35X" : "1.0X"}
                </button>
              </div>
            </div>

            {/* Master Cinema Viewport */}
            <div
              onMouseMove={handleViewportMove}
              onClick={() => {
                if (feeds.length > 1 && !isZoomed) handleCutCamera(safeIndex + 1);
              }}
              className={cn(
                "relative aspect-[16/10] w-full overflow-hidden bg-ink select-none",
                isZoomed ? "cursor-crosshair" : feeds.length > 1 ? "cursor-pointer" : "cursor-default"
              )}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeFeed.id}-${opticalLook}`}
                  initial={{ opacity: 0.45, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.45 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="relative h-full w-full"
                >
                  {activeFeed.imageUrl ? (
                    <img
                      src={activeFeed.imageUrl}
                      alt={activeFeed.title}
                      style={
                        isZoomed
                          ? { transformOrigin: `${panOrigin.x}% ${panOrigin.y}%` }
                          : undefined
                      }
                      className={cn(
                        "h-full w-full object-cover transition-transform duration-300 ease-out",
                        activeLookConfig.filterClass,
                        isZoomed ? "scale-[1.35]" : "scale-100"
                      )}
                    />
                  ) : (
                    <div className="stage-grid-dark flex h-full w-full items-center justify-center">
                      <Video size={48} className="text-volt/70" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Soft vignette & camera frame reticle */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 shadow-[inset_0_0_70px_rgba(0,0,0,0.55)]"
              />

              {showGrid && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  {/* Rule of thirds lines */}
                  <span className="absolute inset-y-0 left-1/3 w-px bg-paper/20" />
                  <span className="absolute inset-y-0 left-2/3 w-px bg-paper/20" />
                  <span className="absolute inset-x-0 top-1/3 h-px bg-paper/20" />
                  <span className="absolute inset-x-0 top-2/3 h-px bg-paper/20" />
                  {/* Center focus crosshair */}
                  <Crosshair
                    size={26}
                    strokeWidth={1.5}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-volt/75"
                  />
                  {/* Corner L-brackets */}
                  <span className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-volt" />
                  <span className="absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-volt" />
                  <span className="absolute left-3 bottom-3 h-4 w-4 border-l-2 border-b-2 border-volt" />
                  <span className="absolute right-3 bottom-3 h-4 w-4 border-r-2 border-b-2 border-volt" />
                </div>
              )}

              {/* Top-left Camera Lens Metadata */}
              <div className="pointer-events-none absolute left-5 top-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 border border-paper/45 bg-ink/85 px-2 py-0.5 mono-label text-[10px] font-extrabold text-volt">
                  <Video size={11} />
                  {activeFeed.camCode} · {isZoomed ? "85MM ZOOM" : activeFeed.lensSpec}
                </span>
                <span className="hidden sm:inline-block border border-paper/35 bg-ink/80 px-2 py-0.5 mono-label text-[9px] font-bold text-paper/90">
                  ISO 800 · 24FPS · {activeFeed.lightingCue}
                </span>
              </div>

              {/* Lower-third Chyron Hint */}
              <div className="pointer-events-none absolute inset-x-5 bottom-4 flex items-end justify-between gap-3">
                <div className="max-w-lg border-l-4 border-volt bg-ink/85 px-3 py-2 backdrop-blur-[2px]">
                  <p className="mono-label text-[9px] font-bold text-volt">
                    {activeFeed.channelRole}
                  </p>
                  <p className="mt-0.5 font-display text-sm sm:text-base font-black uppercase text-paper line-clamp-1 diacritic-safe">
                    {activeFeed.title}
                  </p>
                </div>

                <span className="hidden md:inline-flex items-center gap-1 border border-paper/35 bg-ink/85 px-2 py-1 mono-label text-[9px] font-bold text-paper/85">
                  {isZoomed
                    ? "RÊ CHUỘT ĐỂ SOI VẢI"
                    : feeds.length > 1
                      ? "CLICK KHUNG ĐỂ CHUYỂN CAM"
                      : "LIVE STUDIO FEED"}
                </span>
              </div>
            </div>

            {/* Interactive Scrubbable Reel Timeline */}
            {feeds.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 border-t-2 border-paper/25 bg-ink px-3.5 py-2.5">
                {feeds.map((feed, idx) => {
                  const isCurrent = idx === safeIndex;
                  return (
                    <button
                      key={feed.id}
                      type="button"
                      onClick={() => handleCutCamera(idx)}
                      className={cn(
                        "relative flex flex-col justify-between overflow-hidden border px-2.5 py-1.5 text-left transition-colors cursor-pointer rounded-[1px]",
                        isCurrent
                          ? "border-volt bg-volt/15 text-volt"
                          : "border-paper/25 bg-ink text-paper/75 hover:border-paper/60 hover:text-paper"
                      )}
                    >
                      <div className="flex items-center justify-between gap-1 mono-label text-[9px] font-extrabold">
                        <span>{feed.camCode}</span>
                        <span className="truncate opacity-80">{feed.badge}</span>
                      </div>
                      <div className="mt-1.5 h-1 w-full bg-paper/20 overflow-hidden">
                        {isCurrent ? (
                          autoCut ? (
                            <motion.div
                              key={`progress-${safeIndex}-${autoCut}`}
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{
                                duration: AUTO_CUT_INTERVAL_MS / 1000,
                                ease: "linear",
                              }}
                              className="h-full bg-volt"
                            />
                          ) : (
                            <div className="h-full w-full bg-volt" />
                          )
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Director Slate & Primary CTA */}
            <div className="border-t-2 border-ink bg-paper px-4 py-4 text-ink sm:px-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="border border-ink bg-volt px-2 py-0.5 mono-label text-[10px] font-extrabold text-ink">
                      {activeFeed.badge}
                    </span>
                    <span className="mono-label text-[10px] font-bold text-ink-muted">
                      TAKE 0{safeIndex + 1} / 0{feeds.length}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display text-lg sm:text-xl font-black uppercase text-ink line-clamp-1 diacritic-safe">
                    {activeFeed.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-muted">
                    {activeFeed.description}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => navigate(activeFeed.ctaPath)}
                    iconRight={<ArrowUpRight size={14} strokeWidth={2.5} />}
                  >
                    {activeFeed.ctaLabel}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate("/BodySize")}
                    iconLeft={<ScanLine size={14} strokeWidth={2.5} />}
                  >
                    Thử phom AI
                  </Button>
                </div>
              </div>
            </div>

            <div aria-hidden="true" className="film-sprocket h-4 w-full border-t-2 border-ink" />
          </div>

          {/* RIGHT 4 COLS: Multi-Cam Input Rack + Featured Garment Telemetry */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Multi-Cam Switcher Bank */}
            <div className="flex flex-col border-2 border-paper/45 bg-ink p-3.5 shadow-hard-volt rounded-[2px]">
              <div className="mb-3 flex items-center justify-between border-b-2 border-dashed border-paper/30 pb-2">
                <span className="mono-label text-[10px] font-extrabold text-volt flex items-center gap-1.5">
                  <Sparkles size={12} />
                  INPUT BANK // CH 01–0{feeds.length}
                </span>
                <span className="mono-label text-[10px] font-bold text-paper/75">
                  CHỌN GÓC QUAY
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                {feeds.map((feed, idx) => {
                  const isActive = idx === safeIndex;
                  return (
                    <button
                      key={feed.id}
                      type="button"
                      onClick={() => handleCutCamera(idx)}
                      className={cn(
                        "group flex items-center gap-3 border-2 p-2 text-left transition-all cursor-pointer rounded-[2px]",
                        isActive
                          ? "border-volt bg-volt text-ink shadow-hard-sm"
                          : "border-paper/30 bg-ink text-paper hover:border-volt"
                      )}
                    >
                      <div className="relative h-16 w-24 shrink-0 overflow-hidden border border-ink bg-bone">
                        {feed.imageUrl ? (
                          <img
                            src={feed.imageUrl}
                            alt={feed.title}
                            loading="lazy"
                            className={cn(
                              "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
                              !isActive && "opacity-85 group-hover:opacity-100"
                            )}
                          />
                        ) : (
                          <div className="stage-grid-dark h-full w-full" />
                        )}
                        {isActive && (
                          <span className="absolute left-1 top-1 inline-flex items-center gap-1 bg-flash px-1 py-0.5 mono-label text-[8px] font-extrabold text-paper">
                            ON AIR
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={cn(
                              "mono-label text-[10px] font-extrabold",
                              isActive ? "text-ink" : "text-volt"
                            )}
                          >
                            [{feed.camCode}]
                          </span>
                          <span
                            className={cn(
                              "mono-label truncate text-[9px] font-bold",
                              isActive ? "text-ink/80" : "text-paper/65"
                            )}
                          >
                            {feed.badge}
                          </span>
                        </div>
                        <p
                          className={cn(
                            "mt-1 line-clamp-1 font-display text-xs font-black uppercase diacritic-safe",
                            isActive ? "text-ink" : "text-paper"
                          )}
                        >
                          {feed.title}
                        </p>
                        <p
                          className={cn(
                            "mt-0.5 line-clamp-1 mono-label text-[9px]",
                            isActive ? "text-ink/75" : "text-paper/60"
                          )}
                        >
                          {feed.lensSpec} · {feed.lightingCue}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Piece Telemetry / Shop-The-Frame Dossier */}
            {linkedProduct ? (
              <div className="flex flex-1 flex-col justify-between border-2 border-ink bg-paper p-4 text-ink shadow-hard rounded-[2px]">
                <div>
                  <div className="flex items-center justify-between border-b-2 border-dashed border-ink pb-2 mono-label text-[10px] font-extrabold text-ink-muted">
                    <span className="text-ink">[TRANG PHỤC TRONG CẢNH]</span>
                    <span className="bg-volt px-1.5 py-0.5 text-ink">
                      {linkedProduct.brand || "AURELIA"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/Fashion/Products/${linkedProduct.id}`)}
                      className="h-20 w-16 shrink-0 overflow-hidden border-2 border-ink bg-bone cursor-pointer"
                    >
                      <img
                        src={getPrimaryProductImage(linkedProduct)}
                        alt={linkedProduct.name}
                        className="h-full w-full object-cover"
                      />
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className="mono-label text-[10px] font-bold text-ink-muted">
                        {linkedProduct.type || "GARMENT"} ·{" "}
                        {linkedProduct.material || "Vải Atelier"}
                      </p>
                      <h4 className="mt-0.5 line-clamp-2 font-display text-sm font-black uppercase text-ink diacritic-safe">
                        {linkedProduct.name}
                      </h4>
                      <div className="mt-1.5 flex items-baseline gap-2">
                        <span className="font-mono text-base font-extrabold text-ink tabular">
                          {formatVND(linkedSalePrice ?? linkedProduct.price)}
                        </span>
                        {linkedSalePrice && linkedSalePrice < linkedProduct.price && (
                          <span className="font-mono text-xs text-ink-muted line-through tabular">
                            {formatVND(linkedProduct.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 pt-3 border-t-2 border-dashed border-ink">
                  <button
                    type="button"
                    onClick={() => navigate(`/Fashion/Products/${linkedProduct.id}`)}
                    className="press-collapse flex-1 min-h-[40px] inline-flex items-center justify-center gap-1.5 border-2 border-ink bg-ink px-3 mono-label text-[11px] font-extrabold text-paper hover:bg-flash cursor-pointer rounded-[2px]"
                  >
                    <span>Mở trang sản phẩm</span>
                    <ArrowUpRight size={14} />
                  </button>

                  <button
                    type="button"
                    aria-pressed={linkedFav}
                    aria-label={linkedFav ? "Bỏ yêu thích" : "Lưu vào yêu thích"}
                    onClick={() => {
                      void toggleFavourite(linkedProduct);
                    }}
                    className={cn(
                      "press-collapse flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink cursor-pointer rounded-[2px]",
                      linkedFav
                        ? "bg-flash text-paper"
                        : "bg-paper text-ink hover:bg-volt"
                    )}
                  >
                    <Heart size={16} strokeWidth={2.5} fill={linkedFav ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col justify-between border-2 border-ink bg-bone p-4 text-ink shadow-hard rounded-[2px]">
                <div>
                  <span className="mono-label text-[10px] font-extrabold text-ink-muted">
                    [STUDIO SPEC SHEET]
                  </span>
                  <h4 className="mt-1 font-display text-sm font-black uppercase text-ink">
                    {activeFeed.title}
                  </h4>
                  <p className="mt-1 text-xs text-ink-muted">{activeFeed.description}</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  block
                  onClick={() => navigate("/Fashion/Products")}
                  iconRight={<ArrowUpRight size={14} />}
                  className="mt-4"
                >
                  Khám phá toàn bộ tủ đồ
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const StoryA = ({ data }: { data: StoryData }) => (
  <div className="border-2 border-ink bg-paper p-3 text-ink rounded-[2px]">
    <p className="mono-label text-[10px] font-bold">{data.h1 || "BACKSTAGE"}</p>
    <h3 className="mt-1 font-display text-sm font-black uppercase">{data.mainTitle}</h3>
  </div>
);
export const StoryB = StoryA;
export const StoryC = StoryA;

export default Story;

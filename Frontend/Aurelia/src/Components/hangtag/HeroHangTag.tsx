import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUpRight, ScanLine, Ticket as TicketIcon } from "lucide-react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { CollectionContext } from "../../contexts/SeasonContext";
import { FeaturedTag, TagSkeleton } from "../hangtag/ProductTag";
import { ConcertStageBar, type StageLightMode } from "../hangtag/ConcertStageBar";
import { Button } from "../UI/primitives/Button";
import { Equalizer } from "../UI/primitives/Meter";
import type { Product } from "../../types/type";
import { filterRealProducts } from "../../utils/productFilters";
import { cn } from "../../utils/cn";
import {
  startSoundcheckAudio,
  stopSoundcheckAudio,
  subscribeSoundcheckBeat,
} from "../../utils/soundcheckAudio";

const SLOT_CONFIG = [
  { length: 26, angle: -1.1, channel: "CH-01" },
  { length: 44, angle: 1.0, channel: "CH-02" },
  { length: 26, angle: -1.0, channel: "CH-03" },
  { length: 44, angle: 1.1, channel: "CH-04" },
];

export function HeroHangTag() {
  const navigate = useNavigate();
  const { dataProduct, isLoading } = useContext(FilterProductContext);
  const { collectionData } = useContext(CollectionContext);
  const [lightMode, setLightMode] = useState<StageLightMode>("volt");
  const [audioOn, setAudioOn] = useState(false);
  const [beatStep, setBeatStep] = useState(-1);

  useEffect(() => {
    const unsub = subscribeSoundcheckBeat(setBeatStep);
    return () => {
      unsub();
      stopSoundcheckAudio();
    };
  }, []);

  const handleToggleAudio = () => {
    if (audioOn) {
      stopSoundcheckAudio();
      setAudioOn(false);
    } else {
      const ok = startSoundcheckAudio();
      setAudioOn(ok);
    }
  };

  const heroProducts = useMemo<Product[]>(() => {
    if (!dataProduct || dataProduct.length === 0) return [];
    const sorted = filterRealProducts(dataProduct).sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
    return sorted.slice(0, 4);
  }, [dataProduct]);

  const seasonChips = useMemo(() => {
    if (Array.isArray(collectionData) && collectionData.length > 0) {
      return collectionData.slice(0, 3);
    }
    return [];
  }, [collectionData]);

  const showSkeletons = isLoading && heroProducts.length === 0;
  const beamClass =
    lightMode === "flash"
      ? "from-flash/25 via-flash/8 to-transparent"
      : lightMode === "spot"
      ? "from-paper/65 via-paper/20 to-transparent"
      : "from-volt/30 via-volt/10 to-transparent";
  const parDotClass =
    lightMode === "flash"
      ? "bg-flash"
      : lightMode === "spot"
      ? "bg-paper"
      : "bg-volt";
  const isPulseDownbeat = beatStep >= 0 && beatStep % 4 === 0;

  return (
    <section
      aria-label="Bộ sưu tập nổi bật"
      className="studio-grid-bg relative w-full overflow-hidden border-b-[3px] border-ink bg-bone"
    >
      <ConcertStageBar
        lightMode={lightMode}
        onChangeLightMode={setLightMode}
        audioOn={audioOn}
        onToggleAudio={handleToggleAudio}
        beatStep={beatStep}
        featuredCount={heroProducts.length}
      />

      {/* Overhead Concert Stage Spotlight Cones */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-12 bottom-0 z-0 overflow-hidden">
        <div
          className={cn(
            "spotlight-cone absolute -top-8 left-[6%] h-[460px] w-[42%] bg-gradient-to-b transition-colors duration-300",
            beamClass,
            isPulseDownbeat && "opacity-100"
          )}
          style={{ clipPath: "polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)" }}
        />
        <div
          className={cn(
            "spotlight-cone absolute -top-8 right-[4%] h-[500px] w-[52%] bg-gradient-to-b transition-colors duration-300",
            beamClass,
            isPulseDownbeat && "opacity-100"
          )}
          style={{
            clipPath: "polygon(28% 0%, 72% 0%, 100% 100%, 0% 100%)",
            animationDelay: "-3.2s",
          }}
        />
      </div>

      <div className="container-atelier relative z-10 py-6 md:py-9">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left: Concert Headliner Poster / Ticket Stub */}
          <div className="relative border-[3px] border-ink bg-paper shadow-hard-lg lg:col-span-5 rounded-[2px]">
            <div className="p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-ink pb-3">
                <span className="inline-flex items-center gap-1.5 mono-label text-[11px] font-extrabold text-ink">
                  <span className="h-2.5 w-2.5 rounded-full bg-flash animate-rec" aria-hidden="true" />
                  [HEADLINER // MAIN STAGE]
                </span>
                <span className="border-2 border-ink bg-volt px-2 py-0.5 mono-label text-[10px] font-extrabold text-ink">
                  WORLD TOUR — THU/ĐÔNG 2026
                </span>
              </div>

              {seasonChips.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="mono-label mr-1 text-[9px] font-extrabold text-ink-muted">
                    LINEUP:
                  </span>
                  {seasonChips.map((s: { id?: string; name?: string }, idx: number) => (
                    <button
                      key={s.id ?? idx}
                      type="button"
                      onClick={() => navigate(s.id ? `/Collection/${s.id}` : "/Collection")}
                      className="press-collapse border-2 border-ink bg-bone px-2.5 py-1 mono-label text-[10px] font-bold text-ink hover:bg-volt cursor-pointer"
                    >
                      0{idx + 1}. {s.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 overflow-hidden pt-1">
                <h1 className="font-display font-display-safe text-[clamp(1.75rem,3vw,2.75rem)] font-black uppercase leading-[1.15] tracking-tight text-ink">
                  QUẦN ÁO MAY ĐO{" "}
                  <span className="inline-block border-2 border-ink bg-volt px-2 text-ink shadow-hard-sm">
                    CHUẨN XÁC.
                  </span>{" "}
                  GIÁ NIÊM YẾT MINH BẠCH.
                </h1>
              </div>

              <p className="mt-3.5 text-base leading-relaxed text-ink-muted">
                Mọi thông số — chất liệu, phom dáng, xuất xứ — được in trực tiếp trên từng chiếc mác như vé concert chính thức.
              </p>

              {/* Concert VU status strip inside poster */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-2 border-ink bg-ink px-3 py-2 text-paper">
                <div className="flex items-center gap-2.5">
                  <Equalizer bars={5} label="Live Show" className="h-3.5 [&>span]:w-1 [&>span]:bg-volt" />
                  <span className="mono-label text-[10px] font-bold text-volt">
                    SHOWTIME: OPEN · VIP & FLOOR PASS
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 mono-label text-[10px] font-bold text-paper">
                  <TicketIcon size={12} aria-hidden="true" />
                  ADMIT ONE
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => navigate("/Fashion/Products")}
                  aria-label="Xem toàn bộ sản phẩm"
                  iconRight={<ArrowUpRight size={18} strokeWidth={2.5} />}
                >
                  Xem bộ sưu tập — 2026
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/bodyMeasurements")}
                  iconLeft={<ScanLine size={18} strokeWidth={2.5} />}
                >
                  Soundcheck AI Size
                </Button>
              </div>
            </div>

            {/* Tear-off Concert Ticket Stub */}
            <div className="relative flex items-center justify-between gap-3 border-t-2 border-dashed border-ink bg-bone px-5 py-3">
              <span aria-hidden="true" className="ticket-notch notch-l -left-[13px] -top-[12px]" />
              <span aria-hidden="true" className="ticket-notch notch-r -right-[13px] -top-[12px]" />
              <div className="min-w-0">
                <p className="mono-label text-[10px] font-extrabold text-ink">
                  GATE A // ĐỔI TRẢ MIỄN PHÍ 14 NGÀY · TOÀN QUỐC
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="barcode h-3.5 w-28" aria-hidden="true" />
                  <span className="mono-label text-[9px] font-bold text-ink-muted">
                    AUR-TOUR-2026
                  </span>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 border-2 border-ink bg-paper px-2 py-1 mono-label text-[10px] font-extrabold text-ink">
                SCROLL <ArrowDown size={12} className="animate-bounce" />
              </span>
            </div>
          </div>

          {/* Right: Concert Lighting Truss & 4 Suspended Tour Merch Tags */}
          <div className="relative lg:col-span-7">
            {/* Double-tier Concert Lighting Truss Bar */}
            <div
              className="relative z-10 border-2 border-b-[4px] border-ink bg-ink text-paper shadow-hard-sm"
              aria-hidden="true"
            >
              <div className="concert-truss flex items-center justify-between px-3 py-2 mono-label text-[10px] font-bold">
                <span className="inline-flex items-center gap-2 bg-ink/90 px-2 py-0.5 border border-paper/30">
                  <span className={cn("h-2 w-2 rounded-full", parDotClass)} />
                  STAGE TRUSS // 04 LIVE MERCH TAGS
                </span>
                <span className="inline-flex items-center gap-2 bg-ink/90 px-2 py-0.5 text-volt border border-volt/50">
                  <Equalizer bars={4} className="h-3 [&>span]:w-0.5 [&>span]:bg-volt" />
                  OPTICAL RIG CALIBRATED
                </span>
              </div>

              {/* 4 PAR Stage Lamp Fixtures aligned above desktop columns */}
              <div className="hidden grid-cols-4 border-t border-paper/20 bg-ink px-2 py-1 lg:grid">
                {SLOT_CONFIG.map((slot) => (
                  <div key={slot.channel} className="flex items-center justify-center gap-1.5">
                    <span className={cn("h-2 w-4 rounded-b-full border border-paper/50 transition-colors", parDotClass)} />
                    <span className="mono-label text-[9px] font-bold text-fog">
                      {slot.channel}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile horizontal snap rail */}
            <div
              className="snap-rail gap-4 pt-3 pb-4 lg:hidden"
              role="list"
              aria-label="Sản phẩm nổi bật"
            >
              {showSkeletons
                ? [0, 1, 2].map((i) => (
                    <div key={i} className="w-[230px] shrink-0">
                      <TagSkeleton stringLength={42} />
                    </div>
                  ))
                : heroProducts.map((p, i) => (
                    <div key={p.id} className="w-[230px] shrink-0" role="listitem">
                      <FeaturedTag
                        product={p}
                        index={i}
                        stringLength={SLOT_CONFIG[i]?.length ?? 42}
                        angle={0}
                      />
                    </div>
                  ))}
            </div>

            {/* Desktop 4-col suspended tour merch showcase */}
            <div
              className="hidden items-start gap-3.5 xl:gap-4 lg:grid lg:grid-cols-4"
              role="list"
              aria-label="Sản phẩm nổi bật"
            >
              {showSkeletons
                ? [0, 1, 2, 3].map((i) => (
                    <TagSkeleton key={i} stringLength={SLOT_CONFIG[i]?.length ?? 42} />
                  ))
                : heroProducts.map((p, i) => (
                    <FeaturedTag
                      key={p.id}
                      product={p}
                      index={i}
                      stringLength={SLOT_CONFIG[i]?.length ?? 42}
                      angle={SLOT_CONFIG[i]?.angle ?? 0}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stage Apron Hazard Floor Strip */}
      <div aria-hidden="true" className="hazard-stripe h-3 w-full border-t-2 border-ink" />
    </section>
  );
}

export default HeroHangTag;

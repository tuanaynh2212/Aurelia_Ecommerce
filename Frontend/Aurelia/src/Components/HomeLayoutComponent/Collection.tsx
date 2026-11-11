import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Disc3,
  Pause,
  Play,
} from "lucide-react";
import { CollectionContext } from "../../contexts/SeasonContext";
import { SectionTitle } from "../UI/primitives/SectionTitle";
import { Equalizer } from "../UI/primitives/Meter";
import { spatialStore } from "../UI/three/SpatialStore";
import { cn } from "../../utils/cn";

type SeasonPreviewItem = {
  id: string;
  slug?: string;
  name: string;
  slogan?: string;
  description?: string;
  banner?: string;
};

function getActRole(index: number, total: number): string {
  if (index === 0) return "OPENING ACT";
  if (index === total - 1 && total > 1) return "ENCORE FINALE";
  return `MAIN SET 0${index + 1}`;
}

export const Collection = () => {
  const navigate = useNavigate();
  const { collectionData } = useContext(CollectionContext);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);
  const [autoCue, setAutoCue] = useState(false);
  const [brokenIds, setBrokenIds] = useState<Record<string, boolean>>({});

  const totalCount = collectionData?.length ?? 0;
  const activeIdx = totalCount > 0 ? Math.min(Math.max(hoveredIdx ?? 0, 0), totalCount - 1) : 0;

  useEffect(() => {
    if (!autoCue || totalCount <= 1) return;
    const id = window.setInterval(() => {
      setHoveredIdx((prev) => {
        const next = ((prev ?? 0) + 1) % totalCount;
        spatialStore.setActiveSeasonIndex(next);
        return next;
      });
    }, 3600);
    return () => window.clearInterval(id);
  }, [autoCue, totalCount]);

  if (!collectionData || totalCount === 0) return null;

  const activeSeason = collectionData[activeIdx] as SeasonPreviewItem;
  const activeBanner = activeSeason?.banner;
  const isBannerBroken = !activeBanner || Boolean(brokenIds[activeSeason.id]);

  const handleSelectAct = (idx: number) => {
    setHoveredIdx(idx);
    spatialStore.setActiveSeasonIndex(idx);
  };

  const handleStep = (delta: number) => {
    const next = (activeIdx + delta + totalCount) % totalCount;
    handleSelectAct(next);
  };

  return (
    <section
      aria-label="Setlist Seasons"
      className="border-b-[3px] border-ink bg-bone py-14 md:py-20"
    >
      <div className="container-atelier">
        <SectionTitle
          index="04"
          eyebrow="HEADLINER SETLIST // TOUR ACTS & SEASON ARCHIVE"
          title="SET DIỄN CÁC MÙA NỔI BẬT"
          subtitle="Chọn từng track để xem poster chiến dịch, nghe nhịp trình diễn và bước vào bộ sưu tập tương ứng."
          count={totalCount}
        />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 7-col Concert Setlist Cue Sheet */}
          <div className="flex flex-col gap-3 lg:col-span-7">
            {/* Setlist Deck Header & Auto-Cue Transport */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-2 border-ink bg-ink px-4 py-2.5 text-paper shadow-hard-sm rounded-[2px]">
              <div className="flex items-center gap-2.5">
                <Equalizer bars={5} label="Setlist Active" className="h-3.5 [&>span]:w-1 [&>span]:bg-volt" />
                <span className="mono-label text-[10px] font-extrabold text-volt">
                  MAIN SETLIST // {String(totalCount).padStart(2, "0")} ACTS
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  aria-label="Act trước"
                  className="flex h-7 w-7 items-center justify-center border border-paper/40 bg-ink text-paper hover:bg-volt hover:text-ink cursor-pointer rounded-[1px]"
                >
                  <ChevronLeft size={14} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  aria-label="Act tiếp theo"
                  className="flex h-7 w-7 items-center justify-center border border-paper/40 bg-ink text-paper hover:bg-volt hover:text-ink cursor-pointer rounded-[1px]"
                >
                  <ChevronRight size={14} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => setAutoCue((prev) => !prev)}
                  aria-pressed={autoCue}
                  className={cn(
                    "inline-flex h-7 items-center gap-1 border px-2.5 mono-label text-[10px] font-extrabold cursor-pointer rounded-[1px]",
                    autoCue
                      ? "border-volt bg-volt text-ink"
                      : "border-paper/40 bg-ink text-paper hover:border-volt hover:text-volt"
                  )}
                >
                  {autoCue ? <Pause size={11} /> : <Play size={11} />}
                  <span>{autoCue ? "AUTO CUE: ON" : "AUTO CUE"}</span>
                </button>
              </div>
            </div>

            {collectionData.map((item: SeasonPreviewItem, index: number) => {
              const active = activeIdx === index;
              const actRole = getActRole(index, totalCount);
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => handleSelectAct(index)}
                  onFocus={() => handleSelectAct(index)}
                  className={cn(
                    "group relative flex flex-col justify-between gap-4 border-2 border-ink p-4 md:p-5 shadow-hard transition-colors sm:flex-row sm:items-center rounded-[2px]",
                    active ? "bg-volt text-ink" : "bg-paper text-ink hover:bg-bone"
                  )}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center border-2 border-ink bg-ink font-mono text-paper">
                      {active ? (
                        <Equalizer bars={4} className="h-4 [&>span]:w-1 [&>span]:bg-volt" />
                      ) : (
                        <span className="text-sm font-extrabold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="border border-ink bg-ink px-1.5 py-0.5 mono-label text-[9px] font-extrabold text-volt">
                          {actRole}
                        </span>
                        <span className="mono-label text-[10px] font-bold text-ink-muted">
                          TRACK {String(index + 1).padStart(2, "0")} // {item.slug || "COLLECTION"}
                        </span>
                      </div>
                      <h3 className="mt-1 font-display text-xl font-black uppercase text-ink diacritic-safe">
                        {item.name}
                      </h3>
                      {item.slogan && (
                        <p className="mt-0.5 text-xs font-semibold text-ink-muted">
                          &quot;{item.slogan}&quot;
                        </p>
                      )}
                      {item.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-ink-muted">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/Collection/${item.id}`)}
                    className="press-collapse inline-flex min-h-[44px] shrink-0 items-center gap-2 border-2 border-ink bg-ink px-4 mono-label text-xs font-extrabold text-paper shadow-hard-sm hover:bg-flash cursor-pointer rounded-[2px]"
                  >
                    <span>Mở set diễn</span>
                    <ArrowUpRight size={15} strokeWidth={2.5} aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right 5-col Concert Stage Turntable & Season Campaign Sleeve */}
          <div className="flex flex-col border-[3px] border-ink bg-paper shadow-hard-lg lg:col-span-5 rounded-[2px] overflow-hidden">
            <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-4 py-2.5 mono-label text-[10px] font-bold text-paper">
              <span className="inline-flex items-center gap-2">
                <Disc3
                  size={15}
                  className="text-volt animate-[vinyl-spin_4s_linear_infinite]"
                  aria-hidden="true"
                />
                <span>STAGE DECK // NOW SPINNING</span>
              </span>
              <span className="text-volt">
                ACT {String(activeIdx + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/Collection/${activeSeason.id}`)}
              aria-label={`Xem bộ sưu tập ${activeSeason.name}`}
              className="group relative flex-1 min-h-[340px] lg:min-h-[420px] w-full overflow-hidden bg-bone text-left cursor-pointer"
            >
              {!isBannerBroken ? (
                <img
                  key={activeSeason.id}
                  src={activeBanner}
                  alt={activeSeason.name}
                  onError={() =>
                    setBrokenIds((prev) => ({ ...prev, [activeSeason.id]: true }))
                  }
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              ) : (
                <div className="studio-grid-bg flex h-full w-full flex-col items-center justify-center p-8 text-center">
                  <span className="border-2 border-ink bg-volt px-3 py-1 mono-label text-xs font-extrabold text-ink">
                    {activeSeason.slug || "SEASON ARCHIVE"}
                  </span>
                  <p className="mt-3 font-display text-2xl font-black uppercase text-ink diacritic-safe">
                    {activeSeason.name}
                  </p>
                </div>
              )}

              {/* Corner stage monitor registration marks */}
              <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-volt" />
              <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-volt" />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3 bottom-3 border-2 border-ink bg-volt px-2.5 py-1 mono-label text-[10px] font-extrabold text-ink shadow-hard-sm"
              >
                {getActRole(activeIdx, totalCount)} // {activeSeason.slug || "ARCHIVE"}
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 border-2 border-ink bg-paper px-3 py-1.5 mono-label text-[10px] font-extrabold text-ink shadow-hard-sm transition-colors group-hover:bg-volt"
              >
                <span>MỞ SET DIỄN</span>
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </span>
            </button>

            {/* Vinyl Track Strip Selector */}
            {totalCount > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto border-t-2 border-ink bg-ink px-3 py-2.5">
                {collectionData.map((item: SeasonPreviewItem, idx: number) => {
                  const isCurrent = idx === activeIdx;
                  const thumbBroken = !item.banner || Boolean(brokenIds[item.id]);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectAct(idx)}
                      onMouseEnter={() => handleSelectAct(idx)}
                      aria-label={`Xem trước ${item.name}`}
                      aria-pressed={isCurrent}
                      className={cn(
                        "relative h-11 min-w-[44px] w-14 shrink-0 overflow-hidden border-2 transition-transform cursor-pointer rounded-[2px]",
                        isCurrent
                          ? "border-volt ring-2 ring-volt -translate-y-0.5"
                          : "border-paper/40 opacity-70 hover:opacity-100 hover:border-paper"
                      )}
                    >
                      {!thumbBroken ? (
                        <img
                          src={item.banner}
                          alt={item.name}
                          onError={() =>
                            setBrokenIds((prev) => ({ ...prev, [item.id]: true }))
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-paper mono-label text-[10px] font-bold text-ink">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      )}
                      <span className="absolute left-0 top-0 bg-ink/85 px-1 font-mono text-[8px] font-bold text-volt">
                        0{idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {activeSeason && (
              <div className="flex items-center justify-between gap-4 border-t-2 border-dashed border-ink bg-paper p-4">
                <div className="min-w-0">
                  <p className="mono-label text-[10px] font-bold text-ink-muted">
                    NOW ON TURNTABLE // TRACK {String(activeIdx + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-0.5 truncate font-display text-base font-extrabold uppercase text-ink diacritic-safe">
                    {activeSeason.name}
                  </p>
                  {activeSeason.slogan && (
                    <p className="truncate text-xs font-medium text-ink-muted">
                      &quot;{activeSeason.slogan}&quot;
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/Collection/${activeSeason.id}`)}
                  className="press-collapse inline-flex min-h-[44px] shrink-0 items-center gap-1.5 border-2 border-ink bg-volt px-3.5 mono-label text-[11px] font-extrabold text-ink shadow-hard-sm hover:bg-flash hover:text-paper cursor-pointer rounded-[2px]"
                >
                  <span>CHI TIẾT</span>
                  <ArrowUpRight size={14} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collection;

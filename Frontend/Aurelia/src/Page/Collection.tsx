import { useContext, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Box,
  ChevronRight,
  Disc3,
  LayoutGrid,
} from "lucide-react";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { CollectionContext } from "../contexts/SeasonContext";
import { LoadingOverlay } from "../Components/LoadingOverlay";
import { Container } from "../Components/layout/Container";
import { ProductGrid } from "../Components/product/ProductGrid";
import { MerchSelector3D } from "../Components/hangtag/MerchSelector3D";
import { DynamicMetaTags } from "../Components/SEO/DynamicMetaTags";
import { Button } from "../Components/UI/primitives/Button";
import { EmptyState } from "../Components/UI/primitives/Feedback";
import { SectionTitle } from "../Components/UI/primitives/SectionTitle";
import { SplitFlap } from "../Components/UI/primitives/SplitFlap";
import { Equalizer } from "../Components/UI/primitives/Meter";
import { Tabs } from "../Components/UI/primitives/Overlays";
import type { Product } from "../types/type";
import { filterRealProducts } from "../utils/productFilters";
import { getSalePrice } from "../utils/productHelpers";
import { cn } from "../utils/cn";

type SeasonSummary = {
  id: string;
  slug?: string;
  name?: string;
  slogan?: string;
  description?: string;
  banner?: string;
};

type SeasonDetailEntry = {
  season?: SeasonSummary;
  products?: Product[];
};

type SortKey = "default" | "price-asc" | "price-desc" | "popular";

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "default", label: "Mặc định" },
  { id: "popular", label: "Bán chạy" },
  { id: "price-asc", label: "Giá ↑" },
  { id: "price-desc", label: "Giá ↓" },
];

export const Collection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { seasonCollections, collectionData, fetchData } = useContext(CollectionContext);
  const inventoryRef = useRef<HTMLElement | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [brokenBannerUrl, setBrokenBannerUrl] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("default");
  const [viewMode, setViewMode] = useState<"grid" | "3d">("3d");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    fetchData(id)
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, fetchData]);

  const entries = useMemo<SeasonDetailEntry[]>(
    () => (Array.isArray(seasonCollections) ? seasonCollections : []),
    [seasonCollections]
  );

  const collection = entries[0]?.season;
  const rawProducts = useMemo<Product[]>(
    () => entries.flatMap((entry) => entry.products ?? []),
    [entries]
  );
  const realProducts = useMemo(() => filterRealProducts(rawProducts), [rawProducts]);

  const productTypes = useMemo(() => {
    const set = new Set<string>(["all"]);
    realProducts.forEach((p) => {
      if (p.type) set.add(p.type);
    });
    return Array.from(set).slice(0, 7);
  }, [realProducts]);

  const visibleProducts = useMemo(() => {
    const filtered =
      activeType === "all"
        ? realProducts
        : realProducts.filter((p) => p.type === activeType);

    if (sortBy === "default") return filtered;
    const copy = [...filtered];
    if (sortBy === "popular") {
      return copy.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
    }
    if (sortBy === "price-asc") {
      return copy.sort(
        (a, b) => (getSalePrice(a) ?? a.price) - (getSalePrice(b) ?? b.price)
      );
    }
    return copy.sort(
      (a, b) => (getSalePrice(b) ?? b.price) - (getSalePrice(a) ?? a.price)
    );
  }, [realProducts, activeType, sortBy]);

  const seasonsList = useMemo<SeasonSummary[]>(
    () => (Array.isArray(collectionData) ? collectionData : []),
    [collectionData]
  );

  const actIdx = seasonsList.findIndex((s) => s.id === id);
  const actCode = String((actIdx >= 0 ? actIdx : 0) + 1).padStart(2, "0");

  const handleSwitchSeason = (targetId: string) => {
    if (targetId === id) return;
    setIsLoading(true);
    setActiveType("all");
    setSortBy("default");
    navigate(`/Collection/${targetId}`);
  };

  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-bone text-ink flex flex-col">
        <Navbar />
        {isLoading ? (
          <LoadingOverlay isLoading={true} message="Đang tải dữ liệu bộ sưu tập..." />
        ) : (
          <Container className="flex-1 py-20">
            <EmptyState
              code="[COLLECTION // NOT FOUND]"
              title="KHÔNG TÌM THẤY BỘ SƯU TẬP"
              description="Mã bộ sưu tập không tồn tại hoặc dữ liệu đang được đồng bộ."
              action={
                <Button variant="primary" onClick={() => navigate("/Collection")}>
                  Quay lại mục lục bộ sưu tập
                </Button>
              }
            />
          </Container>
        )}
        <Footer />
      </div>
    );
  }

  const hasValidBanner = Boolean(collection?.banner && brokenBannerUrl !== collection.banner);

  return (
    <>
      <DynamicMetaTags
        title={`${collection?.name || "Bộ Sưu Tập"} | Aurelia`}
        description={collection?.description || "Danh mục bộ sưu tập thời trang Aurelia."}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />

      <div className="min-h-screen bg-bone text-ink flex flex-col">
        <Navbar />
        {isLoading && <LoadingOverlay isLoading={true} message="Đang đồng bộ set diễn..." />}

        <main id="main-content" className="flex-1">
          {/* Dark Concert Setlist Header & Campaign Stage Frame */}
          <section className="stage-grid-dark relative border-b-[3px] border-ink bg-ink text-paper">
            <div aria-hidden="true" className="concert-truss h-3 w-full border-b border-paper/20" />

            <Container className="py-6 md:py-10">
              {/* Top navigation bar: Breadcrumb + Tour Act Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paper/20 pb-4">
                <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 mono-label text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="text-fog hover:text-volt cursor-pointer"
                  >
                    HOME
                  </button>
                  <ChevronRight size={12} className="text-paper/45" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => navigate("/Collection")}
                    className="text-fog hover:text-volt cursor-pointer"
                  >
                    COLLECTIONS
                  </button>
                  <ChevronRight size={12} className="text-paper/45" aria-hidden="true" />
                  <span className="border border-volt bg-volt px-2 py-0.5 text-ink font-extrabold">
                    {collection?.name || "SEASON"}
                  </span>
                </nav>

                {seasonsList.length > 1 && (
                  <div className="flex flex-wrap items-center gap-1.5" role="navigation" aria-label="Chuyển nhanh bộ sưu tập">
                    <span className="mono-label mr-1 text-[9px] font-bold text-fog hidden sm:inline">
                      SETLIST ACTS:
                    </span>
                    {seasonsList.map((s, idx) => {
                      const isCurrent = s.id === id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleSwitchSeason(s.id)}
                          aria-current={isCurrent ? "page" : undefined}
                          className={cn(
                            "border px-2.5 py-1 mono-label text-[10px] font-extrabold transition-colors cursor-pointer rounded-[2px]",
                            isCurrent
                              ? "border-volt bg-volt text-ink"
                              : "border-paper/30 bg-ink text-fog hover:border-volt hover:text-volt"
                          )}
                        >
                          0{idx + 1} · {s.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 12-Col Hero: Left Concert Poster Ticket | Right Real Campaign Frame */}
              <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
                {/* Left 7 Cols: Editorial Setlist Ticket Card */}
                <div className="relative flex flex-col justify-between border-[3px] border-volt bg-paper text-ink shadow-hard-volt lg:col-span-7 rounded-[2px]">
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-ink pb-3">
                      <span className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-2.5 py-0.5 mono-label text-[10px] font-extrabold text-volt">
                        <span className="h-2 w-2 rounded-full bg-flash animate-rec" aria-hidden="true" />
                        ACT {actCode} // SEASON ARCHIVE
                      </span>
                      <span className="border-2 border-ink bg-volt px-2 py-0.5 mono-label text-[10px] font-extrabold text-ink">
                        {collection?.slug || "AURELIA EDITION"}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap items-baseline gap-3">
                      <h1 className="font-display font-display-safe text-[clamp(2rem,4vw,3.5rem)] font-black uppercase leading-[1.08] tracking-tight text-ink">
                        {collection?.name}
                      </h1>
                      <span className="text-outline font-display text-3xl md:text-4xl font-black tabular select-none">
                        ({String(realProducts.length).padStart(2, "0")})
                      </span>
                    </div>

                    {collection?.slogan && (
                      <p className="mt-3 border-l-4 border-ink bg-volt/35 px-3.5 py-2 mono-label text-xs font-extrabold text-ink">
                        &quot;{collection.slogan}&quot;
                      </p>
                    )}

                    {collection?.description && (
                      <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-ink-muted">
                        {collection.description}
                      </p>
                    )}
                  </div>

                  {/* Perforated Concert Stub Telemetry & Quick Actions */}
                  <div className="relative flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-ink bg-bone px-6 py-4">
                    <span
                      aria-hidden="true"
                      className="ticket-notch notch-l -left-[13px] -top-[12px]"
                      style={{ "--notch-bg": "var(--color-ink)", borderColor: "var(--color-volt)" } as CSSProperties}
                    />
                    <span
                      aria-hidden="true"
                      className="ticket-notch notch-r -right-[13px] -top-[12px]"
                      style={{ "--notch-bg": "var(--color-ink)", borderColor: "var(--color-volt)" } as CSSProperties}
                    />

                    <div className="flex items-center gap-3">
                      <SplitFlap
                        value={String(realProducts.length).padStart(2, "0")}
                        size="sm"
                        tone="ink"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Equalizer bars={4} className="h-3 [&>span]:w-0.5" />
                          <span className="mono-label text-[10px] font-extrabold text-ink">
                            SETLIST LIVE
                          </span>
                        </div>
                        <p className="mono-label text-[10px] font-bold text-ink-muted">
                          MẶT HÀNG LƯU HÀNH
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <Button
                        variant="accent"
                        size="md"
                        onClick={() =>
                          inventoryRef.current?.scrollIntoView({ behavior: "smooth" })
                        }
                        iconRight={<ArrowDown size={15} strokeWidth={2.5} />}
                      >
                        Khám phá set đồ
                      </Button>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => navigate("/Fashion/Products")}
                        iconRight={<ArrowUpRight size={15} strokeWidth={2.5} />}
                      >
                        Toàn bộ kệ
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right 5 Cols: Unobstructed High-Res Season Campaign Monitor */}
                <div className="flex flex-col border-[3px] border-paper/75 bg-ink shadow-hard-flash lg:col-span-5 rounded-[2px] overflow-hidden">
                  <div className="flex items-center justify-between border-b-2 border-paper/25 bg-ink px-4 py-2.5 mono-label text-[10px] font-extrabold text-paper">
                    <span className="inline-flex items-center gap-2">
                      <Disc3
                        size={14}
                        className="text-volt animate-[vinyl-spin_4s_linear_infinite]"
                        aria-hidden="true"
                      />
                      CAMPAIGN VISUAL // MASTER FRAME
                    </span>
                    <span className="text-volt">TRACK {actCode}</span>
                  </div>

                  <div className="relative flex-1 min-h-[300px] lg:min-h-[360px] bg-bone overflow-hidden">
                    {hasValidBanner ? (
                      <img
                        key={collection?.banner}
                        src={collection?.banner}
                        alt={collection?.name || "Season Campaign"}
                        onError={() => setBrokenBannerUrl(collection?.banner ?? null)}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="studio-grid-bg flex h-full w-full flex-col items-center justify-center p-8 text-center">
                        <Equalizer bars={6} className="mb-3 h-5" />
                        <span className="border-2 border-ink bg-volt px-3 py-1 mono-label text-xs font-extrabold text-ink">
                          ACT {actCode} // {collection?.slug || "ARCHIVE"}
                        </span>
                        <p className="mt-3 font-display text-2xl font-black uppercase text-ink diacritic-safe">
                          {collection?.name}
                        </p>
                      </div>
                    )}

                    {/* Architectural corner reticle */}
                    <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-volt" />
                    <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-volt" />
                    <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-volt" />
                    <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-volt" />
                  </div>

                  <div className="flex items-center justify-between border-t-2 border-paper/25 bg-ink px-4 py-2.5 mono-label text-[10px] font-bold">
                    <span className="text-fog truncate">
                      TOUR ARCHIVE // {collection?.name}
                    </span>
                    <span className="border border-volt px-1.5 py-0.5 text-[9px] text-volt">
                      VERIFIED EDITION
                    </span>
                  </div>
                </div>
              </div>
            </Container>
          </section>

          {/* Concert Hazard Transition Strip */}
          <div aria-hidden="true" className="hazard-stripe h-3 w-full border-b-[3px] border-ink" />

          {/* Inventory & 3D Select Stage */}
          <section ref={inventoryRef} className="py-12 md:py-16">
            <Container>
              <SectionTitle
                index={actCode}
                eyebrow="MERCHANDISE RACK // SETLIST ITEMS"
                title="SẢN PHẨM TRONG BỘ SƯU TẬP"
                count={visibleProducts.length}
                action={
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/Collection")}
                    iconLeft={<ArrowLeft size={14} strokeWidth={2.5} />}
                  >
                    Tất cả BST
                  </Button>
                }
              />

              {/* Filter + Sort + 2D/3D Mode Toolbar */}
              <div className="mt-6 flex flex-col gap-3 border-2 border-ink bg-paper p-3 shadow-hard-sm lg:flex-row lg:items-center lg:justify-between rounded-[2px]">
                <Tabs
                  activeId={activeType}
                  onChange={setActiveType}
                  items={productTypes.map((type) => ({
                    id: type,
                    label: type === "all" ? "Tất cả" : type,
                  }))}
                />

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Sort Pills */}
                  <div className="flex items-center gap-1 border-2 border-ink bg-bone p-0.5 rounded-[2px]">
                    {SORT_OPTIONS.map((opt) => {
                      const active = sortBy === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSortBy(opt.id)}
                          aria-pressed={active}
                          className={cn(
                            "px-2.5 py-1 mono-label text-[10px] font-extrabold cursor-pointer transition-colors rounded-[1px]",
                            active
                              ? "bg-ink text-volt"
                              : "text-ink-muted hover:text-ink"
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* 2D Grid vs 3D Stage Selector */}
                  <div
                    role="group"
                    aria-label="Chế độ xem bộ sưu tập"
                    className="inline-flex border-2 border-ink bg-bone p-0.5 rounded-[2px]"
                  >
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      aria-pressed={viewMode === "grid"}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 mono-label text-[10px] font-extrabold cursor-pointer transition-colors rounded-[1px]",
                        viewMode === "grid"
                          ? "bg-volt text-ink"
                          : "text-ink-muted hover:text-ink"
                      )}
                    >
                      <LayoutGrid size={12} strokeWidth={2.5} aria-hidden="true" />
                      <span>LƯỚI THẺ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("3d")}
                      aria-pressed={viewMode === "3d"}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 mono-label text-[10px] font-extrabold cursor-pointer transition-colors rounded-[1px]",
                        viewMode === "3d"
                          ? "bg-ink text-volt"
                          : "text-ink-muted hover:text-ink"
                      )}
                    >
                      <Box size={12} strokeWidth={2.5} aria-hidden="true" />
                      <span>SELECT 3D</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                {viewMode === "3d" && visibleProducts.length > 0 ? (
                  <MerchSelector3D
                    key={`${id}-${activeType}-${sortBy}`}
                    products={visibleProducts}
                  />
                ) : (
                  <ProductGrid
                    products={visibleProducts}
                    isLoading={isLoading}
                    columns={4}
                  />
                )}
              </div>
            </Container>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Collection;

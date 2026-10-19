import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { AdminContext } from "../../contexts/AdminContext";

export const HeroBanner = () => {
  const { MainBanner } = useContext(AdminContext);
  const [index, setIndex] = useState(0);

  const banners = (MainBanner || []).filter((b: any) => b.active);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;
  const current = banners[index];

  return (
    <div className="relative w-full overflow-hidden border-b border-[var(--color-rule)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id || index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {current.layout === "A" ? (
            <HeroA data={current} />
          ) : current.layout === "B" ? (
            <HeroB data={current} />
          ) : current.layout === "C" ? (
            <HeroC data={current} />
          ) : (
            <HeroD data={current} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next — minimal arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() =>
              setIndex((prev) => (prev - 1 + banners.length) % banners.length)
            }
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 border border-[var(--color-rule)] bg-[var(--color-bg)]/90 text-[var(--color-ink)] flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors z-20 cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setIndex((prev) => (prev + 1) % banners.length)}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 border border-[var(--color-rule)] bg-[var(--color-bg)]/90 text-[var(--color-ink)] flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors z-20 cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>

          {/* Index indicator — tabular */}
          <div className="absolute bottom-4 right-5 z-20 font-body text-xs text-[var(--color-ink-muted)] tabular-nums">
            <span className="font-semibold text-[var(--color-ink)]">{String(index + 1).padStart(2, "0")}</span>
            <span className="mx-1">/</span>
            <span>{String(banners.length).padStart(2, "0")}</span>
          </div>
        </>
      )}
    </div>
  );
};

/* ============================================================
   Layout A — Split: Text | Image (Trade Ledger: full-bleed halves)
   ============================================================ */
export const HeroA = ({ data }: { data: any }) => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[520px] md:min-h-[600px]">
      <div className="container-page h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px] md:min-h-[600px]">
          {/* Left — Text column */}
          <div className="flex flex-col justify-center py-12 lg:py-16 lg:pr-12">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-accent)] mb-4 block">
              {data.h1 || "New Collection 2026"}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[var(--color-ink)] leading-[1.1] tracking-tight mb-4">
              {data.mainTitle || "Thời Trang Tinh Tế & Hiện Đại"}
            </h1>

            <p className="text-sm sm:text-base text-[var(--color-ink-muted)] font-body leading-relaxed max-w-md mb-8">
              {data.pagaraph ||
                "Các thiết kế mới nhất với chất liệu tự nhiên, kiểu dáng tối giản và phong cách ứng dụng cao."}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/Fashion/Products")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-ink)] text-[var(--color-bg)] text-sm font-semibold hover:bg-[var(--color-accent)] transition-colors cursor-pointer"
              >
                {data.textInButton || data.textButton || "Mua sắm ngay"}
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate("/Collection")}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--color-rule)] text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
              >
                Bộ sưu tập
              </button>
            </div>
          </div>

          {/* Right — Image, flush, no rounding */}
          <div className="relative lg:border-l border-[var(--color-rule)]">
            <img
              src={data.linkUrl}
              alt={data.mainTitle || "Hero Banner"}
              className="w-full h-full object-cover min-h-[320px] lg:min-h-full"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   Layout B — Full-bleed image with overlay text
   ============================================================ */
export const HeroB = ({ data }: { data: any }) => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[520px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={data.linkUrl}
          alt={data.mainTitle || "Hero Banner"}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-[var(--color-ink)]/60" />
      </div>

      <div className="relative z-10 container-page text-center py-16">
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-bg)]/70 mb-4 block">
          Aurelia 2026
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-4 text-white">
          {data.mainTitle}
        </h1>

        <p className="text-sm sm:text-base font-body text-white/80 leading-relaxed mb-8 max-w-xl mx-auto">
          {data.pagaraph}
        </p>

        <button
          onClick={() => navigate("/Fashion/Products")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-ink)] text-sm font-semibold hover:bg-[var(--color-accent)] hover:text-white transition-colors cursor-pointer"
        >
          Xem ngay
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
};

/* ============================================================
   Layout C — Boxed card split
   ============================================================ */
export const HeroC = ({ data }: { data: any }) => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[520px] md:min-h-[600px] flex items-center py-12">
      <div className="container-page">
        <div className="border border-[var(--color-rule)] grid grid-cols-1 md:grid-cols-2">
          {/* Text side */}
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-accent)] mb-3 block">
              {data.subtitle || "Tuyển chọn"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[var(--color-ink)] leading-tight mb-4">
              {data.h1 || data.mainTitle}
            </h1>
            <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed mb-6 font-body">
              {data.pagaraph}
            </p>
            <button
              onClick={() => navigate("/Fashion/Products")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-ink)] text-[var(--color-bg)] text-sm font-semibold hover:bg-[var(--color-accent)] transition-colors w-fit cursor-pointer"
            >
              {data.textInButton || data.textButton || "Mua ngay"}
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Image side */}
          <div className="relative aspect-[4/3] md:aspect-auto border-t md:border-t-0 md:border-l border-[var(--color-rule)] overflow-hidden">
            <img
              src={data.linkUrl}
              alt={data.mainTitle}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   Layout D — Wide text, narrow image
   ============================================================ */
export const HeroD = ({ data }: { data: any }) => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[520px] md:min-h-[600px] flex items-center py-12">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          <div className="lg:col-span-8 flex flex-col justify-center py-8 lg:pr-12">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-accent)] mb-3 block">
              Aurelia Collection
            </span>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-[var(--color-ink)] tracking-tight mb-4">
              {data.mainTitle}
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-ink-muted)] max-w-xl mb-6">
              {data.pagaraph}
            </p>
            <button
              onClick={() => navigate("/Fashion/Products")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-ink)] text-[var(--color-bg)] text-sm font-semibold hover:bg-[var(--color-accent)] transition-colors w-fit cursor-pointer"
            >
              {data.textButton || data.textInButton || "Xem sản phẩm"}
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[var(--color-rule)]">
            <img
              src={data.linkUrl}
              alt={data.mainTitle}
              className="w-full h-full object-cover aspect-[3/4]"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

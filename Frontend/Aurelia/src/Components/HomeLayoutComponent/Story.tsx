import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { AdminContext } from "../../contexts/AdminContext";

export const Story = () => {
  const { StoryBanner } = useContext(AdminContext);
  const banner = useMemo(
    () => (Array.isArray(StoryBanner) ? StoryBanner : []),
    [StoryBanner]
  );

  return (
    <div className="w-full my-8 space-y-12">
      {banner.map((data: any, index: number) => {
        if (data.layout === "A") {
          return <StoryA key={index} data={data} />;
        } else if (data.layout === "B") {
          return <StoryB key={index} data={data} />;
        } else if (data.layout === "C") {
          return <StoryC key={index} data={data} />;
        }
        return null;
      })}
    </div>
  );
};

export const StoryA = ({ data }: any) => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[520px] md:h-[620px] flex items-center overflow-hidden bg-[var(--color-cream-100)] rounded-[var(--radius-2xl)] my-8 max-w-7xl mx-auto border border-[var(--color-cream-300)]">
      <div className="absolute inset-0 w-full h-full">
        <img
          alt={data.mainTitle || "Story Banner"}
          className="w-full h-full object-cover object-center opacity-85"
          src={data.linkUrl}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink)]/80 via-[var(--color-ink)]/40 to-transparent" />
      </div>

      <div className="relative z-10 px-8 md:px-16 lg:px-20 max-w-2xl text-white">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-pill)] bg-white/20 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider text-white mb-4">
          <Sparkles size={13} className="text-[var(--color-peach-100)]" />
          <span>{data.h1 || "Câu chuyện thiết kế"}</span>
        </div>

        <h2 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl leading-[1.1] mb-4 text-white">
          {data.mainTitle}
        </h2>

        <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-body">
          {data.pagaraph}
        </p>

        <button
          onClick={() => navigate("/Fashion/Products")}
          className="btn btn-primary"
        >
          <span>Xem danh mục</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};

export const StoryB = ({ data }: { data: any }) => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto rounded-[var(--radius-2xl)] overflow-hidden bg-white border border-[var(--color-cream-300)] shadow-[var(--shadow-card)] my-8">
      <div className="flex flex-col md:flex-row items-stretch">
        {/* Left Text Col */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-[var(--color-cream-50)]">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-3">
            {data.mainTitle}
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-bold text-[var(--color-ink)] leading-tight mb-4">
            {data.h1}
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-ink-soft)] leading-relaxed mb-8">
            {data.pagaraph}
          </p>
          <div>
            <button
              onClick={() => navigate("/Fashion/Products")}
              className="btn btn-outline"
            >
              <span>Xem chi tiết</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Image Col */}
        <div className="w-full md:w-1/2 min-h-[360px] md:min-h-full relative overflow-hidden bg-[var(--color-cream-200)]">
          <img
            src={data.linkUrl}
            alt={data.h1 || "Story"}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export const StoryC = ({ data }: { data: any }) => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[460px] flex items-center overflow-hidden bg-[var(--color-cream-100)] rounded-[var(--radius-2xl)] my-8 max-w-7xl mx-auto border border-[var(--color-cream-300)]">
      <div className="absolute inset-0 w-full h-full">
        <img
          alt={data.mainTitle || "Story"}
          className="w-full h-full object-cover object-right opacity-80"
          src={data.linkUrl}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://picsum.photos/1200/600";
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-cream-50)] via-[var(--color-cream-50)]/80 to-transparent" />
      </div>

      <div className="relative z-10 px-8 md:px-16 lg:px-20 max-w-xl">
        <span className="text-xs font-semibold tracking-wider uppercase text-[var(--color-accent)] mb-2 block">
          {data.mainTitle}
        </span>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[var(--color-ink)] mb-3">
          {data.h1}
        </h2>
        <p className="text-[var(--color-ink-soft)] text-sm sm:text-base leading-relaxed mb-6 font-body">
          {data.pagaraph}
        </p>
        <button
          onClick={() => navigate("/Fashion/Products")}
          className="btn btn-primary btn-sm"
        >
          <span>Xem bộ sưu tập</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
};

export default Story;
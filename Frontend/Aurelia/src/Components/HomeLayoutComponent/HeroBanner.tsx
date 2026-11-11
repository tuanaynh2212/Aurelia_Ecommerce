import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { AdminContext } from "../../contexts/AdminContext";
import { Button, IconButton } from "../UI/primitives/Button";

interface BannerItem {
  id?: string;
  linkUrl?: string;
  mainTitle?: string;
  h1?: string;
  subtitle?: string;
  pagaraph?: string;
  textInButton?: string;
  textButton?: string;
  active?: boolean;
  layout?: string;
}

export const HeroBanner = () => {
  const { MainBanner } = useContext(AdminContext);
  const [index, setIndex] = useState(0);

  const banners = (MainBanner || []).filter((b: BannerItem) => b.active);

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
    <div className="relative w-full overflow-hidden border-b-2 border-ink bg-bone">
      {current.layout === "A" ? (
        <HeroA data={current} />
      ) : current.layout === "B" ? (
        <HeroB data={current} />
      ) : current.layout === "C" ? (
        <HeroC data={current} />
      ) : (
        <HeroD data={current} />
      )}

      {banners.length > 1 && (
        <div className="container-atelier flex items-center justify-between border-t-2 border-ink bg-paper py-2">
          <div className="flex items-center gap-2">
            <IconButton
              label="Previous slide"
              onClick={() =>
                setIndex((prev) => (prev - 1 + banners.length) % banners.length)
              }
            >
              <ChevronLeft size={16} />
            </IconButton>
            <IconButton
              label="Next slide"
              onClick={() => setIndex((prev) => (prev + 1) % banners.length)}
            >
              <ChevronRight size={16} />
            </IconButton>
          </div>
          <div className="mono-label text-xs font-extrabold tabular text-ink">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span className="mx-1">/</span>
            <span>{String(banners.length).padStart(2, "0")}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const HeroA = ({ data }: { data: BannerItem }) => {
  const navigate = useNavigate();

  return (
    <section className="container-atelier py-12">
      <div className="grid grid-cols-1 border-2 border-ink bg-paper shadow-hard-lg lg:grid-cols-2 rounded-[2px]">
        <div className="flex flex-col justify-center p-8 lg:p-12">
          <span className="mono-label mb-3 inline-block w-fit border-2 border-ink bg-volt px-2.5 py-0.5 text-xs font-extrabold text-ink">
            {data.h1 || "New Collection 2026"}
          </span>

          <h1 className="display-l font-display-safe mb-4 text-ink">
            {data.mainTitle || "Thời Trang Tinh Tế & Hiện Đại"}
          </h1>

          <p className="mb-8 max-w-md text-sm leading-relaxed text-ink-muted sm:text-base">
            {data.pagaraph ||
              "Các thiết kế mới nhất với chất liệu tự nhiên, kiểu dáng tối giản và phong cách ứng dụng cao."}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              onClick={() => navigate("/Fashion/Products")}
              iconRight={<ArrowRight size={15} />}
            >
              {data.textInButton || data.textButton || "Mua sắm ngay"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/Collection")}
            >
              Bộ sưu tập
            </Button>
          </div>
        </div>

        <div className="border-t-2 border-ink bg-bone p-4 lg:border-l-2 lg:border-t-0">
          {data.linkUrl ? (
            <img
              src={data.linkUrl}
              alt={data.mainTitle || "Hero Banner"}
              className="h-full min-h-[320px] w-full border-2 border-ink object-cover"
              loading="eager"
            />
          ) : (
            <div className="studio-grid-bg min-h-[320px] h-full w-full border-2 border-ink" />
          )}
        </div>
      </div>
    </section>
  );
};

export const HeroB = ({ data }: { data: BannerItem }) => <HeroA data={data} />;
export const HeroC = ({ data }: { data: BannerItem }) => <HeroA data={data} />;
export const HeroD = ({ data }: { data: BannerItem }) => <HeroA data={data} />;

export default HeroBanner;

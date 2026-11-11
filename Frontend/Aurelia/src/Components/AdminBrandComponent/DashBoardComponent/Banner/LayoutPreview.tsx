import { ArrowBigLeft, Image as ImageIcon } from "lucide-react";

export interface BannerPreviewData {
  id?: string;
  layout?: string;
  linkUrl?: string;
  mainTitle?: string;
  title?: string;
  subtitle?: string;
  h1?: string;
  h2?: string;
  pagaraph?: string;
  paragraph?: string;
  textInButton?: string;
  textButton?: string;
  colorMainTitle?: string;
  colorText?: string;
  active?: boolean;
}

function resolveBodyText(data: BannerPreviewData): string {
  return data.pagaraph || data.paragraph || "";
}

function resolveCtaText(data: BannerPreviewData): string {
  return data.textInButton || data.textButton || "Khám phá ngay";
}

function PreviewImageFallback({ label }: { label?: string }) {
  return (
    <div className="studio-grid-bg w-full h-full flex flex-col items-center justify-center gap-2 text-ink-muted p-4 text-center">
      <ImageIcon size={28} />
      <span className="mono-label text-[10px] font-bold">
        {label || "CHƯA CÓ ẢNH BANNER"}
      </span>
    </div>
  );
}

export const LayoutPreview = ({
  current,
  statusState,
}: {
  current: BannerPreviewData;
  statusState: string;
  setFile?: unknown;
  selected?: number;
  setLocalMainBanner?: unknown;
  setLocalStoryBanner?: unknown;
  banners?: unknown;
  setSelected?: unknown;
}) => {
  const layoutKey = current.layout || "A";

  return (
    <div className="relative w-full overflow-hidden">
      {statusState === "Main" ? (
        layoutKey === "B" ? (
          <HeroB data={current} />
        ) : layoutKey === "C" ? (
          <HeroC data={current} />
        ) : layoutKey === "D" ? (
          <HeroD data={current} />
        ) : (
          <HeroA data={current} />
        )
      ) : layoutKey === "B" ? (
        <StoryB data={current} />
      ) : layoutKey === "C" ? (
        <StoryC data={current} />
      ) : layoutKey === "D" ? (
        <StoryD data={current} />
      ) : (
        <StoryA data={current} />
      )}
    </div>
  );
};

export const HeroA = ({ data }: { data: BannerPreviewData }) => {
  const body = resolveBodyText(data);
  const cta = resolveCtaText(data);

  return (
    <section className="relative w-full flex flex-col lg:flex-row min-h-[460px] bg-paper">
      <div className="flex-grow lg:w-[58%] flex flex-col justify-between p-8 md:p-10 bg-paper z-10">
        <div className="max-w-md mt-4">
          <p
            className="font-mono text-xs tracking-widest uppercase mb-3 font-bold"
            style={{ color: data.colorText }}
          >
            {data.h1 || "NEW CAMPAIGN"}
          </p>
          <h2
            className="font-sans text-xl md:text-2xl leading-relaxed font-semibold"
            style={{ color: data.colorText }}
          >
            {body || "Thông điệp chiến dịch sẽ hiển thị tại đây."}
          </h2>
        </div>

        <div className="mt-8">
          <span className="inline-flex items-center gap-3 px-5 py-3 border-2 border-ink bg-bone font-mono text-xs font-bold uppercase shadow-hard-sm">
            <span style={{ color: data.colorText }}>{cta}</span>
            <span>→</span>
          </span>
        </div>
      </div>

      <div className="relative flex-grow lg:w-[42%] flex min-h-[320px] lg:min-h-0 bg-bone z-10 border-t-2 lg:border-t-0 lg:border-l-2 border-ink">
        <div className="absolute left-3 top-4 right-3 z-20 pointer-events-none">
          <h1
            className="font-display-safe text-3xl md:text-4xl font-black uppercase leading-tight"
            style={{ color: data.colorMainTitle }}
          >
            {data.mainTitle || "TIÊU ĐỀ CHÍNH"}
          </h1>
        </div>
        <div className="w-full h-full relative overflow-hidden">
          {data.linkUrl ? (
            <img
              src={data.linkUrl}
              alt={data.mainTitle || "Hero"}
              className="w-full h-full object-cover grayscale"
            />
          ) : (
            <PreviewImageFallback />
          )}
        </div>
      </div>
    </section>
  );
};

export const HeroB = ({ data }: { data: BannerPreviewData }) => {
  const body = resolveBodyText(data);
  const cta = resolveCtaText(data);

  return (
    <section className="relative min-h-[460px] flex items-center justify-center overflow-hidden bg-bone p-6">
      <div className="absolute inset-0 z-0">
        {data.linkUrl ? (
          <img
            src={data.linkUrl}
            alt={data.mainTitle || "Hero"}
            className="w-full h-full object-cover"
          />
        ) : (
          <PreviewImageFallback />
        )}
        <div className="absolute inset-0 bg-paper/70" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 py-10 border-2 border-ink bg-paper/95 shadow-hard max-w-xl">
        {data.h1 && (
          <span
            className="mono-label text-[11px] font-bold uppercase mb-2"
            style={{ color: data.colorText }}
          >
            {data.h1}
          </span>
        )}
        <h1
          className="font-display-safe text-3xl md:text-5xl font-black uppercase leading-none mb-4"
          style={{ color: data.colorMainTitle }}
        >
          {data.mainTitle || "TIÊU ĐỀ CHÍNH"}
        </h1>
        <div className="w-24 h-0.5 bg-ink mb-4" />
        <p
          className="font-sans text-sm md:text-base leading-relaxed"
          style={{ color: data.colorText }}
        >
          {body || "Thông điệp chiến dịch sẽ hiển thị tại đây."}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 border-2 border-ink bg-volt font-mono text-xs font-extrabold uppercase text-ink shadow-hard-sm">
          {cta}
        </span>
      </div>
    </section>
  );
};

export const HeroC = ({ data }: { data: BannerPreviewData }) => {
  const body = resolveBodyText(data);
  const cta = resolveCtaText(data);

  return (
    <main className="relative py-10 overflow-hidden bg-paper flex flex-col items-center px-6">
      <div className="text-center mb-6">
        <span
          className="font-mono text-xs tracking-widest font-bold uppercase block mb-1.5"
          style={{ color: data.colorText }}
        >
          {data.h1 || data.subtitle || "ATELIER EDITION"}
        </span>
        <h1
          className="font-display-safe text-3xl md:text-5xl font-black uppercase tracking-tight leading-none"
          style={{ color: data.colorMainTitle }}
        >
          {data.mainTitle || "POSTER CHÍNH"}
        </h1>
      </div>

      <div className="relative max-w-sm w-full aspect-[4/3] mb-6 border-2 border-ink shadow-hard bg-bone overflow-hidden">
        {data.linkUrl ? (
          <img
            src={data.linkUrl}
            alt={data.mainTitle || data.title || "Poster"}
            className="w-full h-full object-cover"
          />
        ) : (
          <PreviewImageFallback />
        )}
      </div>

      <div className="max-w-lg text-center space-y-4">
        <p
          className="font-sans text-sm md:text-base leading-relaxed"
          style={{ color: data.colorText }}
        >
          {body || "Slogan / mô tả chiến dịch sẽ xuất hiện ở đây."}
        </p>

        <span
          className="inline-block px-7 py-2.5 text-paper font-mono text-xs font-bold tracking-widest uppercase border-2 border-ink shadow-hard-sm bg-ink"
        >
          {cta}
        </span>
      </div>
    </main>
  );
};

export const HeroD = ({ data }: { data: BannerPreviewData }) => {
  const body = resolveBodyText(data);
  const cta = resolveCtaText(data);

  return (
    <main className="flex-1 flex flex-col items-center justify-center relative px-6 py-12 min-h-[460px] overflow-hidden bg-bone">
      <div className="text-center z-10 bg-paper border-2 border-ink shadow-hard p-7 max-w-xl">
        <h1
          className="font-display-safe text-4xl md:text-6xl font-black uppercase leading-none"
          style={{ color: data.colorMainTitle }}
        >
          {data.mainTitle || "MINIMAL EDITION"}
        </h1>
        <p
          className="mt-3 font-mono text-xs uppercase tracking-widest"
          style={{ color: data.colorText }}
        >
          {body || "Mô tả ngắn gọn tạo điểm nhấn thị giác"}
        </p>
        <div className="mt-5">
          <span
            className="inline-block px-4 py-2 border-2 border-ink bg-volt font-mono text-xs font-bold uppercase text-ink"
          >
            {cta}
          </span>
        </div>
      </div>

      <div className="mt-5 w-48 aspect-[4/3] bg-paper border-2 border-ink shadow-hard overflow-hidden">
        {data.linkUrl ? (
          <img
            src={data.linkUrl}
            alt={data.mainTitle || "Aurelia Collection"}
            className="w-full h-full object-cover grayscale"
          />
        ) : (
          <PreviewImageFallback />
        )}
      </div>
    </main>
  );
};

export const StoryA = ({ data }: { data: BannerPreviewData }) => {
  const body = resolveBodyText(data);

  return (
    <section className="relative w-full min-h-[440px] flex items-center overflow-hidden bg-ink">
      <div className="absolute inset-0 w-full h-full">
        {data.linkUrl ? (
          <img
            alt={data.mainTitle || "Story banner"}
            className="w-full h-full object-cover opacity-50"
            src={data.linkUrl}
          />
        ) : (
          <div className="stage-grid-dark w-full h-full" />
        )}
      </div>

      <div className="relative z-10 container mx-auto px-8 py-10">
        <div className="max-w-2xl bg-ink/85 border-2 border-paper p-7">
          <div className="w-12 h-1 bg-flash mb-4" />
          <p
            className="font-display-safe text-3xl md:text-5xl font-black uppercase leading-tight mb-3"
            style={{ color: data.colorMainTitle || undefined }}
          >
            {data.mainTitle || "HẬU TRƯỜNG XƯỞNG DIỄN"}
          </p>
          <div className="space-y-2">
            <h1 className="text-volt font-mono text-sm font-bold tracking-widest uppercase">
              {data.h1 || "BACKSTAGE REEL"}
            </h1>
            <p
              className="font-sans text-sm leading-relaxed max-w-md"
              style={{ color: data.colorText || undefined }}
            >
              {body || "Câu chuyện hậu trường trước giờ trình diễn."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const StoryB = ({ data }: { data: BannerPreviewData }) => {
  const body = resolveBodyText(data);

  return (
    <section className="w-full flex flex-col md:flex-row min-h-[440px] bg-ink overflow-hidden">
      <div className="w-full md:w-[45%] flex flex-col justify-center p-8 bg-ink border-b-2 md:border-b-0 md:border-r-2 border-paper relative">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs font-bold uppercase text-volt tracking-widest">
            {data.mainTitle || "BACKSTAGE STORY"}
          </span>

          <h1 className="text-paper font-display-safe text-2xl md:text-4xl font-black uppercase leading-tight">
            {data.h1 || "GÓC PHÒNG THỬ ĐỒ"}
          </h1>

          <p className="text-paper/80 font-sans text-sm leading-relaxed max-w-sm">
            {body || "Mô tả câu chuyện sáng tác sẽ hiện ở đây."}
          </p>

          <div className="mt-3">
            <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-paper px-4 py-2 border-2 border-paper">
              <span>Khám phá thêm</span>
              <ArrowBigLeft className="w-4 h-4 transform rotate-180" />
            </span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-[55%] relative min-h-[280px] bg-bone">
        {data.linkUrl ? (
          <img
            src={data.linkUrl}
            alt={data.mainTitle || "Story"}
            className="w-full h-full object-cover"
          />
        ) : (
          <PreviewImageFallback />
        )}
      </div>
    </section>
  );
};

export const StoryC = ({ data }: { data: BannerPreviewData }) => {
  const body = resolveBodyText(data);

  return (
    <section className="relative w-full min-h-[440px] flex items-end overflow-hidden bg-ink">
      <div className="absolute inset-0 w-full h-full">
        {data.linkUrl ? (
          <img
            alt={data.mainTitle || "Story banner"}
            className="w-full h-full object-cover opacity-70"
            src={data.linkUrl}
          />
        ) : (
          <div className="stage-grid-dark w-full h-full" />
        )}
      </div>

      <div className="relative z-10 w-full p-8">
        <div className="max-w-xl bg-ink/90 border-2 border-paper p-6">
          <h1 className="text-volt font-mono text-xs font-bold mb-2 tracking-widest uppercase">
            {data.h1 || "CAM-01 // HẬU TRƯỜNG"}
          </h1>
          <p className="font-display-safe text-2xl md:text-4xl text-paper font-black uppercase leading-tight mb-2">
            {data.mainTitle || "TIÊU ĐỀ REEL"}
          </p>
          <p className="text-paper/85 font-sans text-sm leading-relaxed">
            {body || "Thông điệp đồng hành cùng bộ sưu tập."}
          </p>
        </div>
      </div>
    </section>
  );
};

export const StoryD = ({ data }: { data: BannerPreviewData }) => {
  const body = resolveBodyText(data);

  return (
    <section className="relative w-full min-h-[440px] flex items-center justify-center overflow-hidden bg-ink p-8">
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 border-2 border-paper bg-bone text-ink shadow-hard-volt overflow-hidden">
        <div className="aspect-[4/3] sm:aspect-auto bg-ink">
          {data.linkUrl ? (
            <img
              src={data.linkUrl}
              alt={data.mainTitle || "Story collage"}
              className="w-full h-full object-cover"
            />
          ) : (
            <PreviewImageFallback />
          )}
        </div>
        <div className="p-6 flex flex-col justify-between">
          <div>
            <span className="inline-block border border-ink bg-volt px-2 py-0.5 mono-label text-[10px] font-bold">
              {data.h1 || "ATELIER DOSSIER"}
            </span>
            <h2 className="mt-3 font-display-safe text-2xl font-black uppercase text-ink">
              {data.mainTitle || "KHUNG HÌNH ĐỘC QUYỀN"}
            </h2>
            {data.h2 && (
              <p className="mt-1 mono-label text-xs font-bold text-flash">
                {data.h2}
              </p>
            )}
          </div>
          <p className="mt-4 font-sans text-xs text-ink-muted leading-relaxed">
            {body || "Nội dung câu chuyện trình diễn thời trang."}
          </p>
        </div>
      </div>
    </section>
  );
};

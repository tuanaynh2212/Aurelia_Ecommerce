import { lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { cn } from "../../utils/cn";

const MerchViewer3D = lazy(() =>
  import("../UI/three/MerchViewer3D").then((m) => ({
    default: m.MerchViewer3D,
  }))
);

interface ProductGalleryProps {
  productId: string;
  productName: string;
  images: string[];
  activeImageIndex: number;
  is3DMode: boolean;
  discountValue: number;
  onSelectImage: (index: number) => void;
  onToggle3D: (enabled: boolean) => void;
}

export function ProductGallery({
  productId,
  productName,
  images,
  activeImageIndex,
  is3DMode,
  discountValue,
  onSelectImage,
  onToggle3D,
}: ProductGalleryProps) {
  const currentImage = images[activeImageIndex] || images[0];

  const handlePrev = () => {
    onSelectImage(activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1);
  };

  const handleNext = () => {
    onSelectImage((activeImageIndex + 1) % images.length);
  };

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row lg:col-span-7">
      {images.length > 1 && (
        <div className="flex max-h-[640px] shrink-0 gap-2.5 overflow-x-auto pb-2 md:flex-col md:overflow-y-auto md:pb-0">
          {images.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSelectImage(idx);
                onToggle3D(false);
              }}
              className={cn(
                "h-20 w-16 shrink-0 overflow-hidden border-2 bg-paper cursor-pointer rounded-[2px]",
                activeImageIndex === idx && !is3DMode
                  ? "border-ink ring-2 ring-volt shadow-hard-sm"
                  : "border-ink/40 opacity-75 hover:opacity-100 hover:border-ink"
              )}
            >
              <img
                src={src}
                alt={`${productName} thumb ${idx + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative aspect-[3/4] flex-1 overflow-hidden border-[3px] border-ink bg-paper shadow-hard-lg rounded-[2px]">
        {is3DMode ? (
          <Suspense fallback={<div className="h-full w-full skeleton-fog" />}>
            <MerchViewer3D
              imageUrl={currentImage}
              productName={productName}
              sku={productId}
              className="h-full w-full"
            />
          </Suspense>
        ) : (
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={currentImage}
              alt={productName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="h-full w-full object-cover"
              loading="eager"
            />
          </AnimatePresence>
        )}

        <div className="absolute right-3 top-3 z-20 inline-flex border-2 border-ink bg-paper shadow-hard-sm rounded-[2px]">
          <button
            type="button"
            onClick={() => onToggle3D(false)}
            className={cn(
              "inline-flex min-h-[40px] items-center gap-1.5 px-3 mono-label text-[11px] font-extrabold cursor-pointer",
              !is3DMode ? "bg-volt text-ink" : "bg-paper text-ink-muted hover:text-ink"
            )}
          >
            <ImageIcon size={14} strokeWidth={2.5} />
            <span>2D</span>
          </button>
          <button
            type="button"
            onClick={() => onToggle3D(true)}
            className={cn(
              "inline-flex min-h-[40px] items-center gap-1.5 border-l-2 border-ink px-3 mono-label text-[11px] font-extrabold cursor-pointer",
              is3DMode ? "bg-volt text-ink" : "bg-paper text-ink-muted hover:text-ink"
            )}
          >
            <Box size={14} strokeWidth={2.5} />
            <span>3D</span>
          </button>
        </div>

        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {discountValue > 0 && (
            <span className="border-2 border-ink bg-volt px-2.5 py-1 mono-label text-xs font-extrabold text-ink shadow-hard-sm">
              -{discountValue}% GIẢM
            </span>
          )}
        </div>

        {images.length > 1 && !is3DMode && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Hình trước"
              className="press-collapse absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border-2 border-ink bg-paper text-ink shadow-hard-sm hover:bg-volt cursor-pointer rounded-[2px]"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Hình kế tiếp"
              className="press-collapse absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border-2 border-ink bg-paper text-ink shadow-hard-sm hover:bg-volt cursor-pointer rounded-[2px]"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}


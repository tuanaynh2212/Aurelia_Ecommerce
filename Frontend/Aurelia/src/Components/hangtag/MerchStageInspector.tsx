import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ScanLine } from "lucide-react";
import type { Product } from "../../types/type";
import { cn } from "../../utils/cn";
import { formatVND } from "../../utils/formatters";
import {
  getAvailableSizes,
  getPrimaryProductImage,
  getProductColors,
  getSalePrice,
  getSku,
} from "../../utils/productHelpers";
import { swatchHex } from "../UI/three/palette";
import { Button } from "../UI/primitives/Button";

export interface MerchStageInspectorProps {
  product: Product;
  activeIndex: number;
  totalCount: number;
}

export function MerchStageInspector({
  product,
  activeIndex,
  totalCount,
}: MerchStageInspectorProps) {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [photoIdx, setPhotoIdx] = useState(0);

  const primaryImg = getPrimaryProductImage(product);
  const gallery =
    product.images && product.images.length > 0
      ? product.images
      : primaryImg
      ? [primaryImg]
      : [];
  const sizes = getAvailableSizes(product);
  const colors = getProductColors(product);
  const salePrice = getSalePrice(product);
  const sku = getSku(product);
  const isSoldOut = (product.stock ?? 0) <= 0;

  useEffect(() => {
    setPhotoIdx(0);
    setSelectedColor(colors[0] ?? "");
    const firstAvail = sizes.find((s) => s.qty > 0)?.size ?? sizes[0]?.size ?? "";
    setSelectedSize(firstAvail);
    // Reset local inspection selections cleanly whenever the 3D selected product changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const activePhoto = gallery[Math.min(photoIdx, Math.max(0, gallery.length - 1))] ?? primaryImg;

  return (
    <div className="flex h-full flex-col justify-between border-[3px] border-ink bg-paper shadow-hard-lg rounded-[2px] overflow-hidden">
      {/* Header status strip */}
      <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-4 py-2.5 mono-label text-[10px] font-extrabold text-paper">
        <span className="text-volt">
          SELECTED STAGE SLOT // #{String(activeIndex + 1).padStart(2, "0")}
        </span>
        <span>
          {String(activeIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
        </span>
      </div>

      {/* Main inspector content */}
      <div className="flex flex-1 flex-col justify-between p-4 md:p-5">
        <div>
          {/* Photo preview & angle selector */}
          <div className="flex gap-3">
            <div className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden border-2 border-ink bg-bone sm:w-32">
              {activePhoto ? (
                <img
                  src={activePhoto}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="studio-grid-bg h-full w-full" />
              )}
              {product.discountValue > 0 && (
                <span className="absolute left-1.5 top-1.5 border border-ink bg-volt px-1.5 py-0.5 mono-label text-[9px] font-extrabold text-ink">
                  -{product.discountValue}%
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="border border-ink bg-bone px-1.5 py-0.5 mono-label text-[9px] font-bold text-ink">
                  {product.brand || "AURELIA"}
                </span>
                <span className="mono-label text-[9px] font-bold text-ink-muted">
                  {sku}
                </span>
              </div>

              <h3 className="mt-1.5 line-clamp-2 font-display text-lg font-black uppercase leading-snug text-ink diacritic-safe">
                {product.name}
              </h3>

              <div className="mt-2 flex flex-wrap items-baseline gap-2 font-mono tabular">
                <span className="text-xl font-black text-ink">
                  {formatVND(salePrice ?? product.price)}
                </span>
                {salePrice && (
                  <span className="text-xs text-ink-muted line-through">
                    {formatVND(product.price)}
                  </span>
                )}
              </div>

              <p className="mt-1.5 mono-label text-[10px] font-bold text-ink-muted">
                CHẤT LIỆU: <span className="text-ink">{product.material || "STUDIO"}</span>
                {" · "}
                <span className={isSoldOut ? "text-danger" : "text-success"}>
                  {isSoldOut ? "HẾT HÀNG" : `CÒN ${product.stock} SP`}
                </span>
              </p>

              {/* Multi-angle thumbnails */}
              {gallery.length > 1 && (
                <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5">
                  {gallery.slice(0, 4).map((url, idx) => (
                    <button
                      key={`${url}-${idx}`}
                      type="button"
                      onClick={() => setPhotoIdx(idx)}
                      aria-label={`Ảnh góc ${idx + 1}`}
                      className={cn(
                        "h-10 w-9 shrink-0 overflow-hidden border-2 cursor-pointer transition-transform",
                        photoIdx === idx
                          ? "border-ink ring-2 ring-volt -translate-y-0.5"
                          : "border-ink/35 opacity-75 hover:opacity-100"
                      )}
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Color & Size Selectors */}
          <div className="mt-4 space-y-3 border-y-2 border-dashed border-ink py-3">
            {colors.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="mono-label text-[10px] font-extrabold text-ink-muted">
                  MÀU CHỌN: <span className="text-ink">{selectedColor || colors[0]}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {colors.slice(0, 6).map((col) => {
                    const active = (selectedColor || colors[0]) === col;
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        aria-label={`Chọn màu ${col}`}
                        aria-pressed={active}
                        className={cn(
                          "h-5 w-5 border-2 border-ink cursor-pointer transition-transform",
                          active ? "ring-2 ring-volt scale-110" : "opacity-80 hover:opacity-100"
                        )}
                        style={{ backgroundColor: swatchHex(col) }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <p className="mono-label text-[10px] font-extrabold text-ink-muted">
                CHỌN KÍCH CỠ: <span className="text-ink">{selectedSize || "FREE"}</span>
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {sizes.length > 0 ? (
                  sizes.map((s) => {
                    const unavailable = s.qty <= 0;
                    const active = selectedSize === s.size;
                    return (
                      <button
                        key={s.size}
                        type="button"
                        disabled={unavailable}
                        onClick={() => setSelectedSize(s.size)}
                        aria-pressed={active}
                        className={cn(
                          "min-w-[40px] border-2 border-ink px-2.5 py-1 font-mono text-[11px] font-extrabold cursor-pointer transition-colors rounded-[2px]",
                          unavailable && "strike-diagonal cursor-not-allowed bg-fog text-ink-muted opacity-60",
                          active && !unavailable && "bg-volt text-ink shadow-hard-sm",
                          !active && !unavailable && "bg-bone text-ink hover:bg-paper"
                        )}
                      >
                        {s.size}
                      </button>
                    );
                  })
                ) : (
                  <span className="border-2 border-ink bg-volt px-2.5 py-1 font-mono text-[11px] font-extrabold text-ink">
                    FREE SIZE
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-2.5">
          <Button
            variant="accent"
            size="md"
            block
            onClick={() => navigate(`/Fashion/Products/${product.id}`)}
            iconRight={<ArrowUpRight size={16} strokeWidth={2.5} />}
          >
            Xem chi tiết &amp; Mua ngay
          </Button>
          <Button
            variant="secondary"
            size="sm"
            block
            onClick={() => navigate("/bodyMeasurements")}
            iconLeft={<ScanLine size={15} strokeWidth={2.5} />}
          >
            Ướm thử với Soundcheck AI
          </Button>
        </div>
      </div>
    </div>
  );
}


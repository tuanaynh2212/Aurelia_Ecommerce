import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, RefreshCw, ScanLine } from "lucide-react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { cn } from "../../utils/cn";
import { formatVND } from "../../utils/formatters";
import type { Product } from "../../types/type";
import { filterRealProducts } from "../../utils/productFilters";
import {
  getAvailableSizeNames,
  getPrimaryProductImage,
  getProductColors,
  getSalePrice,
} from "../../utils/productHelpers";
import { SectionTitle } from "../UI/primitives/SectionTitle";
import { Receipt, ReceiptRow } from "../UI/primitives/Receipt";
import { Button } from "../UI/primitives/Button";
import { swatchHex } from "../UI/three/palette";

function pickCuratedCapsule(products: Product[], setIndex: number): Product[] {
  const pool = filterRealProducts(products);
  if (pool.length === 0) return [];

  const sorted = [...pool].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
  const byType = new Map<string, Product[]>();
  sorted.forEach((p) => {
    const key = (p.type || p.subcategory || "OTHER").toUpperCase();
    const list = byType.get(key) ?? [];
    list.push(p);
    byType.set(key, list);
  });

  const interleaved: Product[] = [];
  const buckets = Array.from(byType.values());
  const maxLen = Math.max(...buckets.map((b) => b.length));
  for (let round = 0; round < maxLen; round += 1) {
    for (const bucket of buckets) {
      if (bucket[round]) interleaved.push(bucket[round]);
    }
  }

  const size = Math.min(4, interleaved.length);
  const start = (setIndex * 2) % interleaved.length;
  const picked: Product[] = [];
  for (let i = 0; i < size; i += 1) {
    picked.push(interleaved[(start + i) % interleaved.length]);
  }
  return picked;
}

export function LookOfTheWeek() {
  const navigate = useNavigate();
  const { dataProduct } = useContext(FilterProductContext);
  const [setIndex, setSetIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const lookProducts = useMemo<Product[]>(
    () => pickCuratedCapsule(dataProduct || [], setIndex),
    [dataProduct, setIndex]
  );

  if (lookProducts.length === 0) return null;

  const safeActiveIdx = Math.min(activeIndex, lookProducts.length - 1);
  const activeProduct = lookProducts[safeActiveIdx];
  const activeImage = getPrimaryProductImage(activeProduct);
  const activeSalePrice = getSalePrice(activeProduct);
  const colors = getProductColors(activeProduct);
  const availableSizes = getAvailableSizeNames(activeProduct);

  const totalSetPrice = lookProducts.reduce(
    (sum, p) => sum + (getSalePrice(p) ?? p.price),
    0
  );

  const handleCycleSet = () => {
    setSetIndex((prev) => prev + 1);
    setActiveIndex(0);
  };

  return (
    <section
      aria-label="Phối đồ trọng điểm"
      className="border-b-[3px] border-ink bg-bone py-14 md:py-20"
    >
      <div className="container-atelier">
        <SectionTitle
          index="06"
          eyebrow="HEADLINER LOOKBOOK // STAGE WARDROBE"
          title="PHỐI ĐỒ TRỌNG ĐIỂM"
          subtitle="Chọn từng món trên bảng phối sân khấu để đối chiếu chất liệu, phom dáng và tổng giá trị set diễn."
          action={
            <Button
              variant="secondary"
              onClick={handleCycleSet}
              iconRight={<RefreshCw size={15} strokeWidth={2.5} />}
            >
              Đổi set diễn
            </Button>
          }
        />

        <div className="mt-8 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <div className="flex flex-col border-[3px] border-ink bg-paper shadow-hard-lg lg:col-span-7 rounded-[2px] overflow-hidden">
            <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-4 py-2.5 mono-label text-[10px] font-bold text-paper">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-flash animate-rec" aria-hidden="true" />
                STAGE CAM-A // CAPSULE #{String(setIndex + 1).padStart(2, "0")}
              </span>
              <span className="text-volt">
                PIECE {String(safeActiveIdx + 1).padStart(2, "0")} / {String(lookProducts.length).padStart(2, "0")}
              </span>
            </div>

            <div className="grid flex-1 grid-cols-1 md:grid-cols-12">
              <div className="relative min-h-[340px] md:col-span-8 md:min-h-[440px] overflow-hidden bg-bone">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProduct.id}
                    initial={{ opacity: 0.35, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.35 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    {activeImage ? (
                      <img
                        src={activeImage}
                        alt={activeProduct.name}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="studio-grid-bg flex h-full w-full items-center justify-center">
                        <span className="mono-label text-xs font-bold text-ink-muted">
                          NO PREVIEW
                        </span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-ink" />
                <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-ink" />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-16 left-3 h-4 w-4 border-b-2 border-l-2 border-ink" />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-16 right-3 h-4 w-4 border-b-2 border-r-2 border-ink" />

                <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-wrap items-end justify-between gap-2">
                  <div className="border-2 border-ink bg-paper px-3 py-1.5 shadow-hard-sm">
                    <p className="mono-label text-[9px] font-bold text-ink-muted">
                      {activeProduct.brand || "AURELIA"} // {activeProduct.type}
                    </p>
                    <p className="max-w-[230px] truncate font-sans text-xs font-extrabold text-ink">
                      {activeProduct.name}
                    </p>
                  </div>

                  <div className="border-2 border-ink bg-volt px-3 py-1.5 font-mono text-xs font-black tabular text-ink shadow-hard-sm">
                    {formatVND(activeSalePrice ?? activeProduct.price)}
                  </div>
                </div>
              </div>

              <div
                role="listbox"
                aria-label="Danh sách món trong set phối đồ"
                className="grid grid-cols-2 gap-[2px] border-t-2 border-ink bg-ink md:col-span-4 md:grid-cols-1 md:auto-rows-fr md:border-l-2 md:border-t-0"
              >
                {lookProducts.map((item, idx) => {
                  const thumb = getPrimaryProductImage(item);
                  const isCurrent = idx === safeActiveIdx;
                  const price = getSalePrice(item) ?? item.price;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={isCurrent}
                      onClick={() => setActiveIndex(idx)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        "flex min-h-[76px] items-center gap-3 p-3 text-left transition-colors cursor-pointer",
                        isCurrent ? "bg-volt text-ink" : "bg-paper text-ink hover:bg-bone"
                      )}
                    >
                      <div className="relative h-14 w-12 shrink-0 overflow-hidden border-2 border-ink bg-bone">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : null}
                        <span className="absolute left-0 top-0 bg-ink px-1 font-mono text-[9px] font-bold text-paper">
                          0{idx + 1}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="mono-label text-[9px] font-bold text-ink-muted truncate">
                          {item.brand || "AURELIA"}
                        </p>
                        <p className="line-clamp-2 font-sans text-xs font-bold leading-snug text-ink">
                          {item.name}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] font-extrabold tabular text-ink">
                          {formatVND(price)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            <div className="border-[3px] border-ink bg-paper p-5 shadow-hard rounded-[2px]">
              <div className="flex items-center justify-between gap-2 border-b-2 border-dashed border-ink pb-3">
                <span className="border-2 border-ink bg-volt px-2 py-0.5 mono-label text-[10px] font-extrabold text-ink">
                  SPECIMEN #0{safeActiveIdx + 1}
                </span>
                <span className="mono-label text-[10px] font-bold text-ink-muted">
                  {activeProduct.brand || "AURELIA"} // {activeProduct.origin || "STUDIO"}
                </span>
              </div>

              <h3 className="mt-3 font-display text-xl font-black uppercase tracking-tight text-ink diacritic-safe">
                {activeProduct.name}
              </h3>

              <div className="mt-2 flex items-baseline gap-2.5 font-mono tabular">
                <span className="text-xl font-black text-ink">
                  {formatVND(activeSalePrice ?? activeProduct.price)}
                </span>
                {activeSalePrice && (
                  <span className="text-xs text-ink-muted line-through">
                    {formatVND(activeProduct.price)}
                  </span>
                )}
                {activeProduct.discountValue > 0 && (
                  <span className="border border-ink bg-volt px-1.5 py-0.5 text-[10px] font-extrabold text-ink">
                    -{activeProduct.discountValue}%
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-y-2 border-dashed border-ink py-3 text-xs">
                <div>
                  <p className="mono-label text-[9px] font-bold text-ink-muted">CHẤT LIỆU</p>
                  <p className="mt-0.5 font-semibold text-ink">
                    {activeProduct.material || "Chưa cập nhật"}
                  </p>
                </div>
                <div>
                  <p className="mono-label text-[9px] font-bold text-ink-muted">KHO HIỆN TẠI</p>
                  <p className="mt-0.5 font-mono font-bold tabular text-ink">
                    {activeProduct.stock > 0 ? `CÒN ${activeProduct.stock} SP` : "HẾT HÀNG"}
                  </p>
                </div>
                <div>
                  <p className="mono-label text-[9px] font-bold text-ink-muted">SIZE SẴN CÓ</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {availableSizes.length > 0 ? (
                      availableSizes.slice(0, 5).map((sz) => (
                        <span
                          key={sz}
                          className="border border-ink bg-bone px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink"
                        >
                          {sz}
                        </span>
                      ))
                    ) : (
                      <span className="font-mono text-[10px] text-ink-muted">FREE</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="mono-label text-[9px] font-bold text-ink-muted">BẢNG MÀU</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    {colors.length > 0 ? (
                      colors.slice(0, 5).map((col) => (
                        <span
                          key={col}
                          title={col}
                          className="h-4 w-4 border-2 border-ink"
                          style={{ backgroundColor: swatchHex(col) }}
                        />
                      ))
                    ) : (
                      <span className="font-mono text-[10px] text-ink-muted">TIÊU CHUẨN</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <Button
                  variant="primary"
                  block
                  onClick={() => navigate(`/Fashion/Products/${activeProduct.id}`)}
                  iconRight={<ArrowUpRight size={15} strokeWidth={2.5} />}
                >
                  Xem sản phẩm
                </Button>
                <Button
                  variant="secondary"
                  block
                  onClick={() => navigate("/bodyMeasurements")}
                  iconRight={<ScanLine size={15} strokeWidth={2.5} />}
                >
                  Thử size AI
                </Button>
              </div>
            </div>

            <Receipt
              code={`[SETLIST // 0${setIndex + 1}]`}
              title="STAGE WARDROBE MANIFEST"
              totalLabel={`TỔNG SET (${lookProducts.length} MÓN)`}
              totalValue={formatVND(totalSetPrice)}
              totalKey={`${setIndex}-${totalSetPrice}`}
            >
              {lookProducts.map((p, idx) => {
                const price = getSalePrice(p) ?? p.price;
                const isSelected = idx === safeActiveIdx;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className="block w-full text-left cursor-pointer hover:bg-bone transition-colors"
                  >
                    <ReceiptRow
                      tone={isSelected ? "volt" : "default"}
                      bold={isSelected}
                      label={
                        <span className="inline-block max-w-[175px] sm:max-w-[205px] truncate align-bottom">
                          0{idx + 1}. {p.name}
                        </span>
                      }
                      value={formatVND(price)}
                    />
                  </button>
                );
              })}
            </Receipt>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LookOfTheWeek;

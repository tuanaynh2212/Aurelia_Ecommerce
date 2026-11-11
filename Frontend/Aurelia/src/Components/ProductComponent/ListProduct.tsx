import { useContext, useState, useMemo } from "react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { ProductGrid } from "../product/ProductGrid";
import { Container } from "../layout/Container";
import { ArrowDown } from "lucide-react";
import { DanhMuc } from "../HomeLayoutComponent/DanhMucSanPham";
import { AccordionItem } from "../UI/primitives/Overlays";
import { Checkbox } from "../UI/primitives/Controls";
import { Sticker } from "../UI/primitives/Sticker";
import { Select } from "../UI/primitives/Input";
import { Button } from "../UI/primitives/Button";
import { swatchHex } from "../UI/three/palette";
import { sizeTileClass } from "../UI/primitives/recipes";
import { filterRealProducts } from "../../utils/productFilters";

const CATALOG_SWATCHES = ["Đen", "Trắng", "Be", "Xanh navy", "Nâu", "Đỏ"];
const CATALOG_SIZES = ["XS", "S", "M", "L", "XL"];

export const ListProduct = () => {
  const { key, setKey, dataProduct, isLoading } = useContext(FilterProductContext);
  const [displayCount, setDisplayCount] = useState(16);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "sold">("default");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(0);

  const filteredProducts = useMemo(() => {
    const baseProducts = filterRealProducts(dataProduct);
    if (!baseProducts.length) return [];
    let list = !key
      ? [...baseProducts]
      : baseProducts.filter(
          (p) =>
            p.type?.toLowerCase() === key.toLowerCase() ||
            p.subcategory?.toLowerCase() === key.toLowerCase()
        );

    if (selectedColor) {
      list = list.filter((p) =>
        p.variants?.some((v) => v.color?.toLowerCase() === selectedColor.toLowerCase())
      );
    }

    if (selectedSize) {
      list = list.filter((p) =>
        p.variants?.some((v) =>
          v.sizes?.some((s) => s.size === selectedSize && s.quantity > 0)
        )
      );
    }

    if (maxPrice > 0) {
      list = list.filter((p) => p.price <= maxPrice);
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "sold") {
      list.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
    }

    return list;
  }, [dataProduct, key, selectedColor, selectedSize, maxPrice, sortBy]);

  const visibleProducts = filteredProducts.slice(0, displayCount);

  return (
    <section className="py-8">
      <Container>
        {/* Toolbar with tabular count, removable active-filter stickers, and 48px sort select */}
        <div className="mb-6 flex flex-col gap-3 border-2 border-ink bg-paper p-4 shadow-hard sm:flex-row sm:items-center sm:justify-between rounded-[2px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono-label text-xs font-extrabold tabular text-ink">
              Hiển thị {visibleProducts.length} / {filteredProducts.length} sản phẩm
            </span>
            {key && (
              <Sticker tone="volt" onRemove={() => setKey("")}>
                DANH MỤC: {key}
              </Sticker>
            )}
            {selectedColor && (
              <Sticker tone="volt" onRemove={() => setSelectedColor("")}>
                MÀU: {selectedColor}
              </Sticker>
            )}
            {selectedSize && (
              <Sticker tone="volt" onRemove={() => setSelectedSize("")}>
                SIZE: {selectedSize}
              </Sticker>
            )}
          </div>

          <div className="w-full sm:w-56">
            <Select
              aria-label="Sắp xếp sản phẩm"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "default" | "price-asc" | "price-desc" | "sold"
                )
              }
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="sold">Bán chạy nhất</option>
              <option value="price-asc">Giá: Thấp → Cao</option>
              <option value="price-desc">Giá: Cao → Thấp</option>
            </Select>
          </div>
        </div>

        {/* 12-col layout: Desktop sticky 3-col Filter accordion sheet + 9-col MerchTag grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside
            aria-label="Bộ lọc chi tiết"
            className="hidden lg:block lg:col-span-3"
          >
            <div className="sticky top-20 border-2 border-ink bg-paper p-4 shadow-hard rounded-[2px]">
              <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                <span className="mono-label text-xs font-extrabold text-ink">
                  [FILTER MATRIX]
                </span>
                {(key || selectedColor || selectedSize || maxPrice > 0) && (
                  <button
                    type="button"
                    onClick={() => {
                      setKey("");
                      setSelectedColor("");
                      setSelectedSize("");
                      setMaxPrice(0);
                    }}
                    className="mono-label text-[10px] font-bold text-flash hover:underline cursor-pointer"
                  >
                    XOÁ TẤT CẢ
                  </button>
                )}
              </div>

              <AccordionItem code="01" title="Phân Loại" defaultOpen>
                <div className="flex flex-col">
                  <Checkbox
                    checked={key === ""}
                    onChange={() => setKey("")}
                    label="Tất cả"
                  />
                  {DanhMuc.map((d) => (
                    <Checkbox
                      key={d.type}
                      checked={key === d.type}
                      onChange={() => setKey(key === d.type ? "" : d.type)}
                      label={d.name}
                    />
                  ))}
                </div>
              </AccordionItem>

              <AccordionItem code="02" title="Kích Cỡ" defaultOpen>
                <div className="flex flex-wrap gap-2 pt-1">
                  {CATALOG_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() =>
                        setSelectedSize(selectedSize === sz ? "" : sz)
                      }
                      className={sizeTileClass(selectedSize === sz, false)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </AccordionItem>

              <AccordionItem code="03" title="Màu Sắc" defaultOpen>
                <div className="flex flex-wrap gap-3 pt-1">
                  {CATALOG_SWATCHES.map((c) => {
                    const active = selectedColor === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        title={c}
                        aria-label={`Màu ${c}`}
                        aria-pressed={active}
                        onClick={() =>
                          setSelectedColor(active ? "" : c)
                        }
                        className={`hit-area-expand h-7 w-7 rounded-full border-2 border-ink cursor-pointer ${
                          active ? "ring-2 ring-volt ring-offset-2" : ""
                        }`}
                        style={{ backgroundColor: swatchHex(c) }}
                      />
                    );
                  })}
                </div>
              </AccordionItem>

              <AccordionItem code="04" title="Trần Giá (VND)">
                <div className="space-y-2 pt-1">
                  <input
                    type="number"
                    min={0}
                    step={100000}
                    value={maxPrice || ""}
                    onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
                    placeholder="Không giới hạn"
                    className="block min-h-[44px] w-full border-2 border-ink bg-paper px-3 font-mono text-xs tabular text-ink"
                  />
                </div>
              </AccordionItem>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <ProductGrid
              products={visibleProducts}
              isLoading={isLoading}
              columns={3}
            />

            {displayCount < filteredProducts.length && (
              <div className="mt-12 flex justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setDisplayCount((prev) => prev + 12)}
                  iconRight={<ArrowDown size={16} strokeWidth={2.5} />}
                >
                  Xem thêm sản phẩm
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ListProduct;

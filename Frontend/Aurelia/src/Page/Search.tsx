import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { useContext, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { filterRealProducts } from "../utils/productFilters";
import { Search as SearchIcon, X } from "lucide-react";
import { FilterProductContext } from "../contexts/FIlterProduct";
import { Container } from "../Components/layout/Container";
import { ProductGrid } from "../Components/product/ProductGrid";
import { DynamicMetaTags } from "../Components/SEO/DynamicMetaTags";
import { Breadcrumb } from "../Components/UI/primitives/Overlays";
import { Button } from "../Components/UI/primitives/Button";
import { Sticker } from "../Components/UI/primitives/Sticker";

export const Search = () => {
  const { key, setKey, dataFilter: rawFilter } = useContext(FilterProductContext);
  const dataFilter = useMemo(() => filterRealProducts(rawFilter), [rawFilter]);
  const [displayCount, setDisplayCount] = useState(16);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  };

  const clearSearch = () => {
    setKey("");
  };

  const quickKeywords = ["Váy", "Áo", "Trang Sức", "Đồng Hồ", "Phụ Kiện", "Lụa", "Cotton"];

  return (
    <>
      <DynamicMetaTags
        title={key ? `Tìm kiếm: "${key}" | Aurelia` : "Tìm Kiếm Sản Phẩm | Aurelia"}
        description="Tra cứu sản phẩm may mặc và phụ kiện thời trang tại Aurelia."
        url={window.location.href}
      />

      <div className="min-h-screen bg-bone text-ink flex flex-col">
        <Navbar />

        <main id="main-content" className="flex-1 pb-16">
          <div className="border-b-2 border-ink bg-paper py-8">
            <Container>
              <Breadcrumb
                items={[
                  { label: "HOME", to: "/" },
                  { label: "SEARCH" },
                ]}
              />
              <div className="mt-2 max-w-2xl">
                <span className="inline-block border-2 border-ink bg-volt px-2.5 py-0.5 mono-label text-[11px] font-extrabold text-ink">
                  [INDEX QUERY · LIVE SEARCH]
                </span>
                <div className="mt-2 flex flex-wrap items-baseline gap-3 overflow-hidden">
                  <h1 className="display-l font-display-safe text-ink">
                    Tìm Kiếm Sản Phẩm
                  </h1>
                  <span className="text-outline font-display text-3xl font-black tabular">
                    ({dataFilter?.length || 0})
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  Tra cứu theo tên mã, danh mục, kết cấu chất liệu hoặc gam màu
                </p>

                <div className="relative mt-5">
                  <input
                    type="search"
                    value={key}
                    onChange={onChange}
                    placeholder="Nhập tên sản phẩm, đầm, áo, phụ kiện..."
                    className="block min-h-[52px] w-full border-2 border-ink bg-paper pl-11 pr-12 font-mono text-sm text-ink shadow-hard rounded-[2px]"
                    autoFocus
                  />
                  <SearchIcon
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink"
                  />
                  {key && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      aria-label="Xoá tìm kiếm"
                      className="hit-area-expand absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center border border-ink bg-bone hover:bg-volt cursor-pointer"
                    >
                      <X size={15} strokeWidth={2.5} />
                    </button>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="mono-label text-[11px] font-bold text-ink-muted">
                    GỢI Ý:
                  </span>
                  {quickKeywords.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => setKey(kw)}
                      className="press-collapse min-h-[36px] border-2 border-ink bg-bone px-3 py-1 mono-label text-[11px] font-bold text-ink hover:bg-volt cursor-pointer rounded-[2px]"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            </Container>
          </div>

          <Container className="pt-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-3 mono-label text-xs font-extrabold text-ink">
              <span>
                {key ? `KẾT QUẢ CHO "${key}":` : "TOÀN BỘ DANH MỤC:"}{" "}
                <strong className="tabular">{dataFilter?.length || 0} SẢN PHẨM</strong>
              </span>
              {key && (
                <Sticker tone="volt" onRemove={clearSearch}>
                  {key}
                </Sticker>
              )}
            </div>

            <ProductGrid
              products={dataFilter?.slice(0, displayCount) || []}
              columns={4}
            />

            {dataFilter && displayCount < dataFilter.length && (
              <div className="mt-12 flex justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setDisplayCount((prev) => prev + 12)}
                >
                  Xem thêm kết quả
                </Button>
              </div>
            )}
          </Container>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Search;

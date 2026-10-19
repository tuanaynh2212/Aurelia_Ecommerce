import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { useContext, useState } from "react";
import type { ChangeEvent } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { FilterProductContext } from "../contexts/FIlterProduct";
import { Container } from "../Components/layout/Container";
import { ProductGrid } from "../Components/product/ProductGrid";
import { DynamicMetaTags } from "../Components/SEO/DynamicMetaTags";

export const Search = () => {
  const { key, setKey, dataFilter } = useContext(FilterProductContext);
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

      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] flex flex-col">
        <Navbar />

        <main id="main-content" className="flex-1 py-8 md:py-12">
          <Container>
            {/* Header & Search Bar */}
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                INDEX QUERY · LIVE SEARCH
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-ink)] tracking-tight">
                Tìm Kiếm Sản Phẩm
              </h1>
              <p className="text-xs font-mono text-[var(--color-ink-muted)]">
                Tra cứu theo tên mã, danh mục, kết cấu chất liệu hoặc gam màu
              </p>

              {/* Input */}
              <div className="relative mt-4">
                <input
                  type="search"
                  value={key}
                  onChange={onChange}
                  placeholder="Nhập tên sản phẩm, đầm, áo, phụ kiện..."
                  className="w-full py-3 pl-11 pr-10 text-sm font-mono bg-[var(--color-surface)]/60 border border-[var(--color-rule)] focus:border-[var(--color-ink)] focus:bg-[var(--color-bg)] rounded-none outline-none transition-colors"
                  autoFocus
                />
                <SearchIcon
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] pointer-events-none"
                />
                {key && (
                  <button
                    onClick={clearSearch}
                    aria-label="Xoá tìm kiếm"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Quick Keywords */}
              <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-ink-muted)] mr-1">
                  GỢI Ý:
                </span>
                {quickKeywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setKey(kw)}
                    className="text-[11px] px-2.5 py-1 rounded-none bg-[var(--color-surface)] border border-[var(--color-rule)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-ink)] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--color-rule)] text-xs font-mono text-[var(--color-ink-muted)] uppercase tracking-wider">
              <span>
                {key ? `KẾT QUẢ CHO "${key}":` : "TOÀN BỘ DANH MỤC:"}{" "}
                <strong className="text-[var(--color-ink)] tabular-nums">{dataFilter?.length || 0} SẢN PHẨM</strong>
              </span>
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={dataFilter?.slice(0, displayCount) || []}
              columns={4}
            />

            {/* Load more */}
            {dataFilter && displayCount < dataFilter.length && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setDisplayCount((prev) => prev + 12)}
                  className="btn btn-outline rounded-none font-mono text-xs uppercase tracking-wider"
                >
                  Xem thêm kết quả
                </button>
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

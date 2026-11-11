import { useContext, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { ProductTag, TagSkeleton } from "../hangtag/ProductTag";
import { SectionTitle } from "../UI/primitives/SectionTitle";
import { Button, IconButton } from "../UI/primitives/Button";
import type { Product } from "../../types/type";
import { filterRealProducts } from "../../utils/productFilters";

export function NewInScroller() {
  const navigate = useNavigate();
  const { dataProduct, isLoading } = useContext(FilterProductContext);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const newProducts = useMemo<Product[]>(() => {
    if (!dataProduct?.length) return [];
    return filterRealProducts(dataProduct)
      .sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      })
      .slice(0, 8);
  }, [dataProduct]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const showSkeletons = isLoading && newProducts.length === 0;

  return (
    <section
      aria-label="Hàng mới về"
      className="border-b-[3px] border-ink bg-paper py-14 md:py-20"
    >
      <div className="container-atelier">
        <SectionTitle
          index="07"
          eyebrow="ENCORE DROP // FRESH STAGE PRESSING"
          title="MỚI NHẬP KHO"
          count={newProducts.length}
          action={
            <div className="flex items-center gap-2">
              <span className="hidden border-2 border-ink bg-volt px-2.5 py-2 mono-label text-[10px] font-extrabold text-ink sm:inline-block">
                ENCORE DROP
              </span>
              <IconButton label="Cuộn trái" onClick={() => scroll("left")}>
                <ChevronLeft size={18} strokeWidth={2.5} />
              </IconButton>
              <IconButton label="Cuộn phải" onClick={() => scroll("right")}>
                <ChevronRight size={18} strokeWidth={2.5} />
              </IconButton>
              <Button
                variant="secondary"
                onClick={() => navigate("/Fashion/Products")}
                iconRight={<ArrowUpRight size={15} />}
              >
                Xem tất cả
              </Button>
            </div>
          }
        />

        <div ref={scrollerRef} className="snap-rail mt-6 gap-5 pb-4">
          {showSkeletons
            ? Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="w-[260px] shrink-0">
                  <TagSkeleton />
                </div>
              ))
            : newProducts.map((product, idx) => (
                <div key={product.id} className="w-[260px] sm:w-[280px] shrink-0">
                  <ProductTag product={product} index={idx} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

export default NewInScroller;

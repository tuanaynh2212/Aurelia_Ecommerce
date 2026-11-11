import { useContext, useMemo } from "react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { Breadcrumb } from "../UI/primitives/Overlays";
import { Sticker } from "../UI/primitives/Sticker";
import { filterRealProducts } from "../../utils/productFilters";

export const BannerTitle = () => {
  const { key, setKey, dataProduct } = useContext(FilterProductContext);
  const realCount = useMemo(
    () => filterRealProducts(dataProduct).length,
    [dataProduct]
  );

  return (
    <div className="w-full border-b-2 border-ink bg-bone py-8">
      <div className="container-atelier">
        <Breadcrumb
          items={[
            { label: "HOME", to: "/" },
            { label: "CATALOGUE" },
          ]}
        />

        <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-block border-2 border-ink bg-volt px-2.5 py-0.5 mono-label text-[11px] font-extrabold text-ink mb-2">
              [CATALOGUE INDEX · ALL INVENTORY]
            </div>
            <div className="flex flex-wrap items-baseline gap-3 overflow-hidden">
              <h1 className="display-xl font-display-safe text-ink">
                Danh Mục Sản Phẩm
              </h1>
              <span
                className="text-outline font-display text-3xl md:text-5xl font-black tabular select-none"
                aria-label={`Tổng số ${realCount}`}
              >
                ({realCount})
              </span>
            </div>
            <p className="mt-2 max-w-xl text-sm text-ink-muted">
              Sản phẩm may mặc và phụ kiện Aurelia. Chất liệu tự nhiên, cấu trúc đường may hoàn thiện và thông số kích thước minh bạch.
            </p>
          </div>

          {key && (
            <div className="self-start md:self-auto">
              <Sticker
                tone="volt"
                onRemove={() => setKey("")}
                removeLabel="Xóa bộ lọc"
              >
                LỌC: {key}
              </Sticker>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerTitle;

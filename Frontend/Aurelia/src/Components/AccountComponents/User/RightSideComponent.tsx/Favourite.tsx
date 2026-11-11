import React, { useContext } from "react";
import { AlertTriangle, Heart, RefreshCw } from "lucide-react";
import type { Product } from "../../../../types/type";
import { useNavigate } from "react-router-dom";
import { formatVND } from "../../../../utils/formatters";
import {
  getPrimaryProductImage,
  getProductColors,
  getSalePrice,
  getSku,
} from "../../../../utils/productHelpers";
import { MerchTag, MerchTagSkeleton } from "../../../UI";
import { FilterProductContext } from "../../../../contexts/FIlterProduct";

export const Favourite: React.FC<{
  dataFavouriteItemUser?: Product[];
}> = ({ dataFavouriteItemUser }) => {
  const navigate = useNavigate();
  const {
    dataFavouriteItemUser: contextFavourites,
    isFavouriteLoading,
    favouriteError,
    refreshFavourites,
    toggleFavourite,
  } = useContext(FilterProductContext);

  const rawItems = Array.isArray(dataFavouriteItemUser)
    ? dataFavouriteItemUser
    : contextFavourites;
  const safeItems = Array.isArray(rawItems)
    ? rawItems.filter((item): item is Product => Boolean(item && (item.id || item.name)))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-[var(--color-ink)] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-volt)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-ink)] shadow-[var(--shadow-hard-sm)]">
            <Heart size={18} className="text-[var(--color-flash)] fill-current" />
          </div>
          <div>
            <h1 className="font-display-safe text-lg font-extrabold uppercase text-[var(--color-ink)]">
              Sản Phẩm Yêu Thích
            </h1>
            <p className="mono-label text-[var(--color-ink-muted)]">
              Danh mục trang phục được lưu vào tủ đồ cá nhân
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refreshFavourites()}
            disabled={isFavouriteLoading}
            aria-label="Làm mới danh sách yêu thích"
            className="min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] hover:bg-[var(--color-bone)] mono-label text-[11px] font-bold text-[var(--color-ink)] cursor-pointer disabled:opacity-60"
          >
            <RefreshCw size={13} className={isFavouriteLoading ? "animate-spin" : ""} />
            Làm mới
          </button>
          <div className="mono-label text-[var(--color-ink-muted)]">
            Đã lưu:{" "}
            <strong className="bg-[var(--color-volt)] text-[var(--color-ink)] px-1.5 py-0.5 font-extrabold">
              {safeItems.length}
            </strong>{" "}
            sản phẩm
          </div>
        </div>
      </div>

      {isFavouriteLoading && safeItems.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map((idx) => (
            <MerchTagSkeleton key={idx} />
          ))}
        </div>
      ) : favouriteError && safeItems.length === 0 ? (
        <div className="bg-[var(--color-bone)] border-2 border-[var(--color-ink)] p-8 text-center shadow-[var(--shadow-hard-sm)]">
          <div className="w-12 h-12 mx-auto bg-[var(--color-paper)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-flash)] mb-3">
            <AlertTriangle size={20} />
          </div>
          <p className="font-display-safe font-extrabold uppercase text-sm text-[var(--color-ink)]">
            Không thể tải danh sách yêu thích
          </p>
          <p className="font-mono text-xs text-[var(--color-ink-muted)] mt-1">
            {favouriteError}
          </p>
          <button
            type="button"
            onClick={() => refreshFavourites()}
            className="mt-5 min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-flash)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] mono-label font-extrabold cursor-pointer"
          >
            <RefreshCw size={14} />
            Thử lại
          </button>
        </div>
      ) : safeItems.length === 0 ? (
        <div className="bg-[var(--color-bone)] border-2 border-dashed border-[var(--color-ink)] p-12 text-center">
          <div className="w-12 h-12 mx-auto bg-[var(--color-paper)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-ink)] mb-3">
            <Heart size={20} />
          </div>
          <p className="font-display-safe font-extrabold uppercase text-sm text-[var(--color-ink)]">
            Tủ đồ yêu thích đang trống
          </p>
          <p className="font-mono text-xs text-[var(--color-ink-muted)] mt-1">
            Lưu lại các thiết kế ưng ý trong quá trình duyệt bộ sưu tập để xem lại bất cứ lúc nào.
          </p>
          <button
            type="button"
            onClick={() => navigate("/Collection")}
            className="mt-5 min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-flash)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] mono-label font-extrabold cursor-pointer"
          >
            Khám phá trang phục mới
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {safeItems.map((p, i) => {
            const image = getPrimaryProductImage(p);
            const salePrice = getSalePrice(p);
            const discountVal = p.discountValue || 0;
            const hasDiscount = Boolean(salePrice && salePrice < p.price);
            const discountLabel = hasDiscount
              ? p.discountType === "percentage"
                ? `-${discountVal}%`
                : "SALE"
              : null;
            const detailRoute = `/Fashion/Products/${p.id}`;

            return (
              <MerchTag
                key={p.id || i}
                index={i}
                name={p.name || "Sản phẩm Aurelia"}
                image={image}
                to={detailRoute}
                onOpen={() => navigate(detailRoute)}
                eyebrow={`${p.brand || "ATELIER"}${p.type ? ` // ${p.type}` : ""}`}
                priceLabel={formatVND(salePrice ?? (p.price || 0))}
                originalPriceLabel={hasDiscount ? formatVND(p.price) : null}
                discountLabel={discountLabel}
                colors={getProductColors(p)}
                sku={getSku(p)}
                soldOut={(p.stock ?? 1) <= 0}
                isFavourite={true}
                onToggleFavourite={() => {
                  void toggleFavourite(p);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

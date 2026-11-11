import React from "react";
import { Package, MapPin, Store } from "lucide-react";
import type { Cart, order } from "../../types/type";

export type LeftSites = {
  data?: {
    shopName?: string;
    address?: string;
    data?: order;
  };
  onOpenMap?: () => void;
};

const LeftSite: React.FC<LeftSites> = ({ data, onOpenMap }) => {
  return (
    <div className="py-6 lg:py-12 bg-[var(--color-bone)] lg:max-h-screen lg:overflow-y-scroll">
      <div className="max-w-4xl mx-auto space-y-6 px-4">
        <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[var(--color-volt)] border-2 border-[var(--color-ink)]">
              <Package className="w-5 h-5 text-[var(--color-ink)]" />
            </div>
            <div>
              <span className="mono-label text-[var(--color-ink-muted)]">
                [LOGISTICS MANIFEST]
              </span>
              <h2 className="display-m font-display-safe text-[var(--color-ink)]">
                Thông Tin Đơn Hàng
              </h2>
            </div>
          </div>
          <p className="font-mono text-xs text-[var(--color-ink-muted)]">
            Thông tin chi tiết về đơn hàng
          </p>
        </div>

        <div className="space-y-4">
          {data?.data?.product?.map((item: Cart, index: number) => (
            <div
              key={item.itemid || index}
              className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] p-4"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-32 h-32 overflow-hidden bg-[var(--color-bone)] border-2 border-[var(--color-ink)]">
                  <img
                    src={item.thumnail}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1.5 right-1.5 bg-[var(--color-ink)] text-[var(--color-paper)] px-2 py-0.5 mono-label text-[10px]">
                    0{index + 1}
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="font-display-safe text-base font-extrabold uppercase text-[var(--color-ink)]">
                    {item.name}
                  </h3>

                  <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-2 bg-[var(--color-bone)] border border-[var(--color-ink)]">
                      <p className="mono-label text-[9px] text-[var(--color-ink-muted)]">
                        MÀU
                      </p>
                      <p className="font-extrabold text-[var(--color-ink)]">
                        {item.color}
                      </p>
                    </div>
                    <div className="p-2 bg-[var(--color-bone)] border border-[var(--color-ink)]">
                      <p className="mono-label text-[9px] text-[var(--color-ink-muted)]">
                        SIZE
                      </p>
                      <p className="font-extrabold text-[var(--color-ink)]">
                        {item.size}
                      </p>
                    </div>
                    <div className="p-2 bg-[var(--color-volt)] border border-[var(--color-ink)]">
                      <p className="mono-label text-[9px] text-[var(--color-ink)]">
                        SL
                      </p>
                      <p className="font-extrabold text-[var(--color-ink)]">
                        x{item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="border-t-2 border-dashed border-[var(--color-ink)] pt-2 flex flex-wrap justify-between gap-4 font-mono text-xs">
                    <span className="font-extrabold text-[var(--color-flash)] tabular-nums">
                      {item.price}
                    </span>
                    <span className="text-[var(--color-ink-muted)]">
                      {new Date(Number(item.dateBuy)).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] p-6 space-y-4">
          <div className="flex items-center gap-3 border-b-2 border-[var(--color-ink)] pb-3">
            <div className="p-2 bg-[var(--color-ink)] text-[var(--color-paper)]">
              <Store className="w-5 h-5" />
            </div>
            <h2 className="font-display-safe text-base font-extrabold uppercase">
              Thông Tin Cửa Hàng
            </h2>
          </div>

          <div className="bg-[var(--color-bone)] p-4 border-2 border-[var(--color-ink)]">
            <p className="mono-label text-[10px] text-[var(--color-ink-muted)]">
              CỬA HÀNG XUẤT KHO
            </p>
            <p className="font-mono font-extrabold text-sm text-[var(--color-ink)] mt-0.5">
              {data?.shopName}
            </p>
            <p className="flex gap-2 text-xs font-mono text-[var(--color-ink-muted)] mt-1">
              <MapPin className="w-4 h-4 text-[var(--color-flash)] shrink-0" />
              {data?.address}
            </p>
          </div>

          <div className="bg-[var(--color-ink)] p-4 border-2 border-[var(--color-ink)] text-[var(--color-paper)]">
            <p className="mono-label text-[10px] text-[var(--color-volt)]">
              ĐIỂM ĐẾN GIAO HÀNG
            </p>
            <p className="font-display-safe text-base font-extrabold uppercase mt-0.5">
              {data?.data?.name}
            </p>
            <p className="text-xs font-mono text-[var(--color-paper)]/80 mt-0.5">
              {data?.data?.address}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenMap}
          className="lg:hidden w-full min-h-[48px] bg-[var(--color-flash)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] mono-label font-extrabold cursor-pointer"
        >
          Xem bản đồ giao hàng
        </button>
      </div>
    </div>
  );
};

export default LeftSite;

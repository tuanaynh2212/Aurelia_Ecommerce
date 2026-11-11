import React, { useContext, useEffect, useState } from "react";
import { X, Sparkles, Tag } from "lucide-react";
import { AdminContext } from "../contexts/AdminContext";
import type { Cart, order } from "../types/type";
import { CouponCard } from "./CheckOutComponents/CouponCard";

export const ListCoupon = ({
  isOpen,
  setIsOpen,
  dataOrder,
  order,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataOrder: Cart[];
  order: order | undefined;
}) => {
  const { coupons, suggestVoucher } = useContext(AdminContext);

  const [validationMessage] = useState<string | null>(null);

  useEffect(() => {
    suggestVoucher(order ?? undefined);
  }, [dataOrder, order, suggestVoucher]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[var(--color-ink)]/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-lg)] max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Brutalist Header */}
        <div className="relative bg-[var(--color-ink)] text-[var(--color-paper)] p-6 border-b-2 border-[var(--color-ink)] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--color-volt)] text-[var(--color-ink)] border-2 border-[var(--color-paper)] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="mono-label text-[var(--color-volt)]">
                [TICKET BOOTH · VOUCHER ARCHIVE]
              </span>
              <h2 className="display-m font-display-safe text-[var(--color-paper)]">
                Mã Giảm Giá
              </h2>
              <p className="mono-label text-[var(--color-paper)]/70">
                Tiết kiệm ngay hôm nay
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-flash)] hover:text-[var(--color-paper)] border-2 border-[var(--color-ink)] transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[var(--color-bone)] space-y-6">
          {validationMessage && (
            <div className="px-4 py-3 border-2 border-[var(--color-ink)] bg-[var(--color-warning)] text-[var(--color-ink)] mono-label">
              {validationMessage}
            </div>
          )}

          {coupons.length === 0 ? (
            <div className="text-center py-12 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-8">
              <Tag className="w-12 h-12 text-[var(--color-ink-muted)] mx-auto mb-3" />
              <p className="mono-label text-[var(--color-ink-muted)]">
                Chưa có mã giảm giá nào
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3 pb-1.5 border-b-2 border-[var(--color-ink)]">
                  <span className="px-2 py-0.5 bg-[var(--color-ink)] text-[var(--color-paper)] mono-label">
                    SHIP
                  </span>
                  <h3 className="font-display-safe font-extrabold text-base uppercase text-[var(--color-ink)]">
                    Mã Giảm Phí Ship
                  </h3>
                </div>
                <CouponCard type="ship" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 pb-1.5 border-b-2 border-[var(--color-ink)]">
                  <span className="px-2 py-0.5 bg-[var(--color-flash)] text-[var(--color-paper)] mono-label">
                    ORDER
                  </span>
                  <h3 className="font-display-safe font-extrabold text-base uppercase text-[var(--color-ink)]">
                    Mã Giảm Đơn Hàng
                  </h3>
                </div>
                <CouponCard type="order" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListCoupon;

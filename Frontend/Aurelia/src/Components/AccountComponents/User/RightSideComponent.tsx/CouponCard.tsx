import React, { useState } from "react";
import type { Coupon } from "../../../../types/type";
import { formatVND, formatDateOnly } from "../../../../utils/formatters";
import { Copy, Check } from "lucide-react";
import { Ticket } from "../../../UI";

export const CouponCard: React.FC<{
  coupon: Coupon;
  type: string;
}> = ({ coupon, type }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const discountDisplay =
    coupon.loaiGiam === "percent"
      ? `Giảm ${coupon.giaTri}%`
      : `Giảm ${formatVND(coupon.giaTri || 0)}`;

  const formattedEnd = formatDateOnly(coupon.ngayKetThuc);

  return (
    <Ticket
      serial={coupon.code}
      header={type === "ship" ? "VẬN CHUYỂN" : "ĐƠN HÀNG"}
      stampText="KHẢ DỤNG"
      stub={
        <div className="w-full flex items-center justify-between gap-2">
          <span className="mono-label text-[10px] text-[var(--color-ink-muted)]">
            HSD · {formattedEnd}
          </span>
          <button
            onClick={handleCopy}
            className="min-h-[38px] px-3 py-1.5 bg-[var(--color-volt)] hover:bg-[var(--color-flash)] hover:text-[var(--color-paper)] border-2 border-[var(--color-ink)] mono-label font-extrabold text-[var(--color-ink)] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Sao chép mã"
          >
            {copied ? (
              <>
                <Check size={12} />
                <span>Đã chép</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Chép mã</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-1.5">
        <p className="font-display-safe text-lg font-extrabold uppercase text-[var(--color-ink)]">
          {discountDisplay}
        </p>
        {coupon.moTa && (
          <p className="font-sans text-xs text-[var(--color-ink-muted)] line-clamp-2">
            {coupon.moTa}
          </p>
        )}
      </div>
    </Ticket>
  );
};

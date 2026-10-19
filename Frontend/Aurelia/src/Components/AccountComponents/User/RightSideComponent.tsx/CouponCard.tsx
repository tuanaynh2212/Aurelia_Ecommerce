import React, { useState } from "react";
import type { Coupon } from "../../../../types/type";
import { formatVND, formatDateOnly } from "../../../../utils/formatters";
import { Copy, Check, Ticket } from "lucide-react";

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
    <div
      className="
        relative
        bg-paper
        border border-rule/80
        rounded-tag
        p-5
        flex flex-col
        justify-between
        transition-all
        hover:border-ink/30
        hover:shadow-tag
        shadow-sm
        overflow-hidden
      "
    >
      {/* Top eyelet and coupon tag identifier */}
      <div className="flex items-center justify-between pb-3 border-b border-rule/60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-hole bg-kraft border border-ink/20 shadow-inner" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            {type === "ship" ? "VẬN CHUYỂN" : "ĐƠN HÀNG"}
          </span>
        </div>
        <Ticket size={14} className="text-cobalt" />
      </div>

      {/* Code with Copy */}
      <div className="mt-4 flex items-center justify-between bg-kraft/15 border border-rule/60 rounded-tag p-2.5">
        <div className="min-w-0">
          <span className="block font-mono text-[9px] uppercase tracking-widest text-ink-muted">
            MÃ ƯU ĐÃI
          </span>
          <span className="font-mono text-base font-bold text-ink tracking-wider">
            {coupon.code}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-tag bg-paper hover:bg-white border border-rule font-mono text-[11px] uppercase tracking-wider text-ink transition-all shadow-sm"
          title="Sao chép mã"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-600" />
              <span className="text-emerald-700">Đã chép</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Chép mã</span>
            </>
          )}
        </button>
      </div>

      {/* Value & description */}
      <div className="mt-4 space-y-1">
        <p className="font-heading text-lg font-semibold text-ink">
          {discountDisplay}
        </p>
        {coupon.moTa && (
          <p className="font-body text-xs text-ink-muted leading-relaxed line-clamp-2">
            {coupon.moTa}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-rule/50 pt-3">
        <span className="font-mono text-[10px] text-ink-muted">
          HSD · {formattedEnd}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-cobalt font-medium">
          Khả dụng
        </span>
      </div>
    </div>
  );
};


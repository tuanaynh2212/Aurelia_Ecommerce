import React, { useState } from "react";
import type { order } from "../../../../types/type";
import { formatOrderId, formatDateTime, formatVND, getRelativeTimeVi } from "../../../../utils/formatters";
import { Copy, Check, ArrowUpRight, Package, XCircle } from "lucide-react";

type OrderCardProps = {
  order: order;
  calcOrderTotal: (order: order) => number;
  huyDonHang: (id: string) => void;
  navigate: (path: string) => void;
};

const STATUS_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  "Chờ Xác Nhận": { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  "Đã Xác Nhận": { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  "Đang Giao": { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
  "Đã Giao": { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  "Đã Hủy": { bg: "bg-stone-100", text: "text-stone-500", border: "border-stone-200" },
};

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  calcOrderTotal,
  huyDonHang,
  navigate,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const shortCode = formatOrderId(order.orderId);
  const formattedDate = formatDateTime(order.ngayTaoDon);
  const relativeDate = getRelativeTimeVi(order.ngayTaoDon);
  const total = calcOrderTotal(order);
  const statusStyle = STATUS_COLOR_MAP[order.status] || {
    bg: "bg-paper",
    text: "text-ink-muted",
    border: "border-rule",
  };

  const firstProduct = order.product?.[0];
  const otherProductsCount = (order.product?.length || 1) - 1;

  return (
    <div className="bg-paper border border-rule/80 rounded-tag shadow-tag p-5 md:p-6 transition-all hover:border-ink/25 relative">
      <div className="flex flex-wrap items-center justify-between pb-3.5 border-b border-rule/60 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-hole bg-kraft border border-ink/20 shadow-inner" />
          <span className="font-mono text-xs font-semibold text-ink">
            Đơn {shortCode}
          </span>
          <button
            onClick={handleCopy}
            title={copied ? "Đã sao chép!" : "Sao chép mã đơn"}
            className="p-1 rounded-tag hover:bg-kraft/20 text-ink-muted hover:text-ink transition-colors"
          >
            {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-ink-muted" title={relativeDate ? `Đặt lúc: ${formattedDate} (${relativeDate})` : formattedDate}>
            Ngày đặt · {formattedDate}
          </span>
          <span
            className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-tag border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-tag bg-kraft/15 border border-rule overflow-hidden shrink-0">
            {firstProduct?.thumnail ? (
              <img
                src={firstProduct.thumnail}
                alt={firstProduct.name || "Sản phẩm"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-muted">
                <Package size={20} />
              </div>
            )}
          </div>

          <div>
            <h4 className="font-heading text-sm font-medium text-ink line-clamp-1">
              {firstProduct?.name || "Sản phẩm thời trang"}
            </h4>
            <div className="font-mono text-xs text-ink-muted mt-0.5">
              <span>Số lượng: {firstProduct?.quantity || 1}</span>
              {firstProduct?.size && <span> · Cỡ: {firstProduct.size}</span>}
              {otherProductsCount > 0 && (
                <span className="text-cobalt ml-1">
                  +{otherProductsCount} sản phẩm khác
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-end md:items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-rule/40">
          <div className="text-left md:text-right">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-ink-muted">
              Tổng giá trị
            </span>
            <span className="font-mono text-lg font-bold text-ink">
              {formatVND(total)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {order.status === "Chờ Xác Nhận" && (
              <button
                onClick={() => huyDonHang(order.orderId)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-tag font-mono text-xs uppercase tracking-wider text-red-700 bg-red-50/70 hover:bg-red-100/70 border border-red-200 transition-colors"
              >
                <XCircle size={13} />
                <span>Hủy đơn</span>
              </button>
            )}

            <button
              onClick={() => navigate(`/orders/${order.orderId}`)}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-tag font-mono text-xs uppercase tracking-wider text-white bg-ink hover:bg-black transition-colors"
            >
              <span>Chi tiết</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


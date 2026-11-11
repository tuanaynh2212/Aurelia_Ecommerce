import React, { useState } from "react";
import type { order } from "../../../../types/type";
import {
  formatOrderId,
  formatDateTime,
  formatVND,
  getRelativeTimeVi,
} from "../../../../utils/formatters";
import { Copy, Check, ArrowUpRight, Package, XCircle } from "lucide-react";
import { Ticket, Badge } from "../../../UI";

type OrderCardProps = {
  order: order;
  calcOrderTotal: (order: order) => number;
  huyDonHang: (id: string) => void;
  navigate: (path: string) => void;
};

const STATUS_BADGE_MAP: Record<
  string,
  "warning" | "info" | "success" | "danger" | "neutral"
> = {
  "Chờ Xác Nhận": "warning",
  "Đã Xác Nhận": "info",
  "Đang Giao": "info",
  "Đã Giao": "success",
  "Đã Hủy": "danger",
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
  const badgeStatus = STATUS_BADGE_MAP[order.status] || "neutral";

  const firstProduct = order.product?.[0];
  const otherProductsCount = (order.product?.length || 1) - 1;

  return (
    <Ticket
      serial={shortCode}
      header={`NGÀY ĐẶT · ${formattedDate}`}
      stampText={order.status}
      stub={
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="block mono-label text-[10px] text-[var(--color-ink-muted)]">
              TỔNG GIÁ TRỊ
            </span>
            <span className="font-mono text-lg font-extrabold text-[var(--color-flash)] tabular-nums">
              {formatVND(total)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {order.status === "Chờ Xác Nhận" && (
              <button
                onClick={() => huyDonHang(order.orderId)}
                className="min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 border-2 border-[var(--color-ink)] bg-[var(--color-danger)] text-[var(--color-paper)] mono-label font-extrabold cursor-pointer"
              >
                <XCircle size={13} />
                <span>Hủy đơn</span>
              </button>
            )}

            <button
              onClick={() => navigate(`/orders/${order.orderId}`)}
              className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-1.5 border-2 border-[var(--color-ink)] bg-[var(--color-ink)] hover:bg-[var(--color-volt)] text-[var(--color-paper)] hover:text-[var(--color-ink)] mono-label font-extrabold transition-colors cursor-pointer"
            >
              <span>Chi tiết</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-extrabold text-[var(--color-ink)]">
              Đơn {shortCode}
            </span>
            <button
              onClick={handleCopy}
              title={copied ? "Đã sao chép!" : "Sao chép mã đơn"}
              className="p-1 border border-[var(--color-ink)] bg-[var(--color-bone)] hover:bg-[var(--color-volt)] text-[var(--color-ink)] transition-colors cursor-pointer"
            >
              {copied ? (
                <Check size={12} className="text-[var(--color-success)]" />
              ) : (
                <Copy size={12} />
              )}
            </button>
            {relativeDate && (
              <span className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                ({relativeDate})
              </span>
            )}
          </div>
          <Badge status={badgeStatus}>{order.status}</Badge>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t-2 border-dashed border-[var(--color-ink)]">
          <div className="w-16 h-16 bg-[var(--color-bone)] border-2 border-[var(--color-ink)] overflow-hidden shrink-0">
            {firstProduct?.thumnail ? (
              <img
                src={firstProduct.thumnail}
                alt={firstProduct.name || "Sản phẩm"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-muted)]">
                <Package size={20} />
              </div>
            )}
          </div>

          <div>
            <h4 className="font-display-safe text-sm font-extrabold uppercase text-[var(--color-ink)] line-clamp-1">
              {firstProduct?.name || "Sản phẩm thời trang"}
            </h4>
            <div className="mono-label text-[var(--color-ink-muted)] mt-1">
              <span>Số lượng: {firstProduct?.quantity || 1}</span>
              {firstProduct?.size && <span> · Cỡ: {firstProduct.size}</span>}
              {otherProductsCount > 0 && (
                <span className="bg-[var(--color-volt)] text-[var(--color-ink)] px-1 ml-1.5 font-extrabold">
                  +{otherProductsCount} sản phẩm khác
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Ticket>
  );
};

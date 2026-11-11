import React, { useState } from "react";
import type { order } from "../../../../types/type";
import {
  formatOrderId,
  formatDateTime,
  formatVND,
  getRelativeTimeVi,
} from "../../../../utils/formatters";
import { Copy, Check, ArrowRight, Package } from "lucide-react";
import { Badge } from "../../../UI";

interface RecentActivityProps {
  orders: order[];
  setActiveItem: React.Dispatch<React.SetStateAction<string>> | undefined;
}

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

export const RecentActivity: React.FC<RecentActivityProps> = ({
  orders,
  setActiveItem,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const safeOrders = Array.isArray(orders) ? orders.slice(0, 5) : [];

  return (
    <div className="w-full bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] p-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[var(--color-ink)]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-volt)] border border-[var(--color-ink)]" />
          <h3 className="mono-label font-extrabold text-[var(--color-ink)]">
            Hoạt Động Gần Đây
          </h3>
        </div>
        <button
          onClick={() => setActiveItem && setActiveItem("recentOrder")}
          className="min-h-[36px] px-3 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] hover:bg-[var(--color-volt)] flex items-center gap-1.5 mono-label text-[var(--color-ink)] transition-colors cursor-pointer"
        >
          <span>Xem tất cả</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="divide-y-2 divide-dashed divide-[var(--color-ink)]">
        {safeOrders.length === 0 ? (
          <div className="py-10 text-center text-[var(--color-ink-muted)] font-mono text-xs">
            Chưa có lịch sử giao dịch nào được ghi nhận.
          </div>
        ) : (
          safeOrders.map((orderItem) => {
            const shortCode = formatOrderId(orderItem.orderId);
            const formattedDate = formatDateTime(orderItem.ngayTaoDon);
            const relativeDate = getRelativeTimeVi(orderItem.ngayTaoDon);
            const total =
              orderItem.product?.reduce(
                (sum, item) =>
                  sum +
                  (Number(item.price) || 0) * (Number(item.quantity) || 1),
                0
              ) || 0;
            const badgeStatus = STATUS_BADGE_MAP[orderItem.status] || "neutral";
            const isCopied = copiedId === orderItem.orderId;

            return (
              <div
                key={orderItem.orderId}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 hover:bg-[var(--color-bone)]/60 px-2 transition-colors gap-2"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[var(--color-bone)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-ink)] shrink-0 mt-0.5">
                    <Package size={15} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-extrabold text-[var(--color-ink)]">
                        Đơn {shortCode}
                      </span>
                      <button
                        onClick={(e) => handleCopy(orderItem.orderId, e)}
                        title={
                          isCopied ? "Đã sao chép!" : "Sao chép mã đơn đầy đủ"
                        }
                        className="p-1 border border-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-volt)] text-[var(--color-ink)] transition-colors cursor-pointer"
                      >
                        {isCopied ? (
                          <Check
                            size={12}
                            className="text-[var(--color-success)]"
                          />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>

                    <div
                      className="flex items-center gap-1.5 font-mono text-xs text-[var(--color-ink-muted)] mt-0.5"
                      title={
                        relativeDate
                          ? `Đặt lúc: ${formattedDate} (${relativeDate})`
                          : formattedDate
                      }
                    >
                      <span>{formattedDate}</span>
                      {relativeDate && (
                        <>
                          <span>·</span>
                          <span>({relativeDate})</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 text-right pl-12 sm:pl-0">
                  <Badge status={badgeStatus}>{orderItem.status}</Badge>

                  <span className="font-mono text-sm font-extrabold text-[var(--color-ink)] tabular-nums sm:min-w-[110px] text-right">
                    {formatVND(total)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

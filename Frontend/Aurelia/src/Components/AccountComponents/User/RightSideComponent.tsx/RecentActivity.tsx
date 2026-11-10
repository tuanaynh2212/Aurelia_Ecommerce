import React, { useState } from "react";
import type { order } from "../../../../types/type";
import { formatOrderId, formatDateTime, formatVND, getRelativeTimeVi } from "../../../../utils/formatters";
import { Copy, Check, ArrowRight, Package } from "lucide-react";

interface RecentActivityProps {
  orders: order[];
  setActiveItem: React.Dispatch<React.SetStateAction<string>> | undefined;
}

const STATUS_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  "Chờ Xác Nhận": { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  "Đã Xác Nhận": { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  "Đang Giao": { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
  "Đã Giao": { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  "Đã Hủy": { bg: "bg-stone-100", text: "text-stone-500", border: "border-stone-200" },
};

export const RecentActivity: React.FC<RecentActivityProps> = ({ orders, setActiveItem }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const safeOrders = Array.isArray(orders) ? orders.slice(0, 5) : [];

  return (
    <div className="w-full bg-paper border border-rule/80 rounded-tag shadow-tag p-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-rule/60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-hole bg-kraft border border-ink/20 shadow-inner" />
          <h3 className="font-mono text-xs uppercase tracking-widest text-ink font-semibold">
            Hoạt Động Gần Đây
          </h3>
        </div>
        <button
          onClick={() => setActiveItem && setActiveItem("recentOrder")}
          className="group flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-cobalt hover:text-cobalt-hover transition-colors"
        >
          <span>Xem tất cả</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="divide-y divide-rule/40">
        {safeOrders.length === 0 ? (
          <div className="py-10 text-center text-ink-muted font-mono text-xs">
            Chưa có lịch sử giao dịch nào được ghi nhận.
          </div>
        ) : (
          safeOrders.map((order) => {
            const shortCode = formatOrderId(order.orderId);
            const formattedDate = formatDateTime(order.ngayTaoDon);
            const relativeDate = getRelativeTimeVi(order.ngayTaoDon);
            const total = order.product?.reduce(
              (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
              0
            ) || 0;
            const statusConfig = STATUS_COLOR_MAP[order.status] || {
              bg: "bg-paper",
              text: "text-ink-muted",
              border: "border-rule",
            };
            const isCopied = copiedId === order.orderId;

            return (
              <div
                key={order.orderId}
                className="group flex flex-col sm:flex-row sm:items-center justify-between py-3.5 hover:bg-black/[0.015] px-2 -mx-2 rounded-tag transition-colors gap-2"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-tag bg-kraft/15 border border-kraft-dark/20 flex items-center justify-center text-ink-muted shrink-0 mt-0.5">
                    <Package size={15} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-ink">
                        Đơn {shortCode}
                      </span>
                      <button
                        onClick={(e) => handleCopy(order.orderId, e)}
                        title={isCopied ? "Đã sao chép!" : "Sao chép mã đơn đầy đủ"}
                        className="p-1 rounded-tag hover:bg-kraft/20 text-ink-muted hover:text-ink transition-colors"
                      >
                        {isCopied ? (
                          <Check size={12} className="text-emerald-600" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-xs text-ink-muted mt-0.5" title={relativeDate ? `Đặt lúc: ${formattedDate} (${relativeDate})` : formattedDate}>
                      <span>{formattedDate}</span>
                      {relativeDate && (
                        <>
                          <span>·</span>
                          <span className="text-ink-faint">({relativeDate})</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 text-right pl-11 sm:pl-0">
                  <span
                    className={`inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-tag border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                  >
                    {order.status}
                  </span>

                  <span className="font-mono text-sm font-semibold text-ink sm:min-w-[110px] text-right">
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
import React, { useState, useContext } from "react";
import {
  ShoppingBag,
  PackageCheck,
  Truck,
  Clock,
  XCircle,
  CheckCircle2,
  Layers,
} from "lucide-react";
import type { order } from "../../../../types/type";
import { useNavigate } from "react-router-dom";
import { FilterProductContext } from "../../../../contexts/FIlterProduct";
import { OrderCard } from "./OrderCard";

const STATUS_CONFIG = [
  { label: "Tất cả", value: null, icon: Layers },
  { label: "Chờ Xác Nhận", value: "Chờ Xác Nhận", icon: Clock },
  { label: "Đã Xác Nhận", value: "Đã Xác Nhận", icon: CheckCircle2 },
  { label: "Đang Giao", value: "Đang Giao", icon: Truck },
  { label: "Đã Giao", value: "Đã Giao", icon: PackageCheck },
  { label: "Đã Hủy", value: "Đã Hủy", icon: XCircle },
] as const;

export const RecentOrder: React.FC<{ donHangChiTiet: order[] }> = ({
  donHangChiTiet = [],
}) => {
  const navigate = useNavigate();
  const { huyDonHang } = useContext(FilterProductContext);
  const [openStatus, setOpenStatus] = useState<string | null>(null);

  const calcOrderTotal = (orderItem: order) =>
    orderItem.product?.reduce(
      (sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 1),
      0
    ) || 0;

  const safeOrders = Array.isArray(donHangChiTiet) ? donHangChiTiet : [];

  const filteredOrders = openStatus
    ? safeOrders.filter((o) => o.status === openStatus)
    : safeOrders;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-[var(--color-ink)] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-volt)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-ink)] shadow-[var(--shadow-hard-sm)]">
            <ShoppingBag size={18} />
          </div>
          <div>
            <h1 className="font-display-safe text-lg font-extrabold uppercase text-[var(--color-ink)]">
              Đơn Hàng Của Bạn
            </h1>
            <p className="mono-label text-[var(--color-ink-muted)]">
              Hồ sơ quản lý và theo dõi tiến độ may đo & vận chuyển
            </p>
          </div>
        </div>

        <div className="mono-label text-[var(--color-ink-muted)]">
          Tổng cộng:{" "}
          <strong className="bg-[var(--color-volt)] text-[var(--color-ink)] px-1.5 py-0.5 font-extrabold">
            {safeOrders.length}
          </strong>{" "}
          đơn hàng
        </div>
      </div>

      <div className="flex gap-2 border-b-2 border-[var(--color-ink)] pb-3 overflow-x-auto">
        {STATUS_CONFIG.map(({ label, value, icon: Icon }) => {
          const isActive = openStatus === value;
          const count = value
            ? safeOrders.filter((o) => o.status === value).length
            : safeOrders.length;

          return (
            <button
              key={label}
              onClick={() => setOpenStatus(value)}
              className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 border-2 border-[var(--color-ink)] mono-label whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[var(--color-volt)] text-[var(--color-ink)] font-extrabold shadow-[var(--shadow-hard-sm)]"
                  : "bg-[var(--color-paper)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-bone)]"
              }`}
            >
              <Icon size={13} />
              <span>{label}</span>
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.5 border border-[var(--color-ink)] ${
                  isActive
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                    : "bg-[var(--color-bone)] text-[var(--color-ink)]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-[var(--color-bone)] border-2 border-dashed border-[var(--color-ink)] p-12 text-center">
            <div className="w-12 h-12 mx-auto bg-[var(--color-paper)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-ink)] mb-3">
              <ShoppingBag size={20} />
            </div>
            <p className="font-display-safe font-extrabold uppercase text-sm text-[var(--color-ink)]">
              Không tìm thấy đơn hàng nào
            </p>
            <p className="font-mono text-xs text-[var(--color-ink-muted)] mt-1">
              {openStatus
                ? `Bạn hiện không có đơn hàng nào trong trạng thái "${openStatus}".`
                : "Bạn chưa có đơn hàng nào trong hệ thống."}
            </p>
            <button
              onClick={() => navigate("/Collection")}
              className="mt-5 min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-flash)] text-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] mono-label font-extrabold cursor-pointer"
            >
              Khám phá bộ sưu tập mới
            </button>
          </div>
        ) : (
          filteredOrders.map((orderItem) => (
            <OrderCard
              key={orderItem.orderId}
              order={orderItem}
              calcOrderTotal={calcOrderTotal}
              huyDonHang={huyDonHang}
              navigate={navigate}
            />
          ))
        )}
      </div>
    </div>
  );
};

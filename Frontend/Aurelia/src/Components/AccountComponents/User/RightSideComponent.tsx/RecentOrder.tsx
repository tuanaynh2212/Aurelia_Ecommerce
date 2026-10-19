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

  const calcOrderTotal = (order: order) =>
    order.product?.reduce(
      (sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 1),
      0
    ) || 0;

  const safeOrders = Array.isArray(donHangChiTiet) ? donHangChiTiet : [];

  const filteredOrders = openStatus
    ? safeOrders.filter((o) => o.status === openStatus)
    : safeOrders;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rule/60 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-tag bg-kraft/15 border border-kraft-dark/20 flex items-center justify-center text-ink">
            <ShoppingBag size={16} />
          </div>
          <div>
            <h1 className="font-heading text-lg font-semibold text-ink">
              Đơn Hàng Của Bạn
            </h1>
            <p className="font-mono text-xs text-ink-muted">
              Hồ sơ quản lý và theo dõi tiến độ may đo & vận chuyển
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-ink-muted">
          Tổng cộng: <strong className="text-ink">{safeOrders.length}</strong> đơn hàng
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-rule/60 pb-3 overflow-x-auto scrollbar-none">
        {STATUS_CONFIG.map(({ label, value, icon: Icon }) => {
          const isActive = openStatus === value;
          const count = value
            ? safeOrders.filter((o) => o.status === value).length
            : safeOrders.length;

          return (
            <button
              key={label}
              onClick={() => setOpenStatus(value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-tag font-mono text-[11px] uppercase tracking-wider whitespace-nowrap transition-all ${
                isActive
                  ? "bg-ink text-paper font-semibold shadow-sm"
                  : "bg-paper text-ink-muted hover:text-ink hover:bg-kraft/15 border border-rule/60"
              }`}
            >
              <Icon size={13} />
              <span>{label}</span>
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-tag ${
                  isActive ? "bg-white/20 text-white" : "bg-kraft/20 text-ink"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-paper border border-dashed border-rule rounded-tag p-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-tag bg-kraft/15 flex items-center justify-center text-ink-muted mb-3">
              <ShoppingBag size={22} />
            </div>
            <p className="font-mono text-sm text-ink font-medium">
              Không tìm thấy đơn hàng nào
            </p>
            <p className="font-mono text-xs text-ink-muted mt-1">
              {openStatus
                ? `Bạn hiện không có đơn hàng nào trong trạng thái "${openStatus}".`
                : "Bạn chưa có đơn hàng nào trong hệ thống."}
            </p>
            <button
              onClick={() => navigate("/Collection")}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-tag bg-cobalt hover:bg-cobalt-hover text-white font-mono text-xs uppercase tracking-wider transition-colors"
            >
              Khám phá bộ sưu tập mới
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
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


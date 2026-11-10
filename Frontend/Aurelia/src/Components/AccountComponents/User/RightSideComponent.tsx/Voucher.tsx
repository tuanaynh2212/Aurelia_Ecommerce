import React, { useContext } from "react";
import { Ticket, Package, Truck } from "lucide-react";
import { AdminContext } from "../../../../contexts/AdminContext";
import { Section } from "./Section";

export default function Voucher() {
  const { coupons } = useContext(AdminContext);

  const safeCoupons = Array.isArray(coupons) ? coupons : [];

  const orderCoupons = safeCoupons.filter(
    (c) => c.typeCoupon === "order" && c.isActive
  );
  const shipCoupons = safeCoupons.filter(
    (c) => c.typeCoupon === "ship" && c.isActive
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rule/60 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-tag bg-kraft/15 border border-kraft-dark/20 flex items-center justify-center text-ink">
            <Ticket size={16} />
          </div>
          <div>
            <h1 className="font-heading text-lg font-semibold text-ink">
              Mã Giảm Giá & Phiếu Quà Tặng
            </h1>
            <p className="font-mono text-xs text-ink-muted">
              Đặc quyền ưu đãi dành riêng cho tài khoản của quý khách
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-ink-muted">
          Tổng số: <strong className="text-ink">{orderCoupons.length + shipCoupons.length}</strong> mã khả dụng
        </div>
      </div>

      <Section
        title="Ưu đãi đơn hàng"
        icon={Package}
        coupons={orderCoupons}
        type="order"
        emptyText="Bạn chưa có mã giảm giá cho đơn hàng nào."
      />

      <Section
        title="Ưu đãi vận chuyển"
        icon={Truck}
        coupons={shipCoupons}
        type="ship"
        emptyText="Bạn chưa có mã miễn phí hoặc giảm phí vận chuyển."
      />
    </div>
  );
}


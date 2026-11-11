import { useContext } from "react";
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-[var(--color-ink)] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-volt)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-ink)] shadow-[var(--shadow-hard-sm)]">
            <Ticket size={18} />
          </div>
          <div>
            <h1 className="font-display-safe text-lg font-extrabold uppercase text-[var(--color-ink)]">
              Mã Giảm Giá & Phiếu Quà Tặng
            </h1>
            <p className="mono-label text-[var(--color-ink-muted)]">
              Đặc quyền ưu đãi dành riêng cho tài khoản của quý khách
            </p>
          </div>
        </div>

        <div className="mono-label text-[var(--color-ink-muted)]">
          Tổng số:{" "}
          <strong className="bg-[var(--color-volt)] text-[var(--color-ink)] px-1.5 py-0.5 font-extrabold">
            {orderCoupons.length + shipCoupons.length}
          </strong>{" "}
          mã khả dụng
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

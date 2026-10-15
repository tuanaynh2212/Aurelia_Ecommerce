import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import { ListCoupon } from "../ListCoupon";

export const OrderSummary = ({
  subtotal,
  shippingCost,
  isOpen,
  setIsOpen,
}: {
  subtotal: number;
  shippingCost: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { CartDataAdd, formatPrice, dataOrder } = useContext(CartContext);

  return (
    <div className="sticky top-[80px] p-6 md:p-8">
      <ListCoupon
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        dataOrder={CartDataAdd}
        order={dataOrder}
      />

      <div className="mb-6 pb-3 border-b border-[var(--color-rule)]">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
          SUMMARY
        </div>
        <h2 className="text-base font-heading font-bold uppercase tracking-wide text-[var(--color-ink)]">
          Chi Tiết Đơn Hàng
        </h2>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        {CartDataAdd.map((product) => (
          <div key={product.itemid} className="flex gap-3 group">
            <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-none border border-[var(--color-rule)] bg-[var(--color-bg)]">
              <span className="absolute top-0 right-0 bg-[var(--color-ink)] text-[var(--color-bg)] text-[10px] font-mono font-bold px-1 py-0.2 rounded-none z-10 tabular-nums">
                {product.quantity}
              </span>
              <img
                alt={product.name}
                className="h-full w-full object-cover object-center"
                src={product.thumnail}
              />
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <h3 className="text-xs sm:text-sm font-heading font-semibold text-[var(--color-ink)] leading-snug line-clamp-1">
                {product.name}
              </h3>
              <p className="text-[11px] font-mono text-[var(--color-ink-muted)] uppercase tracking-wider mt-0.5">
                {product.color} · CỠ {product.size}
              </p>
            </div>
            <div className="flex flex-col justify-center text-right">
              <span className="text-xs sm:text-sm font-mono font-bold text-[var(--color-ink)] tabular-nums">
                {formatPrice?.(product.price * product.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        className="mb-6 text-xs font-mono uppercase tracking-wider text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors underline underline-offset-4 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        + ÁP DỤNG MÃ GIẢM GIÁ / COUPON
      </button>

      {/* Totals */}
      <div className="flex flex-col gap-2.5 border-t border-[var(--color-rule)] pt-5 text-xs font-mono">
        <div className="flex justify-between text-[var(--color-ink-muted)]">
          <span className="uppercase tracking-wider">TẠM TÍNH</span>
          <span className="font-bold text-[var(--color-ink)] tabular-nums">{formatPrice?.(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[var(--color-ink-muted)]">
          <span className="uppercase tracking-wider">PHÍ GIAO HÀNG</span>
          {shippingCost === "0" || !shippingCost ? (
            <span className="font-bold uppercase text-[var(--color-ink)]">
              MIỄN PHÍ
            </span>
          ) : (
            <span className="font-bold text-[var(--color-ink)] tabular-nums">
              {formatPrice?.(Number(shippingCost))}
            </span>
          )}
        </div>
      </div>

      {/* Grand Total */}
      <div className="mt-5 flex items-baseline justify-between border-t border-[var(--color-rule)] pt-5">
        <span className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--color-ink)]">
          TỔNG CỘNG
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-heading font-extrabold text-[var(--color-accent)] tabular-nums">
            {formatPrice?.(subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

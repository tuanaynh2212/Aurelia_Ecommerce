import { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import { ListCoupon } from "../ListCoupon";
import { Receipt, DottedLeaderRow } from "../UI";
import { Ticket as TicketIcon } from "lucide-react";

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
    <div className="sticky top-20">
      <ListCoupon
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        dataOrder={CartDataAdd}
        order={dataOrder}
      />

      <Receipt
        title="CHI TIẾT ĐƠN HÀNG"
        serial={dataOrder?.orderId?.slice(0, 8).toUpperCase() || "CHK-0001"}
        footer="ATELIER THERMAL SETTLEMENT RECORD"
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1 divide-y-2 divide-dashed divide-[var(--color-ink)]">
            {CartDataAdd.map((product) => (
              <div key={product.itemid} className="flex gap-3 pt-3 first:pt-0">
                <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden border-2 border-[var(--color-ink)] bg-[var(--color-bone)]">
                  <span className="absolute top-0 right-0 bg-[var(--color-ink)] text-[var(--color-paper)] text-[10px] font-mono font-extrabold px-1.5 py-0.5 z-10 tabular-nums">
                    x{product.quantity}
                  </span>
                  <img
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                    src={product.thumnail}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <h3 className="text-xs font-display-safe font-extrabold uppercase text-[var(--color-ink)] line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="mono-label text-[var(--color-ink-muted)] mt-1">
                    {product.color} · CỠ {product.size}
                  </p>
                </div>
                <div className="flex flex-col justify-center text-right">
                  <span className="text-xs font-mono font-extrabold text-[var(--color-ink)] tabular-nums">
                    {formatPrice?.(product.price * product.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="w-full min-h-[44px] px-4 py-2.5 border-2 border-[var(--color-ink)] bg-[var(--color-volt)] hover:bg-[var(--color-flash)] hover:text-[var(--color-paper)] text-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] transition-colors inline-flex items-center justify-center gap-2 mono-label cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <TicketIcon size={15} />
            <span>+ ÁP DỤNG MÃ GIẢM GIÁ / COUPON</span>
          </button>

          <div className="space-y-2 border-t-2 border-[var(--color-ink)] pt-4">
            <DottedLeaderRow
              label="TẠM TÍNH"
              value={formatPrice?.(subtotal) || "0 ₫"}
            />
            <DottedLeaderRow
              label="PHÍ GIAO HÀNG"
              value={
                shippingCost === "0" || !shippingCost
                  ? "MIỄN PHÍ"
                  : formatPrice?.(Number(shippingCost)) || "0 ₫"
              }
            />
          </div>

          <div className="flex items-baseline justify-between border-t-2 border-[var(--color-ink)] pt-4">
            <span className="mono-label font-extrabold text-[var(--color-ink)]">
              TỔNG CỘNG
            </span>
            <span className="text-2xl font-mono font-extrabold text-[var(--color-flash)] tabular-nums">
              {formatPrice?.(subtotal)}
            </span>
          </div>
        </div>
      </Receipt>
    </div>
  );
};

export default OrderSummary;

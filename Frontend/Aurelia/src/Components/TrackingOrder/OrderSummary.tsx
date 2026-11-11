import { useContext } from "react";
import type { order } from "../../types/type";
import { CreditCardIcon, HomeIcon } from "lucide-react";
import { CartContext } from "../../contexts/CartContext";
import { Receipt, DottedLeaderRow } from "../UI";

export const OrderSummaryGrid = ({ data }: { data: order | undefined }) => {
  const { formatPrice } = useContext(CartContext);
  const itemsSubtotal =
    data?.product?.reduce((acc, item) => acc + item.price * item.quantity, 0) ??
    0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] p-5 flex flex-col gap-3">
        <h4 className="font-display-safe text-base font-extrabold uppercase text-[var(--color-ink)] pb-2 border-b-2 border-[var(--color-ink)]">
          Shipping Details
        </h4>
        <div className="flex flex-col gap-1 font-mono text-xs text-[var(--color-ink-muted)] leading-relaxed">
          <p className="font-extrabold text-[var(--color-ink)] text-sm mb-1">
            {data?.address}
          </p>
          <p>{data?.address}, VN</p>
          <p>Viet Nam</p>
          <p className="mt-2 font-extrabold text-[var(--color-ink)]">
            {data?.phone}
          </p>
        </div>
      </div>

      <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] p-5 flex flex-col gap-3">
        <h4 className="font-display-safe text-base font-extrabold uppercase text-[var(--color-ink)] pb-2 border-b-2 border-[var(--color-ink)]">
          Payment Method
        </h4>
        <div className="flex items-center gap-3 text-[var(--color-ink)] pt-2">
          <div className="p-2.5 bg-[var(--color-volt)] border-2 border-[var(--color-ink)]">
            {data?.payment === "cod" ? (
              <HomeIcon className="w-5 h-5" />
            ) : (
              <CreditCardIcon className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="font-mono text-sm font-extrabold uppercase">
              {data?.payment?.toUpperCase() || "COD"}
            </p>
            <p className="mono-label text-[10px] text-[var(--color-ink-muted)]">
              ATELIER VERIFIED SETTLEMENT
            </p>
          </div>
        </div>
      </div>

      <Receipt
        title="ORDER SUMMARY"
        serial={data?.orderId?.slice(0, 8) || "SUM-01"}
      >
        <div className="space-y-2.5">
          <DottedLeaderRow
            label="SUBTOTAL"
            value={formatPrice?.(itemsSubtotal) || "0 ₫"}
          />
          <DottedLeaderRow
            label="SHIPPING (EXPRESS)"
            value={formatPrice?.(25000) || "25.000 ₫"}
          />
          <DottedLeaderRow
            label="ESTIMATED TAX"
            value={formatPrice?.(0) || "0 ₫"}
          />
          <div className="pt-2 border-t-2 border-[var(--color-ink)] flex justify-between items-baseline">
            <span className="mono-label font-extrabold text-[var(--color-ink)]">
              GRAND TOTAL
            </span>
            <span className="font-mono text-lg font-extrabold text-[var(--color-flash)] tabular-nums">
              {formatPrice?.(itemsSubtotal + 25000)}
            </span>
          </div>
        </div>
      </Receipt>
    </div>
  );
};

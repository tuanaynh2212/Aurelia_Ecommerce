import { CreditCard, Truck, Wallet, Check } from "lucide-react";

type PaymentOptionsProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const paymentOptions = [
  {
    value: "cod",
    code: "COD-01",
    label: "Thanh toán khi nhận hàng (COD)",
    icon: <Truck size={20} />,
  },
  {
    value: "card",
    code: "POS-02",
    label: "Thẻ Tín Dụng / Thẻ Ghi Nợ",
    icon: <CreditCard size={20} />,
  },
  {
    value: "paypal",
    code: "INT-03",
    label: "Cổng Thanh Toán Quốc Tế",
    icon: <Wallet size={20} />,
  },
];

export const PaymentOptions = ({ value, onChange }: PaymentOptionsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {paymentOptions.map((opt) => {
        const active = value === opt.value;
        return (
          <label
            key={opt.value}
            className={`relative min-h-[76px] flex flex-col justify-between border-2 border-[var(--color-ink)] p-4 cursor-pointer transition-all ${
              active
                ? "bg-[var(--color-volt)]/25 shadow-[var(--shadow-hard)] text-[var(--color-ink)]"
                : "bg-[var(--color-paper)] hover:bg-[var(--color-bone)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {/* Volt Corner Stamp */}
            {active && (
              <span className="absolute top-0 right-0 px-1.5 py-0.5 bg-[var(--color-volt)] border-l-2 border-b-2 border-[var(--color-ink)] text-[var(--color-ink)] inline-flex items-center gap-1 mono-label text-[9px] font-extrabold">
                <Check size={10} />
                ACTIVE
              </span>
            )}
            <input
              type="radio"
              name="payment"
              value={opt.value}
              checked={active}
              onChange={onChange}
              className="sr-only"
            />
            <div className="flex items-center gap-2">
              <div
                className={
                  active
                    ? "text-[var(--color-flash)]"
                    : "text-[var(--color-ink-muted)]"
                }
              >
                {opt.icon}
              </div>
              <span className="mono-label text-[10px] text-[var(--color-ink-muted)]">
                [{opt.code}]
              </span>
            </div>
            <span className="text-xs font-mono font-extrabold uppercase tracking-wide leading-tight mt-2 block text-[var(--color-ink)]">
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default PaymentOptions;

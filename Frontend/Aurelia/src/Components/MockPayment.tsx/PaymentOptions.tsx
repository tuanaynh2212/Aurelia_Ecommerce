import { CreditCard, Truck, Wallet } from "lucide-react";

type PaymentOptionsProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const paymentOptions = [
  {
    value: "cod",
    label: "Thanh toán khi nhận hàng (COD)",
    icon: <Truck size={22} />,
  },
  {
    value: "card",
    label: "Thẻ Tín Dụng / Thẻ Ghi Nợ",
    icon: <CreditCard size={22} />,
  },
  {
    value: "paypal",
    label: "Cổng Thanh Toán Quốc Tế",
    icon: <Wallet size={22} />,
  },
];

export const PaymentOptions = ({ value, onChange }: PaymentOptionsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {paymentOptions.map((opt) => (
        <label
          key={opt.value}
          className={`flex flex-col items-center justify-center gap-2.5 border rounded-none p-4 cursor-pointer transition-colors text-center ${
            value === opt.value
              ? "border-[var(--color-ink)] bg-[var(--color-surface)] ring-1 ring-[var(--color-ink)] text-[var(--color-ink)]"
              : "border-[var(--color-rule)] bg-[var(--color-bg)] hover:border-[var(--color-ink)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange}
            className="hidden"
          />
          <div className={value === opt.value ? "text-[var(--color-accent)]" : "text-[var(--color-ink-muted)]"}>
            {opt.icon}
          </div>
          <span className="text-xs font-mono uppercase tracking-wide leading-tight">
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default PaymentOptions;

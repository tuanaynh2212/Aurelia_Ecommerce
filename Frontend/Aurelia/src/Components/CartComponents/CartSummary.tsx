import React, { useContext, useMemo } from "react";
import { CartContext } from "../../contexts/CartContext";
import { Toaster } from "../Toaster";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { formatVND } from "../../utils/formatters";

interface CartSummaryProps {
  tax: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ tax }) => {
  const { CartDataAdd } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = useMemo(
    () => (CartDataAdd || []).reduce((s, i) => s + i.price * i.quantity, 0),
    [CartDataAdd]
  );

  const shippingFee = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + tax + shippingFee;

  const handleCheckout = () => {
    if (!CartDataAdd || CartDataAdd.length === 0) {
      Toaster("Giỏ hàng của bạn đang trống!", "info");
      return;
    }
    navigate("/payment");
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-none border border-[var(--color-rule)] p-5 sm:p-6 space-y-5">
      <div className="border-b border-[var(--color-rule)] pb-3">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
          SUMMARY
        </div>
        <h3 className="font-heading font-bold text-lg text-[var(--color-ink)] uppercase tracking-wide">
          Tóm Tắt Đơn Hàng
        </h3>
      </div>

      <div className="space-y-3 text-xs sm:text-sm font-mono">
        <div className="flex justify-between text-[var(--color-ink-muted)]">
          <span>TẠM TÍNH ({CartDataAdd?.length || 0} MỤC)</span>
          <span className="font-bold text-[var(--color-ink)] tabular-nums">{formatVND(subtotal)}</span>
        </div>

        <div className="flex justify-between text-[var(--color-ink-muted)]">
          <span>PHÍ VẬN CHUYỂN</span>
          <span>
            {shippingFee === 0 ? (
              <span className="text-[var(--color-ink)] font-bold uppercase">MIỄN PHÍ</span>
            ) : (
              <span className="text-[var(--color-ink)] tabular-nums">{formatVND(shippingFee)}</span>
            )}
          </span>
        </div>

        {tax > 0 && (
          <div className="flex justify-between text-[var(--color-ink-muted)]">
            <span>THUẾ VAT</span>
            <span className="text-[var(--color-ink)] tabular-nums">{formatVND(tax)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-[var(--color-rule)] flex justify-between items-baseline">
          <span className="font-mono font-bold text-sm text-[var(--color-ink)] uppercase">
            TỔNG CỘNG
          </span>
          <span className="font-heading font-extrabold text-xl text-[var(--color-accent)] tabular-nums">
            {formatVND(total)}
          </span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className="btn btn-primary w-full py-3.5 rounded-none font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 group"
      >
        <span>TIẾN HÀNH THANH TOÁN</span>
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="p-3 rounded-none bg-[var(--color-bg)] border border-[var(--color-rule)] text-[11px] font-mono text-[var(--color-ink-muted)] space-y-1">
        <div className="flex items-center gap-2">
          <Truck size={14} className="text-[var(--color-accent)] flex-shrink-0" />
          <span>
            {subtotal >= 500000
              ? "✓ ĐÃ ĐẠT TIÊU CHUẨN MIỄN PHÍ GIAO HÀNG TOÀN QUỐC"
              : `MUA THÊM ${formatVND(500000 - subtotal)} ĐỂ ĐƯỢC FREESHIP`}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[var(--color-ink-muted)] pt-1 uppercase">
        <ShieldCheck size={13} className="text-[var(--color-accent)]" />
        <span>BẢO MẬT GIAO DỊCH CHUẨN SSL 256-BIT</span>
      </div>
    </div>
  );
};

export default CartSummary;

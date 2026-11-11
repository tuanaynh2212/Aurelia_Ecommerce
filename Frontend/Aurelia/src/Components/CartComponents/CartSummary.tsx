import React, { useContext, useMemo } from "react";
import { CartContext } from "../../contexts/CartContext";
import { Toaster } from "../Toaster";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { formatVND } from "../../utils/formatters";
import { Receipt, DottedLeaderRow, SegmentMeter } from "../UI";

interface CartSummaryProps {
  tax: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ tax }) => {
  const { CartDataAdd } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = useMemo(
    () => (CartDataAdd || []).reduce((s, i) => s + i.price * i.quantity, 0),
    [CartDataAdd],
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

  const freeShipProgress = Math.min(100, Math.round((subtotal / 500000) * 100));

  return (
    <Receipt
      title="TÓM TẮT ĐƠN HÀNG"
      serial="RCPT-CART-01"
      footer="BẢO MẬT GIAO DỊCH CHUẨN SSL 256-BIT"
    >
      <div className="space-y-4">
        {/* 10-segment Free-ship Meter */}
        <div className="p-3 bg-[var(--color-bone)] border-2 border-[var(--color-ink)] space-y-2">
          <div className="flex items-center gap-2 mono-label text-[var(--color-ink)]">
            <Truck size={14} className="text-[var(--color-flash)] shrink-0" />
            <span>
              {subtotal >= 500000
                ? "✓ ĐÃ ĐẠT TIÊU CHUẨN MIỄN PHÍ GIAO HÀNG TOÀN QUỐC"
                : `MUA THÊM ${formatVND(500000 - subtotal)} ĐỂ ĐƯỢC FREESHIP`}
            </span>
          </div>
          <SegmentMeter
            value={freeShipProgress}
            max={100}
            segments={10}
            accent={subtotal >= 500000 ? "volt" : "flash"}
            showValue={false}
          />
        </div>

        {/* Dotted leader receipt rows */}
        <div className="space-y-2.5 py-2">
          <DottedLeaderRow
            label={`TẠM TÍNH (${CartDataAdd?.length || 0} MỤC)`}
            value={formatVND(subtotal)}
          />
          <DottedLeaderRow
            label="PHÍ VẬN CHUYỂN"
            value={shippingFee === 0 ? "MIỄN PHÍ" : formatVND(shippingFee)}
          />
          {tax > 0 && (
            <DottedLeaderRow label="THUẾ VAT" value={formatVND(tax)} />
          )}
        </div>

        {/* CSS-3D Total Digit Roll Display */}
        <div className="pt-3 border-t-2 border-[var(--color-ink)] flex justify-between items-baseline">
          <span className="mono-label font-extrabold text-[var(--color-ink)]">
            TỔNG CỘNG
          </span>
          <span
            key={total}
            className="font-mono font-extrabold text-2xl text-[var(--color-flash)] tabular-nums transition-transform duration-300"
          >
            {formatVND(total)}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full min-h-[52px] px-6 py-3.5 border-2 border-[var(--color-ink)] bg-[var(--color-flash)] text-[var(--color-paper)] shadow-[var(--shadow-hard)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[var(--shadow-hard-lg)] active:translate-x-[2px] active:translate-y-[2px] transition-all font-mono font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>TIẾN HÀNH THANH TOÁN</span>
          <ArrowRight size={15} />
        </button>

        <div className="flex items-center justify-center gap-2 mono-label text-[var(--color-ink-muted)] pt-1">
          <ShieldCheck size={14} className="text-[var(--color-success)]" />
          <span>ATELIER VERIFIED CHECKOUT</span>
        </div>
      </div>
    </Receipt>
  );
};

export default CartSummary;

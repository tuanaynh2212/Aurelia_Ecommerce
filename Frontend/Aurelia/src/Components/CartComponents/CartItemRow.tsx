import React, { useContext } from "react";
import type { Cart } from "../../types/type";
import { CartContext } from "../../contexts/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";
import { formatVND } from "../../utils/formatters";

interface CartItemRowProps {
  item: Cart;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { CartDataAdd, setCartDataAdd } = useContext(CartContext);

  const updateQty = (id: string, newQty: number) => {
    const updated = CartDataAdd.map((i) =>
      i.itemid === id ? { ...i, quantity: Math.max(newQty, 1) } : i,
    );
    setCartDataAdd(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  const removeItem = (id: string) => {
    const filtered = CartDataAdd.filter((i) => i.itemid !== id);
    setCartDataAdd(filtered);
    localStorage.setItem("cartItems", JSON.stringify(filtered));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-5 p-5 bg-[var(--color-paper)] hover:bg-[var(--color-bone)]/50 transition-colors">
      {/* Hangtag Spec Image Frame */}
      <div className="w-full sm:w-28 aspect-[3/4] overflow-hidden bg-[var(--color-bone)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)] flex-shrink-0 relative">
        <span className="absolute top-1.5 left-1.5 bg-[var(--color-ink)] text-[var(--color-paper)] mono-label px-1.5 py-0.5 text-[10px]">
          x{item.quantity}
        </span>
        <img
          src={item.thumnail}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Spec Details & Controls */}
      <div className="flex flex-col justify-between flex-1 gap-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="mono-label text-[var(--color-ink-muted)] mb-1">
              [SKU: {item.id || item.itemid}]
            </div>
            <h3 className="font-display-safe font-extrabold text-base uppercase text-[var(--color-ink)]">
              {item.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2 py-0.5 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] mono-label text-[var(--color-ink)]">
                MÀU: {item.color}
              </span>
              <span className="px-2 py-0.5 border-2 border-[var(--color-ink)] bg-[var(--color-volt)] mono-label text-[var(--color-ink)]">
                CỠ: {item.size}
              </span>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="block mono-label text-[var(--color-ink-muted)]">
              THÀNH TIỀN
            </span>
            <span className="font-mono font-extrabold text-base sm:text-lg text-[var(--color-ink)] tabular-nums">
              {formatVND(item.price * item.quantity)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-[var(--color-ink)]">
          {/* 44x44px Industrial Stepper */}
          <div className="inline-flex items-center bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard-sm)]">
            <button
              onClick={() => updateQty(item.itemid, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center hover:bg-[var(--color-volt)] disabled:opacity-30 text-[var(--color-ink)] transition-colors cursor-pointer border-r-2 border-[var(--color-ink)]"
              aria-label="Giảm số lượng"
            >
              <Minus size={14} />
            </button>
            <span className="w-12 text-center font-mono text-xs font-extrabold text-[var(--color-ink)] tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQty(item.itemid, item.quantity + 1)}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center hover:bg-[var(--color-volt)] text-[var(--color-ink)] transition-colors cursor-pointer border-l-2 border-[var(--color-ink)]"
              aria-label="Tăng số lượng"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.itemid)}
            className="min-h-[44px] px-3 inline-flex items-center gap-1.5 mono-label text-[var(--color-ink-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-bone)] border-2 border-transparent hover:border-[var(--color-ink)] transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            <span>XÓA</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;

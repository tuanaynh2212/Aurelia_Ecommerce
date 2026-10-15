import React, { useContext } from "react";
import type { Cart } from "../../types/type";
import { CartContext } from "../../contexts/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";
import { formatVND } from "../../lib/formatters";

interface CartItemRowProps {
  item: Cart;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { CartDataAdd, setCartDataAdd } = useContext(CartContext);

  const updateQty = (id: string, newQty: number) => {
    const updated = CartDataAdd.map((i) =>
      i.itemid === id ? { ...i, quantity: Math.max(newQty, 1) } : i
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
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[var(--color-bg)] rounded-none border border-[var(--color-rule)] hover:border-[var(--color-ink)] transition-colors">
      {/* Thumbnail */}
      <div className="w-full sm:w-24 aspect-[3/4] sm:aspect-square rounded-none overflow-hidden bg-[var(--color-surface)] border border-[var(--color-rule)] flex-shrink-0">
        <img
          src={item.thumnail}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info & Controls */}
      <div className="flex flex-col justify-between flex-1 gap-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="text-[10px] font-mono text-[var(--color-ink-muted)] uppercase tracking-wider mb-1">
              SKU: {item.id || item.itemid}
            </div>
            <h3 className="font-heading font-semibold text-base text-[var(--color-ink)]">
              {item.name}
            </h3>
            <p className="text-xs font-mono text-[var(--color-ink-muted)] mt-1 uppercase tracking-wide">
              MÀU: <span className="font-bold text-[var(--color-ink)]">{item.color}</span> / CỠ:{" "}
              <span className="font-bold text-[var(--color-ink)]">{item.size}</span>
            </p>
          </div>

          <span className="font-heading font-bold text-base text-[var(--color-ink)] tabular-nums flex-shrink-0">
            {formatVND(item.price * item.quantity)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-rule)]">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-[var(--color-surface)] rounded-none border border-[var(--color-rule)]">
            <button
              onClick={() => updateQty(item.itemid, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-1.5 hover:bg-[var(--color-bg)] disabled:opacity-30 text-[var(--color-ink)] transition-colors cursor-pointer"
              aria-label="Giảm số lượng"
            >
              <Minus size={13} />
            </button>
            <span className="w-8 text-center text-xs font-mono font-bold text-[var(--color-ink)] tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQty(item.itemid, item.quantity + 1)}
              className="p-1.5 hover:bg-[var(--color-bg)] text-[var(--color-ink)] transition-colors cursor-pointer"
              aria-label="Tăng số lượng"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Remove button */}
          <button
            onClick={() => removeItem(item.itemid)}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-colors cursor-pointer uppercase tracking-wider"
          >
            <Trash2 size={13} />
            <span>XÓA</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
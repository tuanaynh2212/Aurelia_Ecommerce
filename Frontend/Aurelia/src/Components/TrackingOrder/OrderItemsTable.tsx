import React from "react";
import type { Cart } from "../../types/type";
import { formatVND } from "../../utils/formatters";

interface OrderItemsTableProps {
  data: Cart[] | undefined;
}

export const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ data }) => {
  return (
    <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[var(--shadow-hard)] overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[var(--color-ink)] text-[var(--color-paper)] border-b-2 border-[var(--color-ink)]">
            <tr>
              <th className="py-3.5 px-5 mono-label w-[45%]">Product</th>
              <th className="py-3.5 px-5 mono-label">Price</th>
              <th className="py-3.5 px-5 mono-label text-center">Qty</th>
              <th className="py-3.5 px-5 mono-label text-right">Total</th>
              <th className="py-3.5 px-5 mono-label text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[var(--color-ink)]">
            {data?.map((item) => (
              <tr
                key={item.itemid}
                className="group hover:bg-[var(--color-bone)] transition-colors"
              >
                <td className="py-5 px-5">
                  <div className="flex gap-4">
                    <div className="w-20 h-24 flex-shrink-0 border-2 border-[var(--color-ink)] bg-[var(--color-bone)] overflow-hidden relative">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${item.thumnail}')` }}
                        title={item.name}
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-display-safe text-base font-extrabold uppercase text-[var(--color-ink)] mb-1">
                        {item.name}
                      </h3>
                      <p className="mono-label text-[var(--color-ink-muted)]">
                        Color: {item.color}
                      </p>
                      <p className="mono-label text-[var(--color-ink-muted)]">
                        Size: {item.size}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-5 font-mono text-xs font-bold text-[var(--color-ink)] tabular-nums">
                  {formatVND(item.price)}
                </td>
                <td className="py-5 px-5 font-mono text-xs font-extrabold text-[var(--color-ink)] text-center tabular-nums">
                  {item.quantity}
                </td>
                <td className="py-5 px-5 font-mono text-sm font-extrabold text-[var(--color-flash)] text-right tabular-nums">
                  {formatVND(item.price * item.quantity)}
                </td>
                <td className="py-5 px-5 text-right">
                  {item.itemid.includes("1") ? (
                    <button className="min-h-[38px] px-3 border-2 border-[var(--color-ink)] bg-[var(--color-volt)] mono-label font-extrabold text-[var(--color-ink)] cursor-pointer">
                      Track Item
                    </button>
                  ) : (
                    <button className="min-h-[38px] px-3 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] hover:bg-[var(--color-bone)] mono-label text-[var(--color-ink)] cursor-pointer">
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

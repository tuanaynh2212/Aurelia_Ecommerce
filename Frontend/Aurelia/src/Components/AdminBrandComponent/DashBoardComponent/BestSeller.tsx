import React from "react";
import Icon from "./icon";

interface TopProductItem {
  id: string | number;
  name: string;
  price?: string | number;
  sales?: number;
  type?: string;
  sold?: number;
}

const BestSeller: React.FC<{ TOP_PRODUCTS: TopProductItem[] }> = ({
  TOP_PRODUCTS,
}) => {
  return (
    <div className="bg-paper border-2 border-ink shadow-hard p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 mb-5 border-b-2 border-ink">
          <div className="flex items-center gap-2">
            <Icon name="Star" className="text-flash" size={18} />
            <h4 className="font-display-safe text-lg font-black uppercase tracking-tight text-ink">
              Sản phẩm bán chạy
            </h4>
          </div>
          <span className="mono-label text-[10px] text-ink-muted">[TOP 05]</span>
        </div>

        <div className="space-y-3">
          {TOP_PRODUCTS.map((product, i) => (
            <div
              key={product.id ?? i}
              className="flex items-center gap-3 p-2.5 bg-bone border-2 border-ink hover:bg-volt/40 transition-colors cursor-pointer"
            >
              <div
                className={`shrink-0 w-8 h-8 flex items-center justify-center border-2 border-ink font-mono font-bold text-xs ${
                  i === 0
                    ? "bg-flash text-paper"
                    : i === 1
                      ? "bg-volt text-ink"
                      : i === 2
                        ? "bg-ink text-paper"
                        : "bg-paper text-ink"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h5 className="font-mono text-xs font-bold text-ink truncate uppercase">
                    {product.name}
                  </h5>
                  <span className="font-mono text-xs font-bold text-ink shrink-0">
                    {product.price}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="font-mono text-[10px] font-bold text-ink-muted uppercase tracking-wider">
                    {product.type}
                  </p>
                  <p className="font-mono text-[10px] text-ink font-bold uppercase">
                    {product.sold} đã bán
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSeller;

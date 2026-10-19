import React from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "../../../../types/type";
import { useNavigate } from "react-router-dom";
import { formatVND } from "../../../../utils/formatters";

export const Favourite: React.FC<{
  dataFavouriteItemUser?: Product[];
}> = ({ dataFavouriteItemUser = [] }) => {
  const navigate = useNavigate();
  const safeItems = Array.isArray(dataFavouriteItemUser) ? dataFavouriteItemUser : [];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rule/60 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-tag bg-kraft/15 border border-kraft-dark/20 flex items-center justify-center text-ink">
            <Heart size={16} className="text-rose-600 fill-rose-500/20" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-semibold text-ink">
              Sản Phẩm Yêu Thích
            </h1>
            <p className="font-mono text-xs text-ink-muted">
              Danh mục trang phục được lưu vào tủ đồ cá nhân
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-ink-muted">
          Đã lưu: <strong className="text-ink">{safeItems.length}</strong> sản phẩm
        </div>
      </div>

      {safeItems.length === 0 ? (
        <div className="bg-paper border border-dashed border-rule rounded-tag p-12 text-center">
          <div className="w-12 h-12 mx-auto rounded-tag bg-kraft/15 flex items-center justify-center text-ink-muted mb-3">
            <Heart size={22} className="text-ink-muted" />
          </div>
          <p className="font-mono text-sm text-ink font-medium">
            Tủ đồ yêu thích đang trống
          </p>
          <p className="font-mono text-xs text-ink-muted mt-1">
            Lưu lại các thiết kế ưng ý trong quá trình duyệt bộ sưu tập để xem lại bất cứ lúc nào.
          </p>
          <button
            onClick={() => navigate("/Collection")}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-tag bg-cobalt hover:bg-cobalt-hover text-white font-mono text-xs uppercase tracking-wider transition-colors"
          >
            Khám phá trang phục mới
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {safeItems.map((p, i) => (
            <motion.div
              key={p.id || i}
              onClick={() => navigate(`/Fashion/products/${p.id}`)}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="
                group
                bg-paper
                border border-rule/80
                rounded-tag
                p-3.5
                cursor-pointer
                transition-all
                hover:border-ink/30
                hover:shadow-tag
                flex flex-col justify-between
                relative
              "
            >
              {/* Hang tag eyelet */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-rule/40">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-hole bg-kraft/70 border border-ink/20" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint">
                    ATELIER TAG
                  </span>
                </div>
                <Heart size={13} className="text-rose-500 fill-rose-500" />
              </div>

              <div className="aspect-[4/5] w-full rounded-tag overflow-hidden bg-kraft/10 border border-rule/50 mb-3 relative">
                <img
                  src={p.thumbnail}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="space-y-1">
                <h2 className="font-heading text-sm text-ink line-clamp-1 group-hover:text-cobalt transition-colors">
                  {p.name}
                </h2>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="font-mono text-sm font-semibold text-ink">
                    {formatVND(p.price)}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-ink-muted hover:text-cobalt flex items-center gap-1">
                    <ShoppingBag size={11} />
                    <span>Xem</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};


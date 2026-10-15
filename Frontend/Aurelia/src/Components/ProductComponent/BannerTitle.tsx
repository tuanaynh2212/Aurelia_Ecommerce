import { useContext } from "react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { X } from "lucide-react";

export const BannerTitle = () => {
  const { key, setKey } = useContext(FilterProductContext);

  return (
    <div className="w-full border-b border-[var(--color-rule)] bg-[var(--color-surface)]/40 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-block font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)] mb-2">
              CATALOGUE INDEX · ALL INVENTORY
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[var(--color-ink)] tracking-tight">
              Danh Mục Sản Phẩm
            </h1>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)] font-body max-w-xl">
              Sản phẩm may mặc và phụ kiện Aurelia. Chất liệu tự nhiên, cấu trúc đường may hoàn thiện và thông số kích thước minh bạch.
            </p>
          </div>

          {key && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-[var(--color-bg)] border border-[var(--color-ink)] self-start md:self-auto">
              <span className="text-[11px] font-mono text-[var(--color-ink-muted)] uppercase tracking-wider">Lọc:</span>
              <span className="text-xs font-mono font-bold text-[var(--color-ink)] uppercase">
                {key}
              </span>
              <button
                onClick={() => setKey("")}
                className="p-0.5 hover:bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                aria-label="Xóa bộ lọc"
              >
                <X size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerTitle;

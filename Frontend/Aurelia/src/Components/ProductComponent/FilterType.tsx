import { useContext, useState } from "react";
import { SlidersHorizontal, Search, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { DanhMuc } from "../HomeLayoutComponent/DanhMucSanPham";
import { cn } from "../../utils/cn";
import { Drawer } from "../ui/Drawer";

export const FilterType = () => {
  const { key, setKey } = useContext(FilterProductContext);
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (type: string) => {
    if (key === type) {
      setKey("");
    } else {
      setKey(type);
    }
    setOpenDrawer(false);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-1">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--color-rule)] pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => handleSelect("")}
              className={cn(
                "px-3.5 py-1.5 rounded-none text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer border",
                key === ""
                  ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)] font-bold"
                  : "bg-[var(--color-bg)] text-[var(--color-ink-muted)] border-[var(--color-rule)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
              )}
            >
              TẤT CẢ
            </button>

            {DanhMuc.map((item) => {
              const isSelected = key === item.type;
              return (
                <button
                  key={item.type}
                  onClick={() => handleSelect(item.type)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-none text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer border",
                    isSelected
                      ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)] font-bold"
                      : "bg-[var(--color-bg)] text-[var(--color-ink-muted)] border-[var(--color-rule)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                  )}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setOpenDrawer(true)}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-[var(--color-surface)] border border-[var(--color-rule)] text-xs font-mono uppercase tracking-wider text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors cursor-pointer flex-shrink-0"
          >
            <SlidersHorizontal size={13} className="text-[var(--color-accent)]" />
            <span>Bộ Lọc</span>
          </button>
        </div>
      </div>

      <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setOpenDrawer(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-none bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-mono uppercase tracking-wider border border-[var(--color-ink)] shadow-none transition-colors cursor-pointer"
        >
          <SlidersHorizontal size={13} className="text-[var(--color-accent)]" />
          <span>{key ? `Lọc: ${key}` : "Bộ Lọc & Phân Loại"}</span>
        </button>
      </div>

      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        title="Danh Mục & Bộ Lọc"
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-ink-muted)] mb-3">
              PHÂN LOẠI SẢN PHẨM
            </h4>
            <div className="flex flex-col border border-[var(--color-rule)] divide-y divide-[var(--color-rule)]">
              <button
                onClick={() => handleSelect("")}
                className={cn(
                  "w-full text-left px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-between transition-colors",
                  key === ""
                    ? "bg-[var(--color-surface)] text-[var(--color-ink)] font-bold border-l-2 border-[var(--color-accent)]"
                    : "bg-[var(--color-bg)] text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
                )}
              >
                <span>Tất Cả Sản Phẩm</span>
                {key === "" && <Check size={14} className="text-[var(--color-accent)]" />}
              </button>

              {DanhMuc.map((item) => {
                const isSelected = key === item.type;
                return (
                  <button
                    key={item.type}
                    onClick={() => handleSelect(item.type)}
                    className={cn(
                      "w-full text-left px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-between transition-colors",
                      isSelected
                        ? "bg-[var(--color-surface)] text-[var(--color-ink)] font-bold border-l-2 border-[var(--color-accent)]"
                        : "bg-[var(--color-bg)] text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
                    )}
                  >
                    <span>{item.name}</span>
                    {isSelected && <Check size={14} className="text-[var(--color-accent)]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--color-rule)]">
            <button
              onClick={() => {
                setOpenDrawer(false);
                navigate("/search");
              }}
              className="btn btn-outline w-full flex items-center justify-center gap-2 rounded-none text-xs font-mono uppercase tracking-wider"
            >
              <Search size={14} />
              <span>Tìm Kiếm Theo Từ Khóa</span>
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default FilterType;

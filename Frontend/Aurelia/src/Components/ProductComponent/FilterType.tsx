import { useContext, useState } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { DanhMuc } from "../HomeLayoutComponent/DanhMucSanPham";
import { cn } from "../../utils/cn";
import { Drawer, AccordionItem } from "../UI/primitives/Overlays";
import { Checkbox } from "../UI/primitives/Controls";
import { Button } from "../UI/primitives/Button";

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
      <div className="container-atelier pt-5 pb-1">
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink pb-4">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              type="button"
              onClick={() => handleSelect("")}
              className={cn(
                "press-collapse min-h-[44px] px-4 py-2 rounded-[2px] border-2 border-ink mono-label text-xs font-extrabold whitespace-nowrap cursor-pointer",
                key === ""
                  ? "bg-volt text-ink shadow-hard-sm"
                  : "bg-paper text-ink hover:bg-bone"
              )}
            >
              TẤT CẢ
            </button>

            {DanhMuc.map((item) => {
              const isSelected = key === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleSelect(item.type)}
                  className={cn(
                    "press-collapse min-h-[44px] px-4 py-2 rounded-[2px] border-2 border-ink mono-label text-xs font-extrabold whitespace-nowrap cursor-pointer",
                    isSelected
                      ? "bg-volt text-ink shadow-hard-sm"
                      : "bg-paper text-ink hover:bg-bone"
                  )}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          <Button
            variant="secondary"
            onClick={() => setOpenDrawer(true)}
            className="hidden sm:inline-flex shrink-0"
            iconLeft={<SlidersHorizontal size={15} strokeWidth={2.5} />}
          >
            Bộ Lọc
          </Button>
        </div>
      </div>

      {/* Mobile floating filter trigger */}
      <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 sm:hidden">
        <Button
          variant="primary"
          onClick={() => setOpenDrawer(true)}
          iconLeft={<SlidersHorizontal size={15} strokeWidth={2.5} />}
        >
          {key ? `Lọc: ${key}` : "Bộ Lọc & Phân Loại"}
        </Button>
      </div>

      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        side="bottom"
        code="[FILTER // SHEET]"
        title="Danh Mục & Bộ Lọc"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              block
              onClick={() => {
                setKey("");
                setOpenDrawer(false);
              }}
            >
              Xoá
            </Button>
            <Button
              variant="volt"
              block
              onClick={() => setOpenDrawer(false)}
            >
              Áp dụng
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <AccordionItem code="01" title="Phân Loại Sản Phẩm" defaultOpen>
            <div className="flex flex-col gap-1">
              <Checkbox
                checked={key === ""}
                onChange={() => handleSelect("")}
                label="Tất Cả Sản Phẩm"
              />
              {DanhMuc.map((item) => (
                <Checkbox
                  key={item.type}
                  checked={key === item.type}
                  onChange={() => handleSelect(item.type)}
                  label={item.name}
                  description={item.subtitle}
                />
              ))}
            </div>
          </AccordionItem>

          <div className="pt-2">
            <Button
              variant="secondary"
              block
              onClick={() => {
                setOpenDrawer(false);
                navigate("/search");
              }}
              iconLeft={<Search size={15} />}
            >
              Tìm Kiếm Theo Từ Khóa
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default FilterType;

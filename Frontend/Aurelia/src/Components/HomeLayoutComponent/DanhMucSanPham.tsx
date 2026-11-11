/* eslint-disable react-refresh/only-export-components */
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { Section } from "../layout/Section";

export const DanhMuc = [
  {
    name: "Váy & Đầm",
    subtitle: "Thanh lịch & Nữ tính",
    type: "dress",
    img: "https://i.pinimg.com/736x/58/0b/b7/580bb7f28cfbf183f2746993a181d9f7.jpg",
    accent: "bg-bone",
  },
  {
    name: "Áo Thiết Kế",
    subtitle: "Hiện đại & Năng động",
    type: "top",
    img: "https://i.pinimg.com/1200x/9b/e4/d5/9be4d5d483ce50ddc1dd7cdedcbde159.jpg",
    accent: "bg-paper",
  },
  {
    name: "Trang Sức",
    subtitle: "Tinh tế & Sang trọng",
    type: "jewelry",
    img: "https://i.pinimg.com/736x/1a/d8/11/1ad8111c65c6f2781ccba0009c11cd36.jpg",
    accent: "bg-bone",
  },
  {
    name: "Đồng Hồ",
    subtitle: "Cổ điển & Vượt thời gian",
    type: "watch",
    img: "https://i.pinimg.com/736x/87/9b/ec/879bec5e2a5e23f2528bf1efd93c3f74.jpg",
    accent: "bg-paper",
  },
  {
    name: "Phụ Kiện",
    subtitle: "Điểm nhấn hoàn hảo",
    type: "accessory",
    img: "https://i.pinimg.com/1200x/c4/49/77/c44977b0c84eb51f1713c0778959fc8f.jpg",
    accent: "bg-bone",
  },
];

export const DanhMucSanPham = () => {
  const navigate = useNavigate();
  const { setKey } = useContext(FilterProductContext);

  const handleClick = (type: string) => {
    navigate("/Fashion/Products");
    setKey(type);
  };

  return (
    <Section
      badge="Bộ sưu tập theo phong cách"
      title="Danh Mục Sản Phẩm"
      subtitle="Tìm kiếm trang phục và phụ kiện phù hợp nhất cho phong cách hàng ngày của bạn"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {DanhMuc.map((item, idx) => (
          <button
            key={item.type}
            type="button"
            onClick={() => handleClick(item.type)}
            className={`group relative flex flex-col justify-between overflow-hidden border-2 border-ink bg-paper p-4 text-left shadow-hard hover:bg-volt cursor-pointer rounded-[2px] ${
              idx === 0 ? "md:col-span-6 md:row-span-2" : "md:col-span-3"
            }`}
          >
            <div className="mb-3 flex w-full items-center justify-between mono-label text-[10px] font-bold text-ink-muted">
              <span>[CAT-0{idx + 1}]</span>
              <span>{item.type.toUpperCase()}</span>
            </div>
            <div className="aspect-[4/3] w-full overflow-hidden border-2 border-ink bg-bone">
              <img
                src={item.img}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-3 flex w-full items-end justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-extrabold uppercase text-ink diacritic-safe">
                  {item.name}
                </h3>
                <p className="text-xs text-ink-muted">{item.subtitle}</p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-ink text-paper group-hover:bg-flash">
                <ArrowUpRight size={18} strokeWidth={2.5} aria-hidden="true" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </Section>
  );
};

export default DanhMucSanPham;

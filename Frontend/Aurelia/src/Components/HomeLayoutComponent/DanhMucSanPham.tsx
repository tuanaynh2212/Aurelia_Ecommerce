import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FilterProductContext } from "../../contexts/FIlterProduct";
import { Section } from "../layout/Section";

export const DanhMuc = [
  {
    name: "Váy & Đầm",
    subtitle: "Thanh lịch & Nữ tính",
    type: "dress",
    img: "https://i.pinimg.com/736x/58/0b/b7/580bb7f28cfbf183f2746993a181d9f7.jpg",
    accent: "bg-[var(--color-peach-100)]",
  },
  {
    name: "Áo Thiết Kế",
    subtitle: "Hiện đại & Năng động",
    type: "top",
    img: "https://i.pinimg.com/1200x/9b/e4/d5/9be4d5d483ce50ddc1dd7cdedcbde159.jpg",
    accent: "bg-[var(--color-cream-100)]",
  },
  {
    name: "Trang Sức",
    subtitle: "Tinh tế & Sang trọng",
    type: "jewelry",
    img: "https://i.pinimg.com/736x/1a/d8/11/1ad8111c65c6f2781ccba0009c11cd36.jpg",
    accent: "bg-[var(--color-peach-200)]",
  },
  {
    name: "Đồng Hồ",
    subtitle: "Cổ điển & Vượt thời gian",
    type: "watch",
    img: "https://i.pinimg.com/736x/87/9b/ec/879bec5e2a5e23f2528bf1efd93c3f74.jpg",
    accent: "bg-[var(--color-sage-light)]",
  },
  {
    name: "Phụ Kiện",
    subtitle: "Điểm nhấn hoàn hảo",
    type: "accessory",
    img: "https://i.pinimg.com/1200x/c4/49/77/c44977b0c84eb51f1713c0778959fc8f.jpg",
    accent: "bg-[var(--color-cream-200)]",
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[240px] md:auto-rows-[280px]">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          onClick={() => handleClick(DanhMuc[0].type)}
          className="md:col-span-6 md:row-span-2 group relative rounded-[var(--radius-xl)] overflow-hidden cursor-pointer shadow-[var(--shadow-card)] border border-[var(--color-cream-300)]/60 bg-[var(--color-cream-100)]"
        >
          <img
            src={DanhMuc[0].img}
            alt={DanhMuc[0].name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/75 via-[var(--color-ink)]/20 to-transparent" />

          <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-white">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[var(--color-peach-100)] mb-1 block">
                Nổi bật
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold">
                {DanhMuc[0].name}
              </h3>
              <p className="text-sm text-white/80 font-body mt-1">
                {DanhMuc[0].subtitle}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-[var(--color-accent)] text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          onClick={() => handleClick(DanhMuc[1].type)}
          className="md:col-span-3 md:row-span-1 group relative rounded-[var(--radius-xl)] overflow-hidden cursor-pointer shadow-[var(--shadow-card)] border border-[var(--color-cream-300)]/60 bg-[var(--color-cream-100)]"
        >
          <img
            src={DanhMuc[1].img}
            alt={DanhMuc[1].name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/70 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
            <div>
              <h3 className="text-xl font-heading font-bold">{DanhMuc[1].name}</h3>
              <p className="text-xs text-white/80 mt-0.5">{DanhMuc[1].subtitle}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-[var(--color-accent)] text-white flex items-center justify-center transition-colors">
              <ArrowUpRight size={16} />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          onClick={() => handleClick(DanhMuc[2].type)}
          className="md:col-span-3 md:row-span-1 group relative rounded-[var(--radius-xl)] overflow-hidden cursor-pointer shadow-[var(--shadow-card)] border border-[var(--color-cream-300)]/60 bg-[var(--color-cream-100)]"
        >
          <img
            src={DanhMuc[2].img}
            alt={DanhMuc[2].name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/70 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
            <div>
              <h3 className="text-xl font-heading font-bold">{DanhMuc[2].name}</h3>
              <p className="text-xs text-white/80 mt-0.5">{DanhMuc[2].subtitle}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-[var(--color-accent)] text-white flex items-center justify-center transition-colors">
              <ArrowUpRight size={16} />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          onClick={() => handleClick(DanhMuc[3].type)}
          className="md:col-span-3 md:row-span-1 group relative rounded-[var(--radius-xl)] overflow-hidden cursor-pointer shadow-[var(--shadow-card)] border border-[var(--color-cream-300)]/60 bg-[var(--color-cream-100)]"
        >
          <img
            src={DanhMuc[3].img}
            alt={DanhMuc[3].name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/70 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
            <div>
              <h3 className="text-xl font-heading font-bold">{DanhMuc[3].name}</h3>
              <p className="text-xs text-white/80 mt-0.5">{DanhMuc[3].subtitle}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-[var(--color-accent)] text-white flex items-center justify-center transition-colors">
              <ArrowUpRight size={16} />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          onClick={() => handleClick(DanhMuc[4].type)}
          className="md:col-span-3 md:row-span-1 group relative rounded-[var(--radius-xl)] overflow-hidden cursor-pointer shadow-[var(--shadow-card)] border border-[var(--color-cream-300)]/60 bg-[var(--color-cream-100)]"
        >
          <img
            src={DanhMuc[4].img}
            alt={DanhMuc[4].name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/70 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
            <div>
              <h3 className="text-xl font-heading font-bold">{DanhMuc[4].name}</h3>
              <p className="text-xs text-white/80 mt-0.5">{DanhMuc[4].subtitle}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-[var(--color-accent)] text-white flex items-center justify-center transition-colors">
              <ArrowUpRight size={16} />
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default DanhMucSanPham;

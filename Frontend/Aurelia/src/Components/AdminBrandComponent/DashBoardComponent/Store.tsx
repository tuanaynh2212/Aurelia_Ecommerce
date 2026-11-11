import { motion, type Variants } from "framer-motion";
import {
  MapPin,
  Star,
  TrendingUp,
  Phone,
  MoreVertical,
  Filter,
  Search,
} from "lucide-react";
import { useContext, useState } from "react";
import { AdminContext } from "../../../contexts/AdminContext";
import { SplitFlap } from "../../UI/primitives/SplitFlap";

export const Stores = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const { dataShop } = useContext(AdminContext);
  const filteredStores = dataShop.filter(
    (s) =>
      s?.city?.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "Tất cả" || s.city === filter),
  );

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  return (
    <div className="min-h-screen bg-bone p-4 md:p-8 overflow-y-auto w-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-paper border-2 border-ink shadow-hard p-6 flex flex-col lg:flex-row justify-between lg:items-end gap-4"
      >
        <div>
          <span className="mono-label text-[10px] text-flash block mb-1">
            [ATELIER NETWORK // STORE LOCATIONS]
          </span>
          <h1 className="font-display-safe text-3xl md:text-4xl font-black uppercase text-ink">
            Hệ thống Cửa hàng Aurelia
          </h1>
          <p className="font-mono text-xs text-ink-muted mt-1">
            Quản lý, theo dõi & tối ưu hiệu suất vận hành của chuỗi cửa hàng trên toàn quốc.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="text"
              placeholder="Tìm kiếm cửa hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-10 pr-4 border-2 border-ink bg-bone font-mono text-xs text-ink focus:bg-paper outline-none"
            />
          </div>

          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-12 pl-9 pr-8 border-2 border-ink bg-bone font-mono text-xs font-bold uppercase text-ink focus:bg-paper outline-none cursor-pointer"
            >
              {dataShop
                .reduce(
                  (acc: Array<{ value: string; label: string }>, store) => {
                    if (!acc.find((item) => item.value === store.city)) {
                      acc.push({ value: store.city, label: store.city });
                    }
                    return acc;
                  },
                  [],
                )
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              <option value="Tất cả">Tất cả</option>
            </select>
            <Filter
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink pointer-events-none"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStores.map((store, i) => (
          <motion.div
            key={store.id}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={i}
            className="bg-paper border-2 border-ink shadow-hard overflow-hidden group relative flex flex-col justify-between"
          >
            <div className="relative h-52 overflow-hidden border-b-2 border-ink bg-bone">
              <img
                src="https://i.pinimg.com/1200x/7e/ba/40/7eba4003040262ea71a3a57be399fd13.jpg"
                alt={store.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-paper border-2 border-ink p-1.5 shadow-hard-sm">
                <MoreVertical size={16} className="text-ink" />
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-ink/90 text-paper border-2 border-ink p-3">
                <p className="font-display-safe font-black uppercase text-base text-paper truncate">
                  {store.name}
                </p>
                <p className="font-mono text-xs text-volt flex items-center gap-1 mt-0.5">
                  <MapPin size={12} /> {store.city}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bone border-2 border-ink p-3">
                  <p className="font-mono text-[10px] font-bold uppercase text-ink-muted mb-1">
                    Doanh thu
                  </p>
                  <div className="overflow-x-auto my-1">
                    <SplitFlap
                      value={`${store.revenue.toLocaleString()}₫`}
                      size="sm"
                    />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-success flex items-center gap-1 mt-1">
                    <TrendingUp size={12} /> {store.growth}
                  </span>
                </div>

                <div className="bg-bone border-2 border-ink p-3 flex flex-col justify-between">
                  <p className="font-mono text-[10px] font-bold uppercase text-ink-muted">
                    Đánh giá
                  </p>
                  <p className="flex items-center gap-1.5 font-mono text-xl font-bold text-ink my-1">
                    <Star className="text-flash fill-flash" size={16} />{" "}
                    {store.rating}
                  </p>
                  <p className="font-mono text-[10px] uppercase text-ink-muted">
                    Khách hàng
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t-2 border-ink font-mono text-xs text-ink">
                <div className="flex items-center gap-1.5 font-bold">
                  <Phone size={14} className="text-flash" />
                  {store.phone}
                </div>
                <button
                  type="button"
                  className="min-h-[40px] px-4 py-1.5 bg-ink text-paper border-2 border-ink font-mono text-[11px] font-bold uppercase hover:bg-flash transition-colors cursor-pointer"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredStores.length === 0 && (
        <div className="bg-paper border-2 border-dashed border-ink p-12 text-center">
          <p className="font-mono text-xs font-bold uppercase text-ink-muted">
            Không tìm thấy cửa hàng nào phù hợp.
          </p>
        </div>
      )}
    </div>
  );
};

import { motion, type Variants } from "framer-motion";
import {
  MapPin,
  Star,
  TrendingUp,
  Phone,
  MoreVertical,
  Filter,
  Search,
  Building2,
} from "lucide-react";
import { useContext, useState } from "react";
import { AdminContext } from "../../../contexts/AdminContext";

export const Stores = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const {dataShop}=useContext(AdminContext);
  const filteredStores = dataShop.filter(
    (s) =>
      s?.city?.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "Tất cả" || s.city === filter)
  );

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    }),

  };

  return (
    <div className="h-[110vh] bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-3 md:p-8 overflow-y-auto w-[300px] md:w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-12"
      >
        <div>
          <h1 className="text-5xl serif bg-clip-text flex items-center gap-3">
            Hệ thống Cửa hàng Aurelia
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Quản lý, theo dõi & tối ưu hiệu suất vận hành của chuỗi cửa hàng trên toàn quốc.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm kiếm cửa hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            />
          </div>

          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white appearance-none cursor-pointer"
            >
              {dataShop.reduce((acc: any[], store) => {
                if (!acc.find((item) => item.value === store.city)) {
                  acc.push({ value: store.city, label: store.city });
                }
                return acc;
              }, []).map((option) => {
                return (<option key={option.value} value={option.value}>{option.label}</option>);
              })}
              <option value="Tất cả">Tất cả</option>
            </select>
            <Filter
              size={16}
              className="absolute left-2.5 top-2.5 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">
        {filteredStores.map((store, i) => (
          <motion.div
            key={store.id}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={i}
            whileHover={{ scale: 1.02 }}
            className="bg-white  shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-100 transition-all overflow-hidden group relative"
          >
            <div className="relative h-56 overflow-hidden">
              <motion.img
                src={"https://i.pinimg.com/1200x/7e/ba/40/7eba4003040262ea71a3a57be399fd13.jpg"}
                alt={store.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70"></div>
              <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md rounded-full p-1.5 shadow">
                <MoreVertical size={18} className="text-gray-600" />
              </div>
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-semibold text-lg drop-shadow-lg">{store.name}</p>
                <p className="text-gray-200 text-sm flex items-center gap-1">
                  <MapPin size={14} /> {store.city}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-indigo-50 p-4 rounded-2xl text-center">
                  <p className="text-xs  font-medium">Doanh thu</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {store.revenue.toLocaleString()}₫
                  </p>
                  <span className="text-emerald-600 text-xs font-medium flex items-center justify-center gap-1">
                    <TrendingUp size={12} /> {store.growth}
                  </span>
                </div>

                <div className="bg-purple-50 p-4 rounded-2xl text-center">
                  <p className="text-xs  font-medium">Đánh giá</p>
                  <p className="flex justify-center items-center gap-1 font-semibold text-gray-900">
                    <Star className="text-yellow-400 fill-yellow-400" size={16} /> {store.rating}
                  </p>
                  <p className="text-xs text-gray-400">Khách hàng</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Phone size={14} className="" />
                  {store.phone}
                </div>
                <button className="px-4 py-1.5 text-xs font-semibold   hover:from-indigo-200 hover:to-purple-200 transition-all">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredStores.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          Không tìm thấy cửa hàng nào phù hợp.
        </p>
      )}
    </div>
  );
};

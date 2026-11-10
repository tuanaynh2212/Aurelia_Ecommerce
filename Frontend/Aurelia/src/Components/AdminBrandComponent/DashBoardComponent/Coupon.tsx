import { useContext, useState } from "react";
import {
  Plus,
  Tag,
  TicketPercent,
  Package,
  RefreshCw,
  CheckCircle,

  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminContext } from "../../../contexts/AdminContext";
import { AddCoupon } from "./CouponComponent/AddCoupon";
import { EditCoupon } from "./CouponComponent/EditCoupon";
import { v4 as uuid } from "uuid";
import { CouponTable } from "./CouponTable";
export default function Coupon() {
const { coupons,handleDeleteCoupon,handleToggleCouponStatus } = useContext(AdminContext);
  const [editing, setEditing] = useState<any>();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");

  const [newCoupon, setNewCoupon] = useState({
    id: uuid(),
    code: "",
    NgayBatDau: "",
    NgayKetThuc: "",
    PhamViApDung: "",
    GiaTri: "",
    DieuKienApDung: "",
    ApDungCho: "",
    TheLoaiApDung: "Phần trăm",
    isActive: true,
    SoLuong: "",
    Reuse: "Một lần",
  });

  const handleDelete = (couponId: string) => {
    handleDeleteCoupon(couponId);
  }
  const handleToggleStatus = (couponId: string, bool: boolean) => {
    handleToggleCouponStatus(couponId, bool);
  }
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === "all" ||
                         (filterActive === "active" && coupon.isActive) ||
                         (filterActive === "inactive" && !coupon.isActive);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-[110vh] overflow-y-scroll bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 md:p-8 space-y-8">
      <header className="flex flex-col lg:flex-row justify-between lg:items-end gap-4">
        <div>
          <h1 className="text-5xl serif text-black serif flex items-center gap-3">
            Quản Lý Mã Giảm Giá
          </h1>
          <p className="text-gray-500 mt-2">
            Tạo và theo dõi các chương trình khuyến mãi của hệ thống
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold  shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Plus size={20} />
          Thêm Mã Mới
        </button>
      </header>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200  focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterActive("all")}
              className={`px-4 py-2  font-medium transition-all ${
                filterActive === "all"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterActive("active")}
              className={`px-4 py-2  font-medium transition-all ${
                filterActive === "active"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Hoạt động
            </button>
            <button
              onClick={() => setFilterActive("inactive")}
              className={`px-4 py-2  font-medium transition-all ${
                filterActive === "inactive"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Ngưng
            </button>
          </div>
        </div>
      </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className=" text-black p-6 shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black text-sm font-medium">Tổng mã</p>
              <p className="text-3xl font-bold mt-2">{coupons.length}</p>
            </div>
            <Tag className="opacity-80" size={28} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className=" text-black p-6 shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black text-sm font-medium">Đang hoạt động</p>
              <p className="text-3xl font-bold mt-2">
                {coupons.filter((c) => c.isActive).length}
              </p>
            </div>
            <CheckCircle className="opacity-80" size={28} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className=" text-black p-6 shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black text-sm font-medium">Tổng số lượng</p>
              <p className="text-3xl font-bold mt-2">
                {coupons.reduce((sum, c) => sum + c.soLuong, 0)}
              </p>
            </div>
            <Package className="opacity-80" size={28} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className=" text-black p-6 shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-black text-sm font-medium">Tái sử dụng</p>
              <p className="text-3xl font-bold mt-2">
                {coupons.filter((c) => c.reuse === "Nhiều lần").length}
              </p>
            </div>
            <RefreshCw className="opacity-80" size={28} />
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredCoupons.map((coupon, i) => (
            <CouponTable key={coupon.id} coupon={coupon} i={i} handleDelete={handleDelete} setEditing={setEditing} handleToggleStatus={handleToggleStatus}/>
          ))}
        </AnimatePresence>
      </div>

      {filteredCoupons.length === 0 && (
        <div className="text-center py-16">
          <TicketPercent size={64} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Không tìm thấy mã giảm giá nào</p>
        </div>
      )}

      <div>
        <AddCoupon showAddModal={showAddModal} setShowAddModal={setShowAddModal} newCoupon={newCoupon} setNewCoupon={setNewCoupon}/>
      </div>

      <div>
        <EditCoupon editing={editing} setEditing={setEditing} />
      </div>
    </div>
  );

}